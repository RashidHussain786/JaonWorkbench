import { create } from 'zustand';
import { ThemeMode } from '../../../common/types';

interface ThemeStoreState {
  theme: ThemeMode;
}

interface ThemeStoreActions {
  setTheme: (theme: ThemeMode) => void;
}

export const useThemeStore = create<ThemeStoreState & ThemeStoreActions>((set) => ({
  theme: 'dark',
  setTheme: (theme: ThemeMode) => set({ theme }),
}));

export const useTheme = () => useThemeStore();
