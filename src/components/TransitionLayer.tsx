'use client';

import { AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';

interface Props {
  children: React.ReactNode;
}

export default function TransitionLayer({ children }: Props) {
  const pathname = usePathname();

  return (
    <AnimatePresence mode="wait" initial={false}>
      <div key={pathname}>
        {children}
      </div>
    </AnimatePresence>
  );
}
