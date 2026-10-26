import { useMemo, useEffect, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import {
  SCREEN_W,
  SCREEN_H,
  buildScreenScript,
  renderTerminalScreen,
} from './screenScript';
import type { BrowserProfile } from '../../hooks/useBrowserProfile';

interface LaptopCanvasScreenProps {
  profile: BrowserProfile;
  scrollProgress: number;
}

export default function LaptopCanvasScreen({
  profile,
  scrollProgress,
}: LaptopCanvasScreenProps) {
  const materialRef = useRef<THREE.MeshBasicMaterial>(null);
  const scriptLines = useMemo(() => buildScreenScript(profile), [profile]);

  // Compute total characters in the script
  const totalCharacters = useMemo(() => {
    return scriptLines.reduce(
      (sum, line) => sum + line.reduce((lSum, seg) => lSum + seg.t.length, 0),
      0
    );
  }, [scriptLines]);

  // Create canvas and texture once cleanly
  const [canvas, texture] = useMemo(() => {
    const c = document.createElement('canvas');
    c.width = SCREEN_W;
    c.height = SCREEN_H;

    const tex = new THREE.CanvasTexture(c);
    tex.minFilter = THREE.LinearFilter;
    tex.magFilter = THREE.LinearFilter;
    tex.generateMipmaps = false;
    tex.colorSpace = THREE.SRGBColorSpace;
    return [c, tex] as const;
  }, []);

  useEffect(() => {
    return () => {
      texture.dispose();
    };
  }, [texture]);

  // Draw on each frame based on time + scroll progress
  useFrame((state) => {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const time = state.clock.getElapsedTime();

    // Characters revealed is a blend of time-based typing and scroll progress
    const timeTypingChars = Math.floor(time * 65);
    const scrollChars = Math.floor(scrollProgress * totalCharacters);
    const charBudget = Math.min(
      totalCharacters,
      Math.max(timeTypingChars, scrollChars + 120)
    );

    const showCursor = Math.floor(time * 2.5) % 2 === 0;

    renderTerminalScreen(ctx, scriptLines, charBudget, showCursor);

    if (materialRef.current?.map) {
      materialRef.current.map.needsUpdate = true;
    }
  });

  return (
    <mesh position={[0, 1.23, 0.015]}>
      <planeGeometry args={[3.45, 2.15]} />
      <meshBasicMaterial ref={materialRef} map={texture} toneMapped={false} />
    </mesh>
  );
}
