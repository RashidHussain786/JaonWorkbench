import { create } from 'zustand';
import { ViewMode } from '../common/types';

interface JsonStore {
  activeMode: ViewMode;
  isLoading: boolean;
  searchQuery: string;
  
  setActiveMode: (mode: ViewMode) => void;
  setLoading: (loading: boolean) => void;
  setSearchQuery: (query: string) => void;
}

export const useJsonStore = create<JsonStore>((set) => ({
  activeMode: 'code',
  isLoading: false,
  searchQuery: '',

  setActiveMode: (mode) => set({ activeMode: mode }),
  setLoading: (isLoading) => set({ isLoading }),
  setSearchQuery: (query: string) => set({ searchQuery: query }),
}));