import { create } from 'zustand';
import { ViewMode } from '../common/types';
import { FolderFile } from '../features/folder-compare/types';

interface JsonStore {
  activeMode: ViewMode;
  jsonString: string;
  parsedJson: any;
  isValidJson: boolean;
  searchQuery: string;
  inputType: 'json' | 'base64';
  isLoading: boolean;

  // State for comparison feature
  isComparing: boolean;
  compareMode: 'file' | 'folder' | 'json' | null;
  leftContent: string;
  rightContent: string;
  leftMode: ViewMode;
  rightMode: ViewMode;
  leftSearchQuery: string;
  rightSearchQuery: string;

  // State for folder comparison
  leftFolderFiles: FolderFile[];
  rightFolderFiles: FolderFile[];
  activeCompareFile: string | null;

  setActiveMode: (mode: ViewMode) => void;
  setJsonString: (json: string) => void;
  setParsedJson: (json: any) => void;
  setIsValidJson: (isValid: boolean) => void;
  setSearchQuery: (query: string) => void;
  setInputType: (inputType: 'json' | 'base64') => void;
  setLoading: (loading: boolean) => void;

  // Setters for comparison feature
  setIsComparing: (isComparing: boolean) => void;
  setCompareMode: (mode: 'file' | 'folder' | 'json' | null) => void;
  setLeftContent: (content: string) => void;
  setRightContent: (content: string) => void;
  setLeftMode: (mode: ViewMode) => void;
  setRightMode: (mode: ViewMode) => void;
  setLeftSearchQuery: (query: string) => void;
  setRightSearchQuery: (query: string) => void;

  // Setters for folder comparison
  setLeftFolderFiles: (files: FolderFile[]) => void;
  setRightFolderFiles: (files: FolderFile[]) => void;
  setActiveCompareFile: (path: string | null) => void;
}

export const useJsonStore = create<JsonStore>((set) => ({
  activeMode: 'code',
  jsonString: '',
  parsedJson: null,
  isValidJson: true,
  searchQuery: '',
  inputType: 'json',
  isLoading: false,

  // Initial state for comparison feature
  isComparing: false,
  compareMode: null,
  leftContent: '',
  rightContent: '',
  leftMode: 'code',
  rightMode: 'code',
  leftSearchQuery: '',
  rightSearchQuery: '',

  // Initial state for folder comparison
  leftFolderFiles: [],
  rightFolderFiles: [],
  activeCompareFile: null,

  setActiveMode: (mode) => set({ activeMode: mode }),
  setJsonString: (json) => set({ jsonString: json }),
  setParsedJson: (json) => set({ parsedJson: json }),
  setIsValidJson: (isValid) => set({ isValidJson: isValid }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  setInputType: (inputType) => set({ inputType: inputType }),
  setLoading: (loading) => set({ isLoading: loading }),

  // Setters for comparison feature
  setIsComparing: (isComparing) => set({ isComparing: isComparing }),
  setCompareMode: (mode) => set({ compareMode: mode }),
  setLeftContent: (content) => set({ leftContent: content }),
  setRightContent: (content) => set({ rightContent: content }),
  setLeftMode: (mode) => set({ leftMode: mode }),
  setRightMode: (mode) => set({ rightMode: mode }),
  setLeftSearchQuery: (query) => set({ leftSearchQuery: query }),
  setRightSearchQuery: (query) => set({ rightSearchQuery: query }),

  // Setters for folder comparison
  setLeftFolderFiles: (files) => set({ leftFolderFiles: files }),
  setRightFolderFiles: (files) => set({ rightFolderFiles: files }),
  setActiveCompareFile: (path) => set({ activeCompareFile: path }),
}));
