import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function GridFloor() {
  const gridRef = useRef<THREE.GridHelper>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (gridRef.current) {
      // Subtle pulse on grid line intensity
      const mat = gridRef.current.material as THREE.LineBasicMaterial;
      if (mat) {
        mat.opacity = 0.12 + Math.sin(t * 1.2) * 0.03;
      }
    }
  });

  return (
    <group position={[0, -1.8, 0]}>
      {/* Tech Grid Floor */}
      <gridHelper
        ref={gridRef}
        args={[30, 30, '#c9a96e', '#1f2937']}
        position={[0, 0, 0]}
      />

      {/* Radial fade mask underneath to blend grid softly */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]}>
        <planeGeometry args={[32, 32]} />
        <meshBasicMaterial
          color="#0a0a0c"
          transparent
          opacity={0.88}
        />
      </mesh>
    </group>
  );
}
