import { useEffect, useRef, useState } from 'react';
import { site } from '../data/site';
import { observeOnce } from '../lib/reveal';
import { prefersReducedMotion } from '../lib/motion';
import './Stats.css';

function useCountUp(target: number | null, start: boolean) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (target === null || !start) return;
    if (prefersReducedMotion()) {
      setValue(target);
      return;
    }
    const duration = 1500;
    const startedAt = performance.now();
    let frame = 0;
    const tick = (now: number) => {
      const progress = Math.min((now - startedAt) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(target * eased));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [target, start]);

  return value;
}

function Stat({ label, value, suffix, start }: { label: string; value: number | null; suffix?: string; start: boolean }) {
  const counted = useCountUp(value, start);
  return (
    <li className="stat">
      <span className="stat__value">
        {value === null ? (
          <span className="stat__empty" aria-label="Not provided">
            —
          </span>
        ) : (
          <>
            {counted}
            {suffix ? <span className="stat__suffix">{suffix}</span> : null}
          </>
        )}
      </span>
      <span className="stat__label">{label}</span>
    </li>
  );
}

export default function Stats() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    return observeOnce(element, () => setVisible(true));
  }, []);

  return (
    <section className="stats tone-deep" aria-labelledby="stats-title">
      <div className="container stats__inner" ref={ref}>
        <h2 id="stats-title" className="sr-only">
          Experience in numbers
        </h2>
        <ul className="stats__grid">
          {site.stats.map((stat) => (
            <Stat key={stat.label} label={stat.label} value={stat.value} suffix={stat.suffix} start={visible} />
          ))}
        </ul>
        <p className="stats__note">{site.statsNote}</p>
      </div>
    </section>
  );
}
