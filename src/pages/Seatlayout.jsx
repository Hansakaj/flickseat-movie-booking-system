import React, { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useUser } from '@clerk/react'
import { ArrowRight, Clock } from 'lucide-react';
import toast from 'react-hot-toast';
import { assets } from '../assets/assets';
import { fetchMovieById, fetchDateTimeForMovie, fetchShowtimeById, ensureCustomer, createBooking } from '../lib/data';
import { supabase } from '../lib/supabase';
import isoTimeFormat from '../component/lib/isoTimeFormat';

const Seatlayout = () => {
  const maxSeatsPerBooking = 5;

  const { id, date } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const showId = searchParams.get('showId');
  const { isLoaded, isSignedIn, user } = useUser()

  const [selectedSeats, setSelectedSeats] = useState([]);
  const [selectedTime, setSelectedTime] = useState(null);
  const [show, setShow] = useState(null);
  const [occupiedSeats, setOccupiedSeats] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  const isSeatSelected = (seatId) => selectedSeats.includes(seatId)
  const isSeatOccupied = (seatId) => occupiedSeats.includes(seatId)

  const toggleSeat = (seatId) => {
    if (isSeatOccupied(seatId)) {
      toast.error('This seat is already booked')
      return
    }

    setSelectedSeats((prev) => {
      if (prev.includes(seatId)) return prev.filter((s) => s !== seatId)
      if (prev.length >= maxSeatsPerBooking) {
        toast.error(`You can book maximum ${maxSeatsPerBooking} seats only`)
        return prev
      }

      return [...prev, seatId]
    })
  }

  const buildRowSeats = (rowLabel, count) =>
    Array.from({ length: count }, (_, idx) => `${rowLabel}${idx + 1}`)

  const balconyRows = ['K', 'L']
  const getSeatType = (seatId) => (balconyRows.some((row) => seatId.startsWith(row)) ? 'Balcony' : 'Standard')
  const getSeatPrice = (seatId) => {
    const basePrice = show?.showtime?.price ?? 1000
    return getSeatType(seatId) === 'Balcony' ? basePrice * 1.5 : basePrice
  }

  const seatGroups = [
    {
      id: 'front',
      className: 'lg:col-span-2',
      rows: ['A', 'B'],
    },
    {
      id: 'middle-left',
      className: '',
      rows: ['C', 'D'],
    },
    {
      id: 'middle-right',
      className: '',
      rows: ['E', 'F'],
    },
    {
      id: 'back-left',
      className: '',
      rows: ['G', 'H'],
    },
    {
      id: 'back-right',
      className: '',
      rows: ['I', 'J'],
    },
  ].map((group) => ({
    ...group,
    rows: group.rows.map((row) => ({ row, seats: buildRowSeats(row, 9) })),
  }))

  const balconySeatGroups = [
    {
      id: 'balcony',
      rows: balconyRows,
    },
  ].map((group) => ({
    ...group,
    rows: group.rows.map((row) => ({ row, seats: buildRowSeats(row, 9) })),
  }))

  const SeatButton = ({ seatId }) => {
    const selected = isSeatSelected(seatId)
    const occupied = isSeatOccupied(seatId)

    return (
      <button
        type='button'
        onClick={() => toggleSeat(seatId)}
        aria-pressed={selected}
        disabled={occupied}
        className={`flex h-8 w-8 items-center justify-center rounded-[4px] border text-[11px] font-semibold shadow-[0_0_10px_rgba(248,69,101,0.12)] transition sm:h-9 sm:w-9 sm:text-xs lg:h-10 lg:w-10 lg:text-sm ${
          occupied
            ? 'cursor-not-allowed border-white/5 bg-white/5 text-white/20'
            : selected
            ? 'border-(--color-primary) bg-(--color-primary) text-white'
            : 'border-(--color-primary)/35 bg-black/30 text-white/75 hover:border-(--color-primary) hover:bg-(--color-primary)/15 hover:text-white'
        }`}
        title={seatId}
      >
        {seatId}
      </button>
    )
  }

  const getShow = async () => {
    try {
      const [movie, dateTime] = await Promise.all([
        fetchMovieById(id),
        fetchDateTimeForMovie(id),
      ])

      if (!movie) {
        setShow(null);
        return;
      }

      setShow({ movie, dateTime });
    } catch (err) {
      console.error('Failed to load show', err)
      setShow(null);
    }
  }
  useEffect(() => {
    getShow()
  }, [id])

  const timesForSelectedDate = show?.dateTime?.[date] ?? [];

  useEffect(() => {
    if (!Array.isArray(timesForSelectedDate) || timesForSelectedDate.length === 0) return;

    if (showId) {
      const match = timesForSelectedDate.find((t) => String(t?.showId) === String(showId));
      if (match) {
        setSelectedTime(match);
        return
      }
    }

    if (!selectedTime) setSelectedTime(timesForSelectedDate[0])
  }, [showId, date, show])

  // Load the selected showtime row (price, available seats) + occupied seats from bookings
  useEffect(() => {
    let active = true

    const loadShowtimeDetails = async () => {
      if (!selectedTime?.showId) {
        setShow((prev) => (prev ? { ...prev, showtime: null } : prev))
        setOccupiedSeats([])
        return
      }

      try {
        const [showtimeRow, bookingsResult] = await Promise.all([
          fetchShowtimeById(selectedTime.showId),
          supabase.from('bookings').select('seats').eq('showtime_id', selectedTime.showId),
        ])

        if (!active) return

        setShow((prev) => (prev ? { ...prev, showtime: showtimeRow } : prev))

        const { data: bookingRows, error } = bookingsResult
        if (error) throw error

        const occupied = (bookingRows || []).flatMap((b) => b.seats || [])
        setOccupiedSeats(occupied)
      } catch (err) {
        console.error('Failed to load showtime details', err)
      }
    }

    loadShowtimeDetails()
    return () => {
      active = false
    }
  }, [selectedTime])

  const checkoutTime = selectedTime;
  const totalAmount = useMemo(
    () => selectedSeats.reduce((total, seatId) => total + getSeatPrice(seatId), 0),
    [selectedSeats, show?.showtime]
  )

  const handleProceedToCheckout = async () => {
    if (!show || selectedSeats.length === 0) return;
    if (!checkoutTime) {
      toast.error('Please select the time')
      return
    }

    if (!isLoaded) return

    if (!isSignedIn) {
      toast.error('Please login to book tickets')
      return
    }

    setSubmitting(true)
    try {
      const customer = await ensureCustomer({
        name: user?.fullName || user?.username || 'Guest',
        email: user?.primaryEmailAddress?.emailAddress,
      })

      const seats = selectedSeats.map((seatId) => ({
        id: seatId,
        type: getSeatType(seatId),
        price: getSeatPrice(seatId),
      }))

      await createBooking({
        customer,
        showId: checkoutTime.showId,
        seats,
        ticketTotal: totalAmount,
        concessionTotal: 0,
        grandTotal: totalAmount,
      })

      toast.success('Booking confirmed!')
      navigate('/mybooking')
    } catch (err) {
      console.error('Booking failed', err)
      toast.error('Booking failed. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return show ? (
    <div className='flex flex-col md:flex-row px-6 md:px-16 lg:px-40 py-30 md:pt-50 gap-10'>
      {/*Available Things*/}
      <div className='relative w-56 overflow-hidden rounded-2xl border border-white/10 bg-white/5 px-5 py-7 h-max md:sticky md:top-30'>
        <div className='pointer-events-none absolute inset-0 bg-gradient-to-br from-(--color-primary)/25 via-white/5 to-white/5' />
        <div className='pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-(--color-primary)/25 blur-3xl' />
        <div className='pointer-events-none absolute -right-28 -bottom-28 h-72 w-72 rounded-full bg-(--color-primary)/10 blur-3xl' />

        <p className='relative text-lg font-semibold tracking-tight'>Available Timings</p>

        <div className='relative mt-5 flex flex-col gap-3'>
          {timesForSelectedDate.map((timeItem, index) => {
            const isSelected = selectedTime?.showId === timeItem.showId

            return (
              <button
                key={timeItem.showId ?? index}
                type='button'
                onClick={() => setSelectedTime(timeItem)}
                className={`flex w-28 items-center gap-2 rounded-r-xl px-3 py-2 text-left transition ${
                  isSelected
                    ? 'bg-(--color-primary) text-white'
                    : 'text-white/90 hover:bg-white/5'
                }`}
              >
                <Clock className='h-4 w-4' />

                <span className={`text-base font-semibold tracking-wide ${isSelected ? '' : 'text-white/90'}`}>
                  {isoTimeFormat(timeItem.time)}
                </span>
              </button>
            )
          })}

          {timesForSelectedDate.length === 0 && (
            <p className='text-sm text-white/50'>No showtimes for this date.</p>
          )}
        </div>


      </div>

      {/*Seat Layout*/ }
      <div className='flex-1'>
        <p className='text-center text-lg font-semibold'>Select Your Seat</p>
        <div className='mt-3 flex flex-wrap items-center justify-center gap-4 text-xs text-white/60'>
          <span>Standard: LKR {show?.showtime?.price ?? 1000}</span>
          <span>Balcony: LKR {Math.round((show?.showtime?.price ?? 1000) * 1.5)}</span>
          <span>Selected: {selectedSeats.length}/{maxSeatsPerBooking}</span>
        </div>

        <div className='mx-auto mt-6 w-full max-w-3xl'>
          <div className='relative mx-auto w-full'>
            <img
              src={assets.screenImage}
              alt='Screen'
              className='pointer-events-none mx-auto w-full select-none opacity-90'
              draggable={false}
            />
            <p className='pointer-events-none absolute inset-x-0 top-[100%] -translate-y-1/2 text-center text-xs font-semibold text-white/70'>
              SCREEN SIDE
            </p>
          </div>

          <div className='mt-20 pb-2 md:mt-24'>
            <div className='mx-auto w-full rounded-lg bg-black/30 px-2 py-4 sm:px-0 sm:py-0'>
              <p className='mb-6 text-center text-xs font-semibold uppercase tracking-[0.24em] text-white/40'>
                Standard
              </p>
              <div className='grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-2 xl:gap-x-12 xl:gap-y-12'>
                {seatGroups.map((group) => (
                  <div
                    key={group.id}
                    className={`flex flex-col items-center gap-5 ${group.className}`}
                  >
                    {group.rows.map(({ row, seats }) => (
                      <div key={row} className='grid grid-cols-9 gap-2 sm:gap-3'>
                        {seats.map((seatId) => (
                          <SeatButton key={seatId} seatId={seatId} />
                        ))}
                      </div>
                    ))}
                  </div>
                ))}
              </div>

              <div className='mx-auto my-12 h-px w-full max-w-xl bg-white/10' />

              <p className='mb-6 text-center text-xs font-semibold uppercase tracking-[0.24em] text-(--color-primary)'>
                Balcony
              </p>
              <div className='flex flex-col items-center gap-5'>
                {balconySeatGroups.map((group) => (
                  <div key={group.id} className='flex flex-col items-center gap-5'>
                    {group.rows.map(({ row, seats }) => (
                      <div key={row} className='grid grid-cols-9 gap-2 sm:gap-3'>
                        {seats.map((seatId) => (
                          <SeatButton key={seatId} seatId={seatId} />
                        ))}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {selectedSeats.length > 0 && (
            <div className='mx-auto mt-8 max-w-xl rounded-lg border border-white/10 bg-white/5 px-5 py-4 text-sm text-white/80'>
              <div className='flex flex-wrap items-center justify-between gap-3'>
                <p>
                  Selected seats: <span className='font-semibold text-white'>{selectedSeats.join(', ')}</span>
                </p>
                <p className='font-semibold text-white'>LKR {totalAmount}</p>
              </div>
            </div>
          )}

          <button
            type='button'
            onClick={handleProceedToCheckout}
            disabled={selectedSeats.length === 0 || !checkoutTime || submitting}
            className='mx-auto mt-12 flex items-center justify-center gap-2 rounded-full bg-(--color-primary) px-10 py-3 text-sm font-semibold text-white transition hover:bg-(--color-primary-dull) disabled:cursor-not-allowed disabled:opacity-60'
          >
            {submitting ? 'Booking…' : 'Proceed to checkout'}
            <ArrowRight className='h-4 w-4' />
          </button>
        </div>
      </div>



    </div>
  ) : (
    <div className='px-6 md:px-16 lg:px-40 py-10'>Loading...</div>
  )
}

export default Seatlayout
