import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Menu, Search, X } from 'lucide-react'
import { assets, dummyShowsData } from '../assets/assets'
import { fetchMovies } from '../lib/data'
import Login from './Login/login.jsx'

const Navbar = ({ hasClerkAuth = false }) => {
  const navigate = useNavigate()
  const [isOpen, setIsOpen] = React.useState(false)
  const [isSearchOpen, setIsSearchOpen] = React.useState(false)
  const [searchTerm, setSearchTerm] = React.useState('')
  const [movies, setMovies] = React.useState(dummyShowsData)

  const closeMenu = () => setIsOpen(false)
  const scrollTopAndClose = () => {
    window.scrollTo(0, 0)
    closeMenu()
  }

  React.useEffect(() => {
    let active = true

    fetchMovies()
      .then((data) => {
        if (active && data.length > 0) setMovies(data)
      })
      .catch((err) => {
        console.error('Failed to load search movies', err)
      })

    return () => {
      active = false
    }
  }, [])

  const searchResults = React.useMemo(() => {
    const query = searchTerm.trim().toLowerCase()
    if (!query) return []

    return movies
      .filter((movie) => {
        const title = movie?.title?.toLowerCase() || ''
        const genres = (movie?.genres || []).map((genre) => genre.name).join(' ').toLowerCase()
        return title.includes(query) || genres.includes(query)
      })
      .slice(0, 6)
  }, [movies, searchTerm])

  const openMovie = (movie) => {
    const movieId = movie?.id ?? movie?._id
    if (!movieId) return

    setSearchTerm('')
    setIsSearchOpen(false)
    setIsOpen(false)
    navigate(`/movie/${movieId}`)
    window.scrollTo(0, 0)
  }

  return (
    <div className='fixed left-0 top-0 z-50 flex w-full items-center justify-between px-6 py-5 md:px-16 lg:px-36'>
      <Link to='/' className='max-md:flex-1' onClick={scrollTopAndClose}>
        <img src={assets.logo} alt='' className='logo-entrance h-auto w-32 md:w-40 lg:w-44' />
      </Link>

     <div className={`max-md:absolute max-md:top-0 max-md:left-0 max-md:font-medium 
max-md:text-lg z-50 flex flex-col md:flex-row items-center 
max-md:justify-center gap-8 md:px-8 py-3 max-md:h-screen 
md:rounded-full backdrop-blur bg-black/70 md:bg-white/10 
md:border border-gray-300/20 overflow-hidden transition-[width] duration-300 ${isOpen ?'max-md:w-full' : 'max-md:w-0'}`}>

        <X className="md:hidden absolute top-6 right-6 w-6 h-6 cursor-pointer" onClick={() => setIsOpen(false)} />
  <Link
    onClick={() => { window.scrollTo(0, 0); setIsOpen(false); }}
    to="/"
    className="px-2 transition hover:text-[#e63b60]"
  >
    Home
  </Link>

  <Link
    onClick={() => { window.scrollTo(0, 0); setIsOpen(false); }}
    to="/movie"
    className="px-2 transition hover:text-[#e63b60]"
  >
    Movies
  </Link>

  <Link
    onClick={() => { window.scrollTo(0, 0); setIsOpen(false); }}
    to="/theater"
    className="px-2 transition hover:text-[#e63b60]"
  >
    Theaters
  </Link>

  <Link
    onClick={() => { window.scrollTo(0, 0); setIsOpen(false); }}
    to="/releases"
    className="px-2 transition hover:text-[#e63b60]"
  >
    Releases
  </Link>

  <Link
    onClick={() => { window.scrollTo(0, 0); setIsOpen(false); }}
    to="/favorite"
    className="px-2 transition hover:text-[#e63b60]"
  >
    Favorite
  </Link>
</div>
        <div className='w-72 max-w-[80vw] md:hidden'>
          <div className='flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2'>
            <Search className='h-4 w-4 text-gray-300' />
            <input
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder='Search movies'
              className='w-full bg-transparent text-sm text-white outline-none placeholder:text-gray-400'
            />
          </div>
          {searchTerm && (
            <div className='mt-3 max-h-64 overflow-y-auto rounded-lg border border-white/10 bg-black/90 p-2 text-left'>
              {searchResults.length > 0 ? (
                searchResults.map((movie) => (
                  <button
                    key={movie.id ?? movie._id}
                    type='button'
                    onClick={() => openMovie(movie)}
                    className='flex w-full items-center gap-3 rounded-md p-2 text-left transition hover:bg-white/10'
                  >
                    <img
                      src={movie.poster_path || movie.backdrop_path}
                      alt={movie.title}
                      className='h-12 w-9 rounded object-cover'
                    />
                    <span className='truncate text-sm'>{movie.title}</span>
                  </button>
                ))
              ) : (
                <p className='px-3 py-2 text-sm text-gray-400'>No movies found</p>
              )}
            </div>
          )}
        </div>

      <div className='relative flex items-center gap-8'>
        <button
          type='button'
          onClick={() => setIsSearchOpen((value) => !value)}
          className='max-md:hidden'
          aria-label='Search movies'
        >
          <Search className='h-6 w-6 cursor-pointer' />
        </button>

        {isSearchOpen && (
          <div className='absolute right-24 top-12 w-80 rounded-xl border border-white/10 bg-black/90 p-3 shadow-2xl shadow-black/60 backdrop-blur'>
            <div className='flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2'>
              <Search className='h-4 w-4 text-gray-300' />
              <input
                autoFocus
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder='Search movies'
                className='w-full bg-transparent text-sm text-white outline-none placeholder:text-gray-400'
              />
              <button
                type='button'
                onClick={() => {
                  setSearchTerm('')
                  setIsSearchOpen(false)
                }}
                aria-label='Close search'
              >
                <X className='h-4 w-4 text-gray-400 transition hover:text-white' />
              </button>
            </div>

            <div className='mt-3 max-h-80 overflow-y-auto'>
              {searchTerm ? (
                searchResults.length > 0 ? (
                  searchResults.map((movie) => (
                    <button
                      key={movie.id ?? movie._id}
                      type='button'
                      onClick={() => openMovie(movie)}
                      className='flex w-full items-center gap-3 rounded-lg p-2 text-left transition hover:bg-white/10'
                    >
                      <img
                        src={movie.poster_path || movie.backdrop_path}
                        alt={movie.title}
                        className='h-14 w-10 rounded object-cover'
                      />
                      <div className='min-w-0'>
                        <p className='truncate text-sm font-medium text-white'>{movie.title}</p>
                        <p className='truncate text-xs text-gray-400'>
                          {(movie.genres || []).slice(0, 2).map((genre) => genre.name).join(' | ') || 'Movie'}
                        </p>
                      </div>
                    </button>
                  ))
                ) : (
                  <p className='px-3 py-4 text-center text-sm text-gray-400'>No movies found</p>
                )
              ) : (
                <p className='px-3 py-4 text-center text-sm text-gray-400'>Type a movie name</p>
              )}
            </div>
          </div>
        )}

     

        <Login hasClerkAuth={hasClerkAuth} />
      </div>

      <Menu className='w-8 h-8 cursor-pointer md:hidden' onClick={() => setIsOpen(!isOpen)} />
    </div>
  )
}

export default Navbar
