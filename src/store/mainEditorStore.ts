import { create } from 'zustand';
import { ViewMode } from '../common/types';

interface MainEditorStore {
  activeMode: ViewMode;
  jsonString: string;
  parsedJson: any;
  isValidJson: boolean;
  searchQuery: string;
  inputType: 'json' | 'base64';
  isLoading: boolean;

  setActiveMode: (mode: ViewMode) => void;
  setJsonString: (json: string) => void;
  setParsedJson: (json: any) => void;
  setIsValidJson: (isValid: boolean) => void;
  setSearchQuery: (query: string) => void;
  setInputType: (inputType: 'json' | 'base64') => void;
  setLoading: (loading: boolean) => void;
}

export const useMainEditorStore = create<MainEditorStore>((set) => ({
  activeMode: 'code',
  jsonString: '',
  parsedJson: null,
  isValidJson: true,
  searchQuery: '',
  inputType: 'json',
  isLoading: false,

  setActiveMode: (mode) => set({ activeMode: mode }),
  setJsonString: (json) => set({ jsonString: json }),
  setParsedJson: (json) => set({ parsedJson: json }),
  setIsValidJson: (isValid) => set({ isValidJson: isValid }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  setInputType: (inputType) => set({ inputType: inputType }),
  setLoading: (loading) => set({ isLoading: loading }),
}));
