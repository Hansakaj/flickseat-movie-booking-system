import { Calendar, Clock } from 'lucide-react'
import { assets } from '../../assets/assets'

export default function HeroSection() {
  return (
    <section className="flex flex-col items-start justify-center gap-4 px-6 md:px-16 lg:px-36 bg-[url('/backgroundImage.png')] bg-cover bg-center min-h-screen">
      <img src={assets.marvelLogo} alt="" className="max-h-11 lg:h-11 mt-20" />

      <h1 className="text-5xl md:text-[70px] leading-tight font-semibold max-w-xl">
        Guardians <br /> of the Galaxy
      </h1>

      <div className="flex items-center gap-4 text-gray-300">
        <span>Action | Adventure | Sci-Fi</span>

        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4" />
          <span>2018</span>
        </div>

        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4" />
          <span>2h 8m</span>
        </div>
      </div>
    </section>
  )
}
