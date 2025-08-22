import { create } from 'zustand';
import { JsonError, HistoryState } from '../../../common/types';
import { validateJson, formatJson, isBase64 } from '../../../utils/jsonHelpers';
import { useMainEditorStore } from '../../../store/mainEditorStore';

interface JsonDataStoreState {
  jsonData: any;
  jsonString: string;
  isValid: boolean;
  errors: JsonError[];
  history: HistoryState[];
  currentHistoryIndex: number;
}

interface JsonDataStoreActions {
  setJsonData: (data: any, action?: string) => void;
  setJsonString: (str: string, action?: string) => void;
  validateAndUpdate: (jsonString: string) => void;
  formatJson: () => void;
  minifyJson: () => void;
  undo: () => void;
  redo: () => void;
  canUndo: () => boolean;
  canRedo: () => boolean;
  clearHistory: () => void;
}

const MAX_HISTORY = 50;

export const useJsonDataStore = create<JsonDataStoreState & JsonDataStoreActions>((set, get) => ({
  jsonData: {},
  jsonString: `{
  "hello": "world",
  "example": {
    "array": [1, 2, 3],
    "boolean": true,
    "null": null
  }
}`,
  isValid: true,
  errors: [],
  history: [],
  currentHistoryIndex: -1,

  setJsonData: (data: any, action = 'update') => {
    const jsonString = JSON.stringify(data, null, 2);
    const state = get();

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
    const { inputType } = useMainEditorStore.getState();
    const state = get();

    let isValid = true;
    let errors: JsonError[] = [];
    let parsedData: any = {};

    if (inputType === 'base64') {
      if (!isBase64(str)) {
        isValid = false;
        errors = [{ message: 'Invalid Base64 string', type: 'syntax' }];
      }
      parsedData = state.jsonData;
    } else {
      const validation = validateJson(str);
      isValid = validation.isValid;
      errors = validation.errors || [];
      parsedData = validation.data || {};
    }

    if (isValid) {
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
        jsonData: parsedData,
        isValid: true,
        errors: [],
        history: newHistory,
        currentHistoryIndex: newHistory.length - 1
      });
    } else {
      set({
        jsonString: str,
        isValid: false,
        errors: errors
      });
    }
  },

  validateAndUpdate: (content: string) => {
    const { inputType } = useMainEditorStore.getState();

    if (inputType === 'base64') {
      if (isBase64(content)) {
        set({
          jsonString: content,
          jsonData: {},
          isValid: true,
          errors: []
        });
      } else {
        set({
          jsonString: content,
          jsonData: {},
          isValid: false,
          errors: [{ message: 'Invalid Base64 string', type: 'syntax' }]
        });
      }
    } else {
      const validation = validateJson(content);
      set({
        jsonString: content,
        jsonData: validation.data || {},
        isValid: validation.isValid,
        errors: validation.errors || []
      });
    }
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
}));

export const useJsonData = () => useJsonDataStore();
