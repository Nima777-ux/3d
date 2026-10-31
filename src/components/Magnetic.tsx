import { useEffect, useRef, useState, type ReactNode } from 'react';
import { prefersReducedMotion } from '../lib/motion';

type Props = {
  children: ReactNode;
  strength?: number;
  className?: string;
};

/** A wrapper that gently pulls its content toward the pointer. */
export default function Magnetic({ children, strength = 10, className = '' }: Props) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    if (!window.matchMedia('(pointer: fine)').matches || prefersReducedMotion()) return;

    const handleMove = (event: MouseEvent) => {
      const rect = element.getBoundingClientRect();
      const dx = (event.clientX - (rect.left + rect.width / 2)) / rect.width;
      const dy = (event.clientY - (rect.top + rect.height / 2)) / rect.height;
      element.style.transform = `translate3d(${dx * strength}px, ${dy * strength}px, 0)`;
    };
    const handleLeave = () => {
      element.style.transform = 'translate3d(0, 0, 0)';
    };

    element.addEventListener('mousemove', handleMove);
    element.addEventListener('mouseleave', handleLeave);
    return () => {
      element.removeEventListener('mousemove', handleMove);
      element.removeEventListener('mouseleave', handleLeave);
    };
  }, [strength]);

  return (
    <span ref={ref} className={`magnetic${className ? ` ${className}` : ''}`}>
      {children}
    </span>
  );
}

export function useIsFinePointer() {
  const [fine, setFine] = useState(false);
  useEffect(() => {
    setFine(window.matchMedia('(pointer: fine)').matches);
  }, []);
  return fine;
}
