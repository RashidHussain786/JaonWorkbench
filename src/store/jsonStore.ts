import { create } from 'zustand';
import { JsonEditorState, JsonError, HistoryState } from '../types';
import { validateJson, formatJson } from '../utils/jsonHelpers';

interface JsonStore extends JsonEditorState {
  setJsonData: (data: any, action?: string) => void;
  setJsonString: (str: string, action?: string) => void;
  setActiveMode: (mode: 'tree' | 'code' | 'table') => void;
  setTheme: (theme: 'light' | 'dark') => void;
  setErrors: (errors: JsonError[]) => void;
  validateAndUpdate: (jsonString: string) => void;
  formatJson: () => void;
  minifyJson: () => void;
  undo: () => void;
  redo: () => void;
  canUndo: () => boolean;
  canRedo: () => boolean;
  clearHistory: () => void;
  setLoading: (loading: boolean) => void;
  setSearchQuery: (query: string) => void;
}

const MAX_HISTORY = 50;

export const useJsonStore = create<JsonStore>((set, get) => ({
  jsonData: {},
  jsonString: `{
  "hello": "world",
  "example": {
    "array": [1, 2, 3],
    "boolean": true,
    "null": null
  }
}`,
  activeMode: 'code',
  theme: 'dark',
  isValid: true,
  errors: [],
  history: [],
  currentHistoryIndex: -1,
  isLoading: false,
  searchQuery: '',

  setSearchQuery: (query: string) => set({ searchQuery: query }),

  setJsonData: (data: any, action = 'update') => {
    const jsonString = formatJson(data);
    const state = get();
    
    // Add to history
    const newHistoryItem: HistoryState = {
      data: state.jsonData,
      jsonString: state.jsonString,
      timestamp: Date.now(),
      action
    };

    const newHistory = state.history.slice(0, state.currentHistoryIndex + 1);
    newHistory.push(newHistoryItem);
    
    if (newHistory.length > MAX_HISTORY) {
      newHistory.shift();
    }

    set({
      jsonData: data,
      jsonString,
      history: newHistory,
      currentHistoryIndex: newHistory.length - 1,
      isValid: true,
      errors: []
    });
  },

  setJsonString: (str: string, action = 'edit') => {
    const validation = validateJson(str);
    const state = get();
    
    if (validation.isValid && validation.data !== undefined) {
      // Add to history
      const newHistoryItem: HistoryState = {
        data: state.jsonData,
        jsonString: state.jsonString,
        timestamp: Date.now(),
        action
      };

      const newHistory = state.history.slice(0, state.currentHistoryIndex + 1);
      newHistory.push(newHistoryItem);
      
      if (newHistory.length > MAX_HISTORY) {
        newHistory.shift();
      }

      set({
        jsonString: str,
        jsonData: validation.data,
        isValid: true,
        errors: [],
        history: newHistory,
        currentHistoryIndex: newHistory.length - 1
      });
    } else {
      set({
        jsonString: str,
        isValid: false,
        errors: validation.errors || []
      });
    }
  },

  setActiveMode: (mode) => set({ activeMode: mode }),
  setTheme: (theme) => set({ theme }),
  setErrors: (errors) => set({ errors }),

  validateAndUpdate: (jsonString: string) => {
    const validation = validateJson(jsonString);
    set({
      jsonString,
      jsonData: validation.data || {},
      isValid: validation.isValid,
      errors: validation.errors || []
    });
  },

  formatJson: () => {
    const state = get();
    if (state.isValid) {
      const formatted = formatJson(state.jsonData);
      get().setJsonString(formatted, 'format');
    }
  },

  minifyJson: () => {
    const state = get();
    if (state.isValid) {
      const minified = JSON.stringify(state.jsonData);
      get().setJsonString(minified, 'minify');
    }
  },

  undo: () => {
    const state = get();
    if (state.currentHistoryIndex > 0) {
      const prevIndex = state.currentHistoryIndex - 1;
      const prevState = state.history[prevIndex];
      set({
        jsonData: prevState.data,
        jsonString: prevState.jsonString,
        currentHistoryIndex: prevIndex,
        isValid: true,
        errors: []
      });
    }
  },

  redo: () => {
    const state = get();
    if (state.currentHistoryIndex < state.history.length - 1) {
      const nextIndex = state.currentHistoryIndex + 1;
      const nextState = state.history[nextIndex];
      set({
        jsonData: nextState.data,
        jsonString: nextState.jsonString,
        currentHistoryIndex: nextIndex,
        isValid: true,
        errors: []
      });
    }
  },

  canUndo: () => {
    const state = get();
    return state.currentHistoryIndex > 0;
  },

  canRedo: () => {
    const state = get();
    return state.currentHistoryIndex < state.history.length - 1;
  },

  clearHistory: () => set({ history: [], currentHistoryIndex: -1 }),
  setLoading: (isLoading) => set({ isLoading })
}));