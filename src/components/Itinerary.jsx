import { useState } from 'react'
import Reveal from './Reveal.jsx'
import { ITINERARY, media } from '../data/site.js'
import './Itinerary.css'

export default function Itinerary({ onBook }) {
  const [openDay, setOpenDay] = useState(0)

  return (
    <section className="section itinerary" id="itinerary">
      <div className="inner">
        <Reveal className="itinerary__head">
          <div>
            <p className="eyebrow">04 — Schedule</p>
            <h2 className="section-title">3 – 17 August</h2>
          </div>
          <p className="itinerary__meta label">
            14 days · 11 locations · max 8 photographers
          </p>
        </Reveal>

        <div className="itinerary__grid">
          <div className="itinerary__list">
            {ITINERARY.map((day, i) => {
              const open = openDay === i
              return (
                <Reveal key={day.day} className={`day ${open ? 'is-open' : ''}`} delay={i * 30}>
                  <button
                    type="button"
                    className="day__head"
                    aria-expanded={open}
                    onClick={() => setOpenDay(open ? -1 : i)}
                  >
                    <span className="day__name">{day.day}</span>
                    <span className="day__date">{day.date}</span>
                    <span className="day__title">{day.title}</span>
                    <span className="day__toggle" aria-hidden="true">
                      {open ? '−' : '+'}
                    </span>
                  </button>
                  <div className="day__body" hidden={!open}>
                    <p className="day__text">{day.text}</p>
                    <span className="day__tag">{day.tag}</span>
                  </div>
                </Reveal>
              )
            })}
            <Reveal className="itinerary__note" delay={60}>
              <p>
                Days 9 – 14 continue west: the calderas of Ijen, the salt fields of
                Madura, and a final portfolio review on the coast before departure.
                The full day-by-day plan is shared when you reserve.
              </p>
              <button className="link-underline" type="button" onClick={onBook}>
                <span aria-hidden="true">&gt;</span> Reserve this departure
              </button>
            </Reveal>
          </div>

          <Reveal className="itinerary__aside" delay={120}>
            <figure className="itinerary__figure">
              <img
                src={media.itinerary}
                alt="A Tengger horseman on the sand sea below Mount Bromo"
                loading="lazy"
              />
              <figcaption className="itinerary__caption">
                <span className="label">Field notes</span>
                <p>
                  Between the shoots there is time. We stop where the light is good,
                  we eat where the drivers eat, and we let the country happen to us.
                </p>
              </figcaption>
            </figure>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
