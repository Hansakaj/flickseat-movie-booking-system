import React, { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { fetchMovieById, fetchMovies, fetchDateTimeForMovie } from '../lib/data'
import { Blurcircal } from '../component/Blurcircal';
import { ChevronRight, Heart, PlayCircle, Star } from 'lucide-react';
import timeFormat from '../component/lib/Timeformat';
import Dateselect from '../component/Dateselect';
import { Moviecard } from '../component/Moviecard';

const PageLoader = ({ title = 'Loading…', subtitle }) => {
  return (
    <div className='min-h-[60vh] flex items-center justify-center px-6'>
      <div className='flex flex-col items-center gap-3 text-center'>
        <div className='h-10 w-10 rounded-full border-4 border-white/15 border-t-(--color-primary) animate-spin' />
        <p className='text-sm text-gray-200'>{title}</p>
        {subtitle ? <p className='text-xs text-gray-400'>{subtitle}</p> : null}
      </div>
    </div>
  )
}

export const Moviedetails = () => {
   const {id} = useParams();
   const [show, setShow] = useState(null);
   const [otherMovies, setOtherMovies] = useState([]);
   const [status, setStatus] = useState('loading'); // loading | ready | notfound
  const [isOnline, setIsOnline] = useState(() => {
   if (typeof navigator === 'undefined') return true
   return navigator.onLine
  })
  const [recommendedCount, setRecommendedCount] = useState(4)

  const scrollToDateSelect = () => {
   const el = document.getElementById('dateSelect')
   if (!el) return
   el.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }

   const getShow = async () => {
    try {
      const [movie, dateTime, allMovies] = await Promise.all([
        fetchMovieById(id),
        fetchDateTimeForMovie(id),
        fetchMovies(),
      ])

      if (!movie) {
        setShow(null);
        setStatus('notfound');
        return;
      }

      setShow({ movie, dateTime });
      setOtherMovies(allMovies);
      setStatus('ready');
    } catch (err) {
      console.error('Failed to load movie details', err)
      setShow(null);
      setStatus('notfound');
    }
   }

    useEffect(() => {
      const onOnline = () => setIsOnline(true)
      const onOffline = () => setIsOnline(false)

      window.addEventListener('online', onOnline)
      window.addEventListener('offline', onOffline)
      return () => {
        window.removeEventListener('online', onOnline)
        window.removeEventListener('offline', onOffline)
      }
    }, [])

  useEffect(() => {
      if (!isOnline) return
      setStatus('loading');
      getShow()
    }, [id, isOnline])

    if (!isOnline) {
      return <PageLoader title='No internet connection' subtitle='Waiting to reconnect…' />
    }

    if (status === 'loading') return <PageLoader />
  if (status === 'notfound') return <div>Movie not found.</div>

  return show ? (

    <div className='px-6 md:px-16 lg:px-40 pt-30 md:pt-50 pb-14 md:pb-40'>
       <div className='flex flex-col md:flex-row gap-8 max-w-6xl mx-auto'>
        <img src={show.movie.poster_path} alt= '' className='max-md:mx-auto rounded-xl h-104 max-w-70 object-cover'/>
            <div className='relative flex flex-col gap-3'>
                  <Blurcircal top='-100px' left='-100px' />
                  <p className='text-sm text-gray-300'>ENGLISH</p>

                  <h1 className='text-4xl font-semibold max-w-96 text-balance'>{show.movie.title}</h1>
                  <div className='flex items-center gap-2 text-gray-300'>
                  <Star className='h-5 w-5 text-(--color-primary) fill-(--color-primary)' />
                  <span>{Number.isFinite(show.movie?.vote_average) ? show.movie.vote_average.toFixed(1) : '0.0'} user Rating</span>
                  </div>
                  <p className='text-gray-400 mt-2 text-sm leading-tight max-w-xl'>
                    {show.movie.overview}</p>
                    <p>
                      {timeFormat(show.movie?.runtime)} • {(show.movie?.genres ?? []).map(genre => genre.name).join(' | ')} • {(show.movie?.release_date ?? '').split('-')[0]}
                    </p>
                    <div className='flex items-center flex-wrap gap-4 mt-4'>
                      <button className='flex items-center gap-2 rounded-md bg-gray-800 px-5 py-3 text-sm font-medium transition hover:bg-gray-900 cursor-pointer active:scale-95'>
                        <PlayCircle className='h-5 w-5' />
                        Watch Trailer
                      </button>

                        <button
                          type='button'
                          onClick={scrollToDateSelect}
                          className='cursor-pointer rounded-md bg-(--color-primary) px-8 py-3 text-sm font-medium transition hover:bg-(--color-primary-dull) active:scale-95'
                        >
                          Buy Tickets
                        </button>

                      <button className='cursor-pointer rounded-full bg-gray-800 p-3 ring-1 ring-white/10 transition hover:bg-gray-900 active:scale-95'>
                        <Heart className='h-5 w-5 text-gray-200' />
                      </button>
                    </div>
            </div>
       </div>

       <div className='max-w-6xl mx-auto mt-16'>
         <p className='text-lg font-medium'>Your favorite Cast</p>
         <div className='overflow-x-auto no-scrollbar mt-8 pb-4'>
           <div className='flex items-center gap-4 w-max px-4'>
             {(show.movie?.casts ?? []).slice(0, 10).map((cast, index) => (
               <div key={index} className='flex flex-col items-center text-center'>
                 {cast.profile_path ? (
                   <img
                     src={cast.profile_path}
                     alt={cast.name}
                     className='h-20 aspect-square rounded-full object-cover'
                   />
                 ) : (
                   <div className='h-20 w-20 aspect-square rounded-full bg-white/10 flex items-center justify-center text-xs text-white/60'>
                     {cast.name?.slice(0, 2)?.toUpperCase()}
                   </div>
                 )}
                 <p className='font-medium text-xs mt-3'>{cast.name}</p>
               </div>
             ))}
           </div>
         </div>
          <Dateselect dateTime={show.dateTime} id={id} />

          <div className='mt-16'>
            <div className='flex items-center justify-between'>
              <p className='text-lg font-medium'>You May Also Like</p>
              <Link
                to='/movie'
                className='flex items-center gap-1 text-sm text-gray-300 hover:text-white transition'
              >
                View All
                <ChevronRight className='h-4 w-4' />
              </Link>
            </div>

            <div className='overflow-x-auto overflow-y-visible no-scrollbar mt-8 pb-4 pt-2'>
              <div className='flex items-stretch gap-6 w-max px-4 py-1'>
                {otherMovies
                  .filter((m) => String(m.id ?? m._id) !== String(show.movie?.id ?? show.movie?._id))
                  .slice(0, recommendedCount)
                  .map((movie) => (
                    <div key={movie.id ?? movie._id} className='shrink-0'>
                      <Moviecard Movie={movie} />
                    </div>
                  ))}
              </div>
            </div>

            {otherMovies.filter((m) => String(m.id ?? m._id) !== String(show.movie?.id ?? show.movie?._id))
              .length > recommendedCount && (
              <div className='mt-8 flex justify-center'>
                <button
                  type='button'
                  onClick={() => setRecommendedCount((c) => c + 4)}
                  className='cursor-pointer rounded-md bg-(--color-primary) px-10 py-3 text-sm font-medium transition hover:bg-(--color-primary-dull) active:scale-95'
                >
                  Show more
                </button>
              </div>
            )}
          </div>

       </div>
    </div>
  ) : null
}
