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

  // New state for comparison feature
  isComparing: boolean;
  compareMode: 'file' | 'folder' | 'json' | null;
  leftContent: string;
  rightContent: string;
  leftMode: ViewMode;
  rightMode: ViewMode;
  leftSearchQuery: string; // New
  rightSearchQuery: string; // New

  setActiveMode: (mode: ViewMode) => void;
  setJsonString: (json: string) => void;
  setParsedJson: (json: any) => void;
  setIsValidJson: (isValid: boolean) => void;
  setSearchQuery: (query: string) => void;
  setInputType: (inputType: 'json' | 'base64') => void; // New: Setter for inputType
  setLoading: (loading: boolean) => void; // Added

  // New setters for comparison feature
  setIsComparing: (isComparing: boolean) => void;
  setCompareMode: (mode: 'file' | 'folder' | 'json' | null) => void;
  setLeftContent: (content: string) => void;
  setRightContent: (content: string) => void;
  setLeftMode: (mode: ViewMode) => void;
  setRightMode: (mode: ViewMode) => void;
  setLeftSearchQuery: (query: string) => void; // New
  setRightSearchQuery: (query: string) => void; // New
}

export const useJsonStore = create<JsonStore>((set) => ({
  activeMode: 'code',
  jsonString: '',
  parsedJson: null,
  isValidJson: true,
  searchQuery: '',
  inputType: 'json', // Default to JSON
  isLoading: false, // Added

  // Initial state for comparison feature
  isComparing: false,
  compareMode: null,
  leftContent: '',
  rightContent: '',
  leftMode: 'code',
  rightMode: 'code',
  leftSearchQuery: '',
  rightSearchQuery: '',

  setActiveMode: (mode) => set({ activeMode: mode }),
  setJsonString: (json) => set({ jsonString: json }),
  setParsedJson: (json) => set({ parsedJson: json }),
  setIsValidJson: (isValid) => set({ isValidJson: isValid }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  setInputType: (inputType) => set({ inputType: inputType }),
  setLoading: (loading) => set({ isLoading: loading }), // Added

  // Setters for comparison feature
  setIsComparing: (isComparing) => set({ isComparing: isComparing }),
  setCompareMode: (mode) => set({ compareMode: mode }),
  setLeftContent: (content) => set({ leftContent: content }),
  setRightContent: (content) => set({ rightContent: content }),
  setLeftMode: (mode) => set({ leftMode: mode }),
  setRightMode: (mode) => set({ rightMode: mode }),
  setLeftSearchQuery: (query) => set({ leftSearchQuery: query }),
  setRightSearchQuery: (query) => set({ rightSearchQuery: query }),
}));