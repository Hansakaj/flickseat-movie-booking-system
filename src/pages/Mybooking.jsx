import React, { useEffect, useState, useCallback } from 'react'
import { SignInButton, useUser } from '@clerk/react'
import { CalendarDays, Clock, CreditCard, Landmark, Smartphone, Ticket, XCircle } from 'lucide-react'
import { Link } from 'react-router-dom'
import QRCode from 'qrcode'
import toast from 'react-hot-toast'
import isoTimeFormat from '../component/lib/isoTimeFormat'
import { supabase } from '../lib/supabase'
import { ensureCustomer, fetchBookingsForCustomer } from '../lib/data'

const getSeatNumbers = (booking) => (booking.seats ?? []).join(', ') || '-'

const buildTicketData = ({ booking, userName, userEmail }) => ({
  ticketId: booking.booking_ref,
  bookingId: booking.id,
  name: userName,
  email: userEmail,
  movie: booking.showtimes?.movies?.title,
  date: booking.showtimes?.show_date,
  time: booking.showtimes?.show_time,
  seats: getSeatNumbers(booking),
  amount: `LKR ${booking.grand_total}`,
})

const sendTicketEmail = async ({ booking, userName, userEmail, qrCode }) => {
  const endpoint = import.meta.env.VITE_TICKET_EMAIL_ENDPOINT

  if (!endpoint || !userEmail) {
    return { sent: false, reason: !userEmail ? 'missing-email' : 'missing-endpoint' }
  }

  const ticket = buildTicketData({ booking, userName, userEmail })
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      to: userEmail,
      subject: `Your ticket for ${ticket.movie}`,
      ticket,
      qrCode,
      text: [
        `Ticket ID: ${ticket.ticketId}`,
        `Name: ${ticket.name}`,
        `Movie: ${ticket.movie}`,
        `Date: ${ticket.date}`,
        `Time: ${ticket.time}`,
        `Seats: ${ticket.seats}`,
        `Amount: ${ticket.amount}`,
      ].join('\n'),
    }),
  })

  if (!response.ok) {
    throw new Error('Ticket email failed')
  }

  return { sent: true }
}

const PaymentCheckout = ({ booking, userName, userEmail, onCancel, onConfirm }) => {
  const [paymentMethod, setPaymentMethod] = useState('card')
  const [cardDetails, setCardDetails] = useState({
    name: userName,
    number: '',
    expiry: '',
    cvv: '',
  })
  const [onlineProvider, setOnlineProvider] = useState('bank')

  const updateCardDetails = (field, value) => {
    setCardDetails((current) => ({ ...current, [field]: value }))
  }

  const canConfirm =
    paymentMethod !== 'card' ||
    (cardDetails.name.trim() && cardDetails.number.trim() && cardDetails.expiry.trim() && cardDetails.cvv.trim())

  const handleConfirm = () => {
    if (!canConfirm) {
      toast.error('Please enter payment details')
      return
    }

    onConfirm(booking.id, {
      method: paymentMethod,
      provider: paymentMethod === 'card' ? 'card' : onlineProvider,
    })
  }

  return (
    <div className='fixed inset-0 z-[80] flex items-center justify-center bg-black/80 px-4 py-8 backdrop-blur-sm'>
      <div className='w-full max-w-md rounded-2xl border border-white/10 bg-[#0f0f0f] p-5 text-left shadow-2xl shadow-black/60'>
      <div className='flex items-start justify-between gap-3'>
        <div>
          <p className='text-xs uppercase tracking-[0.22em] text-(--color-primary)'>Payment Details</p>
          <p className='mt-1 text-sm text-white/60'>{userEmail || 'Logged in user'}</p>
        </div>
        <button
          type='button'
          onClick={onCancel}
          className='rounded-full border border-white/10 px-3 py-1 text-xs text-white/70 transition hover:border-white/25 hover:text-white'
        >
          Cancel
        </button>
      </div>

      <div className='mt-4 grid grid-cols-3 gap-2'>
        {[
          { id: 'card', label: 'Card', icon: CreditCard },
          { id: 'bank', label: 'Bank', icon: Landmark },
          { id: 'wallet', label: 'Wallet', icon: Smartphone },
        ].map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            type='button'
            onClick={() => setPaymentMethod(id)}
            className={`flex flex-col items-center gap-1 rounded-md border px-3 py-3 text-xs font-semibold transition ${
              paymentMethod === id
                ? 'border-(--color-primary) bg-(--color-primary) text-white'
                : 'border-white/10 bg-[#181818] text-white/55 hover:border-white/20 hover:text-white'
            }`}
          >
            <Icon className='h-4 w-4' />
            {label}
          </button>
        ))}
      </div>

      {paymentMethod === 'card' ? (
        <div className='mt-4 grid gap-3 text-sm'>
          <input
            value={cardDetails.name}
            onChange={(e) => updateCardDetails('name', e.target.value)}
            placeholder='Cardholder name'
            className='h-11 rounded-md border border-white/10 bg-black px-3 text-white outline-none transition placeholder:text-white/35 focus:border-(--color-primary)'
          />
          <input
            value={cardDetails.number}
            onChange={(e) => updateCardDetails('number', e.target.value)}
            placeholder='Card number'
            inputMode='numeric'
            className='h-11 rounded-md border border-white/10 bg-black px-3 text-white outline-none transition placeholder:text-white/35 focus:border-(--color-primary)'
          />
          <div className='grid grid-cols-2 gap-3'>
            <input
              value={cardDetails.expiry}
              onChange={(e) => updateCardDetails('expiry', e.target.value)}
              placeholder='MM/YY'
              className='h-11 rounded-md border border-white/10 bg-black px-3 text-white outline-none transition placeholder:text-white/35 focus:border-(--color-primary)'
            />
            <input
              value={cardDetails.cvv}
              onChange={(e) => updateCardDetails('cvv', e.target.value)}
              placeholder='CVV'
              inputMode='numeric'
              className='h-11 rounded-md border border-white/10 bg-black px-3 text-white outline-none transition placeholder:text-white/35 focus:border-(--color-primary)'
            />
          </div>
        </div>
      ) : (
        <div className='mt-4 space-y-3 text-sm'>
          <select
            value={onlineProvider}
            onChange={(e) => setOnlineProvider(e.target.value)}
            className='h-11 w-full rounded-md border border-white/10 bg-black px-3 text-white outline-none transition focus:border-(--color-primary)'
          >
            <option value='bank'>Online Banking</option>
            <option value='ezcash'>eZ Cash</option>
            <option value='mcash'>mCash</option>
            <option value='koko'>Koko</option>
          </select>
          <p className='rounded-md bg-white/5 px-3 py-3 text-white/55'>
            You will be redirected to the selected online payment provider after confirmation.
          </p>
        </div>
      )}

      <div className='mt-4 flex items-center justify-between gap-3 border-t border-white/10 pt-4'>
        <p className='text-lg font-semibold text-white'>LKR {booking.grand_total}</p>
        <button
          type='button'
          onClick={handleConfirm}
          className='rounded-md bg-(--color-primary) px-5 py-3 text-xs font-semibold text-white transition hover:bg-(--color-primary-dull) active:scale-95'
        >
          Confirm Payment
        </button>
      </div>
      </div>
    </div>
  )
}

export const Mybooking = ({ hasClerkAuth = false }) => {
  const { isLoaded, isSignedIn, user } = useUser()
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [paymentSession, setPaymentSession] = useState(null)

  const userName = user?.fullName || user?.username || 'Customer'
  const userEmail = user?.primaryEmailAddress?.emailAddress

  const loadBookings = useCallback(async () => {
    if (!isLoaded) return

    if (!isSignedIn || !userEmail) {
      setBookings([])
      setLoading(false)
      return
    }

    setLoading(true)
    try {
      const customer = await ensureCustomer({ name: userName, email: userEmail })
      const data = await fetchBookingsForCustomer(customer?.id)
      setBookings(data)
    } catch (err) {
      console.error('Failed to load bookings', err)
      toast.error('Could not load your bookings')
    } finally {
      setLoading(false)
    }
  }, [isLoaded, isSignedIn, userEmail, userName])

  useEffect(() => {
    loadBookings()
  }, [loadBookings])

  const formatDate = (date) => {
    if (!date) return 'Selected date'
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  const handlePayNow = async (bookingId, paymentDetails) => {
    const bookingToPay = bookings.find((booking) => booking.id === bookingId)
    if (!bookingToPay) return

    const ticketPayload = buildTicketData({
      booking: bookingToPay,
      userName: paymentSession?.userName || 'Customer',
      userEmail: paymentSession?.userEmail || '',
    })
    const ticketQrCode = await QRCode.toDataURL(JSON.stringify(ticketPayload), {
      errorCorrectionLevel: 'M',
      margin: 1,
      width: 320,
    })

    let emailStatus = { sent: false, reason: 'missing-endpoint' }

    try {
      emailStatus = await sendTicketEmail({
        booking: bookingToPay,
        userName: paymentSession?.userName || 'Customer',
        userEmail: paymentSession?.userEmail || '',
        qrCode: ticketQrCode,
      })
    } catch {
      emailStatus = { sent: false, reason: 'send-failed' }
    }

    try {
      const { error } = await supabase
        .from('bookings')
        .update({ status: 'paid' })
        .eq('id', bookingId)

      if (error) throw error
    } catch (err) {
      console.error('Failed to update booking status', err)
      toast.error('Payment recorded, but updating status failed')
    }

    setBookings((prev) =>
      prev.map((booking) =>
        booking.id === bookingId
          ? { ...booking, status: 'paid', _ticketQrCode: ticketQrCode, _paymentDetails: paymentDetails }
          : booking
      )
    )
    setPaymentSession(null)

    if (emailStatus.sent) {
      toast.success('Payment completed. Ticket QR code sent to email.')
    } else {
      toast.success('Payment completed. Ticket QR code is ready.')
    }
  }

  const handleCancelBooking = async (bookingId) => {
    const booking = bookings.find((item) => item.id === bookingId)
    const message = booking?.status === 'paid'
      ? 'Cancel this paid booking?'
      : 'Cancel this booking?'

    if (!window.confirm(message)) return

    try {
      const { error } = await supabase
        .from('bookings')
        .update({ status: 'cancelled' })
        .eq('id', bookingId)

      if (error) throw error
    } catch (err) {
      console.error('Failed to cancel booking', err)
      toast.error('Could not cancel booking')
      return
    }

    setBookings((prev) => prev.filter((item) => item.id !== bookingId))
    setPaymentSession((current) => (current?.booking?.id === bookingId ? null : current))
    toast.success('Booking cancelled')
  }

  if (!isLoaded || loading) {
    return (
      <div className='px-6 pb-20 pt-30 md:px-16 md:pt-40 lg:px-28 flex justify-center'>
        <p className='text-gray-400'>Loading…</p>
      </div>
    )
  }

  if (!isSignedIn) {
    return (
      <div className='px-6 pb-20 pt-30 md:px-16 md:pt-40 lg:px-28 flex flex-col items-center gap-4 text-center'>
        <Ticket className='h-10 w-10 text-(--color-primary)' />
        <p className='text-lg font-semibold'>Please login to view your bookings</p>
        {hasClerkAuth ? (
          <SignInButton mode='modal'>
            <button
              type='button'
              className='rounded-full bg-(--color-primary) px-5 py-2 text-xs font-semibold text-white transition hover:bg-(--color-primary-dull) active:scale-95'
            >
              Login
            </button>
          </SignInButton>
        ) : (
          <p className='text-sm text-white/55'>Add your Clerk key to `.env` to enable login.</p>
        )}
      </div>
    )
  }

  const visibleBookings = bookings.filter((b) => b.status !== 'cancelled')

  return (
    <div className='px-6 pb-20 pt-30 md:px-16 md:pt-40 lg:px-28'>
      <div className='mx-auto max-w-6xl'>
        <div className='mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between'>
          <div>
            <p className='text-sm font-medium uppercase tracking-[0.24em] text-(--color-primary)'>Tickets</p>
            <h1 className='mt-2 text-3xl font-semibold'>My Bookings</h1>
          </div>
          <Link
            to='/movie'
            className='w-max rounded-full border border-white/10 px-5 py-2 text-sm font-semibold text-white/80 transition hover:border-(--color-primary)/50 hover:text-white'
          >
            Book more tickets
          </Link>
        </div>

        {visibleBookings.length === 0 ? (
          <div className='rounded-xl border border-white/10 bg-white/5 px-6 py-14 text-center'>
            <Ticket className='mx-auto h-10 w-10 text-(--color-primary)' />
            <p className='mt-4 text-lg font-semibold'>No bookings yet</p>
            <p className='mt-2 text-sm text-white/55'>Select standard or balcony seats to create a booking.</p>
          </div>
        ) : (
          <div className='flex flex-col gap-5'>
            {visibleBookings.map((booking) => {
              const movie = booking.showtimes?.movies
              const seats = booking.seats ?? []
              const isPaid = booking.status === 'paid'

              return (
                <div key={booking.id} className='overflow-hidden rounded-2xl border border-white/10 bg-[#080808]'>
                  <div className='grid gap-0 lg:grid-cols-[1fr_380px]'>
                    <div className='relative overflow-hidden p-5 sm:p-7'>
                      <img
                        src={movie?.poster_url}
                        alt=''
                        className='pointer-events-none absolute inset-0 h-full w-full scale-110 object-cover opacity-10 blur-xl'
                      />
                      <div className='absolute inset-0 bg-gradient-to-r from-black via-black/95 to-black/80' />

                      <div className='relative flex flex-col gap-6 sm:flex-row'>
                        <img
                          src={movie?.poster_url}
                          alt={movie?.title}
                          className='h-56 w-36 shrink-0 rounded-xl object-cover shadow-2xl shadow-black/50'
                        />

                        <div className='flex min-w-0 flex-1 flex-col justify-between gap-8'>
                          <div>
                            <div className='flex flex-wrap items-start justify-between gap-3'>
                              <div>
                                <p className='text-xs uppercase tracking-[0.24em] text-(--color-primary)'>Cinema Ticket</p>
                                <h2 className='mt-2 text-3xl font-semibold leading-tight'>{movie?.title}</h2>
                              </div>
                              {isPaid ? (
                                <span className='rounded-full bg-green-400/15 px-4 py-2 text-xs font-semibold text-green-200'>
                                  Paid
                                </span>
                              ) : (
                                <span className='flex items-center gap-2 rounded-full bg-yellow-400/10 px-4 py-2 text-xs font-semibold text-yellow-100'>
                                  Pending payment
                                </span>
                              )}
                            </div>

                            <div className='mt-5 flex flex-wrap gap-3 text-sm text-white/70'>
                              <span className='flex items-center gap-2 rounded-full bg-white/8 px-4 py-2'>
                                <CalendarDays className='h-4 w-4 text-(--color-primary)' />
                                {formatDate(booking.showtimes?.show_date)}
                              </span>
                              <span className='flex items-center gap-2 rounded-full bg-white/8 px-4 py-2'>
                                <Clock className='h-4 w-4 text-(--color-primary)' />
                                {booking.showtimes?.show_time ? isoTimeFormat(`${booking.showtimes.show_date}T${booking.showtimes.show_time}.000Z`) : 'Selected time'}
                              </span>
                              <span className='rounded-full bg-white/8 px-4 py-2'>{booking.seat_count} tickets</span>
                            </div>
                          </div>

                          <div className='grid gap-3 text-sm text-white/75 sm:grid-cols-1'>
                            <div className='rounded-xl border border-white/10 bg-white/5 px-4 py-4'>
                              <p className='text-[11px] uppercase tracking-[0.22em] text-white/35'>Seats</p>
                              <p className='mt-3 text-lg font-semibold text-white'>
                                {seats.length > 0 ? seats.join(', ') : '-'}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className='border-t border-white/10 bg-[#0d0d0d] p-5 sm:p-7 lg:border-l lg:border-t-0'>
                      <div className='rounded-2xl border border-white/10 bg-black p-5'>
                        <div className='flex items-start justify-between gap-4 border-b border-white/10 pb-5'>
                          <div>
                            <p className='text-xs uppercase tracking-[0.24em] text-white/40'>Total Amount</p>
                            <p className='mt-2 text-4xl font-semibold leading-none'>LKR {booking.grand_total}</p>
                          </div>
                          <div className='text-right text-sm font-semibold text-white/70'>
                            <p>{booking.seat_count} tickets</p>
                            <p className='mt-2 max-w-32 truncate text-white'>{getSeatNumbers(booking)}</p>
                          </div>
                        </div>

                        <div className='mt-5'>
                          {!isPaid ? (
                            hasClerkAuth ? (
                              <button
                                type='button'
                                onClick={() => setPaymentSession({ booking, userName, userEmail })}
                                className='w-full rounded-full bg-(--color-primary) px-5 py-2.5 text-xs font-semibold text-white transition hover:bg-(--color-primary-dull) active:scale-95'
                              >
                                Pay Now
                              </button>
                            ) : (
                              <div className='rounded-lg border border-yellow-400/20 bg-yellow-400/10 px-4 py-3 text-sm text-yellow-100'>
                                Add your Clerk key to `.env` to enable online payment.
                              </div>
                            )
                          ) : (
                            <div className='rounded-xl bg-green-400/10 px-4 py-4 text-sm text-green-100'>
                              Payment completed successfully.
                            </div>
                          )}
                        </div>

                        <button
                          type='button'
                          onClick={() => handleCancelBooking(booking.id)}
                          className='mt-4 flex w-full items-center justify-center gap-2 rounded-full border border-red-400/20 px-5 py-2.5 text-xs font-semibold text-red-100 transition hover:border-red-300/45 hover:bg-red-400/10 active:scale-95'
                        >
                          <XCircle className='h-4 w-4' />
                          Cancel Booking
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {paymentSession ? (
        <PaymentCheckout
          booking={paymentSession.booking}
          userName={paymentSession.userName}
          userEmail={paymentSession.userEmail}
          onCancel={() => setPaymentSession(null)}
          onConfirm={handlePayNow}
        />
      ) : null}
    </div>
  )
}
