import React, { useEffect, useState } from 'react'
import { fetchMovies } from '../lib/data'
import { Moviecard } from '../component/Moviecard'
import { Blurcircal } from '../component/Blurcircal'

export const Favorite = () => {
  const [movies, setMovies] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true

    fetchMovies()
      .then((data) => {
        if (active) setMovies(data)
      })
      .catch((err) => console.error('Failed to load movies', err))
      .finally(() => {
        if (active) setLoading(false)
      })

    return () => {
      active = false
    }
  }, [])

  if (loading) {
    return (
      <div className='flex h-screen items-center justify-center'>
        <p className='text-gray-400'>Loading…</p>
      </div>
    )
  }

  return movies.length > 0 ? (
    <div className='relative my-40 mb-60 px-6
    md:px-16 lg:px-40 xl:px-44 overflow-hidden min-h-[80vh]'>
      <Blurcircal bottom='50px' right='50px' />
      <Blurcircal top='50px' left='50px' />

       <h1 className='text-lg font-medium my-4'>
        Your Favorite movies
       </h1>
         <div className='flex flex-wrap max:sm:justify-center gap-8'>
          {movies.map((movie) => (
            <Moviecard Movie={movie} key={movie.id}/>
          ))}

         </div>
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
