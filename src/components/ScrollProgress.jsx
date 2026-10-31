import './ScrollProgress.css'

export default function ScrollProgress({ progress }) {
  return (
    <div className="scroll-progress" aria-hidden="true">
      <span className="scroll-progress__bar" style={{ transform: `scaleX(${progress / 100})` }} />
    </div>
  )
}
