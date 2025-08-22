import React, { useEffect, useRef } from 'react';
import Editor from '@monaco-editor/react';
import { useJsonData } from '../hooks/useJsonData';
import { useTheme } from '../../theme/hooks/useTheme';
import { useMainEditorStore } from '../../../store/mainEditorStore';
import * as monaco from 'monaco-editor';
import { defineMonacoThemes } from '../utils/monacoThemes';
import { applyMonacoEditorShortcuts, getMonacoEditorOptions } from '../utils/monacoEditorUtils';

export const CodeEditor: React.FC = () => {
  const { jsonString, setJsonString, errors, isValid } = useJsonData();
  const { theme } = useTheme();
  const { searchQuery, inputType } = useMainEditorStore();
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);

  const handleEditorDidMount = (editor: any, monaco: any) => {
    editorRef.current = editor;

    defineMonacoThemes(monaco);

    monaco.editor.setTheme(theme === 'dark' ? 'json-dark' : 'json-light');

    applyMonacoEditorShortcuts(editor, monaco);
  };

  useEffect(() => {
    if (editorRef.current) {
      const monaco = (window as any).monaco;
      if (monaco) {
        monaco.editor.setTheme(theme === 'dark' ? 'json-dark' : 'json-light');

        if (inputType === 'base64') {
          monaco.languages.json.jsonDefaults.setDiagnosticsOptions({
            validate: false,
            schemas: []
          });
        } else {
          monaco.languages.json.jsonDefaults.setDiagnosticsOptions({
            validate: true,
            schemas: []
          });
        }
      }
    }
  }, [theme, inputType]);

  const decorationIdsRef = useRef<string[]>([]);

  useEffect(() => {
    if (editorRef.current) {
      const model = editorRef.current.getModel();
      if (model) {

        decorationIdsRef.current = editorRef.current.deltaDecorations(decorationIdsRef.current, []);

        if (searchQuery) {
          const matches = model.findMatches(searchQuery, true, false, true, null, true);
          const newDecorations = matches.map((match: monaco.editor.FindMatch) => ({
            range: match.range,
            options: { className: 'search-highlight-background', inlineStyle: 'color: black;' }
          }));
          decorationIdsRef.current = editorRef.current.deltaDecorations([], newDecorations);
          console.log('New decorations applied:', decorationIdsRef.current);
          if (matches.length > 0) {
            editorRef.current.revealRange(matches[0].range);
          }
        }
      }
    }
  }, [searchQuery]);

  useEffect(() => {
    if (editorRef.current) {
      const monaco = (window as any).monaco;
      if (monaco) {
        monaco.editor.setModelMarkers(editorRef.current.getModel(), 'json', []);

        if (!isValid && errors.length > 0 && inputType === 'json') {
          const markers = errors.map(error => ({
            startLineNumber: error.line || 1,
            startColumn: error.column || 1,
            endLineNumber: error.line || 1,
            endColumn: (error.column || 1) + 1,
            message: error.message,
            severity: monaco.MarkerSeverity.Error
          }));
          monaco.editor.setModelMarkers(editorRef.current.getModel(), 'json', markers);
        }
      }
    }
  }, [errors, isValid, inputType]);

  return (
    <div className="h-full border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
      <Editor
        height="100%"
        defaultLanguage={inputType === 'base64' ? 'plaintext' : 'json'}
        value={jsonString}
        onChange={(value) => setJsonString(value || '', 'edit')}
        onMount={handleEditorDidMount}
        theme={theme === 'dark' ? 'vs-dark' : 'vs-light'}
        options={getMonacoEditorOptions() as any}
      />

      {/* Error Display */}
      {!isValid && errors.length > 0 && (
        <div className="bg-red-50 dark:bg-red-900/20 border-t border-red-200 dark:border-red-800 p-3">
          <div className="text-sm text-red-700 dark:text-red-300">
            <span className="font-medium">JSON Validation Error:</span>
          </div>
          {errors.map((error, index) => (
            <div key={index} className="text-sm text-red-600 dark:text-red-400 mt-1">
              {error.line && error.column && (
                <span className="font-mono text-xs">Line {error.line}:{error.column} - </span>
              )}
              {error.message}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};