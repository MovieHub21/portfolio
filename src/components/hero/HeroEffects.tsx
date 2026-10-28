import { useEffect, useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { lerp, mulberry32, ss, type NumRef } from './shared';

/* ─────────────────────────── Particles ─────────────────────────── */

function buildParticles(count: number) {
  const rand = mulberry32(1337);
  const pos = new Float32Array(count * 3);
  const col = new Float32Array(count * 3);
  const gold = new THREE.Color('#d9b878');
  const blue = new THREE.Color('#7aa2f7');
  const white = new THREE.Color('#f2eee8');
  const c = new THREE.Color();
  for (let i = 0; i < count; i++) {
    const a = rand() * Math.PI * 2;
    const r = 2.8 + Math.pow(rand(), 1.4) * 6.5;
    pos[i * 3] = Math.cos(a) * r;
    pos[i * 3 + 1] = (rand() - 0.5) * 6;
    pos[i * 3 + 2] = Math.sin(a) * r - 0.6;
    const k = rand();
    c.copy(k < 0.55 ? gold : k < 0.85 ? blue : white);
    col[i * 3] = c.r;
    col[i * 3 + 1] = c.g;
    col[i * 3 + 2] = c.b;
  }
  return { pos, col };
}

function createDot() {
  const c = document.createElement('canvas');
  c.width = c.height = 64;
  const x = c.getContext('2d')!;
  const g = x.createRadialGradient(32, 32, 0, 32, 32, 32);
  g.addColorStop(0, 'rgba(255,255,255,1)');
  g.addColorStop(0.35, 'rgba(255,255,255,0.65)');
  g.addColorStop(1, 'rgba(255,255,255,0)');
  x.fillStyle = g;
  x.fillRect(0, 0, 64, 64);
  return new THREE.CanvasTexture(c);
}

export function Particles({ count, smooth }: { count: number; smooth: NumRef }) {
  const ref = useRef<THREE.Points>(null);
  const [data] = useState(() => buildParticles(count));
  const [dot] = useState(createDot);
  useEffect(() => () => dot.dispose(), [dot]);

  useFrame((s) => {
    const pts = ref.current;
    if (!pts) return;
    const p = smooth.current;
    pts.rotation.y = s.clock.elapsedTime * 0.035 + p * 1.8;
    pts.rotation.x = Math.sin(s.clock.elapsedTime * 0.2) * 0.03;
    pts.scale.setScalar(lerp(0.75, 1.45, p));
    (pts.material as THREE.PointsMaterial).opacity =
      0.9 * ss(0.0, 0.18, p) * (1 - 0.55 * ss(0.7, 1, p));
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[data.pos, 3]} />
        <bufferAttribute attach="attributes-color" args={[data.col, 3]} />
      </bufferGeometry>
      <pointsMaterial
        map={dot}
        size={0.055}
        vertexColors
        transparent
        opacity={0}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        sizeAttenuation
      />
    </points>
  );
}

/* ───────────────────── Orbiting browser-info tokens ───────────────────── */

const TOKEN_COLORS = ['#dfc28d', '#7aa2f7', '#7ee0a8', '#bb9af7', '#7dcfff'];

function makeToken(label: string, color: string) {
  const c = document.createElement('canvas');
  c.width = 420;
  c.height = 120;
  const x = c.getContext('2d')!;
  x.fillStyle = 'rgba(16,17,26,0.88)';
  x.strokeStyle = color;
  x.lineWidth = 3;
  x.beginPath();
  x.roundRect(6, 6, 408, 108, 54);
  x.fill();
  x.stroke();
  let size = 44;
  const family = 'ui-monospace, "JetBrains Mono", Menlo, Consolas, "DejaVu Sans Mono", monospace';
  x.font = `${size}px ${family}`;
  while (x.measureText(label).width > 360 && size > 22) {
    size -= 2;
    x.font = `${size}px ${family}`;
  }
  x.fillStyle = color;
  x.textAlign = 'center';
  x.textBaseline = 'middle';
  x.fillText(label, 210, 62);
  const texture = new THREE.CanvasTexture(c);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

export function TokenOrbit({ labels, smooth }: { labels: string[]; smooth: NumRef }) {
  const group = useRef<THREE.Group>(null);
  const [textures] = useState(() =>
    labels.map((l, i) => makeToken(l, TOKEN_COLORS[i % TOKEN_COLORS.length]))
  );

  useEffect(() => () => textures.forEach((t) => t.dispose()), [textures]);

  useFrame((s) => {
    const g = group.current;
    if (!g) return;
    const p = smooth.current;
    const t = s.clock.elapsedTime;
    // tokens drift along a wide arc BEHIND the laptop (never past the camera)
    const vis = ss(0.24, 0.36, p) * (1 - ss(0.46, 0.64, p));
    const n = g.children.length;
    g.children.forEach((child, i) => {
      const f = (i / n + t * 0.015 + p * 0.3) % 1;
      const ang = Math.PI * (0.06 + 0.88 * f);
      const r = 4.2 + (i % 3) * 0.6;
      child.position.set(
        Math.cos(ang) * r * 1.35,
        0.5 + Math.sin(f * Math.PI * 2 + i) * 0.6 + (i % 4) * 0.25,
        -Math.sin(ang) * r * 0.55 - 1.4
      );
      const edge = Math.min(ss(0, 0.1, f), 1 - ss(0.9, 1, f));
      const k = 0.4;
      child.scale.set(k * 3.5, k, 1);
      (child as THREE.Sprite).material.opacity = vis * edge;
    });
  });

  return (
    <group ref={group}>
      {textures.map((tex, i) => (
        <sprite key={labels[i] + i}>
          <spriteMaterial map={tex} transparent opacity={0} depthWrite={false} toneMapped={false} />
        </sprite>
      ))}
    </group>
  );
}

/* ───────────────────────────── Grid floor ───────────────────────────── */

export function GridFloor({ smooth }: { smooth: NumRef }) {
  const ref = useRef<THREE.GridHelper>(null);

  useEffect(() => {
    const m = ref.current?.material;
    if (m) {
      const mats = Array.isArray(m) ? m : [m];
      mats.forEach((mat) => {
        mat.transparent = true;
        mat.opacity = 0.32;
      });
    }
  }, []);

  useFrame(() => {
    if (ref.current) ref.current.position.z = (smooth.current * 16) % 1;
  });

  return <gridHelper ref={ref} args={[70, 70, '#c9a96e', '#262833']} position={[0, -0.67, 0]} />;
}
