import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { skills } from '../data/portfolio';

export default function Skills() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-80px' });

  const categories = Object.values(skills);

  return (
    <section
      id="skills"
      ref={sectionRef}
      className="py-24 md:py-32 lg:py-40 bg-[var(--color-bg-secondary)]"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="mb-16 md:mb-20"
        >
          <p
            className="text-xs uppercase tracking-[0.3em] text-[var(--color-accent)] mb-3"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Expertise
          </p>
          <h2
            className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Technical
            <br />
            <span className="text-[var(--color-accent)]">toolbox.</span>
          </h2>
        </motion.div>

        {/* Skills Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {categories.map((category, catIndex) => (
            <motion.div
              key={category.label}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
              transition={{
                duration: 0.7,
                delay: catIndex * 0.1,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="group p-6 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)]/60 hover:border-[var(--color-accent)]/20 transition-all duration-500"
            >
              {/* Category Header */}
              <div className="flex items-center gap-3 mb-6">
                <div className="w-2 h-2 rounded-full bg-[var(--color-accent)]" />
                <h3
                  className="text-sm font-semibold uppercase tracking-[0.15em] text-[var(--color-text)]"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  {category.label}
                </h3>
              </div>

              {/* Skills List */}
              <ul className="space-y-3">
                {category.items.map((skill) => (
                  <li
                    key={skill}
                    className="text-sm text-[var(--color-text-secondary)] flex items-center gap-2.5 group/item"
                  >
                    <span className="w-1 h-1 rounded-full bg-[var(--color-border)] group-hover/item:bg-[var(--color-accent)] transition-colors duration-300" />
                    <span className="group-hover/item:text-[var(--color-text)] transition-colors duration-300">
                      {skill}
                    </span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
