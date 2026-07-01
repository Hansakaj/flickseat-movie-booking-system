import { ArrowRight, Calendar, Clock } from 'lucide-react'
import backgroundImage from '../assets/iN41Ccw4DctL8npfmYg1j5Tr1eb.webp'
import { useNavigate } from 'react-router-dom'


export default function HeroSection () {

  const navigate = useNavigate()

  return (
    <section className="relative min-h-screen overflow-hidden">
      <div
        className="hero-bg-intro absolute inset-0 bg-cover bg-center brightness-75"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      />
      <div className="hero-vignette absolute inset-0" />
      <div className="hero-bottom-fade absolute inset-x-0 bottom-0" />
      <div className="hero-light-sweep absolute inset-0" />

      <div className="hero-content-intro relative z-10 flex min-h-screen flex-col items-start justify-center gap-6 px-6 md:px-16 lg:px-36">
        <h1 className="hero-reveal hero-reveal-1 max-w-2xl text-5xl font-semibold leading-tight md:text-[70px]">
          Avatar : <br /> Fire and Ashes
        </h1>

        <div className="hero-reveal hero-reveal-2 flex flex-wrap items-center gap-x-6 gap-y-3 text-gray-300">
          <span>Action | Adventure | Sci-Fi</span>

          <div className="flex items-center gap-2">
            <Calendar className="h-4.5 w-4.5" />
            <span>2025</span>
          </div>

          <div className="flex items-center gap-2">
            <Clock className="h-4.5 w-4.5" />
            <span>3h 18m</span>
          </div>
        </div>

        <p className="hero-reveal hero-reveal-3 max-w-md text-gray-300 ">
          In the wake of the devastating war against the RDA and the loss of their eldest son, Jake Sully and Neytiri face a new threat on Pandora: the Ash People, a violent and power-hungry Na'vi tribe led by the ruthless Varang. Jake's family must fight for their survival and the future of 
          Pandora in a conflict that pushes them to their emotional and physical limits.
        </p>

        <button
          onClick={() => navigate('/movie')}
          className="hero-reveal hero-reveal-4 flex items-center gap-1 rounded-full bg-red-500 px-6 py-3 text-sm font-medium text-white transition hover:bg-red-600 cursor-pointer"
        >
          Explore Movies
          <ArrowRight className="h-5 w-5" />
        </button>
      </div>
    </section>
  )
}
