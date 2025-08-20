import React, { useEffect, useRef } from 'react';
import Editor from '@monaco-editor/react';
import { useJsonStore } from '../store/jsonStore';

export const CodeEditor: React.FC = () => {
  const { jsonString, setJsonString, theme, errors, isValid } = useJsonStore();
  const editorRef = useRef<any>(null);

  const handleEditorDidMount = (editor: any, monaco: any) => {
    editorRef.current = editor;

    // Custom JSON theme
    monaco.editor.defineTheme('json-light', {
      base: 'vs',
      inherit: true,
      rules: [
        { token: 'string.key.json', foreground: '0451A5' },
        { token: 'string.value.json', foreground: '0A7A37' },
        { token: 'number.json', foreground: '164BCB' },
        { token: 'keyword.json', foreground: 'AF00DB' },
      ],
      colors: {
        'editor.background': '#FFFFFF',
        'editor.foreground': '#000000',
      }
    });

    monaco.editor.defineTheme('json-dark', {
      base: 'vs-dark',
      inherit: true,
      rules: [
        { token: 'string.key.json', foreground: '9CDCFE' },
        { token: 'string.value.json', foreground: 'CE9178' },
        { token: 'number.json', foreground: 'B5CEA8' },
        { token: 'keyword.json', foreground: 'C586C0' },
      ],
      colors: {
        'editor.background': '#1E1E1E',
        'editor.foreground': '#D4D4D4',
      }
    });

    // Set custom theme
    monaco.editor.setTheme(theme === 'dark' ? 'json-dark' : 'json-light');

    // Add keyboard shortcuts
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
      // Save functionality would go here
    });

    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyMod.Shift | monaco.KeyCode.KeyF, () => {
      editor.getAction('editor.action.formatDocument').run();
    });
  };

  useEffect(() => {
    if (editorRef.current) {
      const monaco = (window as any).monaco;
      if (monaco) {
        monaco.editor.setTheme(theme === 'dark' ? 'json-dark' : 'json-light');
      }
    }
  }, [theme]);

  // Add error markers
  useEffect(() => {
    if (editorRef.current && errors.length > 0) {
      const monaco = (window as any).monaco;
      if (monaco) {
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
  }, [errors]);

  return (
    <div className="h-full border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
      <Editor
        height="100%"
        defaultLanguage="json"
        value={jsonString}
        onChange={(value) => setJsonString(value || '', 'edit')}
        onMount={handleEditorDidMount}
        theme={theme === 'dark' ? 'vs-dark' : 'vs-light'}
        options={{
          minimap: { enabled: true },
          wordWrap: 'on',
          lineNumbers: 'on',
          folding: true,
          bracketPairColorization: { enabled: true },
          autoIndent: 'full',
          formatOnPaste: true,
          formatOnType: true,
          scrollBeyondLastLine: false,
          fontSize: 14,
          fontFamily: 'Consolas, Monaco, "Courier New", monospace',
          tabSize: 2,
          insertSpaces: true,
        }}
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