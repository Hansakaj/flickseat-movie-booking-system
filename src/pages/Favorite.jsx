import React, { useEffect, useRef, useState } from 'react'
import { fetchMovies } from '../lib/data'
import { Moviecard } from '../component/Moviecard'
import { Blurcircal } from '../component/Blurcircal'

export const Favorite = () => {
  const pageRef = useRef(null)
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

  useEffect(() => {
    const page = pageRef.current
    if (!page || loading) return undefined

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
  }, [loading, movies.length])

  if (loading) {
    return (
      <div className='flex h-screen items-center justify-center'>
        <p className='text-gray-400'>Loading…</p>
      </div>
    )
  }

  return movies.length > 0 ? (
    <div ref={pageRef} className='relative my-40 mb-60 px-6
    md:px-16 lg:px-40 xl:px-44 overflow-hidden min-h-[80vh]'>
      <Blurcircal bottom='50px' right='50px' />
      <Blurcircal top='50px' left='50px' />

       <h1 className='scroll-reveal text-lg font-medium my-4' data-scroll-reveal>
        Your Favorite movies
       </h1>
         <div className='flex flex-wrap max:sm:justify-center gap-8'>
          {movies.map((movie, index) => (
            <Moviecard
              Movie={movie}
              key={movie.id ?? movie._id}
              className='scroll-reveal scroll-reveal-card'
              data-scroll-reveal
              style={{ '--reveal-delay': `${index * 55}ms` }}
            />
          ))}

         </div>
    </div>
  ) : (

       <div ref={pageRef} className='
       flex flex-col items-center justify-center h-screen'>
        <h1 className='scroll-reveal text-3xl font-bold text-center' data-scroll-reveal>
          No Movies available
        </h1>

       </div>
  )
}
