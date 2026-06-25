import Navbar from './component/Navbar.jsx'
import Footer from './component/Footer.jsx'
import { Navigate, Route, Routes } from 'react-router-dom'
import { Movie } from './pages/Movie.jsx'
import { Moviedetails } from './pages/Moviedetails.jsx'
import { Mybooking } from './pages/Mybooking.jsx'
import Seatlayout from './pages/Seatlayout.jsx'
import { Favorite } from './pages/Favorite.jsx'
import { Toaster } from 'react-hot-toast'
import Home from './pages/home.jsx'

const App = ({ hasClerkAuth = false }) => {
  return (
    <>
      <Toaster position="top-right" />
      <Navbar hasClerkAuth={hasClerkAuth} />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/movie" element={<Movie />} />
        <Route path="/movie/:id" element={<Moviedetails />} />
        <Route path="/mybooking" element={<Mybooking hasClerkAuth={hasClerkAuth} />} />
        <Route path="/movie/:id/:date" element={<Seatlayout />} />
        <Route path="/favorite" element={<Favorite />} />

        {/* Any unknown route redirects to the home page */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      <Footer />
    </>
  );
}

export default App
