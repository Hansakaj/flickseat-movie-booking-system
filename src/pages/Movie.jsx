import React, { useEffect, useMemo, useState } from 'react'
import { supabase } from '../lib/supabase'
import { fetchMovies, mapShowtimeRow } from '../lib/data'
import backgroundImage from '../assets/iN41Ccw4DctL8npfmYg1j5Tr1eb.webp'
import { Moviecard } from '../component/Moviecard'
import { Blurcircal } from '../component/Blurcircal'

export const Movie = () => {
  const [movies, setMovies] = useState([])
  const [showtimesByDate, setShowtimesByDate] = useState({}) // { '2026-06-20': [{movieId, ...}] }
  const [loading, setLoading] = useState(true)
  const [selectedDate, setSelectedDate] = useState('')

  useEffect(() => {
    let active = true

    const load = async () => {
      try {
        const [moviesData, showtimesResult] = await Promise.all([
          fetchMovies(),
          supabase
            .from('showtimes')
            .select('*')
            .eq('is_active', true)
            .order('show_date', { ascending: true }),
        ])

        if (!active) return

        setMovies(moviesData)

        const { data: showtimeRows, error } = showtimesResult
        if (error) throw error

        const grouped = (showtimeRows || []).map(mapShowtimeRow).reduce((acc, item) => {
          if (!acc[item.showDate]) acc[item.showDate] = []
          acc[item.showDate].push(item)
          return acc
        }, {})

        setShowtimesByDate(grouped)
      } catch (err) {
        console.error('Failed to load movies/showtimes', err)
      } finally {
        if (active) setLoading(false)
      }
    }

    load()
    return () => {
      active = false
    }
  }, [])

  const availableDates = useMemo(
    () => Object.keys(showtimesByDate).sort(),
    [showtimesByDate]
  )

  const moviesForDate = useMemo(() => {
    if (!selectedDate) return []
    const movieIds = new Set(
      (showtimesByDate[selectedDate] ?? []).map((item) => String(item.movieId))
    )
    return movies.filter((movie) => movieIds.has(String(movie.id)))
  }, [selectedDate, showtimesByDate, movies])

  if (loading) {
    return (
      <div className='flex h-screen items-center justify-center'>
        <p className='text-gray-400'>Loading…</p>
      </div>
    )
  }

  return availableDates.length > 0 ? (
    <div className='relative min-h-screen overflow-hidden px-6 pb-24 pt-28 md:px-16 md:pt-32 lg:px-40 xl:px-44'>
      <div
        className='pointer-events-none absolute inset-x-[-12%] top-[-180px] h-[860px] scale-110 bg-cover bg-center'
        style={{
          backgroundImage: `url(${backgroundImage})`,
          filter: 'blur(28px)',
          opacity: 0.34,
        }}
      />
      <div className='pointer-events-none absolute inset-0 bg-gradient-to-b from-black/70 via-black/35 to-black' />
      <Blurcircal bottom='50px' right='50px' />
      <Blurcircal top='50px' left='50px' />

       <div className='relative z-10 mx-auto mb-8 flex max-w-6xl flex-col items-center gap-5 text-center md:items-center md:justify-center'>
        <div>
          <h1 className='text-lg font-medium my-4'>
            Choose Date
          </h1>
          <div className='flex flex-wrap justify-center gap-3'>
            {availableDates.map((date) => (
              <button
                key={date}
                type='button'
                onClick={() => setSelectedDate(date)}
                className={`flex h-16 w-16 flex-col items-center justify-center rounded-md border border-white/10 transition hover:bg-white/5 ${
                  selectedDate === date ? 'border-transparent bg-(--color-primary) text-white' : 'text-white/90'
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
          </div>
        </div>

        <p className='text-sm text-gray-400'>
          {selectedDate ? `${moviesForDate.length} movies available` : 'Select a date to view movies'}
        </p>
       </div>

       <h2 className='relative z-10 mx-auto max-w-6xl text-lg font-medium my-4'>
        Available Movies
       </h2>
         <div className='relative z-10 mx-auto flex max-w-6xl flex-wrap justify-center gap-8'>
          {moviesForDate.map((movie) => (
            <Moviecard Movie={movie} key={movie.id}/>
          ))}

         </div>

         {selectedDate && moviesForDate.length === 0 && (
          <p className='relative z-10 mt-10 text-center text-gray-400'>
            No movies available for this date.
          </p>
         )}
    </div>
  ) : (

       <div className='
       flex flex-col items-center justify-center h-screen'>
        <h1 className='text-3xl font-bold text-center'>
          No Movies available
        </h1>

       </div>
  )
}
