import { useState } from 'react';
import { ArrowUpRight, Code2, Gauge, PenTool } from 'lucide-react';
import { site } from '../data/site';
import Reveal from './Reveal';
import SectionHeading from './SectionHeading';
import { scrollToSection } from './Navbar';
import './Services.css';

const icons = {
  code: Code2,
  pen: PenTool,
  gauge: Gauge,
};

export default function Services() {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <section id="services" className="section services tone-deep" aria-labelledby="services-title">
      <div className="container">
        <SectionHeading
          id="services-title"
          index="02"
          label="Services"
          title="What I"
          accent="do"
          intro="Three focused ways I help brands and teams ship websites that feel as good as they look."
        />

        <ul className="services__grid" onMouseLeave={() => setHovered(null)}>
          {site.services.map((service, index) => {
            const Icon = icons[service.icon];
            const dimmed = hovered !== null && hovered !== index;
            return (
              <Reveal as="li" key={service.number} delay={index * 110} className="services__item">
                <article
                  className={`service${dimmed ? ' is-dimmed' : ''}`}
                  onMouseEnter={() => setHovered(index)}
                  onFocus={() => setHovered(index)}
                  onBlur={() => setHovered(null)}
                >
                  <div className="service__head">
                    <span className="service__number">{service.number}</span>
                    <span className="service__icon">
                      <Icon size={22} strokeWidth={1.3} aria-hidden="true" />
                    </span>
                  </div>
                  <h3 className="service__title">{service.title}</h3>
                  <p className="service__copy">{service.description}</p>
                  <a
                    className="service__link"
                    href="#contact"
                    onClick={(event) => {
                      event.preventDefault();
                      scrollToSection('#contact');
                    }}
                  >
                    Discuss this
                    <ArrowUpRight size={15} strokeWidth={1.6} aria-hidden="true" />
                  </a>
                </article>
              </Reveal>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
