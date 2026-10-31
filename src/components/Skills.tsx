import { site } from '../data/site';
import Reveal from './Reveal';
import SectionHeading from './SectionHeading';
import './Skills.css';

export default function Skills() {
  return (
    <section id="skills" className="section skills tone-cream" aria-labelledby="skills-title">
      <div className="container">
        <SectionHeading
          id="skills-title"
          index="04"
          label="Toolkit"
          title="Skills &"
          accent="tools"
          intro="The stack I work in every day — chosen for clarity, speed and long-term maintainability."
        />

        <ul className="skills__grid">
          {site.skills.map((group, index) => (
            <Reveal as="li" key={group.title} delay={index * 120} className="skills__item">
              <article className="skill-card">
                <header className="skill-card__head">
                  <span className="skill-card__index">{String(index + 1).padStart(2, '0')}</span>
                  <h3 className="skill-card__title">{group.title}</h3>
                  <p className="skill-card__caption">{group.caption}</p>
                </header>
                <ul className="skill-card__list">
                  {group.skills.map((skill) => (
                    <li key={skill}>
                      <span className="skill-card__dot" aria-hidden="true" />
                      {skill}
                    </li>
                  ))}
                </ul>
              </article>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
