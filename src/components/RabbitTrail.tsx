'use client';

import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useTrailStore } from '@/store/trail';

export default function RabbitTrail() {
  const router = useRouter();
  const { trail, jumpToIndex, clearTrail } = useTrailStore();

  if (trail.length === 0) return null;

  const handleJump = (index: number, slug: string) => {
    jumpToIndex(index);
    router.push(`/artifact/${slug}`);
  };

  // Show at most the last 8 entries to avoid overflow
  const visible = trail.length > 8 ? trail.slice(-8) : trail;
  const offset = trail.length - visible.length;

  return (
    <div className="flex items-center gap-0.5 min-w-0 flex-1 overflow-x-auto scrollbar-none">
      {offset > 0 && (
        <span className="text-[10px] text-white/20 flex-shrink-0 font-mono mr-1">
          +{offset}
        </span>
      )}
      <AnimatePresence initial={false}>
        {visible.map((entry, i) => {
          const globalIndex = offset + i;
          const isLast = globalIndex === trail.length - 1;

          return (
            <motion.div
              key={`${entry.slug}-${globalIndex}`}
              className="flex items-center gap-0.5 flex-shrink-0"
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -6 }}
              transition={{ duration: 0.15 }}
            >
              {(i > 0 || offset > 0) && (
                <span className="text-white/[0.12] text-[10px] select-none px-0.5">›</span>
              )}
              <button
                onClick={() => handleJump(globalIndex, entry.slug)}
                className={`text-[11px] px-1.5 py-0.5 rounded transition-all whitespace-nowrap focus:outline-none ${
                  isLast
                    ? 'text-white/80 font-medium'
                    : 'text-white/25 hover:text-white/55 hover:bg-white/[0.04]'
                }`}
              >
                {entry.title}
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>

      {trail.length > 1 && (
        <motion.button
          onClick={clearTrail}
          className="ml-1.5 flex-shrink-0 text-[10px] text-white/15 hover:text-white/40 transition-colors uppercase tracking-widest px-1"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          title="Clear trail"
        >
          Clear
        </motion.button>
      )}
    </div>
  );
}
