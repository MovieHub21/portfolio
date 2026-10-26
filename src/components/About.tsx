import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { personalInfo } from '../data/portfolio';

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0 },
};

export default function About() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  return (
    <section
      id="about"
      ref={sectionRef}
      className="relative py-24 md:py-32 lg:py-40 overflow-hidden"
    >
      {/* Subtle background accent */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[var(--color-accent)]/[0.03] rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-start">
          {/* Label Column */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-4"
          >
            <p className="text-xs uppercase tracking-[0.3em] text-[var(--color-accent)] mb-3"
               style={{ fontFamily: 'var(--font-display)' }}>
              About
            </p>
            <h2
              className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight leading-tight"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              The person
              <br />
              behind the
              <br />
              <span className="text-[var(--color-accent)]">code.</span>
            </h2>
          </motion.div>

          {/* Content Column */}
          <div className="lg:col-span-8 space-y-8">
            <motion.p
              variants={fadeUp}
              initial="hidden"
              animate={isInView ? 'visible' : 'hidden'}
              transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
              className="text-lg md:text-xl text-[var(--color-text)] leading-relaxed"
            >
              {personalInfo.bio}
            </motion.p>

            <motion.p
              variants={fadeUp}
              initial="hidden"
              animate={isInView ? 'visible' : 'hidden'}
              transition={{ duration: 0.7, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="text-base md:text-lg text-[var(--color-text-secondary)] leading-relaxed"
            >
              {personalInfo.approach}
            </motion.p>

            {/* Visual separator */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate={isInView ? 'visible' : 'hidden'}
              transition={{ duration: 0.7, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="flex items-center gap-4 pt-4"
            >
              <div className="h-px flex-1 bg-[var(--color-border)]" />
              <span className="text-xs uppercase tracking-[0.2em] text-[var(--color-text-secondary)]">
                What drives me
              </span>
              <div className="h-px flex-1 bg-[var(--color-border)]" />
            </motion.div>

            {/* Values Grid */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate={isInView ? 'visible' : 'hidden'}
              transition={{ duration: 0.7, delay: 0.45, ease: [0.22, 1, 0.36, 1] }}
              className="grid grid-cols-1 sm:grid-cols-3 gap-6"
            >
              {[
                {
                  title: 'Craft',
                  description: 'I write clean, maintainable code that stands the test of time.',
                },
                {
                  title: 'Impact',
                  description: 'I build products that solve real problems for real people.',
                },
                {
                  title: 'Growth',
                  description: 'I continuously learn new technologies and refine my approach.',
                },
              ].map((value) => (
                <div
                  key={value.title}
                  className="p-5 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-secondary)]/50 hover:border-[var(--color-accent)]/20 transition-colors duration-500"
                >
                  <p
                    className="text-sm font-semibold text-[var(--color-accent)] mb-2"
                    style={{ fontFamily: 'var(--font-display)' }}
                  >
                    {value.title}
                  </p>
                  <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
                    {value.description}
                  </p>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
