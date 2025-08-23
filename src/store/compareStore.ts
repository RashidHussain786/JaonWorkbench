import { create } from 'zustand';
import { ViewMode } from '../common/types';

interface CompareStore {
  isComparing: boolean;
  compareMode: 'file' | 'folder' | 'json' | null;
  leftContent: string;
  rightContent: string;
  leftMode: ViewMode;
  rightMode: ViewMode;
  leftSearchQuery: string;
  rightSearchQuery: string;
  originalJsonString: string;

  setIsComparing: (isComparing: boolean) => void;
  setCompareMode: (mode: 'file' | 'folder' | 'json' | null) => void;
  setLeftContent: (content: string) => void;
  setRightContent: (content: string) => void;
  setLeftMode: (mode: ViewMode) => void;
  setRightMode: (mode: ViewMode) => void;
  setLeftSearchQuery: (query: string) => void;
  setRightSearchQuery: (query: string) => void;
  setOriginalJsonString: (str: string) => void;
}

export const useCompareStore = create<CompareStore>((set) => ({
  isComparing: false,
  compareMode: null,
  leftContent: '',
  rightContent: '',
  leftMode: 'code',
  rightMode: 'code',
  leftSearchQuery: '',
  rightSearchQuery: '',
  originalJsonString: '',

  setIsComparing: (isComparing) => set({ isComparing: isComparing }),
  setCompareMode: (mode) => set({ compareMode: mode }),
  setLeftContent: (content) => set({ leftContent: content }),
  setRightContent: (content) => set({ rightContent: content }),
  setLeftMode: (mode) => set({ leftMode: mode }),
  setRightMode: (mode) => set({ rightMode: mode }),
  setLeftSearchQuery: (query) => set({ leftSearchQuery: query }),
  setRightSearchQuery: (query) => set({ rightSearchQuery: query }),
  setOriginalJsonString: (str) => set({ originalJsonString: str }),
}));
