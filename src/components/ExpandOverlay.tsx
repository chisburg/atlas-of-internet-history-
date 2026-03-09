'use client';

import { motion, AnimatePresence } from 'framer-motion';
import HeroSnapshot, { hasHeroSnapshot } from '@/components/HeroSnapshot';
import type { Artifact } from '@/lib/types';

const WAYBACK_BASE = 'https://web.archive.org/web/*/';

const ARCHIVE_URLS: Record<string, string> = {
  geocities: 'https://web.archive.org/web/19961017/http://www.geocities.com/',
  myspace: 'https://web.archive.org/web/20040101/http://www.myspace.com/',
  napster: 'https://web.archive.org/web/20010101/http://www.napster.com/',
  flash: 'https://web.archive.org/web/20020101/http://www.macromedia.com/software/flash/',
  youtube: 'https://web.archive.org/web/20060101/http://www.youtube.com/',
  newgrounds: 'https://web.archive.org/web/20030101/http://www.newgrounds.com/',
  wikipedia: 'https://web.archive.org/web/20020101/http://www.wikipedia.org/',
  '4chan': 'https://web.archive.org/web/20041001/http://www.4chan.org/',
  reddit: 'https://web.archive.org/web/20060101/http://www.reddit.com/',
  facebook: 'https://web.archive.org/web/20040901/http://www.thefacebook.com/',
};

interface Props {
  artifact: Artifact;
  isOpen: boolean;
  onClose: () => void;
}

export default function ExpandOverlay({ artifact, isOpen, onClose }: Props) {
  const archiveUrl = ARCHIVE_URLS[artifact.slug] ?? `${WAYBACK_BASE}${artifact.slug}.com`;
  const yearRange = artifact.endYear
    ? `${artifact.startYear} – ${artifact.endYear}`
    : `${artifact.startYear} – present`;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-40 bg-black/80 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 pointer-events-none"
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.25, ease: [0.32, 0.72, 0, 1] }}
          >
            <div className="pointer-events-auto w-full max-w-4xl rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-[#0d0d14]">
              {/* Hero visual */}
              <div className="relative" style={{ height: '340px' }}>
                {hasHeroSnapshot(artifact.slug) ? (
                  <HeroSnapshot slug={artifact.slug} />
                ) : (
                  <div className="absolute inset-0" style={{ background: artifact.gradient }} />
                )}
                {/* Gradient fade */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-[#0d0d14]" />

                {/* Close button */}
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/60 border border-white/20 flex items-center justify-center text-white/70 hover:text-white hover:bg-black/80 transition-all z-10"
                  aria-label="Close"
                >
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M1 1l10 10M11 1L1 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                </button>

                {/* Title overlay */}
                <div className="absolute bottom-0 left-0 right-0 px-7 pb-6">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-white/35 border border-white/15 rounded px-2 py-0.5">
                      {artifact.type}
                    </span>
                    <span className="text-[11px] font-mono text-white/25">{yearRange}</span>
                  </div>
                  <h2 className="text-3xl md:text-4xl font-bold text-white leading-tight">
                    {artifact.title}
                  </h2>
                </div>
              </div>

              {/* Body */}
              <div className="px-7 py-5 flex items-start justify-between gap-6">
                <p className="text-[15px] text-white/60 leading-relaxed flex-1 font-light">
                  {artifact.shortDescription}
                </p>
                <a
                  href={archiveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-shrink-0 flex items-center gap-2 rounded-lg border border-white/15 bg-white/5 px-4 py-2.5 text-xs text-white/60 hover:text-white hover:bg-white/10 hover:border-white/25 transition-all"
                >
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M5 2H2a1 1 0 00-1 1v7a1 1 0 001 1h7a1 1 0 001-1V8M8 1h3m0 0v3m0-3L5 7" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  View in Wayback Machine
                </a>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
