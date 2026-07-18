import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Home, LifeBuoy, Info, HandHeart, Lock, Mail, MessagesSquare, CloudSun } from 'lucide-react'
import { LimelightNav, type NavItem } from './ui/limelight-nav'

// Sections the nav "limelight" follows as you scroll, in document (scroll) order.
// The nav is ordered to MATCH the page's scroll order (Home, Get in touch,
// Resources, About, Volunteer, Privacy, The Wall), so these map to increasing
// nav indices and the glow travels strictly left-to-right as you scroll down.
// Top of page => Home (index 0). "The Wall" (index 6) is a route, not spied.
const SPY_SECTIONS = [
  { id: 'inquiry', index: 1 },
  { id: 'resources', index: 2 },
  { id: 'about', index: 3 },
  { id: 'volunteer', index: 4 },
  { id: 'privacy', index: 5 },
]

export function Navbar() {
  const navigate = useNavigate()
  const [activeIndex, setActiveIndex] = useState(0)
  // After a click we briefly stop reacting to scroll, so the glow doesn't fight
  // the smooth-scroll animation on its way to the target section.
  const lockUntil = useRef(0)

  useEffect(() => {
    // Computed directly on each scroll event (no rAF throttle): it's only four
    // getBoundingClientRect reads, and setActiveIndex is a no-op in React when
    // the value is unchanged, so this stays cheap and re-renders only on a real
    // section change. (rAF is paused in hidden tabs, which made this untestable.)
    const compute = () => {
      if (performance.now() < lockUntil.current) return
      const threshold = 120
      let current = 0 // top of the page => Home
      for (const section of SPY_SECTIONS) {
        const el = document.getElementById(section.id)
        if (!el) continue
        // SPY_SECTIONS is in scroll order, so the last one whose top has passed
        // the threshold is the section currently in view.
        if (el.getBoundingClientRect().top <= threshold) current = section.index
        else break
      }
      setActiveIndex(current)
    }
    compute()
    window.addEventListener('scroll', compute, { passive: true })
    window.addEventListener('resize', compute)
    return () => {
      window.removeEventListener('scroll', compute)
      window.removeEventListener('resize', compute)
    }
  }, [])

  const scrollTo = (id: string) => {
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
    else navigate(`/#${id}`)
  }

  const items: NavItem[] = [
    { id: 'home', icon: <Home />, label: 'Home', onClick: () => window.scrollTo({ top: 0, behavior: 'smooth' }) },
    { id: 'contact', icon: <Mail />, label: 'Get in touch', onClick: () => scrollTo('inquiry') },
    { id: 'resources', icon: <LifeBuoy />, label: 'Resources', onClick: () => scrollTo('resources') },
    { id: 'about', icon: <Info />, label: 'About', onClick: () => scrollTo('about') },
    { id: 'volunteer', icon: <HandHeart />, label: 'Volunteer', onClick: () => scrollTo('volunteer') },
    { id: 'privacy', icon: <Lock />, label: 'Privacy', onClick: () => scrollTo('privacy') },
    { id: 'weather', icon: <CloudSun />, label: 'Weather', onClick: () => navigate('/weather') },
    { id: 'wall', icon: <MessagesSquare />, label: 'The Wall', onClick: () => navigate('/wall') },
  ]

  return (
    <>
      <div className="lk-navbar-bg" aria-hidden="true" />
      <header className="lk-navbar">
        <div className="lk-logo">
          <span className="lk-logo-text">Soforotto</span>
          <span className="lk-logo-mark">&trade;</span>
        </div>
      </header>

      <div className="fixed z-[110] left-1/2 -translate-x-1/2 bottom-4 sm:bottom-auto sm:top-2.5">
        <LimelightNav
          items={items}
          activeIndex={activeIndex}
          onTabChange={(i) => {
            // Lead the glow for every spied item (Home + the five sections,
            // indices 0-5). "The Wall" (6) is a route, so leave it alone.
            if (i <= 5) {
              setActiveIndex(i)
              lockUntil.current = performance.now() + 900
            }
          }}
          iconContainerClassName="p-2 sm:p-3.5"
        />
      </div>
    </>
  )
}
