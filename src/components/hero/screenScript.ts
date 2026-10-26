import type { BrowserProfile } from '../../hooks/useBrowserProfile';
import { personalInfo } from '../../data/portfolio';

export interface Seg {
  t: string;
  c: string;
}
export type Line = Seg[];

export const SCREEN_W = 1280;
export const SCREEN_H = 800;

export function buildScreenScript(profile: BrowserProfile): Line[] {
  const accent = '#c9a96e';
  const green = '#4ade80';
  const cyan = '#38bdf8';
  const purple = '#c084fc';
  const muted = '#64748b';
  const white = '#f8fafc';
  const yellow = '#facc15';

  return [
    // Top banner
    [
      { t: 'MARVELLOUS OS v2.4 ', c: accent },
      { t: '· ', c: muted },
      { t: 'Interactive Developer Workstation', c: white },
      { t: ' [SESSION LOCAL]', c: green },
    ],
    [{ t: '─'.repeat(64), c: muted }],

    // Neofetch-style ASCII + specs
    [
      { t: '      /\\_/\\   ', c: accent },
      { t: '  developer: ', c: muted },
      { t: personalInfo.name, c: white },
      { t: ' @ ', c: muted },
      { t: 'portfolio', c: green },
    ],
    [
      { t: '     ( o.o )  ', c: accent },
      { t: '  role:      ', c: muted },
      { t: personalInfo.title, c: white },
    ],
    [
      { t: '      > ^ <   ', c: accent },
      { t: '  stack:     ', c: muted },
      { t: 'React · TypeScript · Laravel · MySQL · Tailwind', c: cyan },
    ],
    [
      { t: '   ─────────  ', c: muted },
      { t: '  focus:     ', c: muted },
      { t: 'Clean UX, performant backends, reliable products', c: white },
    ],
    [],

    // Visitor Detected Environment (Privacy-Friendly)
    [
      { t: '[SYSTEM TELEMETRY — EVALUATED LOCALLY IN BROWSER]', c: yellow },
    ],
    [
      { t: '  OS:        ', c: muted },
      { t: profile.os, c: white },
      { t: '  ·  Browser: ', c: muted },
      { t: `${profile.browser} ${profile.browserVersion}`, c: cyan },
    ],
    [
      { t: '  Display:   ', c: muted },
      { t: `${profile.screenRes} (dpr ${profile.dpr})`, c: white },
      { t: '  ·  Hardware Tier: ', c: muted },
      {
        t: profile.tier.toUpperCase(),
        c: profile.tier === 'high' ? green : profile.tier === 'mid' ? yellow : accent,
      },
    ],
    [
      { t: '  GPU:       ', c: muted },
      { t: profile.gpu || 'Hardware Accelerated', c: purple },
    ],
    [
      { t: '  Memory:    ', c: muted },
      { t: profile.memoryGB ? `${profile.memoryGB} GB RAM` : 'Standard', c: white },
      { t: '  ·  Cores: ', c: muted },
      { t: profile.cores ? `${profile.cores} Threads` : 'Multi-core', c: white },
      { t: '  ·  Timezone: ', c: muted },
      { t: profile.timeZone, c: white },
    ],
    [],

    // Boot sequence steps
    [
      { t: '[ OK ] ', c: green },
      { t: 'Mounted 3D Workstation engine (WebGL2 Canvas, Three.js)', c: white },
    ],
    [
      { t: '[ OK ] ', c: green },
      { t: 'Loaded production assets · Core bundle: 118 kB', c: white },
    ],
    [
      { t: '[ OK ] ', c: green },
      { t: 'Projects compiled: TaskFlow · QuickInvoice · DevDash', c: white },
    ],
    [
      { t: '[ OK ] ', c: green },
      { t: 'All systems operational. Zero telemetry leaked.', c: green },
    ],
    [],

    // Prompt line
    [
      { t: 'marvellous@workstation', c: green },
      { t: ':', c: muted },
      { t: '~/portfolio', c: cyan },
      { t: '$ ', c: white },
      { t: 'npm run start -- --interactive --production', c: yellow },
    ],
    [
      { t: '  ➜ Local:   ', c: muted },
      { t: 'http://localhost:5173/ ', c: cyan },
      { t: '[READY TO BUILD]', c: green },
    ],
  ];
}

/** Draws the terminal screen texture onto an HTML Canvas element. */
export function renderTerminalScreen(
  ctx: CanvasRenderingContext2D,
  lines: Line[],
  charBudget: number,
  showCursor: boolean
) {
  // Canvas background
  ctx.fillStyle = '#090a0f';
  ctx.fillRect(0, 0, SCREEN_W, SCREEN_H);

  // Window titlebar
  ctx.fillStyle = '#11131a';
  ctx.fillRect(0, 0, SCREEN_W, 46);

  ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(0, 46);
  ctx.lineTo(SCREEN_W, 46);
  ctx.stroke();

  // Traffic light dots
  const dots = [
    { x: 30, color: '#ff5f56' },
    { x: 50, color: '#ffbd2e' },
    { x: 70, color: '#27c93f' },
  ];
  for (const d of dots) {
    ctx.beginPath();
    ctx.arc(d.x, 23, 7, 0, Math.PI * 2);
    ctx.fillStyle = d.color;
    ctx.fill();
  }

  // Window title
  ctx.font = '500 15px monospace, monospace';
  ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
  ctx.textAlign = 'center';
  ctx.fillText('bash — marvellous@workstation: ~/portfolio (1280×800)', SCREEN_W / 2, 29);
  ctx.textAlign = 'left';

  // Terminal body
  const startX = 36;
  let startY = 82;
  const lineHeight = 28;

  ctx.font = '14px monospace, "Courier New", Courier';
  ctx.textBaseline = 'top';

  let remainingChars = charBudget;
  let lastX = startX;
  let lastY = startY;

  for (let lIdx = 0; lIdx < lines.length; lIdx++) {
    const line = lines[lIdx];
    let curX = startX;

    if (line.length === 0) {
      startY += lineHeight * 0.75;
      continue;
    }

    for (const seg of line) {
      if (remainingChars <= 0) break;

      const segLength = seg.t.length;
      const charsToDraw = Math.min(segLength, remainingChars);
      const textToDraw = seg.t.slice(0, charsToDraw);

      ctx.fillStyle = seg.c;
      ctx.fillText(textToDraw, curX, startY);

      curX += ctx.measureText(textToDraw).width;
      remainingChars -= charsToDraw;
    }

    lastX = curX;
    lastY = startY;
    startY += lineHeight;

    if (remainingChars <= 0) break;
  }

  // Blinking terminal cursor
  if (showCursor) {
    ctx.fillStyle = '#c9a96e';
    ctx.fillRect(lastX + 2, lastY + 2, 9, 18);
  }
}
