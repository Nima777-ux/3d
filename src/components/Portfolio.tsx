import { useMemo, useState, type CSSProperties } from 'react';
import { ArrowUpRight, Github } from 'lucide-react';
import { site, type Project } from '../data/site';
import SectionHeading from './SectionHeading';
import './Portfolio.css';

const filters = site.categories;

function ProjectLinks({ project }: { project: Project }) {
  const preview = project.previewUrl ? (
    <a
      className="work__btn"
      href={project.previewUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Live preview of ${project.title}`}
    >
      Live Preview
      <ArrowUpRight size={14} strokeWidth={1.7} aria-hidden="true" />
    </a>
  ) : (
    <button
      type="button"
      className="work__btn"
      aria-disabled="true"
      title="Add the live URL for this project in src/data/site.ts"
    >
      Live Preview
      <ArrowUpRight size={14} strokeWidth={1.7} aria-hidden="true" />
    </button>
  );

  const source = project.sourceUrl ? (
    <a
      className="work__btn work__btn--quiet"
      href={project.sourceUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Source code of ${project.title}`}
    >
      <Github size={14} strokeWidth={1.6} aria-hidden="true" />
      Source Code
    </a>
  ) : (
    <button
      type="button"
      className="work__btn work__btn--quiet"
      aria-disabled="true"
      title="Add the repository URL for this project in src/data/site.ts"
    >
      <Github size={14} strokeWidth={1.6} aria-hidden="true" />
      Source Code
    </button>
  );

  return (
    <div className="work__links">
      {preview}
      {source}
    </div>
  );
}

export default function Portfolio() {
  const [active, setActive] = useState<string>('all');

  const projects = useMemo(
    () => (active === 'all' ? site.projects : site.projects.filter((project) => project.category === active)),
    [active],
  );

  return (
    <section id="portfolio" className="section work tone-dark" aria-labelledby="portfolio-title">
      <div className="container">
        <SectionHeading
          id="portfolio-title"
          index="03"
          label="Portfolio"
          title="Selected"
          accent="work"
          intro="A selection of recent builds and design explorations. Each case study can be opened in full."
        />

        <div className="work__filters" role="group" aria-label="Filter projects by category">
          {filters.map((filter) => (
            <button
              key={filter.id}
              type="button"
              className={`work__filter${active === filter.id ? ' is-active' : ''}`}
              aria-pressed={active === filter.id}
              onClick={() => setActive(filter.id)}
            >
              {filter.label}
            </button>
          ))}
        </div>

        <ul className="work__grid" key={active}>
          {projects.map((project, index) => (
            <li key={project.id} className="work__item" style={{ '--i': index } as CSSProperties}>
              <article className="work__card">
                <div
                  className="work__art"
                  style={{
                    background: `linear-gradient(140deg, ${project.art[0]} 0%, ${project.art[1]} 100%)`,
                  }}
                  data-cursor="view"
                >
                  <span className="work__art-number" aria-hidden="true">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <span className="work__badge">Placeholder</span>
                  <span className="work__art-lines" aria-hidden="true" />
                  {project.previewUrl ? (
                    <a
                      className="work__view"
                      href={project.previewUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`View case study: ${project.title}`}
                    >
                      View Case Study
                    </a>
                  ) : (
                    <span className="work__view is-static" aria-hidden="true">
                      Preview coming soon
                    </span>
                  )}
                </div>

                <div className="work__body">
                  <div className="work__heading">
                    <h3 className="work__title">{project.title}</h3>
                    <ul className="work__tech" aria-label="Technologies used">
                      {project.tech.map((tech) => (
                        <li key={tech}>{tech}</li>
                      ))}
                    </ul>
                  </div>
                  <p className="work__copy">{project.description}</p>
                  <ProjectLinks project={project} />
                </div>
              </article>
            </li>
          ))}
        </ul>

        <p className="work__note">{site.projectsNote}</p>
      </div>
    </section>
  );
}
