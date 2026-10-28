import { personalInfo, projects, skills } from '../../data/portfolio';

export type Font = 'label' | 'h1' | 'h2' | 'body';

export interface Seg {
  t: string;
  c: string;
  b?: boolean; // bold override
}
/** A line's typography comes from `f`; an empty segment list is a vertical gap. */
export type Line = { f: Font; segs: Seg[] };

export const SCREEN_W = 1280;
export const SCREEN_H = 800;

const COL = {
  dim: '#6c7086',
  text: '#d9d4ca',
  white: '#f2eee8',
  gold: '#dfc28d',
  green: '#7ee0a8',
};

const SANS =
  'ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, "DejaVu Sans", sans-serif';
const MONO =
  'ui-monospace, "JetBrains Mono", "SF Mono", Menlo, Consolas, "DejaVu Sans Mono", monospace';

function wrap(text: string, max: number): string[] {
  const out: string[] = [];
  let cur = '';
  for (const w of text.split(' ')) {
    if (cur && `${cur} ${w}`.length > max) {
      out.push(cur);
      cur = w;
    } else {
      cur = cur ? `${cur} ${w}` : w;
    }
  }
  if (cur) out.push(cur);
  return out;
}

const gap = (f: Font = 'body'): Line => ({ f, segs: [] });
const line = (f: Font, ...segs: Seg[]): Line => ({ f, segs });

interface ScriptInput {
  greeting: string;
  compact: boolean;
}

/** The "about me" page that types itself onto the laptop screen. Content comes from src/data/portfolio.ts. */
export function buildScript({ greeting, compact }: ScriptInput): Line[] {
  // bio reads "I'm Marvellous — a web developer who…": the heading already says the name
  const afterDash = personalInfo.bio.split('— ')[1] ?? personalInfo.bio;
  const intro = afterDash.charAt(0).toUpperCase() + afterDash.slice(1);
  const firstSentence = intro.split('. ')[0] + '.';

  const bullet = (label: string, items: string[]): Line =>
    line('body', { t: '▸ ', c: COL.gold }, { t: `${label}  `, c: COL.gold, b: true }, { t: items.join(', '), c: COL.text });

  const lines: Line[] = [
    line('label', { t: greeting.toUpperCase(), c: COL.dim }),
    line('h1', { t: `Hi, I'm ${personalInfo.name}.`, c: COL.white }),
    line('h2', { t: personalInfo.title, c: COL.gold }),
    gap(),
  ];

  const introLines = wrap(compact ? firstSentence : intro, compact ? 40 : 64);
  introLines.forEach((t) => lines.push(line('body', { t, c: COL.text })));
  lines.push(gap());

  lines.push(line('label', { t: 'WHAT I DO', c: COL.dim }));
 lines.push(bullet('Frontend', skills.frontend.items.slice(0, 5)));
lines.push(bullet('Backend', skills.backend.items.slice(0, 5)));
  lines.push(bullet('Data', skills.database.items.slice(0, 5)));

  lines.push(bullet('Built', projects.map((p) => p.title).slice(0, 3)));
  lines.push(gap());
  lines.push(line('body', { t: '↓ ', c: COL.green, b: true }));
  return lines;
}

export function totalChars(lines: Line[]): number {
  return lines.reduce((n, l) => n + l.segs.reduce((m, s) => m + s.t.length, 0) + 1, 0);
}

interface Style {
  size: number;
  lh: number;
  family: string;
  weight: number;
}

function styleFor(f: Font, compact: boolean): Style {
  const k = compact ? 1.22 : 1;
  switch (f) {
    case 'label':
      return { size: 21 * k, lh: 42 * k, family: MONO, weight: 500 };
    case 'h1':
      return { size: 64 * (compact ? 1.1 : 1), lh: 84 * (compact ? 1.1 : 1), family: SANS, weight: 700 };
    case 'h2':
      return { size: 34 * k, lh: 54 * k, family: SANS, weight: 600 };
    default:
      return { size: 30 * k, lh: 46 * k, family: SANS, weight: 400 };
  }
}

interface DrawOpts {
  title: string;
  budget: number;
  compact: boolean;
  cursorOn: boolean;
}

export function drawScreen(ctx: CanvasRenderingContext2D, lines: Line[], o: DrawOpts) {
  const W = SCREEN_W;
  const H = SCREEN_H;
  const left = o.compact ? 48 : 64;
  const top = 92;
  const bottomPad = 28;

  // background
  const bg = ctx.createLinearGradient(0, 0, 0, H);
  bg.addColorStop(0, '#0d0e16');
  bg.addColorStop(1, '#08090e');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  // subtle gold glow behind the heading
  const glow = ctx.createRadialGradient(W * 0.2, 150, 0, W * 0.2, 150, 520);
  glow.addColorStop(0, 'rgba(201,169,110,0.10)');
  glow.addColorStop(1, 'rgba(201,169,110,0)');
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, W, H);

  // reveal lines up to the character budget
  let remaining = o.budget;
  const shown: Line[] = [];
  for (const ln of lines) {
    if (remaining <= 0) break;
    const out: Seg[] = [];
    let complete = true;
    for (const seg of ln.segs) {
      const take = Math.min(seg.t.length, remaining);
      if (take > 0) out.push({ ...seg, t: seg.t.slice(0, take) });
      remaining -= take;
      if (take < seg.t.length) {
        complete = false;
        break;
      }
    }
    shown.push({ f: ln.f, segs: out });
    if (!complete) break;
    remaining -= 1; // newline
  }

  // if the page grows taller than the screen, scroll it up like a document
  const heights = shown.map((l) => (l.segs.length ? styleFor(l.f, o.compact).lh : styleFor(l.f, o.compact).lh * 0.5));
  const used = heights.reduce((a, b) => a + b, 0);
  const avail = H - top - bottomPad;
  let y = top - Math.max(0, used - avail);

  ctx.textBaseline = 'alphabetic';
  let cursorX = left;
  let cursorBase = y;
  let cursorSize = 30;
  shown.forEach((ln, i) => {
    const st = styleFor(ln.f, o.compact);
    const base = y + st.size * 1.0;
    let x = left;
    for (const seg of ln.segs) {
      ctx.font = `${seg.b ? 700 : st.weight} ${st.size}px ${st.family}`;
      ctx.fillStyle = seg.c;
      ctx.fillText(seg.t, x, base);
      x += ctx.measureText(seg.t).width;
    }
    cursorX = x;
    cursorBase = base;
    cursorSize = st.size;
    y += heights[i];
  });

  // title bar
  ctx.fillStyle = '#12131b';
  ctx.fillRect(0, 0, W, 64);
  ctx.fillStyle = '#1f2030';
  ctx.fillRect(0, 63, W, 1);
  ['#ff5f57', '#febc2e', '#28c840'].forEach((col, i) => {
    ctx.fillStyle = col;
    ctx.beginPath();
    ctx.arc(40 + i * 34, 32, 10, 0, Math.PI * 2);
    ctx.fill();
  });
  ctx.font = `500 22px ${MONO}`;
  ctx.fillStyle = '#6c7086';
  ctx.textAlign = 'center';
  ctx.fillText(o.title, W / 2, 40);
  ctx.textAlign = 'left';

  // blinking cursor at the end of the typed text
  if (o.cursorOn) {
    ctx.fillStyle = COL.gold;
    ctx.fillRect(cursorX + 6, cursorBase - cursorSize * 0.85, cursorSize * 0.14 + 3, cursorSize * 1.0);
  }

  // faint scanlines + vignette keep it feeling like a real display
  ctx.fillStyle = 'rgba(255,255,255,0.018)';
  for (let yy = 0; yy < H; yy += 4) ctx.fillRect(0, yy, W, 1);
  const vg = ctx.createRadialGradient(W / 2, H / 2, H * 0.45, W / 2, H / 2, H * 1.0);
  vg.addColorStop(0, 'rgba(0,0,0,0)');
  vg.addColorStop(1, 'rgba(0,0,0,0.38)');
  ctx.fillStyle = vg;
  ctx.fillRect(0, 0, W, H);
}
