import { lazy, Suspense } from 'react';
import { useBrowserProfile } from '../hooks/useBrowserProfile';
import HeroStatic from './HeroStatic';

const HeroCinematic = lazy(() => import('./hero/HeroCinematic'));

export default function Hero() {
  const profile = useBrowserProfile();

  // If user prefers reduced motion or lacks WebGL, fall back gracefully to HeroStatic
  if (profile.reducedMotion || !profile.webgl) {
    return <HeroStatic />;
  }

  return (
    <Suspense fallback={<HeroStatic />}>
      <HeroCinematic />
    </Suspense>
  );
}
