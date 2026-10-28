import * as THREE from 'three';

export type NumRef = { current: number };
export type PointerRef = { current: { x: number; y: number } };

export const LAPTOP_SCALE = 0.9;
export const LID_OPEN = -0.28; // radians from vertical (leans back ~16°)
export const LID_CLOSED = Math.PI / 2 - 0.02;

export const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
export const ss = (a: number, b: number, v: number) => {
  const t = clamp01((v - a) / (b - a));
  return t * t * (3 - 2 * t);
};
export const lerp = THREE.MathUtils.lerp;
export const easeOutBack = (x: number) => {
  const c1 = 1.1;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2);
};

/** Small deterministic PRNG so scene generation is pure and repeatable. */
export function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
