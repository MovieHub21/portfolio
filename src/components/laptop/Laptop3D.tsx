import { useEffect, useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';
import LaptopScreen from './LaptopScreen';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import { useReducedMotion } from '../../hooks/useReducedMotion';

// Resting height of the whole laptop in the scene (lower = sits lower in the card)
const REST_Y = -0.6;

// How far the screen leans back from vertical (radians). ~0.28 ≈ 16°.
const LID_TILT_BACK = -0.28;

interface Laptop3DProps {
  pointerPosition: { x: number; y: number };
  scrollProgress: number;
}

export default function Laptop3D({ pointerPosition, scrollProgress }: Laptop3DProps) {
  const groupRef = useRef<THREE.Group>(null);
  const lidRef = useRef<THREE.Group>(null);
  const isMobile = useMediaQuery('(max-width: 768px)');
  const prefersReduced = useReducedMotion();

  // drei's <Html transform> can lose its content on the very first mount
  // (its effect re-roots the same element while React is still committing).
  // Mounting it one tick later gives it a clean element and a clean root.
  const [screenReady, setScreenReady] = useState(false);
  useEffect(() => {
    const id = requestAnimationFrame(() => setScreenReady(true));
    return () => cancelAnimationFrame(id);
  }, []);

  // Subtle frame loop
  useFrame((state) => {
    const t = state.clock.getElapsedTime();

    if (groupRef.current) {
      if (!prefersReduced) {
        // Floating motion + subtle mouse parallax
        groupRef.current.position.y =
          Math.sin(t * 0.8) * 0.05 + REST_Y + scrollProgress * 0.4;

        // Base rotation: gentle 3/4 angle (approx -0.18 rad) so the screen stays legible
        const targetRotY =
          -0.18 + pointerPosition.x * 0.2 + scrollProgress * 0.4;
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
      color="#3b3f4a"
      metalness={0.45}
      roughness={0.38}
      envMapIntensity={1.2}
    />
  );

  const darkTrimMaterial = (
    <meshStandardMaterial
      color="#14161b"
      metalness={0.6}
      roughness={0.3}
    />
  );

  const keyboardMaterial = (
    <meshStandardMaterial
      color="#1b1d24"
      metalness={0.35}
      roughness={0.65}
    />
  );

  return (
    <group ref={groupRef} position={[0, REST_Y, 0]} scale={isMobile ? 0.72 : 0.88}>
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
            color="#2d313c"
            metalness={0.5}
            roughness={0.35}
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
            <meshStandardMaterial color="#292c36" metalness={0.4} roughness={0.5} />
          </mesh>
        </group>
      </group>

      {/* ── HINGE ──────────────────────────────────────────────── */}
      <mesh position={[0, 0, -0.9]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.07, 0.07, 2.8, 24]} />
        {darkTrimMaterial}
      </mesh>

      {/* ── DISPLAY LID (Screen Half, opened ~106°) ───────────────────
          rotation.x is measured from VERTICAL: 0 = screen standing straight up,
          more negative = leaning further back. The old value (-π/2 + 0.32)
          laid the lid almost flat, so the glass faced the ceiling. */}
      <group
        ref={lidRef}
        position={[0, 0.02, -0.9]}
        rotation={[LID_TILT_BACK, 0, 0]}
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
          {screenReady && (
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
          )}
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
