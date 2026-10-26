import { lazy, Suspense } from 'react';
import { motion, type Variants } from 'framer-motion';
import { personalInfo } from '../data/portfolio';
import { useScrollProgress } from '../hooks/useScrollProgress';
import { useVisitorPersonalization } from '../hooks/useVisitorPersonalization';
import LaptopFallback from './laptop/LaptopFallback';

const LaptopScene = lazy(() => import('./laptop/LaptopScene'));

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: (delay: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] as const },
  }),
};

export default function HeroStatic() {
  const scrollProgress = useScrollProgress();
  const heroProgress = Math.min(scrollProgress * 2.2, 1);
  const personalization = useVisitorPersonalization();

  return (
    <section
      id="hero"
      className="relative min-h-[95vh] lg:min-h-screen flex items-center justify-center overflow-hidden pt-24 pb-20 lg:pt-32 lg:pb-24"
    >
      {/* Background Ambience / Glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] lg:w-[1000px] lg:h-[1000px] bg-accent/[0.035] rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 w-full relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center">
          {/* Left Column: Typography, Personalized Greeting & Intent */}
          <div className="lg:col-span-6 xl:col-span-6 flex flex-col justify-center">
            {/* Privacy-Friendly Personalized Greeting Badge */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={0.1}
              className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full border border-accent/25 bg-accent-dim w-fit mb-6 shadow-sm"
            >
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
              <span className="text-xs font-mono uppercase tracking-widest text-accent font-medium">
                {personalization.greeting}
              </span>
              <span className="text-[10px] text-text-muted font-mono hidden sm:inline">
                [{personalization.localTimeFormatted}]
              </span>
            </motion.div>

            {/* Main Headline */}
            <motion.h1
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={0.25}
              className="text-4xl sm:text-5xl lg:text-5xl xl:text-6xl font-bold tracking-tight leading-[1.1] font-display text-text mb-6"
            >
              Building web products that{' '}
              <span className="relative inline-block text-accent">
                actually work
                <svg
                  className="absolute left-0 -bottom-1.5 w-full h-2.5 text-accent/40"
                  viewBox="0 0 100 12"
                  preserveAspectRatio="none"
                  fill="currentColor"
                >
                  <path d="M0,7 Q50,0 100,7 L100,10 Q50,3 0,10 Z" />
                </svg>
              </span>
              .
            </motion.h1>

            {/* Subheadline / Supporting Paragraph */}
            <motion.p
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={0.4}
              className="text-base sm:text-lg text-text-secondary max-w-xl leading-relaxed mb-8 font-normal"
            >
              {personalInfo.bio}
            </motion.p>

            {/* Calls to Action */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={0.55}
              className="flex flex-wrap items-center gap-4 sm:gap-5 mb-10"
            >
              <a
                href="#projects"
                onClick={(e) => {
                  e.preventDefault();
                  document.querySelector('#projects')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="group inline-flex items-center gap-3 px-7 py-3.5 bg-accent text-bg font-display font-semibold rounded-full text-sm hover:bg-accent-light hover:shadow-[0_0_28px_rgba(201,169,110,0.35)] transition-all duration-300 transform hover:-translate-y-0.5"
              >
                Explore Projects
                <svg
                  className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
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
                className="inline-flex items-center gap-2.5 px-7 py-3.5 border border-border-light text-text font-display font-medium rounded-full text-sm hover:border-accent hover:text-accent transition-all duration-300 hover:bg-white/[0.02]"
              >
                Let's Talk
              </a>
            </motion.div>

            {/* Tech Stack Indicator */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={0.7}
              className="flex items-center gap-3 pt-4 border-t border-border"
            >
              <span className="text-xs uppercase tracking-widest text-text-muted font-mono">
                Primary Stack
              </span>
              <div className="h-3 w-px bg-border" />
              <div className="flex flex-wrap items-center gap-2">
                {['React', 'TypeScript', 'Tailwind', 'Laravel', 'MySQL'].map((tech) => (
                  <span
                    key={tech}
                    className="text-xs text-text-secondary px-2.5 py-1 rounded-md bg-white/[0.03] border border-border font-mono"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Right Column: 3D Developer Workstation Laptop */}
          <div className="lg:col-span-6 xl:col-span-6 relative h-[420px] sm:h-[480px] lg:h-[600px] w-full flex items-center justify-center">
            {/* Ambient desk back-lighting */}
            <div className="absolute inset-0 m-auto w-72 h-72 sm:w-96 sm:h-96 rounded-full bg-accent/[0.07] blur-3xl pointer-events-none" />

            <div className="relative w-full h-full rounded-3xl overflow-hidden border border-border/80 bg-bg-card/30 backdrop-blur-sm shadow-2xl">
              <Suspense
                fallback={
                  <LaptopFallback scrollProgress={heroProgress} />
                }
              >
                <LaptopScene scrollProgress={heroProgress} />
              </Suspense>

              {/* Status Ribbon at bottom of 3D workstation */}
              <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-[11px] font-mono text-text-muted pointer-events-none px-2 z-10">
                <span className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  3D WORKSTATION
                </span>
                <span>INTERACTIVE CLI &bull; DRAG</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Down Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 1 }}
        className="absolute bottom-5 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 pointer-events-none"
      >
        <span className="text-[10px] uppercase tracking-[0.25em] text-text-muted font-mono">
          Scroll to explore
        </span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          className="w-px h-6 bg-gradient-to-b from-accent to-transparent"
        />
      </motion.div>
    </section>
  );
}
