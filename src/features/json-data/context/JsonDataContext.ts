import { createContext, useContext } from 'react';
import { JsonError, HistoryState } from '../../../common/types';

interface JsonDataState {
  jsonData: any;
  jsonString: string;
  isValid: boolean;
  errors: JsonError[];
  history: HistoryState[];
  currentHistoryIndex: number;
}

interface JsonDataActions {
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

export const JsonDataContext = createContext<JsonDataState & JsonDataActions | undefined>(undefined);

export const useJsonDataContext = () => {
  const context = useContext(JsonDataContext);
  if (context === undefined) {
    throw new Error('useJsonDataContext must be used within a JsonDataContextProvider');
  }
  return context;
};
