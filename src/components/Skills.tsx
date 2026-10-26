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
      className="py-28 md:py-36 lg:py-44 border-t border-border bg-bg-secondary/40"
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 35 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 35 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] as const }}
          className="max-w-2xl mb-16 md:mb-24"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-accent/20 bg-accent-dim text-accent text-xs font-mono uppercase tracking-widest mb-6">
            Technical Arsenal
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-display tracking-tight text-text leading-[1.15] mb-6">
            Modern, battle-tested <br />
            <span className="text-accent">technologies.</span>
          </h2>
          <p className="text-base sm:text-lg text-text-secondary leading-relaxed">
            I specialize in reliable, performant web stacks with strong TypeScript interfaces,
            robust backend APIs, and efficient relational databases.
          </p>
        </motion.div>

        {/* Skills Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {categories.map((category, catIndex) => (
            <motion.div
              key={category.label}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
              transition={{
                duration: 0.75,
                delay: catIndex * 0.1,
                ease: [0.22, 1, 0.36, 1] as const,
              }}
              className="p-8 rounded-3xl border border-border bg-bg-card hover:border-accent/40 hover:-translate-y-1 transition-all duration-300 shadow-xl flex flex-col justify-between"
            >
              <div>
                {/* Header */}
                <div className="flex items-center justify-between pb-6 mb-6 border-b border-border">
                  <h3 className="text-lg font-display font-semibold text-text tracking-tight">
                    {category.label}
                  </h3>
                  <span className="w-2.5 h-2.5 rounded-full bg-accent/80" />
                </div>

                {/* Items */}
                <div className="flex flex-wrap gap-2.5">
                  {category.items.map((skill) => (
                    <span
                      key={skill}
                      className="text-xs font-mono px-3.5 py-2 rounded-xl bg-white/[0.03] border border-border text-text-secondary hover:text-text hover:border-accent/40 hover:bg-accent-dim transition-all duration-200"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Bottom decorative bar */}
              <div className="pt-8 mt-6">
                <div className="h-0.5 w-full bg-border/60 rounded-full overflow-hidden">
                  <div className="h-full bg-accent/40 w-1/3 rounded-full" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
