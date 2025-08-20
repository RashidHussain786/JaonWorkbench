import { create } from 'zustand';
import { ViewMode } from '../common/types';

interface JsonStore {
  activeMode: ViewMode;
  jsonString: string;
  parsedJson: any;
  isValidJson: boolean;
  searchQuery: string;
  inputType: 'json' | 'base64'; // New: To determine if content is JSON or Base64
  isLoading: boolean; // Added

  setActiveMode: (mode: ViewMode) => void;
  setJsonString: (json: string) => void;
  setParsedJson: (json: any) => void;
  setIsValidJson: (isValid: boolean) => void;
  setSearchQuery: (query: string) => void;
  setInputType: (inputType: 'json' | 'base64') => void; // New: Setter for inputType
  setLoading: (loading: boolean) => void; // Added
}

export const useJsonStore = create<JsonStore>((set) => ({
  activeMode: 'code',
  jsonString: '',
  parsedJson: null,
  isValidJson: true,
  searchQuery: '',
  inputType: 'json', // Default to JSON
  isLoading: false, // Added

  setActiveMode: (mode) => set({ activeMode: mode }),
  setJsonString: (json) => set({ jsonString: json }),
  setParsedJson: (json) => set({ parsedJson: json }),
  setIsValidJson: (isValid) => set({ isValidJson: isValid }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  setInputType: (inputType) => set({ inputType: inputType }),
  setLoading: (loading) => set({ isLoading: loading }), // Added
}));