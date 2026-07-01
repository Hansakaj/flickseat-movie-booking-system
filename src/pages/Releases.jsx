import React, { useEffect, useMemo, useRef, useState } from 'react'
import { CalendarDays, Clock, Ticket } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { fetchMovies, mapShowtimeRow } from '../lib/data'
import { dummyDateTimeData, dummyShowsData } from '../assets/assets'
import backgroundImage from '../assets/iN41Ccw4DctL8npfmYg1j5Tr1eb.webp'
import { Moviecard } from '../component/Moviecard'
import { Blurcircal } from '../component/Blurcircal'
import Timeformater from '../component/lib/Timeformat'

const formatDate = (date) => {
  if (!date) return 'Coming soon'
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

const fallbackShowtimes = Object.entries(dummyDateTimeData).flatMap(([showDate, times]) =>
  times.map((item) => ({
    movieId: item.movieId,
    showDate,
  })),
)

export const Releases = () => {
  const navigate = useNavigate()
  const pageRef = useRef(null)
  const [movies, setMovies] = useState([])
  const [showtimes, setShowtimes] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true

    const loadReleases = async () => {
      try {
        const [moviesData, showtimesResult] = await Promise.all([
          fetchMovies(),
          supabase
            .from('showtimes')
            .select('*')
            .eq('is_active', true)
            .order('show_date', { ascending: true })
            .order('show_time', { ascending: true }),
        ])

        if (!active) return

        if (showtimesResult.error) throw showtimesResult.error

        setMovies(moviesData.length > 0 ? moviesData : dummyShowsData)
        setShowtimes(
          moviesData.length > 0
            ? (showtimesResult.data || []).map(mapShowtimeRow)
            : fallbackShowtimes,
        )
      } catch (err) {
        console.error('Failed to load releases', err)
        if (active) {
          setMovies(dummyShowsData)
          setShowtimes(fallbackShowtimes)
        }
      } finally {
        if (active) setLoading(false)
      }
    }

    loadReleases()

    return () => {
      active = false
    }
  }, [])

  const releases = useMemo(() => {
    const byMovieId = showtimes.reduce((acc, showtime) => {
      const key = String(showtime.movieId)
      if (!acc[key]) acc[key] = []
      acc[key].push(showtime)
      return acc
    }, {})

    return movies
      .map((movie) => {
        const movieShowtimes = byMovieId[String(movie.id)] || []
        const firstShowtime = movieShowtimes[0]

        return {
          movie,
          firstDate: firstShowtime?.showDate || movie.release_date || '',
          showCount: movieShowtimes.length,
        }
      })
      .sort((a, b) => {
        const aDate = a.firstDate ? new Date(a.firstDate).getTime() : Number.MAX_SAFE_INTEGER
        const bDate = b.firstDate ? new Date(b.firstDate).getTime() : Number.MAX_SAFE_INTEGER
        return aDate - bDate
      })
  }, [movies, showtimes])

  const featuredRelease = releases[0]

  useEffect(() => {
    const page = pageRef.current
    if (!page || loading || releases.length === 0) return undefined

    const items = page.querySelectorAll('[data-scroll-reveal]')
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.14, rootMargin: '0px 0px -50px 0px' },
    )

    items.forEach((item) => observer.observe(item))

    return () => observer.disconnect()
  }, [loading, releases.length])

  if (loading) {
    return (
      <div className='flex h-screen items-center justify-center'>
        <p className='text-gray-400'>Loading...</p>
      </div>
    )
  }

  return (
    <main ref={pageRef} className='relative min-h-screen overflow-hidden px-6 pb-24 pt-32 md:px-16 lg:px-36'>
      <div className='pointer-events-none absolute inset-x-[-10%] top-0 h-[640px] opacity-20 blur-2xl'>
        <img src={backgroundImage} alt='' className='h-full w-full object-cover object-center' />
        <div className='absolute inset-0 bg-gradient-to-b from-black/20 via-black/60 to-black' />
      </div>
      <Blurcircal top='120px' right='120px' />
      <Blurcircal bottom='220px' left='80px' />

      <section className='relative mb-12 grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]'>
        <div className='scroll-reveal' data-scroll-reveal>
          <p className='mb-3 text-sm font-semibold uppercase tracking-[0.28em] text-(--color-primary)'>
            New Releases
          </p>
          <h1 className='max-w-3xl text-4xl font-bold leading-tight md:text-6xl'>
            Fresh movies ready for your next cinema night
          </h1>
          <p className='mt-5 max-w-2xl text-base leading-7 text-gray-300 md:text-lg'>
            Browse the latest titles, first show dates, and available screenings in one place.
          </p>
        </div>

        {featuredRelease && (
          <button
            type='button'
            onClick={() => {
              navigate(`/movie/${featuredRelease.movie.id}`)
              window.scrollTo(0, 0)
            }}
            className='scroll-reveal scroll-reveal-card group relative min-h-[340px] overflow-hidden rounded-lg border border-white/10 text-left shadow-2xl shadow-black/30'
            data-scroll-reveal
            style={{ '--reveal-delay': '90ms' }}
          >
            <img
              src={featuredRelease.movie.backdrop_path || featuredRelease.movie.poster_path}
              alt={featuredRelease.movie.title}
              className='absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105'
            />
            <div className='absolute inset-0 bg-gradient-to-t from-black via-black/55 to-transparent' />
            <div className='absolute bottom-0 left-0 right-0 p-6'>
              <p className='mb-2 text-sm font-medium text-(--color-primary)'>Featured Release</p>
              <h2 className='text-3xl font-bold'>{featuredRelease.movie.title}</h2>
              <div className='mt-4 flex flex-wrap gap-4 text-sm text-gray-200'>
                <span className='flex items-center gap-2'>
                  <CalendarDays className='h-4 w-4' />
                  {formatDate(featuredRelease.firstDate)}
                </span>
                <span className='flex items-center gap-2'>
                  <Clock className='h-4 w-4' />
                  {Timeformater(featuredRelease.movie.runtime)}
                </span>
                <span className='flex items-center gap-2'>
                  <Ticket className='h-4 w-4' />
                  {featuredRelease.showCount} shows
                </span>
              </div>
            </div>
          </button>
        )}
      </section>

      {releases.length > 0 ? (
        <>
          <div className='mb-6 flex items-end justify-between gap-4'>
            <div className='scroll-reveal' data-scroll-reveal>
              <h2 className='text-2xl font-semibold'>Release Lineup</h2>
              <p className='mt-2 text-sm text-gray-400'>{releases.length} movies available now</p>
            </div>
          </div>

          <div className='grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
            {releases.map(({ movie, firstDate, showCount }, index) => (
              <div
                key={movie.id}
                className='scroll-reveal scroll-reveal-card space-y-3'
                data-scroll-reveal
                style={{ '--reveal-delay': `${index * 55}ms` }}
              >
                <Moviecard Movie={movie} className='w-full' />
                <div className='rounded-lg border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-gray-300'>
                  <div className='flex items-center justify-between gap-3'>
                    <span className='flex items-center gap-2'>
                      <CalendarDays className='h-4 w-4 text-(--color-primary)' />
                      {formatDate(firstDate)}
                    </span>
                    <span>{showCount} shows</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className='flex min-h-[45vh] flex-col items-center justify-center text-center'>
          <h2 className='text-3xl font-bold'>No releases available</h2>
          <p className='mt-3 max-w-md text-gray-400'>
            Add an active movie in the database to show it on this page.
          </p>
        </div>
      )}
    </main>
  )
}

export default Releases
