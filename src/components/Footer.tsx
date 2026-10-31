import { ArrowUp } from 'lucide-react';
import { site } from '../data/site';
import SocialLinks from './SocialLinks';
import { scrollToSection } from './Navbar';
import './Footer.css';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer tone-dark">
      <div className="container footer__inner">
        <div className="footer__brand">
          <a
            href="#home"
            className="footer__logo"
            onClick={(event) => {
              event.preventDefault();
              scrollToSection('#home');
            }}
          >
            <span className="nav__mark" aria-hidden="true">
              N
            </span>
            <span>
              {site.name}
              <small>{site.role}</small>
            </span>
          </a>
          <p className="footer__copy">© {year} {site.name}. All rights reserved.</p>
        </div>

        <nav className="footer__nav" aria-label="Footer">
          <ul>
            {site.nav.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  onClick={(event) => {
                    event.preventDefault();
                    scrollToSection(item.href);
                  }}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="footer__contact">
          {site.email ? (
            <a className="footer__email" href={`mailto:${site.email}`}>
              {site.email}
            </a>
          ) : (
            <span className="footer__email footer__placeholder" title="Add your email in src/data/site.ts">
              hello@yourdomain.com
            </span>
          )}
          <SocialLinks tone="dark" />
        </div>
      </div>

      <div className="container footer__bottom">
        <p>Designed &amp; built with care.</p>
        <button
          type="button"
          className="footer__top"
          onClick={() => scrollToSection('#home')}
        >
          Back to Top
          <ArrowUp size={15} strokeWidth={1.6} aria-hidden="true" />
        </button>
      </div>
    </footer>
  );
}
