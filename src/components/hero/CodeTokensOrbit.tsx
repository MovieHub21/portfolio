import { useMemo, useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface TokenConfig {
  label: string;
  color: string;
  radius: number;
  speed: number;
  phase: number;
  yOffset: number;
}

const TOKENS: TokenConfig[] = [
  { label: 'React', color: '#61dafb', radius: 3.4, speed: 0.35, phase: 0, yOffset: 0.8 },
  { label: 'TypeScript', color: '#3178c6', radius: 3.1, speed: 0.28, phase: 1.25, yOffset: 0.2 },
  { label: 'Laravel', color: '#ff2d20', radius: 3.6, speed: 0.32, phase: 2.5, yOffset: -0.4 },
  { label: 'Tailwind', color: '#38bdf8', radius: 3.2, speed: 0.4, phase: 3.8, yOffset: 1.1 },
  { label: 'MySQL', color: '#f59e0b', radius: 3.5, speed: 0.25, phase: 5.0, yOffset: -0.1 },
];

function createTokenTexture(label: string, color: string): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 96;
  const ctx = canvas.getContext('2d')!;

  // Background rounded pill
  ctx.fillStyle = 'rgba(15, 17, 26, 0.85)';
  ctx.strokeStyle = color;
  ctx.lineWidth = 3;

  ctx.beginPath();
  ctx.roundRect(8, 8, 240, 80, 40);
  ctx.fill();
  ctx.stroke();

  // Glow dot
  ctx.beginPath();
  ctx.arc(42, 48, 8, 0, Math.PI * 2);
  ctx.fillStyle = color;
  ctx.fill();

  // Text label
  ctx.font = 'bold 30px "Space Grotesk", sans-serif';
  ctx.fillStyle = '#f8fafc';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.fillText(label, 64, 48);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

export default function CodeTokensOrbit({ scrollProgress }: { scrollProgress: number }) {
  const groupRef = useRef<THREE.Group>(null);

  // Generate textures once
  const textures = useMemo(() => {
    return TOKENS.map((tok) => createTokenTexture(tok.label, tok.color));
  }, []);

  useEffect(() => {
    return () => {
      textures.forEach((t) => t.dispose());
    };
  }, [textures]);

  const spritesRef = useRef<THREE.Sprite[]>([]);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();

    // Fade out sprites smoothly as user scrolls deep into the next section
    const orbitOpacity = Math.max(0, 1 - scrollProgress * 2.2);

    spritesRef.current.forEach((sprite, idx) => {
      if (!sprite) return;
      const tok = TOKENS[idx];
      const angle = t * tok.speed + tok.phase;

      // Elliptical orbit in X-Z plane around the laptop
      sprite.position.x = Math.cos(angle) * tok.radius;
      sprite.position.z = Math.sin(angle) * (tok.radius * 0.7);
      sprite.position.y = tok.yOffset + Math.sin(t * 1.5 + tok.phase) * 0.15;

      const mat = sprite.material as THREE.SpriteMaterial;
      if (mat) {
        mat.opacity = orbitOpacity * 0.85;
      }
    });
  });

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {TOKENS.map((_, i) => (
        <sprite
          key={i}
          ref={(el) => {
            if (el) spritesRef.current[i] = el;
          }}
          scale={[1.1, 0.42, 1]}
        >
          <spriteMaterial
            map={textures[i]}
            transparent
            opacity={0.85}
            depthWrite={false}
          />
        </sprite>
      ))}
    </group>
  );
}
