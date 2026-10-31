import { useEffect, useRef, useState } from 'react'
import { BRAND, NAV, SECTIONS, SOCIALS } from '../data/site.js'
import './Navbar.css'

function GridIcon({ open }) {
  return (
    <span className={`grid-icon ${open ? 'is-open' : ''}`} aria-hidden="true">
      {Array.from({ length: 9 }).map((_, i) => (
        <span key={i} />
      ))}
    </span>
  )
}

export default function Navbar({ active, onBook }) {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const closeRef = useRef(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.classList.toggle('is-locked', open)
    if (open) closeRef.current?.focus()
    const onKey = (e) => {
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.classList.remove('is-locked')
    }
  }, [open])

  const go = (e, id) => {
    e.preventDefault()
    setOpen(false)
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <>
      <header className={`nav ${scrolled ? 'is-scrolled' : ''}`}>
        <div className="nav__left">
          <a className="nav__logo" href="#home" onClick={(e) => go(e, 'home')}>
            <span className="nav__logo-name">{BRAND.name}</span>
            <span className="nav__logo-sub">{BRAND.tagline}</span>
          </a>
        </div>

        <nav className="nav__center" aria-label="Primary">
          {NAV.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              onClick={(e) => go(e, item.id)}
              className={`nav__link ${active === item.id ? 'is-active' : ''}`}
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="nav__right">
          <span className="nav__sep" aria-hidden="true">
            |
          </span>
          <button className="nav__book" type="button" onClick={onBook}>
            Book a tour
          </button>
          <button
            className="nav__grid"
            type="button"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            <GridIcon open={open} />
          </button>
        </div>
      </header>

      <div className={`menu ${open ? 'is-open' : ''}`} aria-hidden={!open}>
        <div className="menu__inner">
          <div className="menu__col">
            <p className="label">Index</p>
            <ul className="menu__list">
              {SECTIONS.map((s) => (
                <li key={s.id}>
                  <a href={`#${s.id}`} onClick={(e) => go(e, s.id)} tabIndex={open ? 0 : -1}>
                    <span className="menu__num">{s.index}</span>
                    <span className="menu__word">{s.label}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="menu__aside">
            <div>
              <p className="label">Write to us</p>
              <a className="menu__email" href={`mailto:${BRAND.email}`} tabIndex={open ? 0 : -1}>
                {BRAND.email}
              </a>
            </div>
            <div>
              <p className="label">Follow</p>
              <ul className="menu__socials">
                {SOCIALS.map((s) => (
                  <li key={s.label}>
                    <a href={s.href} target="_blank" rel="noreferrer" tabIndex={open ? 0 : -1}>
                      {s.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <button
              className="btn"
              type="button"
              tabIndex={open ? 0 : -1}
              onClick={() => {
                setOpen(false)
                onBook()
              }}
            >
              Reserve a seat
            </button>
          </div>
        </div>
        <button className="menu__close" type="button" onClick={() => setOpen(false)} ref={closeRef}>
          Close
          <span aria-hidden="true">✕</span>
        </button>
      </div>
    </>
  )
}
