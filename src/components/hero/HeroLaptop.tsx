import { useEffect, useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import {
  SCREEN_H,
  SCREEN_W,
  drawScreen,
  totalChars,
  type Line,
} from './screenScript';
import {
  LAPTOP_SCALE,
  LID_CLOSED,
  LID_OPEN,
  easeOutBack,
  lerp,
  ss,
  type NumRef,
  type PointerRef,
} from './shared';

export const BASE_Y = -0.5;

interface Props {
  smooth: NumRef;
  pointer: PointerRef;
  screenRef: { current: THREE.Object3D | null };
  script: Line[];
  title: string;
  compact: boolean;
}

function createScreen() {
  const canvas = document.createElement('canvas');
  canvas.width = SCREEN_W;
  canvas.height = SCREEN_H;
  const ctx = canvas.getContext('2d')!;
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 8;
  return {
    texture,
    redraw(lines: Line[], opts: Parameters<typeof drawScreen>[2]) {
      drawScreen(ctx, lines, opts);
      texture.needsUpdate = true;
    },
  };
}

function createLogo() {
  const c = document.createElement('canvas');
  c.width = c.height = 256;
  const x = c.getContext('2d')!;
  x.clearRect(0, 0, 256, 256);
  x.shadowColor = '#c9a96e';
  x.shadowBlur = 26;
  x.fillStyle = '#e3c88f';
  x.font = '700 150px ui-sans-serif, system-ui, sans-serif';
  x.textAlign = 'center';
  x.textBaseline = 'middle';
  x.fillText('M', 128, 122);
  x.fillStyle = '#c9a96e';
  x.beginPath();
  x.arc(196, 176, 11, 0, Math.PI * 2);
  x.fill();
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

export default function HeroLaptop({ smooth, pointer, screenRef, script, title, compact }: Props) {
  const rootRef = useRef<THREE.Group>(null);
  const lidRef = useRef<THREE.Group>(null);
  const glowRef = useRef<THREE.PointLight>(null);
  const [screen] = useState(createScreen);
  const [logo] = useState(createLogo);
  const [total] = useState(() => totalChars(script));
  const last = useRef({ budget: -1, blink: -1 });

  useEffect(
    () => () => {
      screen.texture.dispose();
      logo.dispose();
    },
    [screen, logo]
  );

  useFrame((state) => {
    const p = smooth.current;
    const t = state.clock.elapsedTime;
    const root = rootRef.current;
    const lid = lidRef.current;
    if (!root || !lid) return;

    // ── lid opens between 5% and 30% scroll ──
    const open = ss(0.05, 0.3, p);
    lid.rotation.x = lerp(LID_CLOSED, LID_OPEN, easeOutBack(open));
    lid.position.y = 0.02 + 0.05 * (1 - open);

    // ── whole laptop: swings from the right toward the centre, floats, parallaxes ──
    const settle = ss(0.1, 0.55, p);
    const bob = Math.sin(t * 0.8) * 0.035 * (1 - ss(0.5, 0.75, p));
    root.position.x = compact ? 0 : lerp(1.45, 0, settle);
    root.position.y = BASE_Y + bob + (compact ? -0.55 * (1 - settle) : 0);
    root.rotation.y = lerp(compact ? -0.3 : -0.6, 0, settle) + pointer.current.x * 0.1 * (1 - ss(0.6, 1, p));
    root.rotation.x = pointer.current.y * 0.04;

    if (glowRef.current) glowRef.current.intensity = open * open * 2.2;

    // ── scroll-scrubbed terminal: characters typed = function of progress ──
    const reveal = Math.min(1, Math.max(0, (p - 0.3) / 0.56));
    const budget = Math.floor(reveal * total);
    const blink = Math.floor(t * 2) % 2;
    if (budget !== last.current.budget || blink !== last.current.blink) {
      last.current = { budget, blink };
      screen.redraw(script, { title, budget, compact, cursorOn: blink === 0 });
    }
  });

  return (
    <group ref={rootRef} scale={LAPTOP_SCALE}>
      {/* ── BASE ── */}
      <group position={[0, -0.08, 0.4]}>
        <mesh>
          <boxGeometry args={[3.8, 0.12, 2.6]} />
          <meshStandardMaterial color="#3b3f4a" metalness={0.45} roughness={0.38} />
        </mesh>
        <mesh position={[0, 0.05, 1.29]}>
          <boxGeometry args={[0.6, 0.04, 0.03]} />
          <meshStandardMaterial color="#14161b" metalness={0.6} roughness={0.3} />
        </mesh>
        <mesh position={[0, 0.065, 0.65]}>
          <boxGeometry args={[1.2, 0.005, 0.8]} />
          <meshStandardMaterial color="#2d313c" metalness={0.5} roughness={0.35} />
        </mesh>
        <mesh position={[0, 0.062, -0.3]}>
          <boxGeometry args={[3.3, 0.005, 1.3]} />
          <meshStandardMaterial color="#0b0c10" roughness={0.9} />
        </mesh>
        <group position={[0, 0.075, -0.3]}>
          {[-0.45, -0.22, 0.01, 0.24, 0.47].map((z) => (
            <mesh key={z} position={[0, 0, z]}>
              <boxGeometry args={[3.15, 0.015, 0.18]} />
              <meshStandardMaterial color="#1b1d24" metalness={0.35} roughness={0.65} />
            </mesh>
          ))}
          <mesh position={[0, 0.018, 0.47]}>
            <boxGeometry args={[1.2, 0.018, 0.17]} />
            <meshStandardMaterial color="#292c36" metalness={0.4} roughness={0.5} />
          </mesh>
        </group>
      </group>

      {/* ── HINGE ── */}
      <mesh position={[0, 0, -0.9]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.07, 0.07, 2.8, 24]} />
        <meshStandardMaterial color="#14161b" metalness={0.6} roughness={0.3} />
      </mesh>

      {/* ── LID: rotation.x is animated by scroll ── */}
      <group ref={lidRef} position={[0, 0.02, -0.9]} rotation={[LID_CLOSED, 0, 0]}>
        <mesh position={[0, 1.25, -0.04]}>
          <boxGeometry args={[3.8, 2.5, 0.08]} />
          <meshStandardMaterial color="#3b3f4a" metalness={0.45} roughness={0.38} />
        </mesh>
        {/* glowing "M" logo on the lid's back */}
        <mesh position={[0, 1.25, -0.0815]} rotation={[Math.PI, 0, 0]}>
          <planeGeometry args={[0.9, 0.9]} />
          <meshBasicMaterial map={logo} transparent toneMapped={false} />
        </mesh>
        <mesh position={[0, 1.25, 0.002]}>
          <boxGeometry args={[3.72, 2.42, 0.01]} />
          <meshBasicMaterial color="#050608" />
        </mesh>
        {/* the screen: a canvas texture drawn from scroll progress */}
        <mesh ref={screenRef} position={[0, 1.23, 0.012]}>
          <planeGeometry args={[3.45, 2.15]} />
          <meshBasicMaterial map={screen.texture} toneMapped={false} />
        </mesh>
        <pointLight ref={glowRef} position={[0, 1.2, 1.6]} color="#8aa8e0" distance={6} intensity={0} />
      </group>
    </group>
  );
}
