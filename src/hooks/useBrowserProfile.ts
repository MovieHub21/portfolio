import { useState } from 'react';

export type DeviceTier = 'high' | 'mid' | 'low';

export interface BrowserProfile {
  browser: string;
  browserVersion: string;
  os: string;
  language: string;
  timeZone: string;
  screenRes: string;
  dpr: number;
  cores: number | null;
  memoryGB: number | null;
  connection: string | null;
  colorScheme: 'dark' | 'light';
  reducedMotion: boolean;
  touch: boolean;
  online: boolean;
  webgl: boolean;
  gpu: string | null;
  tier: DeviceTier;
}

interface NavigatorUAData {
  platform?: string;
  mobile?: boolean;
}

type NavigatorExtras = Navigator & {
  userAgentData?: NavigatorUAData;
  deviceMemory?: number;
  connection?: { effectiveType?: string; downlink?: number; saveData?: boolean };
};

const major = (v: string) => v.split('.')[0] ?? v;

function detectBrowser(ua: string): { name: string; version: string } {
  const rules: [string, RegExp][] = [
    ['Edge', /Edg(?:e|A|iOS)?\/([\d.]+)/],
    ['Opera', /OPR\/([\d.]+)/],
    ['Samsung Internet', /SamsungBrowser\/([\d.]+)/],
    ['Firefox', /(?:Firefox|FxiOS)\/([\d.]+)/],
    ['Chrome', /(?:Chrome|CriOS)\/([\d.]+)/],
    ['Safari', /Version\/([\d.]+).*Safari/],
  ];
  for (const [name, re] of rules) {
    const m = ua.match(re);
    if (m) return { name, version: major(m[1]) };
  }
  return { name: 'Browser', version: '' };
}

function detectOS(ua: string): string {
  if (/Windows NT/.test(ua)) return 'Windows';
  const android = ua.match(/Android ([\d.]+)/);
  if (android) return `Android ${major(android[1])}`;
  if (/iPhone|iPad|iPod/.test(ua)) return 'iOS';
  if (/Mac OS X/.test(ua)) return 'macOS';
  if (/CrOS/.test(ua)) return 'ChromeOS';
  if (/Linux/.test(ua)) return 'Linux';
  return 'Unknown OS';
}

function cleanGpu(raw: string): string {
  let s = raw.replace(/^ANGLE \(/, '').replace(/\)$/, '');
  const parts = s.split(', ');
  if (parts.length > 1) s = parts[1];
  s = s
    .replace(/Direct3D\d*.*$/i, '')
    .replace(/vs_\d_\d.*$/i, '')
    .replace(/\(0x[0-9a-f]+\)/gi, '')
    .replace(/\s+/g, ' ')
    .trim();
  return s.length > 34 ? `${s.slice(0, 33)}…` : s;
}

function detectGpu(): { webgl: boolean; gpu: string | null } {
  try {
    const canvas = document.createElement('canvas');
    const gl = (canvas.getContext('webgl2') ||
      canvas.getContext('webgl')) as WebGLRenderingContext | null;
    if (!gl) return { webgl: false, gpu: null };
    const ext = gl.getExtension('WEBGL_debug_renderer_info');
    const raw = String(
      ext ? gl.getParameter(ext.UNMASKED_RENDERER_WEBGL) : gl.getParameter(gl.RENDERER)
    );
    gl.getExtension('WEBGL_lose_context')?.loseContext();
    return { webgl: true, gpu: cleanGpu(raw) };
  } catch {
    return { webgl: false, gpu: null };
  }
}

function readProfile(): BrowserProfile {
  const nav = navigator as NavigatorExtras;
  const ua = nav.userAgent;
  const { name, version } = detectBrowser(ua);
  const cores = nav.hardwareConcurrency ?? null;
  const memoryGB = nav.deviceMemory ?? null;
  const conn = nav.connection;
  const touch = navigator.maxTouchPoints > 0;
  const mobile = nav.userAgentData?.mobile ?? /Mobi|Android|iPhone/.test(ua);

  let connection: string | null = null;
  if (conn?.effectiveType) {
    connection = conn.downlink
      ? `${conn.effectiveType} · ${conn.downlink} Mbps`
      : conn.effectiveType;
  }

  // Simple capability score (no tracking, purely local)
  let score = 0;
  score += cores === null ? 1 : cores >= 8 ? 2 : cores >= 4 ? 1 : 0;
  score += memoryGB === null ? 1 : memoryGB >= 8 ? 2 : memoryGB >= 4 ? 1 : 0;
  if (conn?.saveData) score = 0;
  if (mobile) score = Math.min(score, 2);
  const tier: DeviceTier = score >= 3 ? 'high' : score >= 2 ? 'mid' : 'low';

  let timeZone = 'Local';
  try {
    timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'Local';
  } catch {
    /* keep default */
  }

  return {
    browser: name,
    browserVersion: version,
    os: detectOS(ua),
    language: navigator.language || 'en',
    timeZone,
    screenRes: `${screen.width}×${screen.height}`,
    dpr: Math.round((window.devicePixelRatio || 1) * 100) / 100,
    cores,
    memoryGB,
    connection,
    colorScheme: window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark',
    reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    touch,
    online: navigator.onLine,
    ...detectGpu(),
    tier,
  };
}

/** Everything is read locally from the visitor's own browser. Nothing is sent anywhere. */
export function useBrowserProfile(): BrowserProfile {
  const [profile] = useState<BrowserProfile>(readProfile);
  return profile;
}
