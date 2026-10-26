import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import LaptopCanvasScreen from './LaptopCanvasScreen';
import type { BrowserProfile } from '../../hooks/useBrowserProfile';

interface LaptopModelProps {
  profile: BrowserProfile;
  pointerPosition: { x: number; y: number };
  scrollProgress: number;
}

export default function LaptopModel({
  profile,
  pointerPosition,
  scrollProgress,
}: LaptopModelProps) {
  const rootGroupRef = useRef<THREE.Group>(null);
  const lidGroupRef = useRef<THREE.Group>(null);

  // Animated hinge and orientation choreography
  useFrame((state) => {
    const t = state.clock.getElapsedTime();

    if (rootGroupRef.current) {
      // Gentle floating levitation
      const levitate = Math.sin(t * 0.9) * 0.04;
      rootGroupRef.current.position.y = -0.25 + levitate + scrollProgress * 0.35;

      // Base rotation: 3/4 angle with mouse tilt parallax
      // Flattering start angle: rotY ~ -0.4, as scroll increases faces user more squarely
      const targetRotY =
        -0.38 +
        pointerPosition.x * 0.2 +
        scrollProgress * 0.35;
      const targetRotX =
        0.14 +
        pointerPosition.y * 0.12 -
        scrollProgress * 0.08;

      rootGroupRef.current.rotation.y = THREE.MathUtils.lerp(
        rootGroupRef.current.rotation.y,
        targetRotY,
        0.06
      );
      rootGroupRef.current.rotation.x = THREE.MathUtils.lerp(
        rootGroupRef.current.rotation.x,
        targetRotX,
        0.06
      );

      // Camera dolly zoom effect via group Z translation
      const targetZ = scrollProgress * 1.35;
      rootGroupRef.current.position.z = THREE.MathUtils.lerp(
        rootGroupRef.current.position.z,
        targetZ,
        0.06
      );
    }

    // Hinge lid animation: starts open at ~108deg and adjusts subtly with scroll
    if (lidGroupRef.current) {
      const openAngle = -Math.PI / 2 + 0.32 - scrollProgress * 0.05;
      lidGroupRef.current.rotation.x = THREE.MathUtils.lerp(
        lidGroupRef.current.rotation.x,
        openAngle,
        0.08
      );
    }
  });

  // Dark anodized aluminum chassis
  const chassisMaterial = (
    <meshStandardMaterial
      color="#181a22"
      metalness={0.9}
      roughness={0.22}
      envMapIntensity={1.4}
    />
  );

  const bezelMaterial = (
    <meshBasicMaterial color="#06070a" />
  );

  const keyboardMaterial = (
    <meshStandardMaterial
      color="#121319"
      metalness={0.4}
      roughness={0.7}
    />
  );

  return (
    <group ref={rootGroupRef} position={[0, -0.25, 0]}>
      {/* ── LAPTOP BASE (Bottom Chassis) ─────────────────────────── */}
      <group position={[0, -0.06, 0.4]}>
        {/* Main Base Body */}
        <mesh castShadow receiveShadow position={[0, 0, 0]}>
          <boxGeometry args={[3.85, 0.12, 2.65]} />
          {chassisMaterial}
        </mesh>

        {/* Front Opening Notch */}
        <mesh position={[0, 0.05, 1.32]}>
          <boxGeometry args={[0.65, 0.035, 0.02]} />
          <meshBasicMaterial color="#0a0a0f" />
        </mesh>

        {/* Recessed Trackpad with subtle rim */}
        <mesh position={[0, 0.063, 0.68]}>
          <boxGeometry args={[1.25, 0.005, 0.85]} />
          <meshStandardMaterial
            color="#21242d"
            metalness={0.88}
            roughness={0.28}
          />
        </mesh>

        {/* Keyboard Well */}
        <mesh position={[0, 0.062, -0.32]}>
          <boxGeometry args={[3.35, 0.005, 1.35]} />
          <meshStandardMaterial color="#090a0e" roughness={0.95} />
        </mesh>

        {/* Keycaps Grid Rows */}
        <group position={[0, 0.075, -0.32]}>
          {[-0.48, -0.24, 0.0, 0.24, 0.48].map((rowZ, idx) => (
            <mesh key={idx} position={[0, 0, rowZ]}>
              <boxGeometry args={[3.2, 0.016, 0.18]} />
              {keyboardMaterial}
            </mesh>
          ))}
          {/* Spacebar */}
          <mesh position={[0, 0.019, 0.48]}>
            <boxGeometry args={[1.3, 0.02, 0.17]} />
            <meshStandardMaterial color="#1a1c24" metalness={0.6} roughness={0.4} />
          </mesh>
        </group>

        {/* Side Ports (USB-C & MagSafe simulation) */}
        <mesh position={[-1.93, 0, 0.3]}>
          <boxGeometry args={[0.02, 0.04, 0.15]} />
          <meshBasicMaterial color="#050508" />
        </mesh>
        <mesh position={[-1.93, 0, 0.6]}>
          <boxGeometry args={[0.02, 0.04, 0.15]} />
          <meshBasicMaterial color="#050508" />
        </mesh>
        <mesh position={[1.93, 0, 0.3]}>
          <boxGeometry args={[0.02, 0.04, 0.15]} />
          <meshBasicMaterial color="#050508" />
        </mesh>
      </group>

      {/* ── HINGE CYLINDER BAR ───────────────────────────────────── */}
      <mesh position={[0, 0, -0.92]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.068, 0.068, 2.9, 28]} />
        <meshStandardMaterial color="#11131a" metalness={0.95} roughness={0.2} />
      </mesh>

      {/* ── DISPLAY LID (Pivots at Hinge: y=0.02, z=-0.92) ─────────── */}
      <group
        ref={lidGroupRef}
        position={[0, 0.02, -0.92]}
        rotation={[-Math.PI / 2 + 0.32, 0, 0]}
      >
        {/* Back Outer Shell */}
        <mesh position={[0, 1.25, -0.04]} castShadow>
          <boxGeometry args={[3.85, 2.55, 0.08]} />
          {chassisMaterial}
        </mesh>

        {/* Glowing Back Lid Logo (Subtle developer emblem on outer shell) */}
        <mesh position={[0, 1.25, -0.082]} rotation={[0, Math.PI, 0]}>
          <circleGeometry args={[0.16, 32]} />
          <meshBasicMaterial color="#c9a96e" />
        </mesh>
        <pointLight
          position={[0, 1.25, -0.2]}
          color="#c9a96e"
          intensity={0.4}
          distance={1.5}
        />

        {/* Front Bezel */}
        <mesh position={[0, 1.25, 0.002]}>
          <boxGeometry args={[3.78, 2.48, 0.008]} />
          {bezelMaterial}
        </mesh>

        {/* Webcam indicator */}
        <mesh position={[0, 2.44, 0.01]}>
          <circleGeometry args={[0.016, 16]} />
          <meshBasicMaterial color="#0a0a0f" />
        </mesh>

        {/* Dynamic Animated Canvas Screen */}
        <LaptopCanvasScreen
          profile={profile}
          scrollProgress={scrollProgress}
        />
      </group>
    </group>
  );
}
