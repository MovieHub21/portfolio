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
      <ambientLight intensity={0.35} />
      <directionalLight
        position={[5, 6, 5]}
        intensity={1.8}
        color="#f5f0ea"
        castShadow={false}
      />
      <directionalLight
        position={[-4, -3, 3]}
        intensity={0.9}
        color="#c9a96e"
      />
      <pointLight
        position={[0, 4, -2]}
        intensity={0.8}
        color="#6488c4"
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

  const opacity = Math.max(1 - scrollProgress * 1.4, 0.15);

  if (prefersReduced) {
    return (
      <div className="w-full h-full flex items-center justify-center pointer-events-none">
        <div
          className="w-48 h-48 sm:w-64 sm:h-64 rounded-3xl rotate-45 border border-accent/25 bg-accent-dim/30 flex items-center justify-center"
        >
          <div className="w-24 h-24 rounded-2xl rotate-45 border border-accent/40" />
        </div>
      </div>
    );
  }

  return (
    <div
      className="w-full h-full relative cursor-grab active:cursor-grabbing"
      style={{
        opacity,
        transition: 'opacity 0.2s ease-out',
        willChange: 'opacity',
      }}
      onPointerMove={handlePointerMove}
      aria-hidden="true"
    >
      <Canvas
        camera={{ position: [0, 0, 5.5], fov: 45 }}
        dpr={isMobile ? [1, 1.5] : [1, 2]}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
        }}
        style={{ width: '100%', height: '100%', background: 'transparent' }}
      >
        <SceneLighting />
        <Suspense fallback={null}>
          <HeroGeometry
            pointerPosition={pointer}
            scrollProgress={scrollProgress}
          />
          <Environment preset="city" environmentIntensity={0.5} />
        </Suspense>
      </Canvas>
    </div>
  );
}
