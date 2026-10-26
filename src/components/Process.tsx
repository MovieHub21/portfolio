import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { processSteps } from '../data/portfolio';

export default function Process() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-80px' });

  return (
    <section id="process" ref={sectionRef} className="py-24 md:py-32 lg:py-40">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="mb-16 md:mb-20 max-w-2xl"
        >
          <p
            className="text-xs uppercase tracking-[0.3em] text-[var(--color-accent)] mb-3"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            How I Work
          </p>
          <h2
            className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            From idea to
            <br />
            <span className="text-[var(--color-accent)]">production.</span>
          </h2>
          <p className="mt-5 text-[var(--color-text-secondary)] leading-relaxed">
            Every project follows a deliberate process. I believe understanding the problem
            deeply leads to better solutions than jumping straight into code.
          </p>
        </motion.div>

        {/* Process Steps */}
        <div className="relative">
          {/* Connecting Line */}
          <div className="absolute left-[23px] top-0 bottom-0 w-px bg-[var(--color-border)] hidden md:block" />

          <div className="space-y-8 md:space-y-12">
            {processSteps.map((step, i) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, x: -30 }}
                animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
                transition={{
                  duration: 0.6,
                  delay: i * 0.1 + 0.2,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="group relative flex gap-6 md:gap-10 items-start"
              >
                {/* Step Number */}
                <div className="relative z-10 flex-shrink-0 w-12 h-12 rounded-full border border-[var(--color-border)] bg-[var(--color-bg)] flex items-center justify-center group-hover:border-[var(--color-accent)] transition-colors duration-500">
                  <span
                    className="text-xs font-semibold text-[var(--color-text-secondary)] group-hover:text-[var(--color-accent)] transition-colors duration-500"
                    style={{ fontFamily: 'var(--font-display)' }}
                  >
                    {step.number}
                  </span>
                </div>

                {/* Step Content */}
                <div className="pb-2">
                  <h3
                    className="text-xl md:text-2xl font-semibold mb-2 tracking-tight group-hover:text-[var(--color-accent)] transition-colors duration-500"
                    style={{ fontFamily: 'var(--font-display)' }}
                  >
                    {step.title}
                  </h3>
                  <p className="text-[var(--color-text-secondary)] leading-relaxed max-w-lg">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
