import { create } from 'zustand';

export type ViewMode = 'explore' | 'map';

interface UIStore {
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
}

/**
 * Persists the current view mode (explore / map) across artifact navigation.
 * When a user is in map mode, navigating to the next artifact stays in map mode.
 */
export const useUIStore = create<UIStore>((set) => ({
  viewMode: 'explore',
  setViewMode: (viewMode) => set({ viewMode }),
}));
