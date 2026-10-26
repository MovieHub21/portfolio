import { lazy, Suspense } from 'react';
import { motion } from 'framer-motion';
import { personalInfo } from '../data/portfolio';
import { useScrollProgress } from '../hooks/useScrollProgress';

const HeroScene = lazy(() => import('./three/HeroScene'));

import type { Variants } from 'framer-motion';

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: (delay: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] as const },
  }),
};

export default function Hero() {
  const scrollProgress = useScrollProgress();
  // Only track progress for the hero area (first ~40vh of scroll)
  const heroProgress = Math.min(scrollProgress * 2.5, 1);

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center overflow-hidden"
    >
      {/* 3D Background */}
      <Suspense fallback={null}>
        <HeroScene scrollProgress={heroProgress} />
      </Suspense>

      {/* Content Overlay */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 w-full pt-20 pb-12">
        <div className="max-w-3xl">
          {/* Greeting */}
          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={0.2}
            className="text-sm md:text-base text-[var(--color-accent)] font-medium tracking-widest uppercase mb-4"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            {personalInfo.name}
          </motion.p>

          {/* Headline */}
          <motion.h1
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={0.4}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.1] tracking-tight mb-6"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            {personalInfo.headline.split(' ').map((word, i) => (
              <span
                key={i}
                className={
                  word.toLowerCase() === 'work.' || word.toLowerCase() === 'experiences'
                    ? 'text-[var(--color-accent)]'
                    : 'text-[var(--color-text)]'
                }
              >
                {word}{' '}
              </span>
            ))}
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={0.6}
            className="text-base md:text-lg text-[var(--color-text-secondary)] max-w-xl leading-relaxed mb-10"
          >
            {personalInfo.subheadline}
          </motion.p>

          {/* CTAs */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={0.8}
            className="flex flex-wrap items-center gap-4 mb-12"
          >
            <a
              href="#projects"
              onClick={(e) => {
                e.preventDefault();
                document.querySelector('#projects')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="group inline-flex items-center gap-2 px-7 py-3.5 bg-[var(--color-accent)] text-[var(--color-bg)] font-medium rounded-full text-sm hover:bg-[var(--color-text)] transition-all duration-300"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              View My Work
              <svg
                className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
            <a
              href="#contact"
              onClick={(e) => {
                e.preventDefault();
                document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="inline-flex items-center gap-2 px-7 py-3.5 border border-[var(--color-border)] text-[var(--color-text)] font-medium rounded-full text-sm hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] transition-all duration-300"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Get in Touch
            </a>
          </motion.div>

          {/* Social Links */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={1.0}
            className="flex items-center gap-5"
          >
            {personalInfo.social.github && (
              <a
                href={personalInfo.social.github}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--color-text-secondary)] hover:text-[var(--color-accent)] transition-colors duration-300"
                aria-label="GitHub Profile"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
              </a>
            )}
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        style={{ opacity: 1 - heroProgress * 3 }}
      >
        <span className="text-[10px] uppercase tracking-[0.3em] text-[var(--color-text-secondary)]">
          Scroll
        </span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className="w-px h-8 bg-gradient-to-b from-[var(--color-accent)] to-transparent"
        />
      </motion.div>
    </section>
  );
}
