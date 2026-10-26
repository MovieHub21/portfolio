import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { projects, type Project } from '../data/portfolio';

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(cardRef, { once: true, margin: '-80px' });
  const isEven = index % 2 === 0;

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 60 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 60 }}
      transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
      className={`grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center ${
        index > 0 ? 'mt-16 md:mt-24 lg:mt-32' : ''
      }`}
    >
      {/* Project Visual */}
      <div
        className={`lg:col-span-7 ${isEven ? '' : 'lg:order-2'}`}
      >
        <div className="group relative rounded-2xl overflow-hidden bg-[var(--color-bg-secondary)] border border-[var(--color-border)] hover:border-[var(--color-accent)]/30 transition-all duration-500">
          {/* Project Preview — gradient placeholder since we don't have real screenshots */}
          <div className="aspect-[16/10] relative overflow-hidden">
            <div
              className="absolute inset-0 transition-transform duration-700 group-hover:scale-105"
              style={{
                background: `linear-gradient(135deg, 
                  ${index === 0 ? '#1a1a2e, #16213e, #0f3460' : 
                    index === 1 ? '#1a1a2e, #2d132c, #3d1c3e' : 
                    '#0a1628, #1a2840, #0d3b45'})`,
              }}
            >
              {/* Abstract project visualization */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center px-8">
                  <p
                    className="text-4xl md:text-5xl font-bold text-white/10"
                    style={{ fontFamily: 'var(--font-display)' }}
                  >
                    {project.title}
                  </p>
                  <div className="mt-4 flex justify-center gap-3 flex-wrap">
                    {project.tech.slice(0, 3).map((t) => (
                      <span
                        key={t}
                        className="text-[10px] uppercase tracking-wider text-white/30 px-3 py-1 border border-white/10 rounded-full"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Hover overlay */}
            <div className="absolute inset-0 bg-[var(--color-bg)]/60 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center gap-4">
              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-2.5 bg-[var(--color-accent)] text-[var(--color-bg)] text-sm font-medium rounded-full hover:bg-[var(--color-text)] transition-colors duration-300"
                >
                  Live Site
                </a>
              )}
              {project.sourceUrl && (
                <a
                  href={project.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-2.5 border border-[var(--color-text)] text-[var(--color-text)] text-sm font-medium rounded-full hover:bg-[var(--color-text)] hover:text-[var(--color-bg)] transition-colors duration-300"
                >
                  Source
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Project Info */}
      <div
        className={`lg:col-span-5 ${isEven ? '' : 'lg:order-1'}`}
      >
        <div className="space-y-5">
          <div className="flex items-center gap-3">
            <span className="text-xs text-[var(--color-accent)] font-mono tracking-wider">
              {String(index + 1).padStart(2, '0')}
            </span>
            <div className="h-px flex-1 bg-[var(--color-border)] max-w-12" />
          </div>

          <h3
            className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            {project.title}
          </h3>

          <p className="text-[var(--color-text-secondary)] leading-relaxed">
            {project.description}
          </p>

          <div className="space-y-3 pt-2">
            <div>
              <p className="text-xs uppercase tracking-[0.15em] text-[var(--color-accent)] mb-1.5"
                 style={{ fontFamily: 'var(--font-display)' }}>
                The Problem
              </p>
              <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
                {project.problem}
              </p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.15em] text-[var(--color-accent)] mb-1.5"
                 style={{ fontFamily: 'var(--font-display)' }}>
                My Role
              </p>
              <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
                {project.contribution}
              </p>
            </div>
          </div>

          {/* Tech Stack */}
          <div className="flex flex-wrap gap-2 pt-2">
            {project.tech.map((t) => (
              <span
                key={t}
                className="text-xs px-3 py-1.5 bg-[var(--color-accent-dim)] text-[var(--color-accent)] rounded-full border border-[var(--color-accent)]/10"
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function Projects() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerInView = useInView(sectionRef, { once: true, margin: '-80px' });

  return (
    <section id="projects" ref={sectionRef} className="py-24 md:py-32 lg:py-40">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={headerInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="mb-16 md:mb-24"
        >
          <p
            className="text-xs uppercase tracking-[0.3em] text-[var(--color-accent)] mb-3"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Featured Work
          </p>
          <h2
            className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Projects that solve
            <br />
            <span className="text-[var(--color-accent)]">real problems.</span>
          </h2>
        </motion.div>

        {/* Projects List */}
        {projects
          .filter((p) => p.featured)
          .map((project, i) => (
            <ProjectCard key={project.id} project={project} index={i} />
          ))}
      </div>
    </section>
  );
}
