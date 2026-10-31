import { useCallback, useEffect, useState } from 'react'
import Preloader from './components/Preloader.jsx'
import Cursor from './components/Cursor.jsx'
import ScrollProgress from './components/ScrollProgress.jsx'
import Navbar from './components/Navbar.jsx'
import SectionRail from './components/SectionRail.jsx'
import Hero from './components/Hero.jsx'
import About from './components/About.jsx'
import Gallery from './components/Gallery.jsx'
import Itinerary from './components/Itinerary.jsx'
import Pricing from './components/Pricing.jsx'
import Contact from './components/Contact.jsx'
import Footer from './components/Footer.jsx'
import BookingModal from './components/BookingModal.jsx'
import { SECTIONS } from './data/site.js'

export default function App() {
  const [active, setActive] = useState('home')
  const [progress, setProgress] = useState(0)
  const [bookingOpen, setBookingOpen] = useState(false)

  const openBooking = useCallback(() => setBookingOpen(true), [])
  const closeBooking = useCallback(() => setBookingOpen(false), [])

  useEffect(() => {
    const onScroll = () => {
      const doc = document.documentElement
      const max = doc.scrollHeight - window.innerHeight
      setProgress(max > 0 ? Math.min(100, (window.scrollY / max) * 100) : 0)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  useEffect(() => {
    const targets = SECTIONS.map((s) => document.getElementById(s.id)).filter(Boolean)
    if (!targets.length) return

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id)
        })
      },
      { rootMargin: '-45% 0px -50% 0px', threshold: 0 }
    )
    targets.forEach((t) => io.observe(t))
    return () => io.disconnect()
  }, [])

  return (
    <>
      <Preloader />
      <Cursor />
      <ScrollProgress progress={progress} />
      <Navbar active={active} onBook={openBooking} />
      <SectionRail active={active} progress={progress} />

      <main>
        <Hero onBook={openBooking} />
        <About onBook={openBooking} />
        <Gallery />
        <Itinerary onBook={openBooking} />
        <Pricing onBook={openBooking} />
        <Contact />
        <Footer />
      </main>

      <BookingModal open={bookingOpen} onClose={closeBooking} />
      <div className="grain" aria-hidden="true" />
    </>
  )
}
