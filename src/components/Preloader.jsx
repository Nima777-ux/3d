import { useEffect, useState } from 'react'
import { BRAND } from '../data/site.js'
import './Preloader.css'

export default function Preloader() {
  const [phase, setPhase] = useState('show')

  useEffect(() => {
    const hide = setTimeout(() => setPhase('hide'), 950)
    const gone = setTimeout(() => setPhase('gone'), 1750)
    return () => {
      clearTimeout(hide)
      clearTimeout(gone)
    }
  }, [])

  if (phase === 'gone') return null

  return (
    <div className={`preloader ${phase === 'hide' ? 'is-hiding' : ''}`} aria-hidden="true">
      <div className="preloader__inner">
        <span className="preloader__brand">{BRAND.name}</span>
        <span className="preloader__line">
          <span className="preloader__fill" />
        </span>
        <span className="preloader__sub">Loading the journey</span>
      </div>
    </div>
  )
}
