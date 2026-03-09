'use client';

import { motion } from 'framer-motion';

export const ERAS = [
  { label: 'BBS & IRC',    year: 1988, sublabel: '1978–1990', color: '#22c55e' },
  { label: 'Early Web',    year: 1991, sublabel: '1991–1994', color: '#3b82f6' },
  { label: 'Browser Wars', year: 1995, sublabel: '1995–1998', color: '#a78bfa' },
  { label: 'Dot-Com Boom', year: 1999, sublabel: '1999–2002', color: '#f59e0b' },
  { label: 'Forum Age',    year: 2003, sublabel: '2003–2005', color: '#ef4444' },
  { label: 'Social Web',   year: 2006, sublabel: '2006–2009', color: '#60a5fa' },
  { label: 'Mobile Web',   year: 2010, sublabel: '2010–2015', color: '#2dd4bf' },
];

export type Era = {
  label: string;
  year: number;
  sublabel: string;
  color: string;
};

export function getActiveEra(year: number): Era {
  let active: Era = ERAS[0];
  for (const era of ERAS) {
    if (year >= era.year) active = era;
  }
  return active;
}

/** Atmosphere gradient keyed to era year — used by AtlasV2 as full-stage bg */
export const ERA_ATMOSPHERE: Record<number, string> = {
  1988: 'radial-gradient(ellipse 110% 80% at 10% 70%, #0a1f08 0%, #08080d 55%)',
  1991: 'radial-gradient(ellipse 110% 80% at 10% 48%, #080e24 0%, #08080d 55%)',
  1995: 'radial-gradient(ellipse 110% 80% at 22% 32%, #100820 0%, #08080d 55%)',
  1999: 'radial-gradient(ellipse 110% 80% at 75% 35%, #200a0e 0%, #08080d 55%)',
  2003: 'radial-gradient(ellipse 110% 80% at 40% 60%, #1e0808 0%, #08080d 55%)',
  2006: 'radial-gradient(ellipse 110% 80% at 18% 38%, #080e20 0%, #08080d 55%)',
  2010: 'radial-gradient(ellipse 110% 80% at 52% 22%, #081618 0%, #08080d 55%)',
};

interface Props {
  year: number;
  onYearChange: (year: number) => void;
}

export default function TimelineBar({ year, onYearChange }: Props) {
  const activeEra = getActiveEra(year);

  return (
    <div className="relative flex-shrink-0 h-[80px] bg-[#08080d] border-t border-white/[0.06] flex items-stretch">
      {ERAS.map((era) => {
        const isActive = activeEra.year === era.year;
        return (
          <button
            key={era.year}
            onClick={() => onYearChange(era.year)}
            className="relative flex-1 flex flex-col items-center justify-center gap-1 group cursor-pointer outline-none overflow-hidden"
          >
            {/* Colored era indicator — slides in from top when active */}
            {isActive && (
              <motion.div
                layoutId="era-indicator"
                className="absolute top-0 left-0 right-0 h-[3px]"
                style={{ background: era.color }}
                transition={{ type: 'spring', stiffness: 380, damping: 38 }}
              />
            )}

            {/* Active background wash */}
            {isActive && (
              <motion.div
                layoutId="era-bg"
                className="absolute inset-0"
                style={{ background: `${era.color}09` }}
                transition={{ type: 'spring', stiffness: 380, damping: 38 }}
              />
            )}

            {/* Era name */}
            <span
              className="relative text-[10px] tracking-[0.12em] uppercase leading-none font-medium transition-colors duration-150"
              style={{
                color: isActive ? era.color : 'rgba(255,255,255,0.22)',
              }}
            >
              {era.label}
            </span>

            {/* Date range */}
            <span
              className="relative text-[8px] font-mono leading-none transition-colors duration-150"
              style={{
                color: isActive
                  ? `${era.color}80`
                  : 'rgba(255,255,255,0.10)',
              }}
            >
              {era.sublabel}
            </span>

            {/* Hover state for inactive */}
            {!isActive && (
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                style={{ background: `${era.color}06` }}
              />
            )}

            {/* Right separator */}
            <div className="absolute right-0 top-4 bottom-4 w-[1px] bg-white/[0.04]" />
          </button>
        );
      })}
    </div>
  );
}
