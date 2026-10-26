import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import type { DeviceTier } from '../../hooks/useBrowserProfile';

interface ParticleFieldProps {
  tier: DeviceTier;
}

export default function ParticleField({ tier }: ParticleFieldProps) {
  const pointsRef = useRef<THREE.Points>(null);

  // Scaled particle counts based on privacy-friendly detected device tier
  const count = tier === 'high' ? 90 : tier === 'mid' ? 48 : 22;

  const [positions, scales] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const sc = new Float32Array(count);

    // Deterministic pseudo-random seed
    let seed = 42;
    const rnd = () => {
      seed = (seed * 16807) % 2147483647;
      return (seed - 1) / 2147483646;
    };

    for (let i = 0; i < count; i++) {
      pos[i * 3 + 0] = (rnd() - 0.5) * 12;
      pos[i * 3 + 1] = (rnd() - 0.5) * 8 + 0.5;
      pos[i * 3 + 2] = (rnd() - 0.5) * 8 - 1;
      sc[i] = rnd() * 0.04 + 0.02;
    }

    return [pos, sc];
  }, [count]);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (pointsRef.current) {
      pointsRef.current.rotation.y = t * 0.025;
      pointsRef.current.rotation.x = Math.sin(t * 0.015) * 0.05;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
        <bufferAttribute
          attach="attributes-scale"
          args={[scales, 1]}
        />
      </bufferGeometry>
      <pointsMaterial
        color="#c9a96e"
        size={0.06}
        sizeAttenuation
        transparent
        opacity={0.45}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}
