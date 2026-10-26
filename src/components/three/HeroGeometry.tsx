import { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import type { Mesh } from 'three';
import * as THREE from 'three';

interface HeroGeometryProps {
  pointerPosition: { x: number; y: number };
  scrollProgress: number;
}

export default function HeroGeometry({ pointerPosition, scrollProgress }: HeroGeometryProps) {
  const meshRef = useRef<Mesh>(null);
  const wireframeRef = useRef<Mesh>(null);
  const innerRef = useRef<Mesh>(null);

  // Create custom geometry with displaced vertices for organic feel
  const geometry = useMemo(() => {
    const geo = new THREE.IcosahedronGeometry(2, 1);
    const positions = geo.attributes.position;
    for (let i = 0; i < positions.count; i++) {
      const x = positions.getX(i);
      const y = positions.getY(i);
      const z = positions.getZ(i);
      const noise = Math.sin(x * 2) * Math.cos(y * 2) * Math.sin(z * 2) * 0.15;
      const len = Math.sqrt(x * x + y * y + z * z);
      const scale = (len + noise) / len;
      positions.setXYZ(i, x * scale, y * scale, z * scale);
    }
    geo.computeVertexNormals();
    return geo;
  }, []);

  useEffect(() => {
    return () => {
      geometry.dispose();
    };
  }, [geometry]);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();

    if (meshRef.current) {
      // Gentle base rotation
      meshRef.current.rotation.y = t * 0.15 + pointerPosition.x * 0.3;
      meshRef.current.rotation.x = Math.sin(t * 0.1) * 0.1 + pointerPosition.y * 0.2;
      meshRef.current.rotation.z = Math.sin(t * 0.08) * 0.05;

      // Scroll-driven transform: move up and scale down as user scrolls
      meshRef.current.position.y = scrollProgress * -3;
      const scale = 1 - scrollProgress * 0.3;
      meshRef.current.scale.setScalar(Math.max(scale, 0.5));
    }

    if (wireframeRef.current) {
      wireframeRef.current.rotation.y = t * 0.12 + pointerPosition.x * 0.3;
      wireframeRef.current.rotation.x = Math.sin(t * 0.1) * 0.1 + pointerPosition.y * 0.2;
      wireframeRef.current.rotation.z = Math.sin(t * 0.08) * 0.05;
      wireframeRef.current.position.y = scrollProgress * -3;
      wireframeRef.current.scale.setScalar(Math.max(1 - scrollProgress * 0.3, 0.5));
    }

    if (innerRef.current) {
      innerRef.current.rotation.y = -t * 0.2 + pointerPosition.x * 0.3;
      innerRef.current.rotation.x = Math.cos(t * 0.12) * 0.15 + pointerPosition.y * 0.2;
      innerRef.current.position.y = scrollProgress * -3;
      innerRef.current.scale.setScalar(Math.max((1 - scrollProgress * 0.3) * 0.6, 0.3));
    }
  });

  return (
    <group>
      {/* Main metallic body */}
      <mesh ref={meshRef} geometry={geometry}>
        <meshPhysicalMaterial
          color="#1a1a2e"
          metalness={0.9}
          roughness={0.15}
          clearcoat={1}
          clearcoatRoughness={0.1}
          envMapIntensity={1.5}
          reflectivity={1}
        />
      </mesh>

      {/* Wireframe overlay */}
      <mesh ref={wireframeRef} geometry={geometry} scale={1.02}>
        <meshBasicMaterial
          color="#c9a96e"
          wireframe
          transparent
          opacity={0.15}
        />
      </mesh>

      {/* Inner glowing core */}
      <mesh ref={innerRef}>
        <icosahedronGeometry args={[1.2, 0]} />
        <meshPhysicalMaterial
          color="#c9a96e"
          emissive="#c9a96e"
          emissiveIntensity={0.3}
          metalness={1}
          roughness={0.3}
          transparent
          opacity={0.4}
        />
      </mesh>
    </group>
  );
}
