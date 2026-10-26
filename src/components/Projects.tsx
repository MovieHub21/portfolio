import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { projects, type Project } from '../data/portfolio';

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(cardRef, { once: true, margin: '-80px' });
  const isEven = index % 2 === 0;

  return (
    <motion.article
      ref={cardRef}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.85, delay: 0.1, ease: [0.22, 1, 0.36, 1] as const }}
      className="p-8 sm:p-10 lg:p-12 rounded-3xl bg-bg-card/90 border border-border hover:border-accent/30 transition-all duration-500 shadow-2xl group"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
        {/* Project Visual / Browser Mockup */}
        <div className={`lg:col-span-7 ${isEven ? '' : 'lg:order-2'}`}>
          <div className="relative rounded-2xl overflow-hidden border border-border-light bg-[#0e0e12] shadow-inner">
            {/* Fake browser header bar */}
            <div className="h-9 px-4 bg-black/40 border-b border-border flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-white/20" />
                <span className="w-2.5 h-2.5 rounded-full bg-white/20" />
                <span className="w-2.5 h-2.5 rounded-full bg-white/20" />
              </div>
              <span className="text-[11px] font-mono text-text-muted">
                {project.id}.preview
              </span>
              <div className="w-8" />
            </div>

            {/* Visual Canvas / Gradient Stage */}
            <div className="aspect-[16/10] relative flex items-center justify-center p-8 overflow-hidden">
              <div
                className="absolute inset-0 opacity-80 group-hover:scale-105 transition-transform duration-700"
                style={{
                  background:
                    index === 0
                      ? 'radial-gradient(circle at 50% 50%, #1e1f38 0%, #0d0e1a 100%)'
                      : index === 1
                      ? 'radial-gradient(circle at 50% 50%, #291a2e 0%, #120914 100%)'
                      : 'radial-gradient(circle at 50% 50%, #142834 0%, #081218 100%)',
                }}
              />

              {/* Decorative Geometric Wireframe in background */}
              <div className="absolute inset-0 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

              <div className="relative z-10 text-center px-4 max-w-sm">
                <span className="text-xs font-mono uppercase tracking-widest text-accent/80 mb-2 block">
                  Project {String(index + 1).padStart(2, '0')}
                </span>
                <h4 className="text-3xl sm:text-4xl font-bold font-display text-text mb-4 tracking-tight">
                  {project.title}
                </h4>
                <div className="flex flex-wrap justify-center gap-2">
                  {project.tech.map((t) => (
                    <span
                      key={t}
                      className="text-[11px] font-mono uppercase tracking-wider px-3 py-1 rounded-full bg-white/[0.06] border border-white/10 text-text-secondary"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Project Details */}
        <div className={`lg:col-span-5 ${isEven ? '' : 'lg:order-1'} flex flex-col justify-center`}>
          <div className="flex items-center gap-3 mb-4">
            <span className="text-xs font-mono font-medium text-accent">
              0{index + 1} // CASE STUDY
            </span>
            <div className="h-px flex-1 bg-border" />
          </div>

          <h3 className="text-2xl sm:text-3xl font-bold font-display text-text mb-4 tracking-tight">
            {project.title}
          </h3>

          <p className="text-base text-text-secondary leading-relaxed mb-6 font-normal">
            {project.description}
          </p>

          <div className="space-y-4 mb-8 pt-4 border-t border-border">
            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-accent block mb-1">
                The Challenge
              </span>
              <p className="text-sm text-text-secondary leading-relaxed">
                {project.problem}
              </p>
            </div>
            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-accent block mb-1">
                Engineering Contribution
              </span>
              <p className="text-sm text-text-secondary leading-relaxed">
                {project.contribution}
              </p>
            </div>
          </div>

          {/* Action Links */}
          <div className="flex items-center gap-4 pt-2">
            <a
              href="#contact"
              onClick={(e) => {
                e.preventDefault();
                document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-accent text-bg font-display font-semibold text-xs tracking-wider uppercase hover:bg-accent-light transition-all duration-300"
            >
              Discuss Project
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </motion.article>
  );
}

export default function Projects() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerInView = useInView(sectionRef, { once: true, margin: '-80px' });

  return (
    <section id="projects" ref={sectionRef} className="py-28 md:py-36 lg:py-44 border-t border-border">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 35 }}
          animate={headerInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 35 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] as const }}
          className="max-w-3xl mb-16 md:mb-24"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-accent/20 bg-accent-dim text-accent text-xs font-mono uppercase tracking-widest mb-6">
            Featured Portfolio
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-display tracking-tight text-text leading-[1.15] mb-6">
            Production software built for{' '}
            <span className="text-accent">real utility</span>.
          </h2>
          <p className="text-base sm:text-lg text-text-secondary leading-relaxed">
            A curated selection of applications demonstrating end-to-end fullstack development,
            clean state architecture, and accessible user interfaces.
          </p>
        </motion.div>

        {/* Projects List */}
        <div className="space-y-16 md:space-y-24">
          {projects
            .filter((p) => p.featured)
            .map((project, i) => (
              <ProjectCard key={project.id} project={project} index={i} />
            ))}
        </div>
      </div>
    </section>
  );
}
