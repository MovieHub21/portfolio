import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { personalInfo } from '../data/portfolio';

const fadeUp = {
  hidden: { opacity: 0, y: 35 },
  visible: { opacity: 1, y: 0 },
};

export default function About() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  return (
    <section
      id="about"
      ref={sectionRef}
      className="relative py-28 md:py-36 lg:py-44 border-t border-border overflow-hidden"
    >
      {/* Subtle background glow */}
      <div className="absolute top-1/2 right-0 w-[500px] h-[500px] bg-accent/[0.03] rounded-full blur-[140px] -translate-y-1/2 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-start">
          {/* Label & Sticky Header */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-4 lg:sticky lg:top-32"
          >
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-accent/20 bg-accent-dim text-accent text-xs font-mono uppercase tracking-widest mb-6">
              About Me
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-display tracking-tight leading-[1.15] text-text">
              The engineer
              <br />
              behind the
              <br />
              <span className="text-accent">interfaces.</span>
            </h2>
          </motion.div>

          {/* Narrative & Values */}
          <div className="lg:col-span-8 space-y-12">
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate={isInView ? 'visible' : 'hidden'}
              transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
              className="space-y-6"
            >
              <p className="text-xl sm:text-2xl text-text font-normal leading-relaxed">
                {personalInfo.bio}
              </p>
              <p className="text-base sm:text-lg text-text-secondary leading-relaxed">
                {personalInfo.approach}
              </p>
            </motion.div>

            {/* Principles Cards */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate={isInView ? 'visible' : 'hidden'}
              transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="pt-6"
            >
              <p className="text-xs font-mono uppercase tracking-widest text-text-muted mb-6">
                Guiding Principles
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {[
                  {
                    title: 'Precision Craft',
                    description:
                      'Writing maintainable, clean code that prioritizes correctness, performance, and long-term stability.',
                  },
                  {
                    title: 'Human-First Design',
                    description:
                      'Designing digital products with intuitive ergonomics, accessibility, and zero unnecessary visual friction.',
                  },
                  {
                    title: 'Continuous Mastery',
                    description:
                      'Constantly expanding technical depth across modern frontend architecture, backend services, and databases.',
                  },
                ].map((val) => (
                  <div
                    key={val.title}
                    className="group relative p-7 rounded-2xl border border-border bg-bg-card/70 hover:bg-bg-card hover:border-accent/40 transition-all duration-300 shadow-lg"
                  >
                    <div className="w-8 h-1 bg-accent/40 rounded-full mb-6 group-hover:w-12 group-hover:bg-accent transition-all duration-300" />
                    <h3 className="text-lg font-display font-semibold text-text mb-3">
                      {val.title}
                    </h3>
                    <p className="text-sm text-text-secondary leading-relaxed">
                      {val.description}
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
