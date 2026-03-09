'use client';

import { useState, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import WorldCanvas from './WorldCanvas';
import ArtifactStage from './ArtifactStage';
import TimelineBar, { getActiveEra, ERA_ATMOSPHERE } from './TimelineBar';
import { getAllPlaces, type Place } from '@/data/atlasWorld';
import { getArtifact } from '@/data/seed';
import type { Artifact } from '@/lib/types';

type Mode = 'world' | 'artifact';

interface V2State {
  year: number;
  mode: Mode;
  place: Place | null;
  artifact: Artifact | null;
}

export default function AtlasV2() {
  const [state, setState] = useState<V2State>({
    year: 1995,
    mode: 'world',
    place: null,
    artifact: null,
  });

  const activeEra = getActiveEra(state.year);
  const atmosphere = ERA_ATMOSPHERE[activeEra.year] ?? ERA_ATMOSPHERE[1991];

  const enterPlace = useCallback((place: Place) => {
    const artifact = getArtifact(place.slug);
    if (!artifact) return;
    setState(prev => ({ ...prev, mode: 'artifact', place, artifact }));
  }, []);

  const navigateToArtifact = useCallback((slug: string) => {
    const artifact = getArtifact(slug);
    if (!artifact) return;
    const place = getAllPlaces().find(p => p.slug === slug) ?? null;
    setState(prev => ({ ...prev, mode: 'artifact', place, artifact }));
  }, []);

  const goToWorld = useCallback(() => {
    setState(prev => ({ ...prev, mode: 'world', place: null, artifact: null }));
  }, []);

  const setYear = useCallback((year: number) => {
    setState(prev => ({ ...prev, year }));
  }, []);

  return (
    <div
      className="relative w-full h-screen overflow-hidden flex flex-col"
      style={{
        background: atmosphere,
        transition: 'background 0.5s ease',
        fontFamily: '"Courier New", Courier, monospace',
      }}
    >
      {/* Floating minimal nav */}
      <div className="absolute top-0 left-0 right-0 z-50 flex items-start justify-between px-5 pt-4 pointer-events-none">
        <a
          href="/"
          className="pointer-events-auto text-[9px] tracking-[0.3em] uppercase text-white/22 hover:text-white/60 transition-colors"
        >
          Atlas
        </a>

        <AnimatePresence>
          {state.mode === 'artifact' && state.artifact && (
            <motion.button
              key="back"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={goToWorld}
              className="pointer-events-auto text-[9px] tracking-[0.2em] uppercase text-white/35 hover:text-white/75 transition-colors"
            >
              ← world
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* Artifact breadcrumb strip */}
      <AnimatePresence>
        {state.mode === 'artifact' && state.artifact && (
          <motion.div
            key="artifact-label"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute top-4 left-1/2 -translate-x-1/2 z-50 pointer-events-none"
          >
            <span
              className="text-[8px] tracking-[0.3em] uppercase"
              style={{ color: `${activeEra.color}60` }}
            >
              {activeEra.label} / {state.artifact.title}
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main stage — full bleed */}
      <div className="flex-1 relative overflow-hidden">
        <AnimatePresence mode="wait">
          {state.mode === 'world' && (
            <motion.div
              key="world"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, transition: { duration: 0.12 } }}
              className="absolute inset-0"
            >
              <WorldCanvas
                activeYear={state.year}
                onEnterPlace={enterPlace}
                onHoverEra={setYear}
              />
            </motion.div>
          )}

          {state.mode === 'artifact' && state.artifact && (
            <motion.div
              key={`artifact-${state.artifact.slug}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { duration: 0.22 } }}
              exit={{ opacity: 0, transition: { duration: 0.12 } }}
              className="absolute inset-0"
            >
              <ArtifactStage
                artifact={state.artifact}
                place={state.place}
                onNavigate={navigateToArtifact}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Timeline */}
      <TimelineBar year={state.year} onYearChange={setYear} />
    </div>
  );
}
