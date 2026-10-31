import { BRAND, IMAGE_CREDIT, SOCIALS } from '../data/site.js'
import './Footer.css'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="inner footer__inner">
        <p className="footer__thanks">Thank you for watching</p>
        <span className="footer__heart" aria-hidden="true">
          ♥
        </span>

        <div className="footer__bar">
          <a className="footer__email" href={`mailto:${BRAND.email}`}>
            {BRAND.email}
          </a>

          <ul className="footer__socials">
            {SOCIALS.map((s) => (
              <li key={s.label}>
                <a href={s.href} target="_blank" rel="noreferrer">
                  {s.label}
                </a>
              </li>
            ))}
          </ul>

          <button
            className="footer__top"
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            Back to top <span aria-hidden="true">↑</span>
          </button>
        </div>

        <p className="footer__legal">
          © {new Date().getFullYear()} {BRAND.name} · Photography tours &amp; commissions · Java, Indonesia
        </p>
        <p className="footer__credit">{IMAGE_CREDIT}</p>
      </div>
    </footer>
  )
}
