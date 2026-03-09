'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { getAllConnections } from '@/lib/navigation';
import { useTrailStore } from '@/store/trail';
import { useUIStore } from '@/store/ui';
import type { Artifact, Connection, RelationType } from '@/lib/types';

// ── Relation config ───────────────────────────────────────────────────────────

const RELATION_CONFIG: Record<RelationType, {
  color: string;
  label: string;
  sublabel: string;
  baseAngle: number;
}> = {
  before:      { color: '#3b82f6', label: 'Before',       sublabel: 'Historical predecessor', baseAngle: 162 },
  after:       { color: '#34d399', label: 'After',         sublabel: 'What followed',          baseAngle: 18  },
  sideways:    { color: '#8b5cf6', label: 'Sideways',      sublabel: 'Parallel existence',     baseAngle: 90  },
  sameEra:     { color: '#f59e0b', label: 'Same Era',      sublabel: 'Shared moment in time',  baseAngle: 234 },
  strangeJump: { color: '#f43f5e', label: 'Strange Jump',  sublabel: 'Surprising connection',  baseAngle: 315 },
};

// ── SVG constants ─────────────────────────────────────────────────────────────

const W = 840;
const H = 420;        // reduced: timeline lives below in its own bar
const ORBIT = 195;
const CENTER_R = 46;
const NODE_R = 32;

// ── Time config ───────────────────────────────────────────────────────────────

const TIME_MIN = 1990;
const TIME_MAX = 2020;
const TICK_YEARS = [1990, 1994, 1998, 2002, 2006, 2010, 2014, 2018, 2020];

function getDefaultYear(artifact: Artifact): number {
  const start = artifact.startYear;
  const end = artifact.endYear ?? 2022;
  const mid = Math.round((start + end) / 2);
  return Math.max(TIME_MIN, Math.min(TIME_MAX, mid));
}

function getEraLabel(year: number): string {
  if (year >= 2018) return 'Platform Consolidation';
  if (year >= 2014) return 'Post-Social Web';
  if (year >= 2011) return 'Mobile-First Era';
  if (year >= 2008) return 'Mobile Begins';
  if (year >= 2004) return 'Social Web';
  if (year >= 2001) return 'Web 2.0';
  if (year >= 1999) return 'Dot-Com Boom';
  if (year >= 1996) return 'Early Web';
  if (year >= 1993) return 'Web Goes Public';
  return 'Pre-Web Era';
}

// ── Layout ────────────────────────────────────────────────────────────────────

interface NodeData {
  conn: Connection;
  x: number;
  y: number;
  relationType: RelationType;
}

function layoutNodes(connections: Connection[]): NodeData[] {
  const groups = new Map<RelationType, Connection[]>();
  for (const conn of connections) {
    const g = groups.get(conn.relationType) ?? [];
    g.push(conn);
    groups.set(conn.relationType, g);
  }
  const nodes: NodeData[] = [];
  for (const [relType, conns] of groups) {
    const { baseAngle } = RELATION_CONFIG[relType as RelationType];
    conns.forEach((conn, i) => {
      const n = conns.length;
      const spread = n > 1 ? (i - (n - 1) / 2) * (n === 2 ? 28 : 22) : 0;
      const rad = ((baseAngle + spread) * Math.PI) / 180;
      nodes.push({
        conn,
        x: ORBIT * Math.cos(rad),
        y: -ORBIT * Math.sin(rad),
        relationType: relType as RelationType,
      });
    });
  }
  return nodes;
}

// ── Visibility helpers ────────────────────────────────────────────────────────

function artifactVisible(a: Artifact, year: number): boolean {
  const end = a.endYear ?? 2030;
  return a.startYear <= year && end >= year;
}

// ── Component ─────────────────────────────────────────────────────────────────

interface Props { artifact: Artifact; }
interface TooltipState { node: NodeData; x: number; y: number; }

function getTimeGap(fromYear: number, toYear: number): string {
  const diff = toYear - fromYear;
  if (Math.abs(diff) <= 1) return 'same era';
  if (diff > 0) return `${diff} yr${diff !== 1 ? 's' : ''} later`;
  return `${Math.abs(diff)} yr${Math.abs(diff) !== 1 ? 's' : ''} earlier`;
}

export default function LocalMap({ artifact }: Props) {
  const router = useRouter();
  const addToTrail = useTrailStore((s) => s.addToTrail);
  const setViewMode = useUIStore((s) => s.setViewMode);
  const mapRef = useRef<HTMLDivElement>(null);

  const connections = getAllConnections(artifact.slug);
  const nodes = layoutNodes(connections);

  // ── Pan / zoom ───────────────────────────────────────────────────────────
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [scale, setScale] = useState(1);
  const drag = useRef({ active: false, lastX: 0, lastY: 0, moved: false });

  // ── Time layer ───────────────────────────────────────────────────────────
  const [selectedYear, setSelectedYear] = useState(() => getDefaultYear(artifact));
  const [isPlaying, setIsPlaying] = useState(false);

  // Reset time when artifact changes
  useEffect(() => {
    setSelectedYear(getDefaultYear(artifact));
    setIsPlaying(false);
    setPan({ x: 0, y: 0 });
    setScale(1);
  }, [artifact.slug]); // eslint-disable-line react-hooks/exhaustive-deps

  // Playback — advance 1 year every 380ms
  useEffect(() => {
    if (!isPlaying) return;
    const id = setInterval(() => {
      setSelectedYear((y) => {
        if (y >= TIME_MAX) { setIsPlaying(false); return TIME_MAX; }
        return y + 1;
      });
    }, 380);
    return () => clearInterval(id);
  }, [isPlaying]);

  // ── Tooltip ──────────────────────────────────────────────────────────────
  const [tooltip, setTooltip] = useState<TooltipState | null>(null);

  // ── Non-passive wheel on map area ────────────────────────────────────────
  useEffect(() => {
    const el = mapRef.current;
    if (!el) return;
    const handler = (e: WheelEvent) => {
      e.preventDefault();
      setScale((s) => Math.max(0.5, Math.min(1.8, s - e.deltaY * 0.0008)));
    };
    el.addEventListener('wheel', handler, { passive: false });
    return () => el.removeEventListener('wheel', handler);
  }, []);

  // ── Drag handlers ────────────────────────────────────────────────────────
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    drag.current = { active: true, lastX: e.clientX, lastY: e.clientY, moved: false };
    mapRef.current?.classList.add('cursor-grabbing');
    mapRef.current?.classList.remove('cursor-grab');
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!drag.current.active) return;
    const dx = e.clientX - drag.current.lastX;
    const dy = e.clientY - drag.current.lastY;
    if (Math.abs(dx) > 3 || Math.abs(dy) > 3) drag.current.moved = true;
    drag.current.lastX = e.clientX;
    drag.current.lastY = e.clientY;
    setPan((p) => ({
      x: Math.max(-200, Math.min(200, p.x + dx)),
      y: Math.max(-140, Math.min(140, p.y + dy)),
    }));
  }, []);

  const stopDrag = useCallback(() => {
    drag.current.active = false;
    mapRef.current?.classList.remove('cursor-grabbing');
    mapRef.current?.classList.add('cursor-grab');
  }, []);

  const handleNodeClick = (conn: Connection, e: React.MouseEvent) => {
    e.stopPropagation();
    if (drag.current.moved) return;
    setViewMode('map'); // stay in map mode after navigation
    addToTrail({ slug: conn.artifact.slug, title: conn.artifact.title });
    router.push(`/artifact/${conn.artifact.slug}`);
  };

  const handleNodeMouseEnter = (node: NodeData, e: React.MouseEvent) => {
    if (drag.current.active) return;
    const rect = mapRef.current?.getBoundingClientRect();
    if (!rect) return;
    setTooltip({ node, x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  // ── Derived visibility ───────────────────────────────────────────────────
  const centerVisible = artifactVisible(artifact, selectedYear);

  const nodeVisible = (conn: Connection) => artifactVisible(conn.artifact, selectedYear);

  const sliderPct = ((selectedYear - TIME_MIN) / (TIME_MAX - TIME_MIN)) * 100;

  const gTransform = `translate(${W / 2 + pan.x}, ${H / 2 + pan.y}) scale(${scale})`;
  const short = (t: string, n: number) => (t.length > n ? t.slice(0, n - 1) + '…' : t);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="flex flex-col w-full select-none bg-[#05050a]"
    >
      {/* ── MAP SVG AREA ────────────────────────────────────────────────── */}
      <div
        ref={mapRef}
        className="relative overflow-hidden cursor-grab"
        style={{ height: `${H}px` }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={stopDrag}
        onMouseLeave={() => { stopDrag(); setTooltip(null); }}
      >
        <svg
          width="100%"
          height="100%"
          viewBox={`0 0 ${W} ${H}`}
          preserveAspectRatio="xMidYMid meet"
          aria-label={`Local map of ${artifact.title} — ${selectedYear}`}
        >
          <defs>
            <pattern id="lm-dots" x="0" y="0" width="44" height="44" patternUnits="userSpaceOnUse">
              <circle cx="22" cy="22" r="0.7" fill="rgba(255,255,255,0.04)" />
            </pattern>
            <radialGradient id="lm-center" cx="45%" cy="35%" r="70%">
              <stop offset="0%" stopColor="rgba(255,255,255,0.2)" />
              <stop offset="100%" stopColor="rgba(255,255,255,0.02)" />
            </radialGradient>
            <filter id="lm-center-glow" x="-60%" y="-60%" width="220%" height="220%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="8" result="b" />
              <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
            {(Object.entries(RELATION_CONFIG) as [RelationType, typeof RELATION_CONFIG[RelationType]][]).map(([type, cfg]) => (
              <filter key={type} id={`lm-glow-${type}`} x="-60%" y="-60%" width="220%" height="220%">
                <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="b" />
                <feFlood floodColor={cfg.color} floodOpacity="0.2" result="c" />
                <feComposite in="c" in2="b" operator="in" result="cb" />
                <feMerge><feMergeNode in="cb" /><feMergeNode in="SourceGraphic" /></feMerge>
              </filter>
            ))}
          </defs>

          <rect width={W} height={H} fill="#05050a" />
          <rect width={W} height={H} fill="url(#lm-dots)" />

          <g transform={gTransform}>
            {/* Orbit guide ring */}
            <circle cx={0} cy={0} r={ORBIT} fill="none" stroke="rgba(255,255,255,0.025)" strokeWidth="1" />

            {/* ── Edges ── */}
            {nodes.map(({ conn, x, y, relationType }) => {
              const cfg = RELATION_CONFIG[relationType];
              const visible = nodeVisible(conn) && centerVisible;
              const len = Math.sqrt(x * x + y * y);
              const cpX = x / 2 + (-y / len) * 18;
              const cpY = y / 2 + (x / len) * 18;
              return (
                <path
                  key={`edge-${conn.artifact.slug}`}
                  d={`M 0 0 Q ${cpX} ${cpY} ${x} ${y}`}
                  fill="none"
                  stroke={cfg.color}
                  strokeWidth="1.5"
                  strokeOpacity={visible ? 0.22 : 0.04}
                  strokeDasharray="5 4"
                  style={{ transition: 'stroke-opacity 0.4s ease' }}
                />
              );
            })}

            {/* ── Center node ── */}
            <g
              filter="url(#lm-center-glow)"
              style={{ opacity: centerVisible ? 1 : 0.35, transition: 'opacity 0.4s ease' }}
            >
              <circle cx={0} cy={0} r={CENTER_R + 18} fill="none" stroke="white" strokeWidth="0.5" strokeOpacity="0.04" />
              <circle cx={0} cy={0} r={CENTER_R + 9} fill="none" stroke="white" strokeWidth="0.5" strokeOpacity="0.07" />
              <circle cx={0} cy={0} r={CENTER_R} fill="#0d0d1a" stroke="rgba(255,255,255,0.45)" strokeWidth="1.5" />
              <circle cx={0} cy={0} r={CENTER_R} fill="url(#lm-center)" />
            </g>
            <g style={{ opacity: centerVisible ? 1 : 0.35, transition: 'opacity 0.4s ease' }}>
              <text x={0} y={-9} textAnchor="middle" fontSize="10.5" fontWeight="700"
                fill="white" fillOpacity="0.9" fontFamily="system-ui, sans-serif">
                {short(artifact.title, 13)}
              </text>
              <text x={0} y={8} textAnchor="middle" fontSize="8.5"
                fill="rgba(255,255,255,0.3)" fontFamily="monospace">
                {artifact.startYear}
              </text>
              <text x={0} y={CENTER_R + 15} textAnchor="middle" fontSize="7"
                fill="rgba(255,255,255,0.13)" fontFamily="monospace" letterSpacing="2">
                YOU ARE HERE
              </text>
            </g>

            {/* ── Surrounding nodes ── */}
            {nodes.map(({ conn, x, y, relationType }) => {
              const cfg = RELATION_CONFIG[relationType];
              const visible = nodeVisible(conn);
              const title = short(conn.artifact.title, 12);

              return (
                <g
                  key={conn.artifact.slug}
                  style={{
                    opacity: visible ? 1 : 0.1,
                    cursor: visible ? 'pointer' : 'default',
                    transition: 'opacity 0.4s ease',
                  }}
                  onClick={visible ? (e) => handleNodeClick(conn, e) : undefined}
                  onMouseEnter={visible ? (e) => handleNodeMouseEnter({ conn, x, y, relationType }, e) : undefined}
                  onMouseLeave={visible ? () => setTooltip(null) : undefined}
                >
                  <circle cx={x} cy={y} r={NODE_R + 12} fill={cfg.color} fillOpacity="0.04" />
                  <circle cx={x} cy={y} r={NODE_R + 1} fill={cfg.color} fillOpacity="0.08"
                    filter={`url(#lm-glow-${relationType})`} />
                  <circle cx={x} cy={y} r={NODE_R}
                    fill="#0b0b14" stroke={cfg.color} strokeWidth="1.5" strokeOpacity="0.8" />
                  <circle cx={x} cy={y} r={NODE_R - 1} fill={cfg.color} fillOpacity="0.06" />
                  <circle cx={x + NODE_R * 0.68} cy={y - NODE_R * 0.68} r="5.5"
                    fill={cfg.color} fillOpacity="0.9" />
                  <text x={x} y={y - 6} textAnchor="middle" fontSize="9.5" fontWeight="600"
                    fill="rgba(255,255,255,0.85)" fontFamily="system-ui, sans-serif"
                    dominantBaseline="middle">
                    {title}
                  </text>
                  <text x={x} y={y + 8} textAnchor="middle" fontSize="8"
                    fill={cfg.color} fillOpacity="0.6" fontFamily="monospace">
                    {conn.artifact.startYear}
                  </text>
                  <text x={x} y={y + NODE_R + 14} textAnchor="middle" fontSize="7.5"
                    fill={cfg.color} fillOpacity="0.45" fontFamily="system-ui"
                    letterSpacing="0.5" fontWeight="600">
                    {cfg.label.toUpperCase()}
                  </text>
                </g>
              );
            })}
          </g>
        </svg>

        {/* Tooltip */}
        {tooltip && (() => {
          const cfg = RELATION_CONFIG[tooltip.node.relationType];
          const to = tooltip.node.conn.artifact;
          const timeGap = getTimeGap(artifact.startYear, to.startYear);
          const visible = nodeVisible(tooltip.node.conn);
          return (
            <div
              className="pointer-events-none absolute z-20 rounded-xl border bg-[#0c0c18]/98 px-4 py-3.5 shadow-2xl backdrop-blur-md"
              style={{
                left: Math.min(tooltip.x + 18, (mapRef.current?.offsetWidth ?? 800) - 230),
                top: Math.max(tooltip.y - 100, 8),
                maxWidth: '220px',
                borderColor: `${cfg.color}25`,
              }}
            >
              {/* Relation type header */}
              <div className="flex items-center gap-1.5 mb-2">
                <span className="text-[8px] font-bold uppercase tracking-[0.15em]"
                  style={{ color: cfg.color }}>
                  {cfg.label}
                </span>
                <span className="text-white/15 text-[8px]">·</span>
                <span className="text-[8px] text-white/25 italic">{cfg.sublabel}</span>
              </div>

              {/* Artifact name + years */}
              <div className="text-[15px] font-bold text-white leading-tight">
                {to.title}
              </div>
              <div className="text-[10px] text-white/30 font-mono mt-0.5">
                {to.startYear}{to.endYear ? ` – ${to.endYear}` : ' – now'}
              </div>

              {/* Time gap from current artifact */}
              <div className="mt-2 flex items-center gap-2">
                <div className="flex items-center gap-1">
                  <span className="text-[9px] text-white/25 truncate max-w-[4rem]">
                    {artifact.title.length > 9 ? artifact.title.slice(0, 8) + '…' : artifact.title}
                  </span>
                  <svg width="12" height="7" viewBox="0 0 12 7" fill="none">
                    <path d="M0 3.5h10M7.5 1.5l2 2-2 2" stroke={cfg.color} strokeWidth="1"
                      strokeLinecap="round" strokeLinejoin="round" opacity="0.4" />
                  </svg>
                  <span className="text-[9px] font-semibold" style={{ color: cfg.color, opacity: 0.8 }}>
                    {to.title.length > 9 ? to.title.slice(0, 8) + '…' : to.title}
                  </span>
                </div>
                <span className="ml-auto text-[9px] font-mono flex-shrink-0" style={{ color: cfg.color, opacity: 0.55 }}>
                  {timeGap}
                </span>
              </div>

              {/* Not active badge */}
              {!visible && (
                <div className="mt-2 text-[8.5px] font-mono px-1.5 py-0.5 rounded bg-white/[0.04] text-white/25 border border-white/[0.07]">
                  not active in {selectedYear}
                </div>
              )}

              {/* Edge explanation */}
              <div className="mt-2.5 pt-2 border-t border-white/[0.06] text-[11px] text-white/40 leading-snug">
                {tooltip.node.conn.label}
              </div>

              {/* CTA */}
              <div className="mt-2 text-[8.5px] text-white/18 font-mono">
                click to explore →
              </div>
            </div>
          );
        })()}

        {/* Zoom controls — top right */}
        <div className="absolute top-3 right-3 flex flex-col gap-1"
          onMouseDown={(e) => e.stopPropagation()}>
          <button onClick={(e) => { e.stopPropagation(); setScale((s) => Math.min(1.8, s + 0.2)); }}
            className="w-7 h-7 rounded-lg border border-white/10 bg-black/50 text-white/35 hover:text-white hover:bg-white/10 flex items-center justify-center font-mono text-sm leading-none transition-colors"
            title="Zoom in">+</button>
          <button onClick={(e) => { e.stopPropagation(); setScale((s) => Math.max(0.5, s - 0.2)); }}
            className="w-7 h-7 rounded-lg border border-white/10 bg-black/50 text-white/35 hover:text-white hover:bg-white/10 flex items-center justify-center font-mono text-sm leading-none transition-colors"
            title="Zoom out">−</button>
          <button onClick={(e) => { e.stopPropagation(); setScale(1); setPan({ x: 0, y: 0 }); }}
            className="w-7 h-7 rounded-lg border border-white/10 bg-black/50 text-white/35 hover:text-white hover:bg-white/10 flex items-center justify-center transition-colors"
            title="Reset">
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
              <circle cx="5" cy="5" r="3" stroke="currentColor" strokeWidth="1.2" />
              <circle cx="5" cy="5" r="1" fill="currentColor" />
            </svg>
          </button>
        </div>

        {/* Legend — top left */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-x-3 gap-y-1">
          {(Object.entries(RELATION_CONFIG) as [RelationType, typeof RELATION_CONFIG[RelationType]][]).map(([type, cfg]) => (
            <div key={type} className="flex items-center gap-1">
              <div className="w-1.5 h-1.5 rounded-full" style={{ background: cfg.color }} />
              <span className="text-[8.5px] text-white/20 font-medium">{cfg.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── TIMELINE BAR ────────────────────────────────────────────────── */}
      <div
        className="border-t border-white/[0.05] bg-[#05050a] px-5 md:px-7 pt-3.5 pb-4"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-5">
          {/* Year + era label */}
          <div className="flex-shrink-0 w-24">
            <div className="flex items-baseline gap-2">
              <AnimatePresence mode="wait">
                <motion.span
                  key={selectedYear}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  transition={{ duration: 0.12 }}
                  className="text-3xl font-bold text-white tabular-nums font-mono leading-none"
                >
                  {selectedYear}
                </motion.span>
              </AnimatePresence>
            </div>
            <AnimatePresence mode="wait">
              <motion.div
                key={getEraLabel(selectedYear)}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="text-[9px] text-white/25 font-mono uppercase tracking-[0.12em] mt-1 leading-none"
              >
                {getEraLabel(selectedYear)}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Play/Pause */}
          <button
            onClick={() => setIsPlaying((p) => !p)}
            className="flex-shrink-0 w-7 h-7 rounded-full border border-white/12 bg-white/[0.04] hover:bg-white/10 text-white/40 hover:text-white transition-colors flex items-center justify-center"
            title={isPlaying ? 'Pause' : 'Play through time'}
          >
            {isPlaying ? (
              <svg width="9" height="9" viewBox="0 0 9 9" fill="currentColor">
                <rect x="1" y="1" width="2.5" height="7" rx="0.5" />
                <rect x="5.5" y="1" width="2.5" height="7" rx="0.5" />
              </svg>
            ) : (
              <svg width="8" height="9" viewBox="0 0 8 9" fill="currentColor">
                <path d="M1 0.5L7.5 4.5L1 8.5V0.5Z" />
              </svg>
            )}
          </button>

          {/* Slider + ticks */}
          <div className="flex-1 flex flex-col gap-1.5">
            {/* Custom track + native input stacked */}
            <div className="relative flex items-center">
              {/* Visual track (pointer-events:none so input captures events) */}
              <div className="pointer-events-none absolute inset-0 flex items-center">
                <div className="w-full h-[3px] rounded-full overflow-hidden"
                  style={{ background: 'rgba(255,255,255,0.08)' }}>
                  <div className="h-full rounded-full"
                    style={{
                      width: `${sliderPct}%`,
                      background: 'rgba(255,255,255,0.38)',
                      transition: 'width 0.08s linear',
                    }} />
                </div>
              </div>
              {/* Native range input — transparent track, custom thumb via CSS */}
              <input
                type="range"
                min={TIME_MIN}
                max={TIME_MAX}
                value={selectedYear}
                onChange={(e) => { setIsPlaying(false); setSelectedYear(Number(e.target.value)); }}
                className="atlas-range"
              />
            </div>

            {/* Tick marks */}
            <div className="flex justify-between">
              {TICK_YEARS.map((y) => {
                const active = y <= selectedYear;
                return (
                  <div key={y} className="flex flex-col items-center gap-0.5" style={{ width: '1px' }}>
                    <div className="w-px h-1.5 transition-colors duration-300"
                      style={{ background: active ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.1)' }} />
                    <span className="text-[7.5px] font-mono transition-colors duration-300"
                      style={{ color: active ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.12)' }}>
                      {y}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
