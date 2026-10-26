import { Suspense, useState, useCallback, useRef } from 'react';
import type React from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment, ContactShadows } from '@react-three/drei';
import { motion, type Variants } from 'framer-motion';
import LaptopModel from './LaptopModel';
import ParticleField from './ParticleField';
import CodeTokensOrbit from './CodeTokensOrbit';
import GridFloor from './GridFloor';
import { useBrowserProfile } from '../../hooks/useBrowserProfile';
import { useScrollProgress } from '../../hooks/useScrollProgress';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import { personalInfo } from '../../data/portfolio';

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: (delay: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] as const },
  }),
};

export default function HeroCinematic() {
  const profile = useBrowserProfile();
  const scrollProgress = useScrollProgress();
  const isMobile = useMediaQuery('(max-width: 768px)');
  const [pointer, setPointer] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  // Normalized pointer movement for camera parallax
  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (isMobile) return;
      const rect = e.currentTarget.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      const y = ((e.clientY - rect.top) / rect.height - 0.5) * -2;
      setPointer({ x, y });
    },
    [isMobile]
  );

  // Progressive scroll stages
  const heroProgress = Math.min(scrollProgress * 2.2, 1);
  const stage =
    heroProgress < 0.25
      ? '01 / WORKSTATION BOOT'
      : heroProgress < 0.55
      ? '02 / TELEMETRY STREAM'
      : heroProgress < 0.85
      ? '03 / CODE COMPILATION'
      : '04 / PRODUCTION LAUNCH';

  return (
    <section
      ref={containerRef}
      onPointerMove={handlePointerMove}
      className="relative min-h-[96vh] lg:min-h-screen flex items-center justify-center overflow-hidden pt-24 pb-16 lg:pt-32 lg:pb-24 select-none"
      id="hero"
    >
      {/* Background Ambience Radial Glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] lg:w-[1100px] lg:h-[1100px] bg-accent/[0.04] rounded-full blur-[160px] pointer-events-none" />

      {/* Main Content Layout */}
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 w-full relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Left Column: Typography, Personalized Greeting & Intent */}
          <div className="lg:col-span-5 xl:col-span-5 flex flex-col justify-center">
            {/* Local Context Badge */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={0.1}
              className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full border border-accent/25 bg-accent-dim w-fit mb-6 shadow-sm"
            >
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
              <span className="text-xs font-mono uppercase tracking-widest text-accent font-medium">
                {profile.os} · {profile.browser}
              </span>
              <span className="text-[10px] text-text-muted font-mono hidden sm:inline">
                [{profile.timeZone}]
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

            {/* Subheadline / Bio Description */}
            <motion.p
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={0.4}
              className="text-base sm:text-lg text-text-secondary max-w-lg leading-relaxed mb-8 font-normal"
            >
              {personalInfo.bio}
            </motion.p>

            {/* Calls to Action */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={0.55}
              className="flex flex-wrap items-center gap-4 sm:gap-5 mb-8"
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

            {/* HUD Status Chips */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={0.7}
              className="pt-4 border-t border-border flex flex-wrap items-center gap-3 text-[11px] font-mono text-text-muted"
            >
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/[0.03] border border-border">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span>STAGE: {stage}</span>
              </div>

              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/[0.03] border border-border">
                <span className="text-accent">GPU:</span>
                <span>{profile.tier.toUpperCase()} TIER</span>
              </div>
            </motion.div>
          </div>

          {/* Right Column: 3D Cinematic Laptop Workstation */}
          <div className="lg:col-span-7 xl:col-span-7 relative h-[440px] sm:h-[520px] lg:h-[640px] w-full flex items-center justify-center">
            {/* Framed Viewport Container */}
            <div className="relative w-full h-full rounded-3xl overflow-hidden border border-border/80 bg-bg-card/25 backdrop-blur-sm shadow-2xl">
              {/* Canvas Rig */}
              <Canvas
                camera={{
                  position: isMobile ? [0, 0.4, 6.2] : [0, 0.35, 5.0],
                  fov: isMobile ? 46 : 40,
                }}
                dpr={isMobile ? [1, 1.25] : [1, 2]}
                gl={{
                  antialias: true,
                  alpha: true,
                  powerPreference: 'high-performance',
                }}
                style={{ width: '100%', height: '100%', background: 'transparent' }}
              >
                {/* Lighting Setup */}
                <ambientLight intensity={0.5} />
                <directionalLight
                  position={[5, 7, 5]}
                  intensity={2.2}
                  color="#faf6f0"
                  castShadow
                />
                <directionalLight
                  position={[-4, 3, 2]}
                  intensity={1.0}
                  color="#c9a96e"
                />
                <pointLight
                  position={[0, 2.5, 2]}
                  intensity={1.2}
                  color="#8cb0e8"
                  distance={12}
                  decay={2}
                />

                <Suspense fallback={null}>
                  <LaptopModel
                    profile={profile}
                    pointerPosition={pointer}
                    scrollProgress={heroProgress}
                  />

                  {/* Orbiting Code Token Sprites */}
                  <CodeTokensOrbit scrollProgress={heroProgress} />

                  {/* Seeded Floating Particles */}
                  <ParticleField tier={profile.tier} />

                  {/* Tech Grid Floor */}
                  <GridFloor />

                  <ContactShadows
                    position={[0, -0.28, 0.2]}
                    opacity={0.68}
                    scale={9}
                    blur={2.4}
                    far={3.2}
                  />

                  <Environment preset="city" environmentIntensity={0.45} />
                </Suspense>
              </Canvas>

              {/* Bottom HUD Bar on 3D Frame */}
              <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-[11px] font-mono text-text-muted pointer-events-none px-2 z-10">
                <span className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                 
                </span>
                <span className="hidden sm:inline">
                  {profile.screenRes} · {profile.timeZone}
                </span>
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
        className="absolute bottom-4 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 pointer-events-none"
      >
        <span className="text-[10px] uppercase tracking-[0.25em] text-text-muted font-mono">
          Scroll to orbit
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
