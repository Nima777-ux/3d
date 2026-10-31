import { SECTIONS } from '../data/site.js'
import './SectionRail.css'

export default function SectionRail({ active, progress }) {
  const goTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })

  return (
    <aside className="rail" aria-label="Page sections">
      <span className="rail__track" aria-hidden="true">
        <span className="rail__track-fill" style={{ height: `${progress}%` }} />
      </span>
      <ul className="rail__list">
        {SECTIONS.map((s) => (
          <li key={s.id}>
            <button
              type="button"
              className={`rail__item ${active === s.id ? 'is-active' : ''}`}
              onClick={() => goTo(s.id)}
              aria-current={active === s.id ? 'true' : undefined}
            >
              <span className="rail__tick" aria-hidden="true" />
              <span className="rail__num">{s.index}</span>
              <span className="rail__label">{s.label}</span>
            </button>
          </li>
        ))}
      </ul>
    </aside>
  )
}
