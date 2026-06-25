import { Star } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import Timeformater from './lib/Timeformat'

export const Moviecard = ({ Movie, className = '', style, ...props }) => {
  const navigate = useNavigate()
  const movieId = Movie?.id ?? Movie?._id

  const goToMovie = () => {
    if (!movieId) return
    navigate(`/movie/${movieId}`)
    window.scrollTo(0, 0)
  }

  return (
    <div
      className={`movie-card-motion flex w-66 flex-col justify-between rounded-2xl bg-[#0b1324] p-3 transition hover:ring-2 hover:ring-sky-500/70 focus-within:ring-2 focus-within:ring-sky-500/70 ${className}`}
      style={style}
      {...props}
    >
      <img
        onClick={goToMovie}
        src={Movie?.backdrop_path}
        alt={Movie?.title ?? 'Movie'}
        className='h-52 w-full cursor-pointer rounded-lg object-cover object-bottom-right'
      />

      <p className='mt-2 truncate font-semibold'>{Movie?.title}</p>
      <p className='mt-1 text-sm font-semibold text-gray-200'>Movies</p>
      <p className='mt-2 text-sm text-gray-400'>
        {Movie?.release_date ? new Date(Movie.release_date).getFullYear() : 'N/A'} •{' '}
        {Movie?.genres?.slice(0, 2).map((genre) => genre.name).join(' | ') || 'N/A'} • {Timeformater(Movie?.runtime)}
      </p>

      <div className='mt-4 flex items-center justify-between pb-3'>
        <button
          onClick={goToMovie}
          className='cursor-pointer rounded-full bg-(--color-primary) px-4 py-2 text-sm font-medium text-white transition hover:bg-(--color-primary-dull)'
        >
          Buy Ticket
        </button>

        <p className='mt-1 flex items-center gap-1 pr-1 text-sm text-gray-400'>
          <Star className='h-4 w-4 fill-red-500 text-red-500' fill='currentColor' />
          {Number.isFinite(Movie?.vote_average) ? Movie.vote_average.toFixed(1) : '0.0'}
        </p>
      </div>
    </div>
  )
}

export default Moviecard
