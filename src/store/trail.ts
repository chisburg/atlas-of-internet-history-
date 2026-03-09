'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface TrailEntry {
  slug: string;
  title: string;
}

interface TrailStore {
  trail: TrailEntry[];
  addToTrail: (entry: TrailEntry) => void;
  jumpToIndex: (index: number) => void;
  clearTrail: () => void;
}

export const useTrailStore = create<TrailStore>()(
  persist(
    (set) => ({
      trail: [],

      addToTrail: (entry) =>
        set((state) => {
          const last = state.trail[state.trail.length - 1];
          if (last?.slug === entry.slug) return state;
          return { trail: [...state.trail, entry] };
        }),

      jumpToIndex: (index) =>
        set((state) => ({
          trail: state.trail.slice(0, index + 1),
        })),

      clearTrail: () => set({ trail: [] }),
    }),
    { name: 'atlas-rabbit-trail' }
  )
);
