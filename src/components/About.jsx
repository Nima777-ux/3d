import Reveal from './Reveal.jsx'
import { ABOUT_STRIP } from '../data/site.js'
import './About.css'

const STATS = [
  { value: '14', label: 'Days on the road' },
  { value: '08', label: 'Photographers' },
  { value: '11', label: 'Locations' },
  { value: '03', label: 'Departures a year' },
]

export default function About({ onBook }) {
  return (
    <section className="section about" id="about">
      <div className="inner">
        <Reveal>
          <p className="eyebrow">02 — The journey</p>
        </Reveal>

        <div className="about__grid">
          <Reveal delay={60}>
            <h2 className="section-title about__title">
              The story <em>begins</em> here
            </h2>
          </Reveal>

          <Reveal className="about__copy" delay={140}>
            <h3 className="about__lead">A country of eternal summer and tropics</h3>
            <p className="lead">
              Java is one hundred and thirty volcanoes standing in a green sea of
              rice. It is the smell of clove smoke at 5 a.m., the sound of a gamelan
              drifting over temple stone that has watched a thousand dawns. For
              fourteen days we travel slowly through it — with tripods, patience,
              and the kind of access that only comes from knowing the people who
              live there.
            </p>
            <p className="lead about__copy-second">
              I am Nima Nabizada, a documentary and travel photographer. This is not
              a sightseeing trip with cameras attached. It is a working journey: we
              wake before the light, we stay after the crowds leave, and every
              evening we sit down together and make sense of what we saw. You will
              come home with a portfolio — and with the way of seeing that makes it.
            </p>
            <button className="link-underline about__cta" type="button" onClick={onBook}>
              <span aria-hidden="true">&gt;</span> Join the tour
            </button>
          </Reveal>
        </div>

        <Reveal className="about__stats" delay={80}>
          {STATS.map((s) => (
            <div className="about__stat" key={s.label}>
              <span className="about__stat-value">{s.value}</span>
              <span className="about__stat-label">{s.label}</span>
            </div>
          ))}
        </Reveal>

        <Reveal className="about__strip" delay={60}>
          {ABOUT_STRIP.map((src, i) => (
            <a
              key={src}
              className="about__thumb"
              href="#gallery"
              aria-label={`See selected work, frame ${i + 1}`}
            >
              <img src={src} alt="" loading="lazy" />
              <span className="about__thumb-index">{String(i + 1).padStart(2, '0')}</span>
            </a>
          ))}
        </Reveal>
      </div>
    </section>
  )
}
