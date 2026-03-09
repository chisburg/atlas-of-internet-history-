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

function polarToOffset(angleDeg: number, distance: number): { x: number; y: number } {
  const rad = (angleDeg * Math.PI) / 180;
  return {
    x: Math.cos(rad) * 41 * distance,
    y: Math.sin(rad) * 34 * distance,
  };
}

function discoveryDelay(i: number): number {
  return 0.2 + i * 0.12;
}

function extractFirstColor(gradient: string): string {
  const m = gradient.match(/#[0-9a-fA-F]{3,6}/);
  return m ? m[0] : '#3b82f6';
}

const CX = 50;
const CY = 43;

export default function ArtifactStage({ artifact, place, onNavigate }: Props) {
  const ecosystem = place?.ecosystem ?? [];
  const hasScene = hasHeroSnapshot(artifact.slug);
  const glowColor = extractFirstColor(artifact.gradient);

  return (
    <div
      className="absolute inset-0 overflow-hidden"
      style={{ fontFamily: '"Courier New", Courier, monospace' }}
    >
      {/* Ambient glow based on artifact color */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse 80% 60% at 50% 38%, ${glowColor}28 0%, transparent 55%)`,
        }}
      />

      {/* Scanlines */}
      <div
        className="absolute inset-0 pointer-events-none z-[1]"
        style={{
          backgroundImage: 'repeating-linear-gradient(0deg, transparent 0px, transparent 3px, rgba(0,0,0,0.07) 3px, rgba(0,0,0,0.07) 4px)',
        }}
      />

      {/* ── SVG connection lines ────────────────────────────────────── */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none z-[10]">
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
                strokeDasharray={node.navigable ? '3 5' : '1 7'}
                initial={{ opacity: 0 }}
                animate={{
                  opacity: node.navigable ? 0.35 : 0.15,
                  transition: { delay: discoveryDelay(i) + 0.1, duration: 0.4 },
                }}
                exit={{ opacity: 0, transition: { duration: 0.08 } }}
              />
            );
          })}
        </AnimatePresence>
      </svg>

      {/* ── ARTIFACT SCENE ────────────────────────────────────────────── */}
      <motion.div
        key={artifact.slug}
        initial={{ opacity: 0, y: 6 }}
        animate={{
          opacity: 1, y: 0,
          transition: { duration: 0.25, ease: [0.25, 0, 0, 1] as [number, number, number, number] },
        }}
        exit={{ opacity: 0, transition: { duration: 0.12 } }}
        className="absolute z-20"
        style={{
          width: 'clamp(300px, 58vw, 680px)',
          left: '50%',
          top: `${CY}%`,
          transform: 'translate(-50%, -50%)',
        }}
      >
        {/* Frame — sharp corners, raw */}
        <div
          className="relative overflow-hidden"
          style={{
            height: 'clamp(200px, 40vh, 400px)',
            border: '1px solid rgba(255,255,255,0.12)',
            // No rounded corners
            boxShadow: `0 0 60px ${glowColor}22, 0 20px 80px rgba(0,0,0,0.85)`,
          }}
        >
          {hasScene ? (
            <HeroSnapshot slug={artifact.slug} />
          ) : (
            <AmbientEnvironment artifact={artifact} />
          )}

          {/* Title caption */}
          <div
            className="absolute bottom-0 left-0 right-0 px-5 pb-4 pt-16"
            style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.95) 0%, transparent 100%)' }}
          >
            <div className="flex items-end justify-between gap-3">
              <h2 className="text-[18px] font-bold text-white leading-tight tracking-tight">
                {artifact.title}
              </h2>
              <span className="text-[10px] text-white/45 flex-shrink-0 pb-0.5 tabular-nums">
                {artifact.startYear}
                {artifact.endYear ? `–${String(artifact.endYear).slice(2)}` : '+'}
              </span>
            </div>
          </div>
        </div>

        {/* Description */}
        <p className="mt-2.5 text-[10px] text-white/42 leading-relaxed line-clamp-2 text-center px-4">
          {artifact.shortDescription}
        </p>
      </motion.div>

      {/* ── ECOSYSTEM NODES ──────────────────────────────────────────── */}
      <AnimatePresence>
        {ecosystem.map((node, i) => (
          <EcosystemNodeDot
            key={`${artifact.slug}-${node.id}`}
            node={node}
            index={i}
            onNavigate={onNavigate}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────

function EcosystemNodeDot({
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
  const nodeColor = sym.glyphColor ?? '#94a3b8';
  const delay = discoveryDelay(index);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{
        opacity: 1,
        transition: { delay, duration: 0.2 },
      }}
      exit={{ opacity: 0, transition: { duration: 0.08 } }}
      style={{
        position: 'absolute',
        left: `calc(${CX}% + ${x}%)`,
        top: `calc(${CY}% + ${y}%)`,
        transform: 'translate(-50%, -50%)',
        zIndex: 30,
        fontFamily: '"Courier New", Courier, monospace',
      }}
    >
      <motion.button
        onClick={() => node.navigable && onNavigate(node.id)}
        disabled={!node.navigable}
        whileHover={node.navigable ? { scale: 1.1 } : undefined}
        className="group flex flex-col items-center gap-1.5 outline-none"
        style={{ cursor: node.navigable ? 'crosshair' : 'default' }}
      >
        {/* Square node body */}
        <NodeSquare node={node} color={nodeColor} />

        {/* Label */}
        <div className="flex flex-col items-center gap-0.5 max-w-[88px]">
          <span
            className="text-[9px] uppercase tracking-[0.1em] leading-tight text-center"
            style={{
              color: node.navigable ? 'rgba(255,255,255,0.78)' : 'rgba(255,255,255,0.32)',
            }}
          >
            <span className="group-hover:text-white/95 transition-colors duration-100">
              {node.label}
            </span>
          </span>
          {node.navigable && (
            <span
              className="text-[7px] tracking-widest uppercase opacity-0 group-hover:opacity-100 transition-opacity duration-100"
              style={{ color: nodeColor }}
            >
              enter →
            </span>
          )}
        </div>
      </motion.button>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────

function NodeSquare({
  node,
  color,
}: {
  node: EcosystemNode;
  color: string;
}) {
  const isNavigable = node.navigable;
  const isStrange = node.relation === 'strange';
  const isCulture = !isNavigable;
  const size = isNavigable ? 36 : 24;

  return (
    <div className="relative group-hover:outline outline-1" style={{ outlineColor: `${color}80` }}>
      {/* Pulsing halo for strange jumps */}
      {isStrange && isNavigable && (
        <motion.div
          animate={{ scale: [1, 1.8, 1], opacity: [0.4, 0, 0.4] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute inset-0 pointer-events-none"
          style={{ border: `1px solid ${color}60`, background: `${color}10` }}
        />
      )}

      {/* Square body */}
      <div
        style={{
          width: size,
          height: size,
          background: `${color}${isNavigable ? '1a' : '0c'}`,
          border: `1px ${isCulture ? 'dashed' : 'solid'} ${color}${isNavigable ? '55' : '25'}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          // deliberately no border-radius — raw 1990s aesthetic
        }}
      >
        {isNavigable && (
          <div
            style={{
              width: 4,
              height: 4,
              background: color,
              opacity: 0.7,
            }}
          />
        )}
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
      {/* Year watermark */}
      <span
        className="absolute font-black text-white/[0.06] select-none pointer-events-none leading-none"
        style={{ fontSize: '28vw', letterSpacing: '-0.05em' }}
      >
        {artifact.startYear}
      </span>

      {/* Phosphor scanlines overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.15) 2px, rgba(0,0,0,0.15) 3px)',
        }}
      />

      {/* Artifact type stamp */}
      <span className="absolute top-3 left-4 text-[8px] tracking-[0.3em] uppercase text-white/28">
        {artifact.type}
      </span>

      {/* Corner bracket decoration */}
      <span className="absolute top-3 right-4 text-[8px] text-white/15">
        [{artifact.startYear}]
      </span>
    </div>
  );
}
