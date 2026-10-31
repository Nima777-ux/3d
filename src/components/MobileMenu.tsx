import { useEffect, useRef, type CSSProperties, type MouseEvent as ReactMouseEvent } from 'react';
import { ArrowUpRight, X } from 'lucide-react';
import { site } from '../data/site';
import { useScrollLock } from '../lib/useScrollLock';
import SocialLinks from './SocialLinks';
import './MobileMenu.css';

type Props = {
  open: boolean;
  active: string;
  onClose: () => void;
  onNavigate: (event: ReactMouseEvent<HTMLAnchorElement>, href: string) => void;
};

export default function MobileMenu({ open, active, onClose, onNavigate }: Props) {
  const closeRef = useRef<HTMLButtonElement>(null);
  useScrollLock(open);

  useEffect(() => {
    if (!open) return;
    closeRef.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div id="mobile-menu" className="mobile-menu" role="dialog" aria-modal="true" aria-label="Site menu">
      <div className="mobile-menu__top container">
        <span className="mobile-menu__brand">
          <span className="nav__mark" aria-hidden="true">
            N
          </span>
          {site.firstName}
        </span>
        <button ref={closeRef} type="button" className="mobile-menu__close" onClick={onClose} aria-label="Close menu">
          <X size={22} strokeWidth={1.5} aria-hidden="true" />
        </button>
      </div>

      <nav className="mobile-menu__nav container" aria-label="Mobile">
        <ul>
          {site.nav.map((item, index) => (
            <li key={item.href} style={{ '--i': index } as CSSProperties}>
              <a
                href={item.href}
                className={`mobile-menu__link${active === item.href ? ' is-active' : ''}`}
                onClick={(event) => onNavigate(event, item.href)}
              >
                <span className="mobile-menu__index">{String(index + 1).padStart(2, '0')}</span>
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <div className="mobile-menu__foot container">
        <a className="btn btn--solid mobile-menu__cta" href="#contact" onClick={(event) => onNavigate(event, '#contact')}>
          Let&apos;s Talk
          <ArrowUpRight size={17} strokeWidth={1.6} aria-hidden="true" />
        </a>
        <SocialLinks tone="dark" />
      </div>
    </div>
  );
}
