import { useEffect, useState } from 'react'
import { ArrowRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { fetchMovies } from '../lib/data'
import { Blurcircal } from './Blurcircal'
import { Moviecard } from './Moviecard'

export const Featuresection = () => {
  const navigate = useNavigate()
  const [movies, setMovies] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true

    fetchMovies()
      .then((data) => {
        if (active) setMovies(data)
      })
      .catch((err) => {
        console.error('Failed to load movies', err)
      })
      .finally(() => {
        if (active) setLoading(false)
      })

    return () => {
      active = false
    }
  }, [])

  const featured = movies.slice(0, 8)

  return (
    <div className='overflow-hidden px-6 md:px-16 lg:px-24 xl:px-44'>
      <div className='relative pt-20'>
        <Blurcircal bottom='0' right='-80px' />

        <div className='scroll-reveal relative flex items-center justify-between' data-scroll-reveal>
          <div className='pointer-events-none absolute -right-16 -top-20 h-48 w-56 rounded-full bg-[radial-gradient(circle,rgba(75,7,12,0.58)_0%,rgba(45,3,8,0.34)_42%,rgba(0,0,0,0)_72%)] blur-2xl md:-right-24 md:h-64 md:w-72' />
          <p className='text-lg font-medium text-gray-300'>Now Showing</p>
          <button
            onClick={() => navigate('/movie')}
            className='group relative flex cursor-pointer items-center gap-2 rounded-full border border-red-400/10 bg-red-950/10 px-4 py-2 text-sm text-gray-300 backdrop-blur-sm transition hover:border-red-300/20 hover:bg-red-900/20 hover:text-white'
          >
            View All
            <ArrowRight className='h-4 w-4 transition group-hover:translate-x-0.5' />
          </button>
        </div>

        <div className='mt-6 flex flex-wrap gap-8 max-sm:justify-center'>
          {featured.map((movie, index) => (
            <Moviecard
              Movie={movie}
              key={movie.id ?? movie._id}
              className='scroll-reveal scroll-reveal-card'
              data-scroll-reveal
              style={{ '--reveal-delay': `${index * 55}ms` }}
            />
          ))}
        </div>

        {!loading && featured.length === 0 && (
          <p className='mt-10 text-center text-gray-400'>No movies available right now.</p>
        )}

        <div className='scroll-reveal mt-20 flex justify-center' data-scroll-reveal>
          <button
            onClick={() => navigate('/movie')}
            className='cursor-pointer rounded-md bg-(--color-primary) px-10 py-3 text-sm font-medium transition hover:bg-(--color-primary-dull)'
          >
            Show more
          </button>
        </div>
      </div>
    </div>
  )
}
