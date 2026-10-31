import { useEffect, useRef } from 'react'
import { BRAND, SOCIALS, media } from '../data/site.js'
import './Hero.css'

export default function Hero({ onBook }) {
  const mediaRef = useRef(null)

  useEffect(() => {
    let frame = 0
    const onScroll = () => {
      if (frame) return
      frame = requestAnimationFrame(() => {
        const y = window.scrollY
        if (mediaRef.current && y < window.innerHeight * 1.2) {
          mediaRef.current.style.transform = `translate3d(0, ${y * 0.22}px, 0) scale(1.04)`
        }
        frame = 0
      })
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [])

  return (
    <section className="hero" id="home">
      <div className="hero__media" ref={mediaRef}>
        <img src={media.hero} alt="Mount Bromo and the Tengger caldera at sunrise" />
      </div>
      <div className="hero__veil" aria-hidden="true" />
      <div className="hero__veil hero__veil--bottom" aria-hidden="true" />

      <div className="hero__content inner">
        <p className="hero__meta">
          <span>Photography journey</span>
          <span className="hero__dot" aria-hidden="true" />
          <span>Java, Indonesia</span>
          <span className="hero__dot" aria-hidden="true" />
          <span>3 – 17 August</span>
        </p>

        <h1 className="hero__title">
          Find <span className="hero__title-thin">yourself</span>
        </h1>

        <p className="hero__sub">
          A signature photography tour through Indonesia, to the origins of
          civilisation on the island of Java — fourteen days, eight photographers,
          and the light of a country that never stops moving.
        </p>

        <div className="hero__actions">
          <button className="btn btn--solid" type="button" onClick={onBook}>
            Reserve a seat
          </button>
          <a className="link-underline" href="#gallery">
            View selected work <span aria-hidden="true">↗</span>
          </a>
        </div>
      </div>

      <h2 className="hero__word" aria-hidden="true">
        Origins
      </h2>

      <a className="hero__scroll" href="#about" aria-label="Scroll to the story">
        <span className="hero__scroll-line" aria-hidden="true" />
        <span>Scroll</span>
      </a>

      <aside className="hero__sidebar">
        <div className="hero__mail">
          <a href={`mailto:${BRAND.email}`}>{BRAND.email}</a>
          <p className="hero__vertical">For any questions, write to us:</p>
        </div>
        <ul className="hero__socials">
          {SOCIALS.map((s) => (
            <li key={s.label}>
              <a href={s.href} target="_blank" rel="noreferrer">
                {s.label}
              </a>
            </li>
          ))}
        </ul>
      </aside>
    </section>
  )
}
