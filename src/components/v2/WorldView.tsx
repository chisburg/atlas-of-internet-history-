'use client';

import { motion, AnimatePresence } from 'framer-motion';
import type { Territory } from '@/data/atlasWorld';
import { getActiveEra } from './TimelineBar';

interface Props {
  territories: Territory[];
  year: number;
  eraColor: string;
  onEnterTerritory: (territory: Territory) => void;
}

/**
 * Fixed spatial positions for each territory — like a world map.
 * Territories feel like regions, not a list.
 */
const TERRITORY_POSITIONS: Record<string, { left: string; top: string }> = {
  'early-web':   { left: '7%',  top: '14%' },
  'messaging':   { left: '5%',  top: '54%' },
  'knowledge':   { left: '50%', top: '10%' },
  'creative':    { left: '58%', top: '48%' },
  'subculture':  { left: '26%', top: '68%' },
  'social':      { left: '55%', top: '70%' },
};

export default function WorldView({ territories, year, eraColor, onEnterTerritory }: Props) {
  const era = getActiveEra(year);

  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Large era year — ambient depth watermark */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
        <motion.span
          key={era.year}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          className="font-black leading-none tracking-tighter"
          style={{
            fontSize: '28vw',
            color: `${eraColor}0a`,
          }}
        >
          {era.year}
        </motion.span>
      </div>

      {/* Era label — floats top left, anchors context */}
      <div className="absolute top-14 left-8 pointer-events-none">
        <motion.p
          key={`sub-${era.year}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-[9px] tracking-[0.3em] uppercase mb-0.5"
          style={{ color: `${eraColor}70` }}
        >
          {era.sublabel}
        </motion.p>
        <motion.h1
          key={`h-${era.year}`}
          initial={{ opacity: 0, x: -4 }}
          animate={{ opacity: 1, x: 0, transition: { delay: 0.05 } }}
          className="text-[1.1rem] font-light tracking-widest"
          style={{ color: `${eraColor}55` }}
        >
          {era.label}
        </motion.h1>
      </div>

      {/* Territories — spatially scattered across the screen */}
      <AnimatePresence>
        {territories.map((territory) => {
          const pos = TERRITORY_POSITIONS[territory.id];
          if (!pos) return null;
          return (
            <TerritoryZone
              key={territory.id}
              territory={territory}
              position={pos}
              eraColor={eraColor}
              onClick={() => onEnterTerritory(territory)}
            />
          );
        })}
      </AnimatePresence>

      {territories.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <p className="text-white/20 text-sm tracking-widest">— select a later era —</p>
        </div>
      )}
    </div>
  );
}

function TerritoryZone({
  territory,
  position,
  eraColor,
  onClick,
}: {
  territory: Territory;
  position: { left: string; top: string };
  eraColor: string;
  onClick: () => void;
}) {
  return (
    <motion.button
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.25, 0, 0, 1] as [number, number, number, number] } }}
      exit={{ opacity: 0, y: 8, transition: { duration: 0.2 } }}
      onClick={onClick}
      whileHover={{ x: 6, transition: { duration: 0.15 } }}
      className="absolute group flex flex-col items-start text-left outline-none cursor-pointer"
      style={{ left: position.left, top: position.top }}
    >
      {/* Colored rule */}
      <motion.div
        className="h-[1px] mb-2.5 rounded-full"
        style={{ background: territory.color, width: 20 }}
        whileHover={{ width: 48, transition: { duration: 0.18 } }}
      />

      {/* Name — large and readable */}
      <h2
        className="text-[1.9rem] font-light leading-none tracking-tight transition-colors duration-200 whitespace-nowrap"
        style={{ color: 'rgba(255,255,255,0.62)' }}
      >
        <span className="group-hover:text-white/92 transition-colors duration-200">
          {territory.label}
        </span>
      </h2>

      {/* Sublabel — appears on hover */}
      <p
        className="mt-1.5 text-[10px] text-white/0 group-hover:text-white/38 transition-colors duration-200 leading-relaxed max-w-[220px]"
      >
        {territory.sublabel}
      </p>
    </motion.button>
  );
}
