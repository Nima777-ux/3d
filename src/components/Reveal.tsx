import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import { observeOnce } from '../lib/reveal';
import { prefersReducedMotion } from '../lib/motion';

type RevealProps = {
  children: ReactNode;
  delay?: number;
  className?: string;
  as?: 'div' | 'section' | 'article' | 'li' | 'header' | 'figure' | 'p';
};

export default function Reveal({ children, delay = 0, className = '', as: Tag = 'div' }: RevealProps) {
  const ref = useRef<HTMLElement | null>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    if (prefersReducedMotion()) {
      setShown(true);
      return;
    }
    return observeOnce(element, () => setShown(true));
  }, []);

  return (
    <Tag
      ref={ref as never}
      className={`reveal${shown ? ' is-in' : ''}${className ? ` ${className}` : ''}`}
      style={{ '--reveal-delay': `${delay}ms` } as CSSProperties}
    >
      {children}
    </Tag>
  );
}
