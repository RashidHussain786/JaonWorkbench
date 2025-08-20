export interface JsonEditorState {
  jsonData: any;
  jsonString: string;
  activeMode: 'tree' | 'code' | 'table';
  theme: 'light' | 'dark';
  isValid: boolean;
  errors: JsonError[];
  history: HistoryState[];
  currentHistoryIndex: number;
  isLoading: boolean;
  searchQuery: string;
}

export interface JsonError {
  line?: number;
  column?: number;
  message: string;
  type: 'syntax' | 'validation' | 'schema';
}

export interface HistoryState {
  data: any;
  jsonString: string;
  timestamp: number;
  action: string;
}

export interface FileImportResult {
  success: boolean;
  data?: any;
  error?: string;
}

export type ViewMode = 'tree' | 'code' | 'table';
export type ThemeMode = 'light' | 'dark';