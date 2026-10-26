import { Suspense, useState, useCallback } from 'react';
import type React from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment } from '@react-three/drei';
import HeroGeometry from './HeroGeometry';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { useMediaQuery } from '../../hooks/useMediaQuery';

interface HeroSceneProps {
  scrollProgress: number;
}

function SceneLighting() {
  return (
    <>
      <ambientLight intensity={0.15} />
      <directionalLight
        position={[5, 5, 5]}
        intensity={1.2}
        color="#f0ece4"
        castShadow={false}
      />
      <directionalLight
        position={[-3, -2, 4]}
        intensity={0.4}
        color="#c9a96e"
      />
      <pointLight
        position={[0, 3, -3]}
        intensity={0.6}
        color="#4a6fa5"
        distance={15}
        decay={2}
      />
    </>
  );
}

export default function HeroScene({ scrollProgress }: HeroSceneProps) {
  const prefersReduced = useReducedMotion();
  const isMobile = useMediaQuery('(max-width: 768px)');
  const [pointer, setPointer] = useState({ x: 0, y: 0 });

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (isMobile || prefersReduced) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * -2;
    setPointer({ x, y });
  }, [isMobile, prefersReduced]);

  // Fade out canvas as user scrolls past hero
  const opacity = Math.max(1 - scrollProgress * 2.5, 0);

  if (prefersReduced) {
    // Static fallback for reduced motion
    return (
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div
          className="w-48 h-48 md:w-72 md:h-72 rounded-3xl rotate-45 border border-[var(--color-accent)]/20"
          style={{ opacity: 0.3 }}
        />
      </div>
    );
  }

  return (
    <div
      className="absolute inset-0 pointer-events-auto"
      style={{
        opacity,
        transition: 'opacity 0.1s linear',
        willChange: 'opacity',
      }}
      onPointerMove={handlePointerMove}
      aria-hidden="true"
    >
      <Canvas
        camera={{ position: [0, 0, 6], fov: 45 }}
        dpr={isMobile ? [1, 1.5] : [1, 2]}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
        }}
        style={{ background: 'transparent' }}
      >
        <SceneLighting />
        <Suspense fallback={null}>
          <HeroGeometry
            pointerPosition={pointer}
            scrollProgress={scrollProgress}
          />
          <Environment preset="city" environmentIntensity={0.4} />
        </Suspense>
      </Canvas>
    </div>
  );
}
