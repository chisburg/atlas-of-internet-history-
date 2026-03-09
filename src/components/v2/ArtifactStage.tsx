'use client';

import { motion, AnimatePresence } from 'framer-motion';
import HeroSnapshot, { hasHeroSnapshot } from '@/components/HeroSnapshot';
import { getNodeSymbol } from './nodeSymbols';
import type { Artifact } from '@/lib/types';
import type { Place, EcosystemNode } from '@/data/atlasWorld';

interface Props {
  artifact: Artifact;
  place: Place | null;
  onNavigate: (slug: string) => void;
}

/**
 * Polar → percentage offsets from stage center (50%, 43%).
 * Orbit radii sized to clear the large scene frame.
 */
function polarToOffset(angleDeg: number, distance: number): { x: number; y: number } {
  const rad = (angleDeg * Math.PI) / 180;
  return {
    x: Math.cos(rad) * 43 * distance,
    y: Math.sin(rad) * 37 * distance,
  };
}

/** Culture unfolds: 0.5s → 0.7s → 0.9s → … */
function discoveryDelay(i: number): number {
  return 0.45 + i * 0.2;
}

function extractFirstColor(gradient: string): string {
  const m = gradient.match(/#[0-9a-fA-F]{3,6}/);
  return m ? m[0] : '#3b82f6';
}

// Scene center in percentage coordinates (must match the absolute positioning below)
const CX = 50; // % from left
const CY = 43; // % from top

export default function ArtifactStage({ artifact, place, onNavigate }: Props) {
  const ecosystem = place?.ecosystem ?? [];
  const hasScene = hasHeroSnapshot(artifact.slug);
  const glowColor = extractFirstColor(artifact.gradient);

  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Full-stage ambient glow evokes the artifact's era */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse 90% 70% at 50% 38%, ${glowColor}1e 0%, transparent 60%)`,
        }}
      />

      {/* SVG connection lines — drawn from scene center to each node */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ zIndex: 15 }}
      >
        <AnimatePresence>
          {ecosystem.map((node, i) => {
            const { x, y } = polarToOffset(node.angle, node.distance);
            const sym = getNodeSymbol(node.id, node.relation);
            const lineColor = sym.glyphColor ?? '#94a3b8';
            return (
              <motion.line
                key={`line-${artifact.slug}-${node.id}`}
                x1={`${CX}%`}
                y1={`${CY}%`}
                x2={`${CX + x}%`}
                y2={`${CY + y}%`}
                stroke={lineColor}
                strokeWidth={node.navigable ? '0.8' : '0.5'}
                strokeDasharray={node.navigable ? '3 5' : '1.5 6'}
                initial={{ opacity: 0 }}
                animate={{
                  opacity: node.navigable ? 0.22 : 0.1,
                  transition: { delay: discoveryDelay(i) + 0.15, duration: 0.6 },
                }}
                exit={{ opacity: 0, transition: { duration: 0.12 } }}
              />
            );
          })}
        </AnimatePresence>
      </svg>

      {/* ── ARTIFACT SCENE — dominates the viewport ─────────────────────────── */}
      <motion.div
        key={artifact.slug}
        initial={{ opacity: 0, scale: 0.93, y: 8 }}
        animate={{
          opacity: 1, scale: 1, y: 0,
          transition: { duration: 0.55, ease: [0.25, 0, 0, 1] as [number, number, number, number] },
        }}
        exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
        className="absolute z-10"
        style={{
          width: 'clamp(320px, 62vw, 700px)',
          left: '50%',
          top: `${CY}%`,
          transform: 'translate(-50%, -50%)',
        }}
      >
        {/* Scene frame */}
        <div
          className="relative overflow-hidden rounded-2xl"
          style={{
            height: 'clamp(220px, 44vh, 420px)',
            border: '1px solid rgba(255,255,255,0.08)',
            boxShadow: `0 0 100px ${glowColor}2a, 0 32px 100px rgba(0,0,0,0.8)`,
          }}
        >
          {hasScene ? (
            <HeroSnapshot slug={artifact.slug} />
          ) : (
            <AmbientEnvironment artifact={artifact} />
          )}

          {/* Cinematic title caption at bottom of scene */}
          <div
            className="absolute bottom-0 left-0 right-0 px-6 pb-5 pt-20"
            style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.92) 0%, transparent 100%)' }}
          >
            <div className="flex items-end justify-between gap-3">
              <h2 className="text-[22px] font-semibold text-white leading-tight tracking-tight">
                {artifact.title}
              </h2>
              <span className="text-[11px] font-mono text-white/40 flex-shrink-0 pb-0.5 tabular-nums">
                {artifact.startYear}
                {artifact.endYear ? `–${String(artifact.endYear).slice(2)}` : '+'}
              </span>
            </div>
          </div>
        </div>

        {/* Description — below scene, museum label style */}
        <p className="mt-3 text-[11px] text-white/38 leading-relaxed line-clamp-2 text-center px-2 max-w-lg mx-auto">
          {artifact.shortDescription}
        </p>
      </motion.div>

      {/* ── ECOSYSTEM NODES — emerge around the artifact ─────────────────────── */}
      <AnimatePresence>
        {ecosystem.map((node, i) => (
          <EcosystemNode
            key={`${artifact.slug}-${node.id}`}
            node={node}
            index={i}
            onNavigate={onNavigate}
          />
        ))}
      </AnimatePresence>

      {ecosystem.length === 0 && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { delay: 1.2 } }}
          className="absolute bottom-8 left-0 right-0 text-center text-[9px] tracking-[0.25em] uppercase text-white/15"
        >
          ← back to keep exploring
        </motion.p>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────

function EcosystemNode({
  node,
  index,
  onNavigate,
}: {
  node: EcosystemNode;
  index: number;
  onNavigate: (slug: string) => void;
}) {
  const { x, y } = polarToOffset(node.angle, node.distance);
  const sym = getNodeSymbol(node.id, node.relation);
  const isStrange = node.relation === 'strange';
  const isCulture = !node.navigable;
  const nodeColor = sym.glyphColor ?? '#94a3b8';
  const delay = discoveryDelay(index);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.4 }}
      animate={{
        opacity: 1, scale: 1,
        transition: { delay, duration: 0.38, ease: [0.25, 0, 0, 1] as [number, number, number, number] },
      }}
      exit={{ opacity: 0, scale: 0.3, transition: { duration: 0.12 } }}
      style={{
        position: 'absolute',
        left: `calc(${CX}% + ${x}%)`,
        top: `calc(${CY}% + ${y}%)`,
        transform: 'translate(-50%, -50%)',
        zIndex: 20,
      }}
    >
      <motion.button
        onClick={() => node.navigable && onNavigate(node.id)}
        disabled={!node.navigable}
        whileHover={node.navigable ? { scale: 1.12 } : undefined}
        whileTap={node.navigable ? { scale: 0.93 } : undefined}
        className={['group flex flex-col items-center gap-1.5 outline-none', node.navigable ? 'cursor-pointer' : 'cursor-default'].join(' ')}
      >
        <NodeCircle
          glyph={sym.glyph}
          glyphColor={nodeColor}
          isMono={sym.mono ?? false}
          isNavigable={node.navigable}
          isStrange={isStrange}
          isCulture={isCulture}
        />

        <div className="flex flex-col items-center gap-0.5 max-w-[92px]">
          <span
            className="text-[10px] leading-tight text-center font-medium"
            style={{ color: node.navigable ? 'rgba(255,255,255,0.72)' : 'rgba(255,255,255,0.35)' }}
          >
            {node.label}
          </span>
          <span
            className="text-[7px] tracking-[0.1em] uppercase"
            style={{ color: `${nodeColor}80` }}
          >
            {RELATION_SHORT[node.relation] ?? node.relation}
          </span>
        </div>
      </motion.button>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────

function NodeCircle({
  glyph,
  glyphColor,
  isMono,
  isNavigable,
  isStrange,
  isCulture,
}: {
  glyph: string;
  glyphColor: string;
  isMono: boolean;
  isNavigable: boolean;
  isStrange: boolean;
  isCulture: boolean;
}) {
  const size = isNavigable ? 54 : 38;

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      {/* Curiosity anchor pulsing halo */}
      {isStrange && isNavigable && (
        <motion.div
          animate={{ scale: [1, 1.7, 1], opacity: [0.5, 0, 0.5] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute inset-0 rounded-full pointer-events-none"
          style={{ border: `1px solid ${glyphColor}70`, background: `${glyphColor}18` }}
        />
      )}

      {/* Hover glow */}
      {isNavigable && (
        <div
          className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-180 pointer-events-none"
          style={{ boxShadow: `0 0 20px ${glyphColor}65`, border: `1px solid ${glyphColor}80` }}
        />
      )}

      {/* Body */}
      <div
        className="relative flex items-center justify-center rounded-full"
        style={{
          width: size,
          height: size,
          background: `${glyphColor}${isNavigable ? '18' : '08'}`,
          border: `1px ${isCulture ? 'dashed' : 'solid'} ${glyphColor}${isNavigable ? '50' : '22'}`,
          opacity: isNavigable ? 1 : 0.6,
        }}
      >
        <span
          className={['leading-none select-none', isMono ? 'font-mono' : ''].join(' ')}
          style={{
            color: glyphColor,
            fontSize: glyph.length > 3 ? '7px' : glyph.length > 2 ? '9px' : '15px',
          }}
        >
          {glyph}
        </span>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────

function AmbientEnvironment({ artifact }: { artifact: Artifact }) {
  return (
    <div
      className="absolute inset-0 flex items-center justify-center overflow-hidden"
      style={{ background: artifact.gradient }}
    >
      {/* Large year watermark */}
      <span
        className="font-black leading-none text-white/[0.07] select-none pointer-events-none"
        style={{ fontSize: '30vw', letterSpacing: '-0.05em' }}
      >
        {artifact.startYear}
      </span>

      {/* Scanlines */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ opacity: 0.04 }}>
        <defs>
          <pattern id={`scan-${artifact.slug}`} width="1" height="4" patternUnits="userSpaceOnUse">
            <rect width="1" height="1" fill="white" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#scan-${artifact.slug})`} />
      </svg>

      <span className="absolute top-4 left-5 text-[8px] tracking-[0.3em] uppercase text-white/22">
        {artifact.type}
      </span>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────

const RELATION_SHORT: Record<string, string> = {
  before: 'earlier',
  after: 'next',
  sideways: 'parallel',
  culture: 'practice',
  strange: 'strange jump',
};
