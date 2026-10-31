import { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { site } from '../data/site';
import Reveal from './Reveal';
import './About.css';

export default function About() {
  const [expanded, setExpanded] = useState(false);

  return (
    <section id="about" className="section about tone-cream" aria-labelledby="about-title">
      <div className="container">
        <Reveal className="about__panel">
          <div className="about__content">
            <p className="eyebrow">01 — About</p>
            <h2 id="about-title" className="about__title">
              About <span className="serif-accent accent">Me</span>
            </h2>
            <p className="about__lead">{site.about.lead}</p>

            <div id="about-more" className={`about__more${expanded ? ' is-open' : ''}`} aria-hidden={!expanded}>
              <div className="about__more-inner">
                {site.about.more.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </div>

            <button
              type="button"
              className="btn btn--outline about__toggle"
              aria-expanded={expanded}
              aria-controls="about-more"
              onClick={() => setExpanded((value) => !value)}
            >
              {expanded ? site.about.lessCta : site.about.cta}
              <ArrowRight
                size={16}
                strokeWidth={1.6}
                aria-hidden="true"
                style={{ transform: expanded ? 'rotate(-90deg)' : undefined }}
              />
            </button>
          </div>

          <div className="about__aside">
            <svg
              className="about__botanical"
              viewBox="0 0 220 320"
              role="presentation"
              aria-hidden="true"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
            >
              <path d="M110 312V96" />
              <path d="M110 250c-26-4-44-22-48-46 26-2 44 14 48 46Z" />
              <path d="M110 206c24-6 40-24 42-48-24 2-40 18-42 48Z" />
              <path d="M110 162c-22-4-36-20-40-42 22-1 36 13 40 42Z" />
              <path d="M110 124c20-8 32-26 32-50-20 6-31 22-32 50Z" />
              <circle cx="110" cy="70" r="22" />
              <path d="M110 48v44M88 70h44" />
              <path d="M34 312h152" />
              <path d="M62 312c0-18 12-30 30-32M158 312c0-18-12-30-30-32" />
            </svg>

            <ul className="about__principles">
              <li>Detail-obsessed development</li>
              <li>Accessible by default</li>
              <li>Performance as a feature</li>
            </ul>

            <span className="about__monogram" aria-hidden="true">
              N
            </span>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
