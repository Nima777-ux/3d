import { useEffect, useMemo, useState } from 'react'
import Reveal from './Reveal.jsx'
import { GALLERY, GALLERY_FILTERS } from '../data/site.js'
import './Gallery.css'
import './Lightbox.css'

export default function Gallery() {
  const [filter, setFilter] = useState('All')
  const [open, setOpen] = useState(null) // index within the visible list

  const items = useMemo(
    () => (filter === 'All' ? GALLERY : GALLERY.filter((g) => g.category === filter)),
    [filter]
  )

  const close = () => setOpen(null)
  const step = (dir) =>
    setOpen((i) => (i === null ? null : (i + dir + items.length) % items.length))

  useEffect(() => {
    if (open === null) return
    document.body.classList.add('is-locked')
    const onKey = (e) => {
      if (e.key === 'Escape') close()
      if (e.key === 'ArrowRight') step(1)
      if (e.key === 'ArrowLeft') step(-1)
    }
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.classList.remove('is-locked')
    }
  }, [open, items.length])

  const current = open === null ? null : items[open]

  return (
    <section className="section gallery" id="gallery">
      <div className="inner">
        <Reveal className="gallery__head">
          <div>
            <p className="eyebrow">03 — Selected work</p>
            <h2 className="section-title">
              Frames from <em>the road</em>
            </h2>
          </div>
          <p className="gallery__intro lead">
            A small selection from the last three seasons on Java, Bali and Sumba.
            Every frame here was made on foot, slowly, usually before breakfast.
          </p>
        </Reveal>

        <Reveal className="gallery__filters" delay={60}>
          {GALLERY_FILTERS.map((f) => {
            const count = f === 'All' ? GALLERY.length : GALLERY.filter((g) => g.category === f).length
            return (
              <button
                key={f}
                type="button"
                className={`gallery__filter ${filter === f ? 'is-active' : ''}`}
                onClick={() => {
                  setFilter(f)
                  setOpen(null)
                }}
              >
                {f} <span className="gallery__count">{String(count).padStart(2, '0')}</span>
              </button>
            )
          })}
        </Reveal>

        <div className={`gallery__grid gallery__grid--${filter.toLowerCase()}`}>
          {items.map((item, i) => (
            <button
              key={item.id}
              type="button"
              className={`gallery__cell gallery__cell--${item.span}`}
              style={{ '--delay': `${Math.min(i, 8) * 45}ms` }}
              onClick={() => setOpen(i)}
              aria-label={`Open ${item.title}`}
            >
              <img src={item.src} alt={item.alt || `${item.title} — ${item.place}`} loading="lazy" />
              <span className="gallery__meta">
                <span className="gallery__meta-title">{item.title}</span>
                <span className="gallery__meta-place">{item.place}</span>
              </span>
              <span className="gallery__plus" aria-hidden="true">
                +
              </span>
            </button>
          ))}
        </div>
      </div>

      {current && (
        <div className="lightbox" role="dialog" aria-modal="true" aria-label={current.title}>
          <button className="lightbox__backdrop" type="button" onClick={close} aria-label="Close viewer" />
          <figure className="lightbox__figure">
            <img src={current.src} alt={current.alt || current.title} />
            <figcaption className="lightbox__caption">
              <span className="lightbox__title">{current.title}</span>
              <span className="lightbox__place">{current.place}</span>
              <span className="lightbox__count">
                {String(open + 1).padStart(2, '0')} / {String(items.length).padStart(2, '0')}
              </span>
            </figcaption>
          </figure>
          <div className="lightbox__controls">
            <button type="button" onClick={() => step(-1)} aria-label="Previous photograph">
              ←
            </button>
            <button type="button" onClick={() => step(1)} aria-label="Next photograph">
              →
            </button>
            <button type="button" className="lightbox__close" onClick={close} aria-label="Close viewer">
              ✕
            </button>
          </div>
        </div>
      )}
    </section>
  )
}
