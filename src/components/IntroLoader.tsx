import { useEffect, useState } from 'react';
import { prefersReducedMotion } from '../lib/motion';

export default function IntroLoader() {
  const [phase, setPhase] = useState<'visible' | 'leaving' | 'done'>('visible');

  useEffect(() => {
    if (prefersReducedMotion()) {
      setPhase('done');
      return;
    }
    const leave = window.setTimeout(() => setPhase('leaving'), 760);
    const done = window.setTimeout(() => setPhase('done'), 1500);
    return () => {
      window.clearTimeout(leave);
      window.clearTimeout(done);
    };
  }, []);

  if (phase === 'done') return null;

  return (
    <div className={`intro${phase === 'leaving' ? ' is-leaving' : ''}`} aria-hidden="true">
      <div className="intro__inner">
        <span className="intro__mark">N</span>
        <span className="intro__line">
          <span className="intro__line-fill" />
        </span>
      </div>
    </div>
  );
}
