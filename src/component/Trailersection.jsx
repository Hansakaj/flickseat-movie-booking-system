import { dummyTrailers } from '../assets/assets'
import { useMemo, useState } from 'react'

export const Trailersection = () => {
  const [activeIndex, setActiveIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)

  const activeTrailer = dummyTrailers[activeIndex] ?? dummyTrailers[0]

  const embedUrl = useMemo(() => {
    const raw = activeTrailer?.videoUrl
    if (!raw) return null

    try {
      const url = new URL(raw)

      // youtube.com/watch?v=...
      if (url.hostname.includes('youtube.com')) {
        const id = url.searchParams.get('v')
        return id ? `https://www.youtube.com/embed/${id}` : null
      }

      // youtu.be/...
      if (url.hostname.includes('youtu.be')) {
        const id = url.pathname.replace('/', '')
        return id ? `https://www.youtube.com/embed/${id}` : null
      }

      return null
    } catch {
      return null
    }
  }, [activeTrailer])

  const selectTrailer = (index) => {
    setActiveIndex(index)
    setIsPlaying(false)
  }

  return (
    <section className='px-6 pb-20 md:px-16 lg:px-36'>
      <h2 className='scroll-reveal mb-10 text-lg font-medium' data-scroll-reveal>Trailers</h2>

      <div className='mx-auto max-w-3xl'>
        <div className='scroll-reveal mb-8 overflow-hidden rounded-xl bg-white/5' data-scroll-reveal>
          <div className='relative w-full' style={{ paddingTop: '56.25%' }}>
            {isPlaying && embedUrl ? (
              <iframe
                className='absolute inset-0 h-full w-full'
                src={`${embedUrl}?autoplay=1&mute=1&rel=0`}
                title='Trailer player'
                allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'
                allowFullScreen
              />
            ) : (
              <button
                type='button'
                onClick={() => setIsPlaying(true)}
                className='absolute inset-0 h-full w-full cursor-pointer'
                aria-label='Play trailer'
              >
                <img
                  src={activeTrailer?.image}
                  alt='Trailer preview'
                  className='h-full w-full object-cover'
                />
                <div className='absolute inset-0 grid place-items-center bg-black/30'>
                  <span className='rounded-full bg-white/10 px-5 py-2 text-sm font-medium'>Play</span>
                </div>
              </button>
            )}
          </div>
        </div>

        <div className='grid gap-5 sm:grid-cols-2 lg:grid-cols-4'>
          {dummyTrailers.map((trailer, index) => {
            const isActive = index === activeIndex

            return (
              <button
                key={index}
                type='button'
                onClick={() => selectTrailer(index)}
                className={`scroll-reveal scroll-reveal-card group block w-full overflow-hidden rounded-xl bg-white/5 p-0 text-left ${
                  isActive ? 'ring-2 ring-sky-500' : ''
                }`}
                data-scroll-reveal
                style={{ '--reveal-delay': `${index * 70}ms` }}
                aria-label='Select trailer'
              >
                <div className='relative w-full' style={{ paddingTop: '56.25%' }}>
                  <img
                    src={trailer.image}
                    alt='Movie trailer thumbnail'
                    className='absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-105'
                  />
                </div>
              </button>
            )
          })}
        </div>
      </div>
    </section>
  )
}
