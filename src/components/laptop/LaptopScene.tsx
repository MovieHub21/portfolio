import { Suspense, useState, useCallback, Component } from 'react';
import type React from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment, Lightformer } from '@react-three/drei';
import Laptop3D from './Laptop3D';
import LaptopFallback from './LaptopFallback';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { useMediaQuery } from '../../hooks/useMediaQuery';

interface LaptopSceneProps {
  scrollProgress: number;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

class WebGLErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    console.warn('WebGL scene error handled gracefully:', error);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

function SceneLighting() {
  return (
    <>
      <ambientLight intensity={0.45} />
      <directionalLight
        position={[4, 6, 4]}
        intensity={2.0}
        color="#f8f4ed"
        castShadow
      />
      <directionalLight
        position={[-4, 3, 2]}
        intensity={0.8}
        color="#c9a96e"
      />
      <pointLight
        position={[0, 2, 2]}
        intensity={0.9}
        color="#8aa8e0"
        distance={10}
        decay={2}
      />
    </>
  );
}

export default function LaptopScene({ scrollProgress }: LaptopSceneProps) {
  const prefersReduced = useReducedMotion();
  const isMobile = useMediaQuery('(max-width: 768px)');
  const [pointer, setPointer] = useState({ x: 0, y: 0 });

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (isMobile || prefersReduced) return;
      const rect = e.currentTarget.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      const y = ((e.clientY - rect.top) / rect.height - 0.5) * -2;
      setPointer({ x, y });
    },
    [isMobile, prefersReduced]
  );

  if (prefersReduced) {
    return <LaptopFallback scrollProgress={scrollProgress} />;
  }

  return (
    <WebGLErrorBoundary fallback={<LaptopFallback scrollProgress={scrollProgress} />}>
      <div
        className="w-full h-full relative"
        onPointerMove={handlePointerMove}
        aria-label="Interactive 3D Developer Laptop Workstation"
      >
        <Canvas
          camera={{ position: [0, 0.9, 6.8], fov: 40 }}
          dpr={isMobile ? [1, 1.25] : [1, 2]}
          gl={{
            antialias: true,
            alpha: true,
            powerPreference: 'high-performance',
          }}
          style={{ width: '100%', height: '100%', background: 'transparent' }}
        >
          <SceneLighting />
          <Laptop3D
            pointerPosition={pointer}
            scrollProgress={scrollProgress}
          />
          {/* Own Suspense boundary so the environment loading never hides/re-shows the laptop */}
          <Suspense fallback={null}>
            <Environment resolution={256} environmentIntensity={0.9}>
              <Lightformer form="rect" intensity={3.5} color="#f8f4ed" position={[0, 5, 2]} rotation={[Math.PI / 2, 0, 0]} scale={[10, 4, 1]} />
              <Lightformer form="rect" intensity={2} color="#c9a96e" position={[-5, 1, 2]} rotation={[0, Math.PI / 2, 0]} scale={[6, 3, 1]} />
              <Lightformer form="rect" intensity={1.6} color="#8aa8e0" position={[5, 1, 1]} rotation={[0, -Math.PI / 2, 0]} scale={[6, 3, 1]} />
            </Environment>
          </Suspense>
        </Canvas>
      </div>
    </WebGLErrorBoundary>
  );
}
