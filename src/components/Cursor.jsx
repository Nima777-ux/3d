import { useEffect, useRef } from 'react'
import './Cursor.css'

export default function Cursor() {
  const dot = useRef(null)
  const ring = useRef(null)

  useEffect(() => {
    const fine = window.matchMedia('(pointer: fine)').matches
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!fine || reduced) return

    let x = window.innerWidth / 2
    let y = window.innerHeight / 2
    let rx = x
    let ry = y
    let frame = 0

    const onMove = (e) => {
      x = e.clientX
      y = e.clientY
      if (dot.current) dot.current.style.transform = `translate3d(${x}px, ${y}px, 0)`
      const interactive = e.target.closest?.('a, button, .gallery__cell')
      ring.current?.classList.toggle('is-active', Boolean(interactive))
    }

    const loop = () => {
      rx += (x - rx) * 0.16
      ry += (y - ry) * 0.16
      if (ring.current) ring.current.style.transform = `translate3d(${rx}px, ${ry}px, 0)`
      frame = requestAnimationFrame(loop)
    }

    window.addEventListener('mousemove', onMove)
    frame = requestAnimationFrame(loop)
    document.documentElement.classList.add('has-custom-cursor')

    return () => {
      window.removeEventListener('mousemove', onMove)
      cancelAnimationFrame(frame)
      document.documentElement.classList.remove('has-custom-cursor')
    }
  }, [])

  return (
    <div className="cursor" aria-hidden="true">
      <span className="cursor__ring" ref={ring} />
      <span className="cursor__dot" ref={dot} />
    </div>
  )
}
