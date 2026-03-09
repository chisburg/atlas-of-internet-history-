'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import HeroSnapshot, { hasHeroSnapshot } from '@/components/HeroSnapshot';
import { useTrailStore } from '@/store/trail';
import type { Artifact, Connection, RelationType } from '@/lib/types';

// ── Relation config ───────────────────────────────────────────────────────────

const RELATION_CONFIG: Record<RelationType, {
  label: string;
  sublabel: string;
  narrative: string;     // evocative story framing for PathPreview
  badge: string;
  glow: string;
  accentColor: string;
  icon: string;
}> = {
  before: {
    label: 'Before',
    sublabel: 'Historical predecessor',
    narrative: 'One step back in internet history.',
    badge: 'bg-blue-950/80 text-blue-200 border-blue-500/40',
    glow: 'rgba(59,130,246,0.12)',
    accentColor: '#3b82f6',
    icon: '←',
  },
  after: {
    label: 'After',
    sublabel: 'What followed',
    narrative: 'Follow the evolution forward.',
    badge: 'bg-emerald-950/80 text-emerald-200 border-emerald-500/40',
    glow: 'rgba(52,211,153,0.12)',
    accentColor: '#34d399',
    icon: '→',
  },
  sideways: {
    label: 'Sideways',
    sublabel: 'Parallel existence',
    narrative: 'A different path through the same era.',
    badge: 'bg-violet-950/80 text-violet-200 border-violet-500/40',
    glow: 'rgba(139,92,246,0.12)',
    accentColor: '#8b5cf6',
    icon: '↔',
  },
  sameEra: {
    label: 'Same Era',
    sublabel: 'Shared moment in time',
    narrative: 'Defined the same internet moment.',
    badge: 'bg-amber-950/80 text-amber-200 border-amber-500/40',
    glow: 'rgba(245,158,11,0.12)',
    accentColor: '#f59e0b',
    icon: '◎',
  },
  strangeJump: {
    label: 'Strange Jump',
    sublabel: 'Surprising connection',
    narrative: 'A real but unexpected leap. Trust it.',
    badge: 'bg-rose-950/80 text-rose-200 border-rose-600/50',
    glow: 'rgba(244,63,94,0.18)',
    accentColor: '#f43f5e',
    icon: '⟡',
  },
};

// ── Helpers ───────────────────────────────────────────────────────────────────

function getTimeGap(fromYear: number, toYear: number): string {
  const diff = toYear - fromYear;
  if (Math.abs(diff) <= 1) return 'same era';
  if (diff > 0) return `${diff} yr${diff !== 1 ? 's' : ''} later`;
  return `${Math.abs(diff)} yr${Math.abs(diff) !== 1 ? 's' : ''} earlier`;
}

function shorten(t: string, max: number) {
  return t.length > max ? t.slice(0, max - 1) + '…' : t;
}

// ── Component ─────────────────────────────────────────────────────────────────

interface Props {
  connection: Connection;
  fromArtifact: Artifact;
  index: number;
}

export default function RabbitCard({ connection, fromArtifact, index }: Props) {
  const router = useRouter();
  const addToTrail = useTrailStore((s) => s.addToTrail);
  const [isHovered, setIsHovered] = useState(false);

  const { artifact, relationType, label } = connection;
  const cfg = RELATION_CONFIG[relationType];
  const hasScene = hasHeroSnapshot(artifact.slug);
  const timeGap = getTimeGap(fromArtifact.startYear, artifact.startYear);

  const handleClick = () => {
    addToTrail({ slug: artifact.slug, title: artifact.title });
    router.push(`/artifact/${artifact.slug}`);
  };

  return (
    <motion.button
      onClick={handleClick}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="group relative flex flex-col overflow-hidden rounded-xl border border-white/[0.07] bg-[#0d0d14] text-left focus:outline-none focus:ring-1 focus:ring-white/20 cursor-pointer w-full"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07, duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] }}
      whileHover={{ scale: 1.02, y: -3 }}
      whileTap={{ scale: 0.975 }}
      style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.4)' }}
    >
      {/* ── Thumbnail ─────────────────────────────────────────────────── */}
      <div className="relative h-28 w-full overflow-hidden flex-shrink-0">
        {hasScene ? (
          <div className="absolute inset-0 scale-[1.02]">
            <HeroSnapshot slug={artifact.slug} />
          </div>
        ) : (
          <div className="absolute inset-0" style={{ background: artifact.gradient }} />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d14] via-black/30 to-transparent" />
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{ background: `radial-gradient(ellipse at 50% 100%, ${cfg.glow} 0%, transparent 70%)` }}
        />
        <div className="absolute top-2.5 left-2.5">
          <span className={`inline-flex items-center gap-1 rounded-md border px-1.5 py-[3px] text-[9px] font-bold tracking-[0.1em] uppercase ${cfg.badge}`}>
            <span className="opacity-70">{cfg.icon}</span>
            {cfg.label}
          </span>
        </div>
      </div>

      {/* ── Body ──────────────────────────────────────────────────────── */}
      <div className="flex flex-col gap-1 px-3.5 pt-3 pb-2.5 flex-1">
        <div className="flex items-baseline justify-between gap-2">
          <h3 className="text-sm font-semibold text-white/85 leading-tight line-clamp-1 group-hover:text-white transition-colors duration-200">
            {artifact.title}
          </h3>
          <span className="flex-shrink-0 text-[11px] font-mono text-white/25 tabular-nums">
            {artifact.startYear}
          </span>
        </div>

        <p className="text-[9.5px] font-medium uppercase tracking-[0.1em]" style={{ color: cfg.accentColor, opacity: 0.6 }}>
          {cfg.sublabel}
        </p>

        <p className="text-[11px] text-white/38 leading-relaxed line-clamp-2 group-hover:text-white/55 transition-colors duration-200">
          {label}
        </p>
      </div>

      {/* ── Path Preview strip (appears on hover) ─────────────────────── */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            key="preview"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            className="overflow-hidden"
          >
            <div
              className="px-3.5 py-2.5 border-t"
              style={{
                borderColor: `${cfg.accentColor}18`,
                background: `linear-gradient(to bottom, ${cfg.accentColor}08, transparent)`,
              }}
            >
              {/* Mini-path */}
              <div className="flex items-center gap-1.5 mb-1.5">
                <span className="text-[9.5px] text-white/28 font-medium truncate max-w-[4.5rem]">
                  {shorten(fromArtifact.title, 9)}
                </span>
                <svg width="14" height="8" viewBox="0 0 14 8" fill="none" className="flex-shrink-0">
                  <path d="M0 4h12M9 1.5l2.5 2.5L9 6.5" stroke={cfg.accentColor} strokeWidth="1.2"
                    strokeLinecap="round" strokeLinejoin="round" opacity="0.5" />
                </svg>
                <span className="text-[9.5px] font-semibold truncate" style={{ color: cfg.accentColor, opacity: 0.85 }}>
                  {shorten(artifact.title, 11)}
                </span>
              </div>

              {/* Time gap + narrative */}
              <div className="flex items-center gap-2">
                <span className="text-[9px] font-mono font-medium" style={{ color: cfg.accentColor, opacity: 0.65 }}>
                  {timeGap}
                </span>
                <span className="text-white/15 text-[9px]">·</span>
                <span className="text-[9px] text-white/25 italic">
                  {cfg.narrative}
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Bottom accent line ────────────────────────────────────────── */}
      <div
        className="absolute bottom-0 left-0 right-0 h-[2px] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"
        style={{ background: `linear-gradient(90deg, ${cfg.accentColor}80, ${cfg.accentColor}15)` }}
      />

      {/* ── Hover border glow ─────────────────────────────────────────── */}
      <div
        className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{ boxShadow: `inset 0 0 0 1px ${cfg.accentColor}28` }}
      />
    </motion.button>
  );
}
