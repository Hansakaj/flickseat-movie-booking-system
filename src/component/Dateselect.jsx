import { Blurcircal } from './Blurcircal'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'

const Dateselect = ({dateTime, id}) => {
  const navigate = useNavigate()
  const datesRowRef = useRef(null)

  const dates = useMemo(
    () => (dateTime && typeof dateTime === 'object' ? Object.keys(dateTime) : []),
    [dateTime]
  )

  const [selectedDate, setSelectedDate] = useState('')

  const canBook = Boolean(id && selectedDate)

  const onBookNow = () => {
    if (!selectedDate) {
      toast.error('Please select the date')
      return
    }
    if (!id) return

    const encodedDate = encodeURIComponent(selectedDate)
    navigate(`/movie/${id}/${encodedDate}`)
    window.scrollTo(0, 0)
  }

  const scrollDates = (direction) => {
    const el = datesRowRef.current
    if (!el) return
    const amount = 220
    el.scrollBy({ left: direction === 'left' ? -amount : amount, behavior: 'smooth' })
  }

  return (
    <div id='dateSelect' className='pt-14'>
    <div  className='relative flex flex-col md:flex-row items-start md:items-center justify-between gap-10 rounded-2xl border border-white/10 bg-white/5 p-8 md:p-10'>
        <Blurcircal top='-100px' left='-100px'   />
        <Blurcircal top='100px' right='0px'   />
           <div>
            <p className='inline-block text-lg font-semibold border-b-2 border-(--color-primary) pb-1'>Choose Date</p>
            <div  className='flex items-center gap-4 text-sm mt-6'>
                  <button
                    type='button'
                    onClick={() => scrollDates('left')}
                    className='grid h-10 w-10 place-items-center rounded-full bg-white/5 text-(--color-primary) transition hover:bg-white/10 active:scale-95'
                    aria-label='Previous dates'
                  >
                    <ChevronLeft width={26} />
                  </button>

                  <span
                    ref={datesRowRef}
                    className='flex items-center gap-4 overflow-x-auto no-scrollbar scroll-smooth max-w-full md:max-w-lg'
                  >

                         {dates.map((date) => (
                            <button
                              key={date}
                              type='button'
                              onClick={() => setSelectedDate(date)}
                              className={`flex flex-col items-center justify-center h-16 w-16 shrink-0 rounded-md border border-white/10 cursor-pointer transition hover:bg-white/5 ${
                                selectedDate === date ? 'bg-(--color-primary) text-white border-transparent' : 'text-white/90'
                              }`}
                            >
                               <span className='text-base font-semibold leading-none'>
                                 {new Date(date).getDate()}
                               </span>
                               <span className='mt-1 text-xs font-medium opacity-90'>
                                 {new Date(date).toLocaleDateString('en-US', { month: 'short' })}
                               </span>
                            </button>
                         ))}
                  </span>

                  <button
                    type='button'
                    onClick={() => scrollDates('right')}
                    className='grid h-10 w-10 place-items-center rounded-full bg-white/5 text-(--color-primary) transition hover:bg-white/10 active:scale-95'
                    aria-label='Next dates'
                  >
                    <ChevronRight width={26} />
                  </button>
            </div>

            {dates.length === 0 && (
              <p className='mt-4 text-sm text-gray-400'>No dates available.</p>
            )}
           </div>
           <button
             type='button'
             onClick={onBookNow}
             aria-disabled={!canBook}
             className={`cursor-pointer rounded-full bg-(--color-primary) px-14 py-4 mt-2 text-sm font-semibold text-white transition hover:bg-(--color-primary-dull) active:scale-95 ${
               canBook ? '' : 'opacity-60'
             }`}
           >
             Book Now
           </button>

    </div>
    </div>
  )
}

export default Dateselect
