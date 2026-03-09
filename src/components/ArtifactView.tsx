'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import RabbitCard from '@/components/RabbitCard';
import AtlasCanvas from '@/components/AtlasCanvas';
import HeroSnapshot, { hasHeroSnapshot } from '@/components/HeroSnapshot';
import ExpandOverlay from '@/components/ExpandOverlay';
import { useTrailStore } from '@/store/trail';
import { useUIStore } from '@/store/ui';
import type { Artifact, Connection } from '@/lib/types';

interface Props {
  artifact: Artifact;
  connections: Connection[];
}

const TYPE_LABELS: Record<string, string> = {
  platform: 'Platform',
  protocol: 'Protocol',
  software: 'Software',
  community: 'Community',
  format: 'Format',
  phenomenon: 'Phenomenon',
  service: 'Service',
  tool: 'Tool',
};

export default function ArtifactView({ artifact, connections }: Props) {
  const addToTrail = useTrailStore((s) => s.addToTrail);
  const viewMode = useUIStore((s) => s.viewMode);
  const setViewMode = useUIStore((s) => s.setViewMode);
  const [expandOpen, setExpandOpen] = useState(false);

  // Add to trail whenever the artifact changes; do NOT reset viewMode here
  // so map mode persists naturally across navigation
  useEffect(() => {
    addToTrail({ slug: artifact.slug, title: artifact.title });
  }, [artifact.slug, artifact.title, addToTrail]);

  const yearRange = artifact.endYear
    ? `${artifact.startYear} – ${artifact.endYear}`
    : `${artifact.startYear} – present`;

  const hasScene = hasHeroSnapshot(artifact.slug);

  // In map mode, render the full-screen atlas canvas directly (no hero, no cards)
  if (viewMode === 'map') {
    return (
      <motion.div
        key={`${artifact.slug}-map`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25, ease: 'easeInOut' }}
      >
        <AtlasCanvas currentArtifactSlug={artifact.slug} artifact={artifact} />
      </motion.div>
    );
  }

  return (
    <>
      <motion.div
        key={artifact.slug}
        className="flex flex-col"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
      >
        {/* ── Hero ───────────────────────────────────────────────────────── */}
        <div
          className="relative w-full cursor-pointer group/hero"
          style={{ height: '46vh', minHeight: '300px', maxHeight: '520px' }}
          onClick={() => setExpandOpen(true)}
          role="button"
          aria-label={`Expand ${artifact.title}`}
        >
          {hasScene ? (
            <HeroSnapshot slug={artifact.slug} />
          ) : (
            <>
              <div className="absolute inset-0" style={{ background: artifact.gradient }} />
              <div
                className="absolute inset-0 opacity-30"
                style={{ backgroundImage: 'radial-gradient(ellipse at 30% 50%, rgba(255,255,255,0.04) 0%, transparent 70%)' }}
              />
            </>
          )}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent from-40% via-[#08080d]/50 to-[#08080d]" />

          <div className="absolute top-4 right-4 flex items-center gap-1.5 rounded-md border border-white/20 bg-black/50 px-2.5 py-1.5 backdrop-blur-sm opacity-0 group-hover/hero:opacity-100 transition-opacity">
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none" className="text-white/60">
              <path d="M1 4V1h3M6 1h3v3M9 6v3H6M4 9H1V6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="text-[10px] text-white/60 font-medium">Expand</span>
          </div>

          <div className="absolute bottom-0 left-0 right-0 px-5 md:px-8 pb-8">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08, duration: 0.5, ease: 'easeOut' }}
            >
              <div className="flex items-center gap-2.5 mb-3">
                <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-white/35 border border-white/15 rounded px-2 py-0.5">
                  {TYPE_LABELS[artifact.type] ?? artifact.type}
                </span>
                <span className="text-[11px] font-mono text-white/25 tracking-wide">{yearRange}</span>
              </div>
              <h1 className="text-4xl md:text-[52px] font-bold text-white leading-[1.05] tracking-tight mb-3">
                {artifact.title}
              </h1>
              <p className="text-[15px] text-white/55 leading-relaxed max-w-xl font-light">
                {artifact.shortDescription}
              </p>
            </motion.div>
          </div>
        </div>

        {/* ── View Mode Toggle ──────────────────────────────────────────── */}
        <div className="bg-[#08080d] px-5 md:px-8 pt-5 pb-0 flex items-center justify-between">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.18, duration: 0.35 }}
            className="flex items-center gap-1 rounded-lg border border-white/[0.07] bg-white/[0.03] p-1"
          >
            <button
              onClick={() => setViewMode('explore')}
              className={`relative flex items-center gap-1.5 rounded-md px-3.5 py-1.5 text-xs font-medium transition-all duration-200 ${
                viewMode === 'explore' ? 'text-white' : 'text-white/30 hover:text-white/60'
              }`}
            >
              {viewMode === 'explore' && (
                <motion.div layoutId="view-indicator"
                  className="absolute inset-0 rounded-md bg-white/[0.08]"
                  transition={{ type: 'spring', bounce: 0.2, duration: 0.35 }} />
              )}
              <svg width="11" height="11" viewBox="0 0 11 11" fill="none" className="relative z-10">
                <rect x="0.5" y="0.5" width="4" height="4" rx="1" stroke="currentColor" strokeWidth="1.1" />
                <rect x="6.5" y="0.5" width="4" height="4" rx="1" stroke="currentColor" strokeWidth="1.1" />
                <rect x="0.5" y="6.5" width="4" height="4" rx="1" stroke="currentColor" strokeWidth="1.1" />
                <rect x="6.5" y="6.5" width="4" height="4" rx="1" stroke="currentColor" strokeWidth="1.1" />
              </svg>
              <span className="relative z-10">Explore</span>
            </button>

            <button
              onClick={() => setViewMode('map')}
              className="relative flex items-center gap-1.5 rounded-md px-3.5 py-1.5 text-xs font-medium transition-all duration-200 text-white/30 hover:text-white/60"
            >
              {/* indicator not shown — we're always in explore here */}
              <svg width="11" height="11" viewBox="0 0 11 11" fill="none" className="relative z-10">
                <circle cx="5.5" cy="5.5" r="4.5" stroke="currentColor" strokeWidth="1.1" />
                <circle cx="5.5" cy="5.5" r="1.5" fill="currentColor" fillOpacity="0.6" />
                <line x1="5.5" y1="1" x2="5.5" y2="10" stroke="currentColor" strokeWidth="0.8" strokeOpacity="0.4" />
                <line x1="1" y1="5.5" x2="10" y2="5.5" stroke="currentColor" strokeWidth="0.8" strokeOpacity="0.4" />
              </svg>
              <span className="relative z-10">Atlas</span>
            </button>
          </motion.div>

          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.22, duration: 0.3 }}
            className="text-[10px] font-mono text-white/15"
          >
            {connections.length} path{connections.length !== 1 ? 's' : ''}
          </motion.span>
        </div>

        {/* ── Rabbit cards ──────────────────────────────────────────────── */}
        <div className="bg-[#08080d]">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.12, duration: 0.22, ease: 'easeOut' }}
            className="px-5 md:px-8 pt-5 pb-14"
          >
            {connections.length === 0 ? (
              <p className="text-white/20 text-sm">No connections found.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
                {connections.map((conn, index) => (
                  <RabbitCard
                    key={conn.artifact.slug}
                    connection={conn}
                    fromArtifact={artifact}
                    index={index}
                  />
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </motion.div>

      <ExpandOverlay
        artifact={artifact}
        isOpen={expandOpen}
        onClose={() => setExpandOpen(false)}
      />
    </>
  );
}
