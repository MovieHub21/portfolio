import { motion, useTransform, type MotionValue } from 'framer-motion';
import type { BrowserProfile } from '../../hooks/useBrowserProfile';
import type { VisitorContext } from '../../hooks/useVisitorPersonalization';

interface Props {
  progress: MotionValue<number>;
  profile: BrowserProfile;
  visitor: VisitorContext;
}

const go = (id: string) => (e: React.MouseEvent) => {
  e.preventDefault();
  document.querySelector(id)?.scrollIntoView({ behavior: 'smooth' });
};

export default function HeroOverlay({ progress, profile, visitor }: Props) {
  const headOpacity = useTransform(progress, [0, 0.12, 0.27], [1, 1, 0]);
  const headY = useTransform(progress, [0, 0.27], [0, -80]);
  const headEvents = useTransform(progress, (v) => (v < 0.2 ? 'auto' : 'none'));
  const hintOpacity = useTransform(progress, [0, 0.05], [1, 0]);
  const chipsOpacity = useTransform(progress, [0.34, 0.46, 0.9, 0.98], [0, 1, 1, 0]);
  const chipsY = useTransform(progress, [0.34, 0.46], [18, 0]);
  const ctaOpacity = useTransform(progress, [0.86, 0.95], [0, 1]);
  const ctaY = useTransform(progress, [0.86, 0.95], [24, 0]);
  const ctaEvents = useTransform(progress, (v) => (v > 0.88 ? 'auto' : 'none'));
  const pct = useTransform(progress, (v) => `${String(Math.round(v * 100)).padStart(3, '0')}%`);
  const stage = useTransform(progress, (v): string =>
    v < 0.3 ? '01 / BOOT' : v < 0.62 ? '02 / IDENTIFY' : '03 / DEPLOY'
  );
  const railFill = useTransform(progress, [0, 1], ['0%', '100%']);

  const browser = `${profile.browser} ${profile.browserVersion}`.trim();
  const chips = [
    browser,
    profile.os,
    profile.screenRes,
    profile.cores ? `${profile.cores} ${profile.cores === 1 ? 'thread' : 'threads'}` : null,
    profile.timeZone.replace(/_/g, ' '),
  ].filter(Boolean) as string[];

  return (
    <div className="absolute inset-0 z-10 pointer-events-none">
      {/* readability scrim behind the headline */}
      <motion.div
        style={{ opacity: headOpacity }}
        className="absolute inset-0 bg-gradient-to-b lg:bg-gradient-to-r from-bg/85 via-bg/45 to-transparent"
      />

      {/* ── Headline block (fades away as the laptop takes over) ── */}
      <motion.div
        style={{ opacity: headOpacity, y: headY, pointerEvents: headEvents }}
        className="absolute inset-0 flex items-start lg:items-center"
      >
        <div className="max-w-7xl mx-auto w-full px-6 sm:px-8 lg:px-12 pt-24 lg:pt-0">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full border border-accent/25 bg-accent-dim mb-5 lg:mb-6">
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
              <span className="text-xs font-mono uppercase tracking-widest text-accent font-medium">
                {visitor.greeting}
              </span>
              <span className="text-[10px] text-text-muted font-mono hidden sm:inline">
                [{visitor.localTimeFormatted}]
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl xl:text-6xl font-bold tracking-tight leading-[1.1] font-display text-text mb-5 lg:mb-6">
              Building web products that <span className="text-accent">actually work</span>.
            </h1>

           

            <div className="flex flex-wrap items-center gap-4">
              <a
                href="#projects"
                onClick={go('#projects')}
                className="group inline-flex items-center gap-3 px-7 py-3.5 bg-accent text-bg font-display font-semibold rounded-full text-sm hover:bg-accent-light hover:shadow-[0_0_28px_rgba(201,169,110,0.35)] transition-all duration-300"
              >
                Explore Projects
                <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
              </a>
              <a
                href="#contact"
                onClick={go('#contact')}
                className="inline-flex items-center px-7 py-3.5 border border-border-light text-text font-display font-medium rounded-full text-sm hover:border-accent hover:text-accent transition-all duration-300 bg-bg/40 backdrop-blur-sm"
              >
                Contact
              </a>
            </div>
          </div>
        </div>
      </motion.div>

      {/* ── Live scroll HUD (top-right, under the nav) ── */}
      <div className="absolute top-20 right-6 sm:right-8 lg:right-12 hidden sm:flex flex-col items-end gap-1 font-mono text-[11px] text-text-muted">
        <motion.span className="text-accent tracking-widest">{stage}</motion.span>
        <span className="flex items-center gap-2">
          scroll <motion.span className="text-text-secondary tabular-nums">{pct}</motion.span>
        </span>
        <div className="w-28 h-px bg-border-light mt-1 overflow-hidden">
          <motion.div style={{ width: railFill }} className="h-full bg-accent" />
        </div>
      </div>

      {/* ── Visitor chips: this visitor's real browser info ── */}
      <motion.div
        style={{ opacity: chipsOpacity, y: chipsY }}
        className="absolute left-0 right-0 bottom-6 sm:bottom-8 px-6 flex flex-col items-center gap-2"
      >
        <div className="flex flex-wrap justify-center gap-2">
          {chips.map((c) => (
            <span
              key={c}
              className="text-[11px] font-mono text-text-secondary px-3 py-1 rounded-full bg-bg/70 backdrop-blur border border-border-light"
            >
              {c}
            </span>
          ))}
        </div>
        <span className="text-[10px] font-mono text-text-muted">
          read locally from your browser · nothing leaves this tab
        </span>
      </motion.div>

      {/* ── Closing CTA ── */}
      <motion.div
        style={{ opacity: ctaOpacity, y: ctaY, pointerEvents: ctaEvents }}
        className="absolute left-0 right-0 bottom-6 sm:bottom-8 flex justify-center"
      >
        <a
          href="#projects"
          onClick={go('#projects')}
          className="inline-flex items-center gap-3 px-7 py-3.5 bg-accent text-bg font-display font-semibold rounded-full text-sm shadow-[0_0_40px_rgba(201,169,110,0.35)] hover:bg-accent-light transition-colors"
        >
          Ship it — see the work ↓
        </a>
      </motion.div>

      {/* ── Scroll hint ── */}
      <motion.div
        style={{ opacity: hintOpacity }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-[10px] uppercase tracking-[0.25em] text-text-muted font-mono">
          Scroll to boot
        </span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          className="w-px h-6 bg-gradient-to-b from-accent to-transparent"
        />
      </motion.div>
    </div>
  );
}
