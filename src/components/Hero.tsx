import { useEffect, useState, type CSSProperties } from 'react';
import { ArrowRight, Play } from 'lucide-react';
import { site } from '../data/site';
import { prefersReducedMotion } from '../lib/motion';
import Magnetic from './Magnetic';
import VideoModal from './VideoModal';
import { scrollToSection } from './Navbar';
import './Hero.css';

export default function Hero() {
  const [introOpen, setIntroOpen] = useState(false);

  useEffect(() => {
    const root = document.getElementById('home');
    if (!root || prefersReducedMotion()) return;

    let frame = 0;
    const update = () => {
      frame = 0;
      const y = Math.min(window.scrollY, window.innerHeight * 1.4);
      root.style.setProperty('--sy', String(y));
      root.style.setProperty('--hero-fade', String(Math.max(0, 1 - y / (window.innerHeight * 0.9))));
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <section id="home" className="hero tone-dark" aria-labelledby="hero-title">
      <div className="hero__grain" aria-hidden="true" />
      <div className="hero__ambient" aria-hidden="true" />
      <p className="hero__watermark" aria-hidden="true">
        Portfolio
      </p>
      <div className="hero__ring hero__ring--one" aria-hidden="true" />
      <div className="hero__ring hero__ring--two" aria-hidden="true" />

      <div className="hero__inner container">
        <div className="hero__copy">
          <p className="hero__hello hero-anim" style={{ '--d': '140ms' } as CSSProperties}>
            {site.hero.greeting}
          </p>

          <h1 id="hero-title" className="hero__title">
            <span className="hero__line">
              <span className="hero__line-inner hero-anim" style={{ '--d': '220ms' } as CSSProperties}>
                Nima
              </span>
            </span>
            <span className="hero__line">
              <span className="hero__line-inner hero-anim" style={{ '--d': '320ms' } as CSSProperties}>
                Nabizada
              </span>
            </span>
          </h1>

          <p className="hero__role hero-anim" style={{ '--d': '430ms' } as CSSProperties}>
            Frontend <span className="accent">Developer</span>
          </p>

          <p className="hero__lede hero-anim" style={{ '--d': '520ms' } as CSSProperties}>
            {site.tagline}
          </p>

          <div className="hero__actions hero-anim" style={{ '--d': '640ms' } as CSSProperties}>
            <Magnetic>
              <a
                className="btn btn--solid"
                href="#portfolio"
                onClick={(event) => {
                  event.preventDefault();
                  scrollToSection('#portfolio');
                }}
              >
                {site.hero.primaryCta}
                <ArrowRight size={17} strokeWidth={1.7} aria-hidden="true" />
              </a>
            </Magnetic>
            <button type="button" className="hero__watch" onClick={() => setIntroOpen(true)}>
              <span className="hero__play" aria-hidden="true">
                <Play size={11} fill="currentColor" strokeWidth={0} />
              </span>
              {site.hero.secondaryCta}
            </button>
          </div>
        </div>

        <div className="hero__portrait">
          <div className="fog" aria-hidden="true">
            <span className="fog__layer fog__layer--one" />
            <span className="fog__layer fog__layer--two" />
            <span className="fog__layer fog__layer--three" />
          </div>
          <figure className="hero__frame">
            <img
              src="/media/portrait.webp"
              alt="Nima Nabizada, frontend developer"
              width={1122}
              height={1402}
              loading="eager"
              decoding="async"
            />
          </figure>
        </div>
      </div>

      <a
        className="hero__scroll"
        href="#about"
        aria-label="Scroll to the about section"
        onClick={(event) => {
          event.preventDefault();
          scrollToSection('#about');
        }}
      >
        <span className="hero__mouse" aria-hidden="true">
          <span />
        </span>
        <span className="hero__scroll-label">{site.hero.scrollLabel}</span>
        <span className="hero__scroll-line" aria-hidden="true" />
      </a>

      <VideoModal open={introOpen} onClose={() => setIntroOpen(false)} />
    </section>
  );
}
