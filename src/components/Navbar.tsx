import { useEffect, useRef, useState, type MouseEvent as ReactMouseEvent } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { site } from '../data/site';
import Magnetic from './Magnetic';
import MobileMenu from './MobileMenu';
import { prefersReducedMotion } from '../lib/motion';
import './Navbar.css';

export function scrollToSection(href: string) {
  const target = document.querySelector<HTMLElement>(href);
  if (!target) return;
  target.scrollIntoView({
    behavior: prefersReducedMotion() ? 'auto' : 'smooth',
    block: 'start',
  });
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState('#home');
  const burgerRef = useRef<HTMLButtonElement>(null);
  const wasOpen = useRef(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const sections = site.nav
      .map((item) => document.querySelector<HTMLElement>(item.href))
      .filter((el): el is HTMLElement => Boolean(el));
    if (!sections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(`#${entry.target.id}`);
        }
      },
      { rootMargin: '-45% 0px -50% 0px', threshold: 0 },
    );
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (wasOpen.current && !open) burgerRef.current?.focus();
    wasOpen.current = open;
  }, [open]);

  const handleNav = (event: ReactMouseEvent<HTMLAnchorElement>, href: string) => {
    event.preventDefault();
    setActive(href);
    setOpen(false);
    scrollToSection(href);
  };

  return (
    <>
      <header className={`nav${scrolled ? ' is-scrolled' : ''}`}>
        <div className="nav__inner container">
          <a
            className="nav__logo"
            href="#home"
            onClick={(event) => handleNav(event, '#home')}
            aria-label="Nima Nabizada — back to top"
          >
            <span className="nav__mark" aria-hidden="true">
              N
            </span>
            <span className="nav__name">{site.firstName}</span>
          </a>

          <nav className="nav__links" aria-label="Primary">
            <ul>
              {site.nav.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    className={`nav__link${active === item.href ? ' is-active' : ''}`}
                    aria-current={active === item.href ? 'page' : undefined}
                    onClick={(event) => handleNav(event, item.href)}
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="nav__actions">
            <Magnetic className="nav__cta-wrap" strength={8}>
              <a
                className="btn btn--outline nav__cta"
                href="#contact"
                onClick={(event) => handleNav(event, '#contact')}
              >
                Let&apos;s Talk
                <ArrowUpRight size={16} strokeWidth={1.6} aria-hidden="true" />
              </a>
            </Magnetic>

            <button
              ref={burgerRef}
              type="button"
              className={`nav__burger${open ? ' is-open' : ''}`}
              aria-label={open ? 'Close menu' : 'Open menu'}
              aria-expanded={open}
              aria-controls="mobile-menu"
              onClick={() => setOpen((value) => !value)}
            >
              <span aria-hidden="true" />
              <span aria-hidden="true" />
            </button>
          </div>
        </div>
      </header>

      <MobileMenu open={open} active={active} onNavigate={handleNav} onClose={() => setOpen(false)} />
    </>
  );
}
