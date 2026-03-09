'use client';

import { useState, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import WorldView from './WorldView';
import PlaceView from './PlaceView';
import ArtifactStage from './ArtifactStage';
import TimelineBar, { getActiveEra, ERA_ATMOSPHERE } from './TimelineBar';
import { getTerritoriesForYear, getAllPlaces, type Territory, type Place } from '@/data/atlasWorld';
import { getArtifact } from '@/data/seed';
import type { Artifact } from '@/lib/types';

type Level = 'world' | 'place' | 'artifact';

interface V2State {
  year: number;
  level: Level;
  territory: Territory | null;
  place: Place | null;
  artifact: Artifact | null;
}

const INITIAL_YEAR = 1995;

export default function AtlasV2() {
  const [state, setState] = useState<V2State>({
    year: INITIAL_YEAR,
    level: 'world',
    territory: null,
    place: null,
    artifact: null,
  });

  const territories = getTerritoriesForYear(state.year);
  const activeEra = getActiveEra(state.year);
  const atmosphere = ERA_ATMOSPHERE[activeEra.year] ?? ERA_ATMOSPHERE[1991];

  const enterTerritory = useCallback((territory: Territory) => {
    setState((prev) => ({ ...prev, level: 'place', territory }));
  }, []);

  const enterPlace = useCallback((place: Place) => {
    const artifact = getArtifact(place.slug);
    if (!artifact) return;
    setState((prev) => ({ ...prev, level: 'artifact', place, artifact }));
  }, []);

  const navigateToArtifact = useCallback((slug: string) => {
    const artifact = getArtifact(slug);
    if (!artifact) return;
    const place = getAllPlaces().find((p) => p.slug === slug) ?? null;
    setState((prev) => ({ ...prev, level: 'artifact', place, artifact }));
  }, []);

  const goBack = useCallback(() => {
    setState((prev) => {
      if (prev.level === 'artifact') return { ...prev, level: 'place', artifact: null };
      if (prev.level === 'place') return { ...prev, level: 'world', territory: null, place: null, artifact: null };
      return prev;
    });
  }, []);

  const setYear = useCallback((year: number) => {
    setState((prev) => ({ ...prev, year }));
  }, []);

  const backLabel =
    state.level === 'artifact'
      ? (state.territory?.label ?? 'back')
      : state.level === 'place'
        ? 'world'
        : null;

  return (
    <div
      className="relative w-full h-screen overflow-hidden flex flex-col"
      style={{
        background: atmosphere,
        transition: 'background 0.7s ease',
      }}
    >
      {/* Floating nav — minimal, sits above content */}
      <div className="absolute top-0 left-0 right-0 z-50 flex items-start justify-between px-6 pt-5 pointer-events-none">
        {/* Logo */}
        <a
          href="/"
          className="pointer-events-auto text-[9px] tracking-[0.28em] uppercase text-white/30 hover:text-white/65 transition-colors"
        >
          Atlas
        </a>

        {/* Back */}
        <AnimatePresence>
          {backLabel && (
            <motion.button
              key="back"
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              onClick={goBack}
              className="pointer-events-auto flex items-center gap-1.5 text-[9px] text-white/35 hover:text-white/75 transition-colors"
            >
              ← {backLabel}
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* Breadcrumb — only shows when inside territory or artifact */}
      <AnimatePresence>
        {state.territory && (
          <motion.div
            key="crumb"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute top-5 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 pointer-events-none"
          >
            <button
              onClick={() => setState(p => ({ ...p, level: 'world', territory: null, place: null, artifact: null }))}
              className="pointer-events-auto text-[9px] text-white/25 hover:text-white/55 transition-colors"
            >
              world
            </button>

            {state.territory && (
              <>
                <span className="text-white/12 text-[9px]">›</span>
                <button
                  onClick={() => setState(p => ({ ...p, level: 'place', place: null, artifact: null }))}
                  className="pointer-events-auto text-[9px] transition-colors"
                  style={{ color: state.level === 'place' ? activeEra.color : 'rgba(255,255,255,0.25)' }}
                >
                  {state.territory.label}
                </button>
              </>
            )}

            {state.artifact && (
              <>
                <span className="text-white/12 text-[9px]">›</span>
                <span className="text-[9px] text-white/55">{state.artifact.title}</span>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main stage — full bleed */}
      <div className="flex-1 relative overflow-hidden">
        <AnimatePresence mode="wait">
          {state.level === 'world' && (
            <motion.div
              key="world"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, transition: { duration: 0.18 } }}
              className="absolute inset-0"
            >
              <WorldView
                territories={territories}
                year={state.year}
                eraColor={activeEra.color}
                onEnterTerritory={enterTerritory}
              />
            </motion.div>
          )}

          {state.level === 'place' && state.territory && (
            <motion.div
              key={`place-${state.territory.id}`}
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0, transition: { duration: 0.3, ease: [0.25, 0, 0, 1] as [number, number, number, number] } }}
              exit={{ opacity: 0, x: -24, transition: { duration: 0.18 } }}
              className="absolute inset-0"
            >
              <PlaceView
                territory={state.territory}
                year={state.year}
                onEnterPlace={enterPlace}
              />
            </motion.div>
          )}

          {state.level === 'artifact' && state.artifact && (
            <motion.div
              key={`artifact-${state.artifact.slug}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { duration: 0.35 } }}
              exit={{ opacity: 0, transition: { duration: 0.18 } }}
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
