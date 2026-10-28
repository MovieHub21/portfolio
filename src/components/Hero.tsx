import { Component, lazy, Suspense, useRef, type ReactNode } from 'react';
import { useInView, useScroll, useSpring } from 'framer-motion';
import HeroStatic from './HeroStatic';
import HeroOverlay from './hero/HeroOverlay';
import { useBrowserProfile, type BrowserProfile } from '../hooks/useBrowserProfile';
import { useMediaQuery } from '../hooks/useMediaQuery';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { useVisitorPersonalization } from '../hooks/useVisitorPersonalization';

const HeroStage = lazy(() => import('./hero/HeroStage'));

/** If WebGL throws at runtime, quietly swap to the classic hero. */
class StageBoundary extends Component<{ fallback: ReactNode; children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}

function HeroCinematic({ profile }: { profile: BrowserProfile }) {
  const ref = useRef<HTMLElement>(null);
  const visitor = useVisitorPersonalization();
  const compact = useMediaQuery('(max-width: 767px)');
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });
  const domProgress = useSpring(scrollYProgress, { stiffness: 140, damping: 28, mass: 0.3 });
  const active = useInView(ref, { margin: '300px 0px 300px 0px' });

  return (
    <section
      id="hero"
      ref={ref}
      className="relative"
      style={{ height: compact ? '340svh' : '420svh' }}
    >
      {/* The sticky stage stays pinned while scroll drives the animation. */}
      <div className="sticky top-0 h-svh w-full overflow-hidden">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] lg:w-[1100px] lg:h-[1100px] bg-accent/[0.04] rounded-full blur-[150px] pointer-events-none" />
        <div className="absolute inset-0">
          <StageBoundary fallback={<HeroStaticFallback />}>
            <Suspense fallback={null}>
              <HeroStage
                progress={scrollYProgress}
                profile={profile}
                greeting={visitor.greeting}
                compact={compact}
                active={active}
              />
            </Suspense>
          </StageBoundary>
        </div>
        <HeroOverlay progress={domProgress} profile={profile} visitor={visitor} />
      </div>
    </section>
  );
}

function HeroStaticFallback() {
  return <div className="absolute inset-0 grid place-items-center text-text-muted font-mono text-xs">3D unavailable</div>;
}

export default function Hero() {
  const reduced = useReducedMotion();
  const profile = useBrowserProfile();
  // Visitors who prefer reduced motion, or have no WebGL, get the classic static hero.
  if (reduced || !profile.webgl) return <HeroStatic />;
  return <HeroCinematic profile={profile} />;
}
