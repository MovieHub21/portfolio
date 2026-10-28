import { useEffect, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { ContactShadows, Environment, Lightformer } from '@react-three/drei';
import type { MotionValue } from 'framer-motion';
import * as THREE from 'three';
import type { BrowserProfile } from '../../hooks/useBrowserProfile';
import HeroLaptop from './HeroLaptop';
import { GridFloor, Particles, TokenOrbit } from './HeroEffects';
import { buildScript } from './screenScript';
import { LAPTOP_SCALE, lerp, ss, type NumRef, type PointerRef } from './shared';

interface Props {
  progress: MotionValue<number>;
  profile: BrowserProfile;
  greeting: string;
  compact: boolean;
  active: boolean;
}

/** Eases the raw scroll value so the 3D scene glides instead of jumping. */
function ProgressDriver({ source, outRef }: { source: MotionValue<number>; outRef: NumRef }) {
  useFrame((_, delta) => {
    outRef.current = THREE.MathUtils.damp(outRef.current, source.get(), 5, delta);
  }, -1);
  return null;
}

const V = {
  pos: new THREE.Vector3(),
  look: new THREE.Vector3(),
  s: new THREE.Vector3(),
  endPos: new THREE.Vector3(),
  n: new THREE.Vector3(),
  q: new THREE.Quaternion(),
};

function CameraRig({
  smooth,
  pointer,
  screenRef,
  compact,
}: {
  smooth: NumRef;
  pointer: PointerRef;
  screenRef: { current: THREE.Object3D | null };
  compact: boolean;
}) {
  const { camera, size } = useThree();

  useFrame(() => {
    const cam = camera as THREE.PerspectiveCamera;
    const p = smooth.current;

    // live world position of the screen → the camera ends exactly in front of it
    const scr = screenRef.current;
    if (scr) {
      scr.updateWorldMatrix(true, false);
      scr.getWorldPosition(V.s);
      scr.getWorldQuaternion(V.q);
    }
    V.n.set(0, 0, 1).applyQuaternion(V.q); // the glass's outward normal
    const tanH = Math.tan(THREE.MathUtils.degToRad(cam.fov / 2));
    const aspect = size.width / size.height;
    const dH = (2.15 * LAPTOP_SCALE) / (0.74 * 2 * tanH);
    const dW = (3.45 * LAPTOP_SCALE) / (0.9 * 2 * tanH * aspect);
    const dEnd = Math.max(dH, dW);
    V.endPos.copy(V.s).addScaledVector(V.n, dEnd);

    // key 0 (closed laptop, high 3/4 view) → key 1 (opened) → end (screen fills view)
    const k0p = compact ? [0.9, 2.8, 11.5] : [3.4, 2.2, 7.6];
    const k0l = compact ? [0, 0.9, 0] : [0.9, 0.1, 0];
    const k1p = compact ? [0.9, 2.0, 10.8] : [1.4, 1.5, 6.3];
    const k1l = compact ? [0, 0.9, -0.3] : [0.4, 0.6, -0.3];

    const a = ss(0, 0.3, p);
    const b = ss(0.3, 0.9, p);
    V.pos.set(lerp(k0p[0], k1p[0], a), lerp(k0p[1], k1p[1], a), lerp(k0p[2], k1p[2], a));
    V.look.set(lerp(k0l[0], k1l[0], a), lerp(k0l[1], k1l[1], a), lerp(k0l[2], k1l[2], a));
    V.pos.lerp(V.endPos, b);
    V.look.lerp(V.s, b);
    V.pos.x += Math.sin(b * Math.PI) * 0.6 + pointer.current.x * 0.18 * (1 - b);
    V.pos.y += pointer.current.y * 0.1 * (1 - b);

    cam.position.copy(V.pos);
    cam.lookAt(V.look);
  });
  return null;
}

export default function HeroStage({ progress, profile, greeting, compact, active }: Props) {
  const smooth = useRef(0);
  const pointer = useRef({ x: 0, y: 0 });
  const screenRef = useRef<THREE.Object3D | null>(null);

  const [script] = useState(() => buildScript({ greeting, compact }));
  const browser = `${profile.browser} ${profile.browserVersion}`.trim();
  const [labels] = useState(() =>
    [
      '</>',
      browser,
      '{ async }',
      profile.os,
      `${profile.cores ?? '4+'} ${profile.cores === 1 ? 'thread' : 'threads'}`,
      'git push',
      profile.timeZone.split('/').pop() ?? profile.timeZone,
      'npm run dev',
      profile.language,
      'useState()',
    ].map((l) => l.replace(/_/g, ' '))
  );

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = -((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => window.removeEventListener('pointermove', onMove);
  }, []);

  const particleCount = Math.round(
    (profile.tier === 'high' ? 2400 : profile.tier === 'mid' ? 1400 : 650) * (compact ? 0.6 : 1)
  );
  const title = 'about-me.md';

  return (
    <Canvas
      frameloop={active ? 'always' : 'never'}
      dpr={profile.tier === 'low' ? [1, 1.25] : [1, 1.75]}
      camera={{ position: [3.4, 2.2, 7.6], fov: 40, near: 0.1, far: 80 }}
      gl={{ antialias: profile.tier !== 'low', powerPreference: 'high-performance' }}
    >
      <fog attach="fog" args={['#0a0a0c', 10, 30]} />
      <ProgressDriver source={progress} outRef={smooth} />

      <ambientLight intensity={0.35} />
      <directionalLight position={[4, 6, 5]} intensity={1.6} color="#fff4e3" />
      <pointLight position={[-5, 2, 3]} intensity={18} color="#c9a96e" distance={14} />
      <pointLight position={[5, 1, -3]} intensity={12} color="#7aa2f7" distance={14} />

      {/* local studio lighting: no HDR download, works offline */}
      <Environment resolution={256} environmentIntensity={0.9}>
        <Lightformer form="rect" intensity={3.5} color="#f8f4ed" position={[0, 5, 2]} rotation={[Math.PI / 2, 0, 0]} scale={[10, 4, 1]} />
        <Lightformer form="rect" intensity={2} color="#c9a96e" position={[-5, 1, 2]} rotation={[0, Math.PI / 2, 0]} scale={[6, 3, 1]} />
        <Lightformer form="rect" intensity={1.6} color="#8aa8e0" position={[5, 1, 1]} rotation={[0, -Math.PI / 2, 0]} scale={[6, 3, 1]} />
      </Environment>

      <HeroLaptop smooth={smooth} pointer={pointer} screenRef={screenRef} script={script} title={title} compact={compact} />
      <CameraRig smooth={smooth} pointer={pointer} screenRef={screenRef} compact={compact} />

      <GridFloor smooth={smooth} />
      <Particles count={particleCount} smooth={smooth} />
      <TokenOrbit labels={labels} smooth={smooth} />
      <ContactShadows position={[0, -0.66, 0]} opacity={0.55} scale={9} blur={2.6} far={2} resolution={256} />
    </Canvas>
  );
}
