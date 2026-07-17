
import React, { useEffect } from 'react'
import Herosection from '../component/Herosection.jsx'
import { Featuresection } from '../component/Featuresection.jsx'
import { Trailersection } from '../component/Trailersection.jsx'
export default function Home() {
  useEffect(() => {
    const items = document.querySelectorAll('[data-scroll-reveal]')

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.16, rootMargin: '0px 0px -60px 0px' },
    )

    items.forEach((item) => observer.observe(item))

    return () => observer.disconnect()
  }, [])

  return (
    <>
      <Herosection />
      <Featuresection />
      <div className='mt-14 mb-12'>
        <Trailersection />
      </div>
    </>
  )
}

//test