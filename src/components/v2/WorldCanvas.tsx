'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { WORLD, type Territory, type Place } from '@/data/atlasWorld';

interface Props {
  activeYear: number;
  onEnterPlace: (place: Place) => void;
  onHoverEra: (year: number) => void;
}

// Fixed screen positions for each territory hub (% of stage)
const HUB: Record<string, { left: number; top: number }> = {
  'early-web':   { left: 7,  top: 16 },
  'messaging':   { left: 6,  top: 56 },
  'knowledge':   { left: 51, top: 11 },
  'creative':    { left: 58, top: 48 },
  'subculture':  { left: 25, top: 68 },
  'social':      { left: 56, top: 70 },
};

/**
 * Fan of N place nodes spreading BELOW a territory hub.
 * Returns positions as % of stage container.
 */
function fanPositions(
  hub: { left: number; top: number },
  n: number,
): Array<{ left: number; top: number }> {
  if (n === 0) return [];
  if (n === 1) return [{ left: hub.left, top: hub.top + 11 }];
  const halfSpread = 52; // degrees each side from "straight down" (90°)
  return Array.from({ length: n }, (_, i) => {
    const deg = 90 - halfSpread + (2 * halfSpread / (n - 1)) * i;
    const rad = (deg * Math.PI) / 180;
    return {
      left: hub.left + Math.cos(rad) * 10.5,
      top:  hub.top  + Math.sin(rad) * 10.5 * 0.65,
    };
  });
}

export default function WorldCanvas({ activeYear, onEnterPlace, onHoverEra }: Props) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const hoveredTerritory = WORLD.find(t => t.id === hoveredId) ?? null;
  const hoveredHub = hoveredTerritory ? HUB[hoveredTerritory.id] : null;
  const hoveredPositions = hoveredTerritory && hoveredHub
    ? fanPositions(hoveredHub, hoveredTerritory.places.length)
    : [];

  return (
    <div className="absolute inset-0 overflow-hidden" style={{ fontFamily: '"Courier New", Courier, monospace' }}>

      {/* Scanlines — subtle CRT texture */}
      <div
        className="absolute inset-0 pointer-events-none z-[1]"
        style={{
          backgroundImage: 'repeating-linear-gradient(0deg, transparent 0px, transparent 3px, rgba(0,0,0,0.07) 3px, rgba(0,0,0,0.07) 4px)',
        }}
      />

      {/* ── SVG connection lines ─────────────────────────────────────── */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none z-[2]">
        {hoveredTerritory && hoveredHub && hoveredPositions.map((pos, i) => {
          const isActive = hoveredTerritory.startYear <= activeYear;
          return (
            <motion.line
              key={`${hoveredTerritory.id}-l${i}`}
              x1={`${hoveredHub.left}%`}
              y1={`${hoveredHub.top}%`}
              x2={`${pos.left}%`}
              y2={`${pos.top}%`}
              stroke={isActive ? hoveredTerritory.color : '#666'}
              strokeWidth="0.7"
              strokeOpacity={isActive ? 0.4 : 0.12}
              strokeDasharray="2 5"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { delay: i * 0.03, duration: 0.12 } }}
            />
          );
        })}
      </svg>

      {/* ── Territory hubs ─────────────────────────────────────────────── */}
      {WORLD.map((territory) => {
        const hub = HUB[territory.id];
        if (!hub) return null;
        const isActive = territory.startYear <= activeYear;
        const isHovered = hoveredId === territory.id;

        return (
          <button
            key={territory.id}
            onMouseEnter={() => {
              setHoveredId(territory.id);
              onHoverEra(territory.startYear); // always jump — discovery mechanic
            }}
            onMouseLeave={() => setHoveredId(null)}
            className="absolute outline-none text-left"
            style={{
              left: `${hub.left}%`,
              top: `${hub.top}%`,
              transform: 'translate(0, -50%)',
              zIndex: 10,
              opacity: isActive ? 1 : 0.14,
              transition: 'opacity 0.25s',
              cursor: 'crosshair',
            }}
          >
            <div className="flex items-start gap-2">
              {/* Square status indicator */}
              <div
                style={{
                  width: 7,
                  height: 7,
                  marginTop: 3,
                  flexShrink: 0,
                  background: isHovered && isActive ? 'white' : isActive ? territory.color : '#444',
                  transition: 'background 0.1s',
                  outline: isHovered ? `1px solid ${territory.color}` : 'none',
                  outlineOffset: 2,
                }}
              />

              <div>
                {/* Territory name */}
                <div
                  className="text-[12px] tracking-[0.16em] uppercase leading-none"
                  style={{
                    color: isActive
                      ? isHovered ? 'rgba(255,255,255,0.95)' : territory.color
                      : '#444',
                    textShadow: isHovered && isActive
                      ? `0 0 14px ${territory.color}70`
                      : 'none',
                    transition: 'color 0.1s',
                  }}
                >
                  {territory.label}
                </div>

                {/* Year stamp */}
                <div
                  className="text-[7px] tracking-widest mt-0.5 leading-none"
                  style={{ color: isActive ? `${territory.color}50` : '#2a2a2a' }}
                >
                  EST.{territory.startYear}
                </div>
              </div>
            </div>
          </button>
        );
      })}

      {/* ── Place sub-nodes (appear on territory hover) ──────────────── */}
      <AnimatePresence>
        {hoveredTerritory && hoveredHub && hoveredPositions.map((pos, i) => {
          const place = hoveredTerritory.places[i];
          if (!place) return null;
          const isActive = hoveredTerritory.startYear <= activeYear;
          return (
            <motion.div
              key={`${hoveredTerritory.id}-p-${place.slug}`}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{
                opacity: 1,
                scale: 1,
                transition: { delay: i * 0.04 + 0.06, duration: 0.15 },
              }}
              exit={{ opacity: 0, transition: { duration: 0.06 } }}
              style={{
                position: 'absolute',
                left: `${pos.left}%`,
                top: `${pos.top}%`,
                transform: 'translate(-50%, -50%)',
                zIndex: 15,
              }}
            >
              <button
                onClick={() => isActive && onEnterPlace(place)}
                disabled={!isActive}
                className="group flex flex-col items-center gap-[5px] outline-none"
                style={{ cursor: isActive ? 'crosshair' : 'default', fontFamily: 'inherit' }}
              >
                {/* Place dot */}
                <div
                  style={{
                    width: 5,
                    height: 5,
                    background: hoveredTerritory.color,
                    opacity: isActive ? 0.85 : 0.25,
                    transition: 'transform 0.1s',
                  }}
                  className="group-hover:scale-150"
                />

                {/* Label */}
                <span
                  className="text-[9px] uppercase tracking-[0.12em] whitespace-nowrap leading-none"
                  style={{
                    color: isActive
                      ? 'rgba(255,255,255,0.65)'
                      : 'rgba(255,255,255,0.15)',
                  }}
                >
                  <span className="group-hover:text-white/95 transition-colors duration-100">
                    {place.label}
                  </span>
                </span>
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>

      {/* Instruction ghost — fades quickly */}
      <motion.p
        initial={{ opacity: 0.3 }}
        animate={{ opacity: 0 }}
        transition={{ delay: 4, duration: 2 }}
        className="absolute bottom-6 left-0 right-0 text-center text-[8px] tracking-[0.3em] uppercase pointer-events-none z-[20]"
        style={{ color: 'rgba(255,255,255,0.2)', fontFamily: 'inherit' }}
      >
        hover to explore — click to enter
      </motion.p>
    </div>
  );
}
