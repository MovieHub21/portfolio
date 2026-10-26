import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { processSteps } from '../data/portfolio';

export default function Process() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-80px' });

  return (
    <section id="process" ref={sectionRef} className="py-28 md:py-36 lg:py-44 border-t border-border">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 35 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 35 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] as const }}
          className="max-w-3xl mb-16 md:mb-24"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-accent/20 bg-accent-dim text-accent text-xs font-mono uppercase tracking-widest mb-6">
            Engineering Methodology
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-display tracking-tight text-text leading-[1.15] mb-6">
            Deliberate execution, from{' '}
            <span className="text-accent">first concept</span> to scale.
          </h2>
          <p className="text-base sm:text-lg text-text-secondary leading-relaxed">
            I don't jump into code blindly. Quality software requires understanding the user,
            architecting the boundaries, and refining until every detail is rock-solid.
          </p>
        </motion.div>

        {/* Process Steps Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {processSteps.map((step, i) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
              transition={{
                duration: 0.7,
                delay: i * 0.1,
                ease: [0.22, 1, 0.36, 1] as const,
              }}
              className="p-8 sm:p-10 rounded-3xl border border-border bg-bg-card hover:border-accent/40 hover:-translate-y-1 transition-all duration-300 shadow-xl flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-8">
                  <span className="text-4xl sm:text-5xl font-display font-light text-accent/40">
                    {step.number}
                  </span>
                  <span className="text-[11px] font-mono uppercase tracking-widest text-text-muted px-2.5 py-1 rounded bg-white/[0.03] border border-border">
                    Phase {step.number}
                  </span>
                </div>

                <h3 className="text-2xl font-display font-semibold text-text mb-4 tracking-tight">
                  {step.title}
                </h3>

                <p className="text-base text-text-secondary leading-relaxed font-normal">
                  {step.description}
                </p>
              </div>

              <div className="mt-8 pt-6 border-t border-border flex items-center gap-2 text-xs font-mono text-accent">
                <span>0{i + 1}</span>
                <div className="h-px flex-1 bg-border" />
                <span>ACTIVE STAGE</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
