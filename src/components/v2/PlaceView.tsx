'use client';

import { motion } from 'framer-motion';
import type { Territory, Place } from '@/data/atlasWorld';

interface Props {
  territory: Territory;
  year: number;
  onEnterPlace: (place: Place) => void;
}

export default function PlaceView({ territory, onEnterPlace }: Props) {
  return (
    <div className="absolute inset-0 flex flex-col overflow-hidden">
      {/* Territory ambient — subtle side glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse 60% 80% at 0% 50%, ${territory.color}12 0%, transparent 55%)`,
        }}
      />

      {/* Territory label — top left, minimal */}
      <motion.div
        initial={{ opacity: 0, x: -8 }}
        animate={{ opacity: 1, x: 0 }}
        className="absolute top-14 left-8"
      >
        <div className="flex items-center gap-2 mb-1">
          <div className="w-4 h-[1px]" style={{ background: territory.color }} />
          <span
            className="text-[9px] tracking-[0.25em] uppercase"
            style={{ color: territory.color }}
          >
            {territory.label}
          </span>
        </div>
      </motion.div>

      {/* Landmark names — fill the screen, large and explorable */}
      <div className="flex-1 flex items-center overflow-hidden pt-16">
        <motion.div
          initial="hidden"
          animate="show"
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.09 } } }}
          className="w-full px-8"
        >
          {territory.places.map((place, i) => (
            <LandmarkEntry
              key={place.slug}
              place={place}
              index={i}
              color={territory.color}
              onClick={() => onEnterPlace(place)}
            />
          ))}
        </motion.div>
      </div>
    </div>
  );
}

function LandmarkEntry({
  place,
  color,
  onClick,
}: {
  place: Place;
  index: number;
  color: string;
  onClick: () => void;
}) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 10 },
        show: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.38, ease: [0.25, 0, 0, 1] as [number, number, number, number] },
        },
      }}
    >
      <motion.button
        onClick={onClick}
        whileHover={{ x: 12, transition: { duration: 0.16 } }}
        className="group w-full text-left py-2 outline-none cursor-pointer flex items-center gap-4"
      >
        {/* Color rule reveals on hover */}
        <motion.div
          className="flex-shrink-0 h-[1px] rounded-full"
          style={{ background: color, width: 0 }}
          whileHover={{ width: 24 }}
          transition={{ duration: 0.18 }}
        />

        {/* Landmark name — large and bright */}
        <span
          className="text-[2rem] font-light leading-tight tracking-tight transition-colors duration-180 whitespace-nowrap"
          style={{ color: 'rgba(255,255,255,0.58)' }}
        >
          <span className="group-hover:text-white/92 transition-colors duration-180">
            {place.label}
          </span>
        </span>

        {/* Year — appears on hover */}
        <span
          className="text-[10px] font-mono text-white/0 group-hover:text-white/32 transition-colors duration-200 flex-shrink-0 tabular-nums pb-0.5"
        >
          {place.year}
        </span>
      </motion.button>
    </motion.div>
  );
}
