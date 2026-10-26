import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';
import LaptopScreen from './LaptopScreen';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import { useReducedMotion } from '../../hooks/useReducedMotion';

interface Laptop3DProps {
  pointerPosition: { x: number; y: number };
  scrollProgress: number;
}

export default function Laptop3D({ pointerPosition, scrollProgress }: Laptop3DProps) {
  const groupRef = useRef<THREE.Group>(null);
  const lidRef = useRef<THREE.Group>(null);
  const isMobile = useMediaQuery('(max-width: 768px)');
  const prefersReduced = useReducedMotion();

  // Subtle frame loop
  useFrame((state) => {
    const t = state.clock.getElapsedTime();

    if (groupRef.current) {
      if (!prefersReduced) {
        // Floating motion + subtle mouse parallax
        groupRef.current.position.y =
          Math.sin(t * 0.8) * 0.05 - 0.2 + scrollProgress * 0.4;

        // Base rotation: flattering 3/4 angle (approx -0.35 rad) responding to pointer
        const targetRotY =
          -0.35 + pointerPosition.x * 0.25 + scrollProgress * 0.4;
        const targetRotX =
          0.12 + pointerPosition.y * 0.15 - scrollProgress * 0.1;

        groupRef.current.rotation.y = THREE.MathUtils.lerp(
          groupRef.current.rotation.y,
          targetRotY,
          0.05
        );
        groupRef.current.rotation.x = THREE.MathUtils.lerp(
          groupRef.current.rotation.x,
          targetRotX,
          0.05
        );

        // Zoom slightly closer as user scrolls
        const targetZ = scrollProgress * 1.2;
        groupRef.current.position.z = THREE.MathUtils.lerp(
          groupRef.current.position.z,
          targetZ,
          0.05
        );
      }
    }
  });

  // Metallic Aluminum Material properties
  const chassisMaterial = (
    <meshStandardMaterial
      color="#181a20"
      metalness={0.88}
      roughness={0.25}
      envMapIntensity={1.2}
    />
  );

  const darkTrimMaterial = (
    <meshStandardMaterial
      color="#0a0b0e"
      metalness={0.92}
      roughness={0.15}
    />
  );

  const keyboardMaterial = (
    <meshStandardMaterial
      color="#121318"
      metalness={0.5}
      roughness={0.65}
    />
  );

  return (
    <group ref={groupRef} position={[0, -0.2, 0]} scale={isMobile ? 0.75 : 0.95}>
      {/* ── BASE CHASSIS (Bottom Half) ─────────────────────────── */}
      <group position={[0, -0.08, 0.4]}>
        {/* Main Base Body */}
        <mesh castShadow receiveShadow position={[0, 0, 0]}>
          <boxGeometry args={[3.8, 0.12, 2.6]} />
          {chassisMaterial}
        </mesh>

        {/* Front Opening Notch */}
        <mesh position={[0, 0.05, 1.29]}>
          <boxGeometry args={[0.6, 0.04, 0.03]} />
          {darkTrimMaterial}
        </mesh>

        {/* Recessed Trackpad */}
        <mesh position={[0, 0.065, 0.65]}>
          <boxGeometry args={[1.2, 0.005, 0.8]} />
          <meshStandardMaterial
            color="#1d2028"
            metalness={0.85}
            roughness={0.3}
          />
        </mesh>

        {/* Keyboard Well */}
        <mesh position={[0, 0.062, -0.3]}>
          <boxGeometry args={[3.3, 0.005, 1.3]} />
          <meshStandardMaterial color="#0b0c10" roughness={0.9} />
        </mesh>

        {/* Keyboard Keycap Representation */}
        <group position={[0, 0.075, -0.3]}>
          {[-0.45, -0.22, 0.01, 0.24, 0.47].map((rowZ, rIdx) => (
            <mesh key={rIdx} position={[0, 0, rowZ]}>
              <boxGeometry args={[3.15, 0.015, 0.18]} />
              {keyboardMaterial}
            </mesh>
          ))}
          {/* Spacebar */}
          <mesh position={[0, 0.018, 0.47]}>
            <boxGeometry args={[1.2, 0.018, 0.17]} />
            <meshStandardMaterial color="#1a1c22" metalness={0.6} roughness={0.5} />
          </mesh>
        </group>
      </group>

      {/* ── HINGE ──────────────────────────────────────────────── */}
      <mesh position={[0, 0, -0.9]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.07, 0.07, 2.8, 24]} />
        {darkTrimMaterial}
      </mesh>

      {/* ── DISPLAY LID (Screen Half, angled ~108 degrees) ────────── */}
      <group
        ref={lidRef}
        position={[0, 0.02, -0.9]}
        rotation={[-Math.PI / 2 + 0.32, 0, 0]}
      >
        {/* Back Outer Shell */}
        <mesh position={[0, 1.25, -0.04]} castShadow>
          <boxGeometry args={[3.8, 2.5, 0.08]} />
          {chassisMaterial}
        </mesh>

        {/* Screen Bezel */}
        <mesh position={[0, 1.25, 0.002]}>
          <boxGeometry args={[3.72, 2.42, 0.01]} />
          <meshBasicMaterial color="#050608" />
        </mesh>

        {/* Webcam indicator dot */}
        <mesh position={[0, 2.4, 0.01]}>
          <circleGeometry args={[0.015, 16]} />
          <meshBasicMaterial color="#111" />
        </mesh>

        {/* Screen Glass Surface */}
        <mesh position={[0, 1.23, 0.008]}>
          <planeGeometry args={[3.45, 2.15]} />
          <meshStandardMaterial
            color="#08080c"
            metalness={0.9}
            roughness={0.1}
          />
        </mesh>

        {/* Embedded Interactive DOM Screen via Drei Html */}
        <group position={[0, 1.23, 0.02]}>
          <Html
            transform
            distanceFactor={1.9}
            position={[0, 0, 0]}
            rotation={[0, 0, 0]}
            style={{
              width: '840px',
              height: '520px',
              pointerEvents: 'auto',
            }}
          >
            <LaptopScreen scrollStage={scrollProgress > 0.4 ? 1 : 0} />
          </Html>
        </group>
      </group>

      {/* Soft Contact Shadow on Desk Floor */}
      <ContactShadows
        position={[0, -0.25, 0.2]}
        opacity={0.65}
        scale={8}
        blur={2}
        far={3}
      />
    </group>
  );
}
