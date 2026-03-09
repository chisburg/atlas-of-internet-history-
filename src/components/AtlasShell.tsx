'use client';

import Link from 'next/link';
import RabbitTrail from '@/components/RabbitTrail';

interface Props {
  children: React.ReactNode;
}

export default function AtlasShell({ children }: Props) {
  return (
    <div className="flex flex-col min-h-dvh bg-[#08080d] text-white">
      {/* Top navigation bar */}
      <header className="sticky top-0 z-50 flex items-center gap-3 border-b border-white/[0.06] bg-[#08080d]/95 backdrop-blur-sm px-5 md:px-8 h-11">
        <Link
          href="/artifact/geocities"
          className="flex items-center gap-2 flex-shrink-0 group"
        >
          <span className="text-[11px] font-bold tracking-[0.2em] uppercase text-white/30 group-hover:text-white/60 transition-colors">
            Atlas
          </span>
          <span className="text-white/10 text-xs">·</span>
          <span className="text-[11px] text-white/20 tracking-wide">Internet History</span>
        </Link>
        <div className="w-px h-3.5 bg-white/[0.08] flex-shrink-0" />
        <RabbitTrail />
      </header>

      {/* Main content */}
      <main className="flex-1 min-h-0">
        {children}
      </main>

      {/* Footer hint — only shown when no trail */}
      <div className="px-5 md:px-8 py-3 flex items-center justify-between border-t border-white/[0.04]">
        <span className="text-[11px] text-white/15 tracking-wide">
          Navigate through internet history
        </span>
        <span className="text-[11px] font-mono text-white/10">
          v1 prototype
        </span>
      </div>
    </div>
  );
}
