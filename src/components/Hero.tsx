import { lazy, Suspense } from 'react';
import { motion, type Variants } from 'framer-motion';
import { personalInfo } from '../data/portfolio';
import { useScrollProgress } from '../hooks/useScrollProgress';

const HeroScene = lazy(() => import('./three/HeroScene'));

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 35 },
  visible: (delay: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.85, delay, ease: [0.22, 1, 0.36, 1] as const },
  }),
};

export default function Hero() {
  const scrollProgress = useScrollProgress();
  const heroProgress = Math.min(scrollProgress * 2.2, 1);

  return (
    <section
      id="hero"
      className="relative min-h-[92vh] lg:min-h-screen flex items-center justify-center overflow-hidden pt-28 pb-20 lg:pt-36 lg:pb-28"
    >
      {/* Background Ambience / Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] lg:w-[900px] lg:h-[900px] bg-accent/[0.04] rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 w-full relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Typography & Intent */}
          <div className="lg:col-span-7 xl:col-span-7 flex flex-col justify-center">
            {/* Status / Personal Badge */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={0.1}
              className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full border border-accent/25 bg-accent-dim w-fit mb-8"
            >
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
              <span className="text-xs font-mono uppercase tracking-widest text-accent font-medium">
                {personalInfo.name} &bull; {personalInfo.title}
              </span>
            </motion.div>

            {/* Main Headline */}
            <motion.h1
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={0.25}
              className="text-4xl sm:text-6xl lg:text-6xl xl:text-7xl font-bold tracking-tight leading-[1.08] font-display text-text mb-8"
            >
              Building digital experiences that{' '}
              <span className="relative inline-block text-accent">
                work
                <svg
                  className="absolute left-0 -bottom-2 w-full h-2.5 text-accent/40"
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
              className="text-lg sm:text-xl text-text-secondary max-w-xl leading-relaxed mb-10 font-normal"
            >
              {personalInfo.subheadline}
            </motion.p>

            {/* Calls to Action */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={0.55}
              className="flex flex-wrap items-center gap-4 sm:gap-6 mb-12"
            >
              <a
                href="#projects"
                onClick={(e) => {
                  e.preventDefault();
                  document.querySelector('#projects')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="group inline-flex items-center gap-3 px-8 py-4 bg-accent text-bg font-display font-semibold rounded-full text-sm hover:bg-accent-light hover:shadow-[0_0_30px_rgba(201,169,110,0.35)] transition-all duration-300 transform hover:-translate-y-0.5"
              >
                Explore Selected Work
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
                className="inline-flex items-center gap-2.5 px-8 py-4 border border-border-light text-text font-display font-medium rounded-full text-sm hover:border-accent hover:text-accent transition-all duration-300 hover:bg-white/[0.02]"
              >
                Get in Touch
              </a>
            </motion.div>

            {/* Tech Stack Preview */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={0.7}
              className="flex items-center gap-3 pt-4 border-t border-border"
            >
              <span className="text-xs uppercase tracking-widest text-text-muted font-mono">
                Core Stack
              </span>
              <div className="h-3 w-px bg-border" />
              <div className="flex flex-wrap items-center gap-2">
                {['React', 'Tailwind', 'Laravel', 'MySQL', 'TypeScript'].map((tech) => (
                  <span
                    key={tech}
                    className="text-xs text-text-secondary px-2.5 py-1 rounded bg-white/[0.03] border border-border"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Right Column: 3D Interactive Centerpiece */}
          <div className="lg:col-span-5 xl:col-span-5 relative h-[380px] sm:h-[460px] lg:h-[580px] w-full flex items-center justify-center">
            {/* Subtle glow circle under the 3D canvas */}
            <div className="absolute inset-0 m-auto w-64 h-64 sm:w-80 sm:h-80 rounded-full bg-accent/[0.08] blur-3xl pointer-events-none" />

            <div className="relative w-full h-full rounded-3xl overflow-hidden border border-border/80 bg-bg-card/40 backdrop-blur-sm shadow-2xl">
              <Suspense
                fallback={
                  <div className="w-full h-full flex items-center justify-center text-text-muted text-xs font-mono">
                    Loading 3D Visual...
                  </div>
                }
              >
                <HeroScene scrollProgress={heroProgress} />
              </Suspense>

              {/* Minimal caption badge inside the 3D frame */}
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-[11px] font-mono text-text-muted pointer-events-none px-2">
                <span>[3D INTERACTIVE ENGINE]</span>
                <span>DRAG / SCROLL</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Down Cue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 1 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 pointer-events-none"
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
