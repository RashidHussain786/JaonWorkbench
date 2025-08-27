import React, { useEffect, useRef } from 'react';
import * as monaco from 'monaco-editor';
import { defineMonacoThemes } from '../utils/monacoThemes';
import { X } from 'lucide-react';
import { useEditorStore } from '../../../store/editorStore';
import SearchBar from '../../search/components/SearchBar';

// Define Monaco themes once
defineMonacoThemes(monaco);

(self as any).MonacoEnvironment = {
  getWorkerUrl: function (_moduleId: string, label: string) {
    if (label === "json") {
      return "/monacoeditorwork/json.worker.bundle.js";
    }
    if (label === "css" || label === "scss" || label === "less") {
      return "/monacoeditorwork/css.worker.bundle.js";
    }
    if (label === "html" || label === "handlebars" || label === "razor") {
      return "/monacoeditorwork/html.worker.bundle.js";
    }
    if (label === "typescript" || label === "javascript") {
      return "/monacoeditorwork/ts.worker.bundle.js";
    }
    return "/monacoeditorwork/editor.worker.bundle.js";
  },
};
import { useCompareStore } from '../../../store/compareStore';
import { ChevronUp, ChevronDown, Copy, Clipboard, FileUp, FileDown } from 'lucide-react';
import { useTheme } from '../../theme/hooks/useTheme';
import { useCompareSearch } from '../hooks/useCompareSearch';
import { toast } from 'react-hot-toast';

interface CompareEditorLayoutProps {
  originalContent: string;
  modifiedContent: string;
  showControls?: boolean;
  handleExitCompareMode: () => void;
}

const CompareEditorLayout: React.FC<CompareEditorLayoutProps> = ({
  originalContent,
  modifiedContent,
  showControls = true,
  handleExitCompareMode,
}) => {
  const diffEditorRef = useRef<HTMLDivElement>(null);
  const diffEditorInstanceRef = useRef<monaco.editor.IStandaloneDiffEditor | null>(null);
  const { jsonWordWrap, fileWordWrap, toggleWordWrap } = useEditorStore();

  const {
    compareMode,
    setLeftContent,
    setRightContent,
    leftSearchQuery,
    setLeftSearchQuery,
    rightSearchQuery,
    setRightSearchQuery
  } = useCompareStore();
  const { theme } = useTheme();
  const {
    handleSearch,
    originalMatches,
    modifiedMatches,
    currentOriginalMatchIndex,
    currentModifiedMatchIndex,
    handleNextMatch,
    handlePreviousMatch,
  } = useCompareSearch();

  useEffect(() => {
    const language = compareMode === 'json' ? 'json' : 'text/plain';

    if (diffEditorRef.current) {
      const originalModel = monaco.editor.createModel(originalContent, language);
      const modifiedModel = monaco.editor.createModel(modifiedContent, language);

      diffEditorInstanceRef.current = monaco.editor.createDiffEditor(diffEditorRef.current, {
        automaticLayout: true,
        theme: theme === 'dark' ? 'json-dark' : 'json-light',
        readOnly: false,
        originalEditable: true,
      });

      diffEditorInstanceRef.current.setModel({
        original: originalModel,
        modified: modifiedModel,
      });

      const originalEditor = diffEditorInstanceRef.current.getOriginalEditor();
      const modifiedEditor = diffEditorInstanceRef.current.getModifiedEditor();

      const toggle = () => toggleWordWrap(compareMode === 'json' ? 'json' : 'file');

      originalEditor.addCommand(monaco.KeyMod.Alt | monaco.KeyCode.KeyZ, toggle);
      modifiedEditor.addCommand(monaco.KeyMod.Alt | monaco.KeyCode.KeyZ, toggle);

      originalEditor.onDidChangeModelContent(() => {
        setLeftContent(originalEditor.getValue());
      });

      modifiedEditor.onDidChangeModelContent(() => {
        setRightContent(modifiedEditor.getValue());
      });

      return () => {
        diffEditorInstanceRef.current?.dispose();
        originalModel.dispose();
        modifiedModel.dispose();
      };
    }
  }, [originalContent, modifiedContent, compareMode, theme, setLeftContent, setRightContent, toggleWordWrap]);

  useEffect(() => {
    if (diffEditorInstanceRef.current) {
      const wordWrap = compareMode === 'json' ? jsonWordWrap : fileWordWrap;
      const originalEditor = diffEditorInstanceRef.current.getOriginalEditor();
      const modifiedEditor = diffEditorInstanceRef.current.getModifiedEditor();
      originalEditor.updateOptions({ wordWrap });
      modifiedEditor.updateOptions({ wordWrap });
    }
  }, [jsonWordWrap, fileWordWrap, compareMode]);

  const handleLeftSearchChange = (value: string) => {
    setLeftSearchQuery(value);
    handleSearch(diffEditorInstanceRef.current?.getOriginalEditor() ?? null, value, true);
  };

  const handleRightSearchChange = (value: string) => {
    setRightSearchQuery(value);
    handleSearch(diffEditorInstanceRef.current?.getModifiedEditor() ?? null, value, false);
  };

  const handleCopy = (editorType: 'original' | 'modified') => {
    const editor = editorType === 'original'
      ? diffEditorInstanceRef.current?.getOriginalEditor()
      : diffEditorInstanceRef.current?.getModifiedEditor();
    if (editor) {
      navigator.clipboard.writeText(editor.getValue());
      toast.success('Copied to clipboard');
    }
  };

  const handlePaste = (editorType: 'original' | 'modified') => {
    const editor = editorType === 'original'
      ? diffEditorInstanceRef.current?.getOriginalEditor()
      : diffEditorInstanceRef.current?.getModifiedEditor();
    const setter = editorType === 'original' ? setLeftContent : setRightContent;
    if (editor) {
      navigator.clipboard.readText().then(text => {
        editor.setValue(text);
        setter(text);
        toast.success('Pasted from clipboard');
      });
    }
  };

  const handleFormat = (editorType: 'original' | 'modified') => {
    const editor = editorType === 'original'
      ? diffEditorInstanceRef.current?.getOriginalEditor()
      : diffEditorInstanceRef.current?.getModifiedEditor();
    const setter = editorType === 'original' ? setLeftContent : setRightContent;
    if (editor) {
      try {
        const unformattedJson = editor.getValue();
        const formattedJson = JSON.stringify(JSON.parse(unformattedJson), null, 2);
        editor.setValue(formattedJson);
        setter(formattedJson);
        toast.success('JSON formatted successfully');
      } catch {
        toast.error('Failed to format JSON: Invalid JSON');
      }
    }
  };

  const handleMinify = (editorType: 'original' | 'modified') => {
    const editor = editorType === 'original'
      ? diffEditorInstanceRef.current?.getOriginalEditor()
      : diffEditorInstanceRef.current?.getModifiedEditor();
    const setter = editorType === 'original' ? setLeftContent : setRightContent;
    if (editor) {
      try {
        const unformattedJson = editor.getValue();
        const minifiedJson = JSON.stringify(JSON.parse(unformattedJson));
        editor.setValue(minifiedJson);
        setter(minifiedJson);
        toast.success('JSON minified successfully');
      } catch {
        toast.error('Failed to minify JSON: Invalid JSON');
      }
    }
  };

  const handleTrimWhitespace = (editorType: 'original' | 'modified') => {
    const editor = editorType === 'original'
      ? diffEditorInstanceRef.current?.getOriginalEditor()
      : diffEditorInstanceRef.current?.getModifiedEditor();
    const setter = editorType === 'original' ? setLeftContent : setRightContent;
    if (editor) {
      const content = editor.getValue();
      let processedContent = content;

      if (compareMode === 'json') {
        try {
          processedContent = JSON.stringify(JSON.parse(content));
          toast.success('JSON minified successfully');
        } catch {
          toast.error('Failed to minify JSON: Invalid JSON');
          return; // Stop execution if JSON is invalid
        }
      } else { // compareMode === 'file'
        // Remove leading/trailing whitespace from each line, remove empty lines, and replace multiple spaces
        processedContent = content
          .split('\n')
          .map(line => line.trim())
          .filter(line => line.length > 0)
          .join('\n')
          .replace(/\s\s+/g, ' '); // Replace multiple spaces with a single space
        toast.success('Whitespace trimmed successfully');
      }

      editor.setValue(processedContent);
      setter(processedContent);
    }
  };

  return (
    <div className="flex flex-col h-full space-y-2">
      {showControls && (
        <div className="flex space-x-4 items-center">
          {/* Left Controls */}
          <div className="flex-1 flex items-center space-x-2">
            <div className="flex-1">
              <SearchBar 
                searchValue={leftSearchQuery} 
                onSearchChange={handleLeftSearchChange} 
                placeholder="Search left..." 
              />
            </div>
            {originalMatches.length > 0 && (
              <>
                <span className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
                  {currentOriginalMatchIndex + 1} of {originalMatches.length}
                </span>
                <button
                  onClick={() => handlePreviousMatch(diffEditorInstanceRef.current?.getOriginalEditor() ?? null, true)}
                  className="p-1 rounded-md hover:bg-light-border dark:hover:bg-dark-border"
                  title="Previous Match"
                >
                  <ChevronUp size={18} className="text-light-text-secondary" />
                </button>
                <button
                  onClick={() => handleNextMatch(diffEditorInstanceRef.current?.getOriginalEditor() ?? null, true)}
                  className="p-1 rounded-md hover:bg-light-border dark:hover:bg-dark-border"
                  title="Next Match"
                >
                  <ChevronDown size={18} className="text-light-text-secondary" />
                </button>
              </>
            )}
            <button onClick={() => handleCopy('original')} className="px-2 py-1 rounded-md text-sm font-medium transition-colors bg-light-surface text-light-text-primary hover:bg-light-border dark:bg-dark-surface dark:text-dark-text-primary dark:hover:bg-dark-border" title="Copy Left"><Copy size={18} /></button>
            <button onClick={() => handlePaste('original')} className="px-2 py-1 rounded-md text-sm font-medium transition-colors bg-light-surface text-light-text-primary hover:bg-light-border dark:bg-dark-surface dark:text-dark-text-primary dark:hover:bg-dark-border" title="Paste Left"><Clipboard size={18} /></button>
            {compareMode === 'json' ? (
              <>
                <button onClick={() => handleFormat('original')} className="px-2 py-1 rounded-md text-sm font-medium transition-colors bg-light-surface text-light-text-primary hover:bg-light-border dark:bg-dark-surface dark:text-dark-text-primary dark:hover:bg-dark-border" title="Format Left"><FileUp size={18} /></button>
                <button onClick={() => handleMinify('original')} className="px-2 py-1 rounded-md text-sm font-medium transition-colors bg-light-surface text-light-text-primary hover:bg-light-border dark:bg-dark-surface dark:text-dark-text-primary dark:hover:bg-dark-border" title="Minify Left"><FileDown size={18} /></button>
              </>
            ) : (
              <button onClick={() => handleTrimWhitespace('original')} className="px-2 py-1 rounded-md text-sm font-medium transition-colors bg-light-surface text-light-text-primary hover:bg-light-border dark:bg-dark-surface dark:text-dark-text-primary dark:hover:bg-dark-border" title="Trim Whitespace">Trim</button>
            )}
          </div>
          {/* Right Controls */}
          <div className="flex-1 flex items-center space-x-2">
            <div className="flex-1">
              <SearchBar 
                searchValue={rightSearchQuery} 
                onSearchChange={handleRightSearchChange} 
                placeholder="Search right..." 
              />
            </div>
            {modifiedMatches.length > 0 && (
              <>
                <span className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
                  {currentModifiedMatchIndex + 1} of {modifiedMatches.length}
                </span>
                <button
                  onClick={() => handlePreviousMatch(diffEditorInstanceRef.current?.getModifiedEditor() ?? null, false)}
                  className="p-1 rounded-md hover:bg-light-border dark:hover:bg-dark-border"
                  title="Previous Match"
                >
                  <ChevronUp size={18} className="text-light-text-secondary" />
                </button>
                <button
                  onClick={() => handleNextMatch(diffEditorInstanceRef.current?.getModifiedEditor() ?? null, false)}
                  className="p-1 rounded-md hover:bg-light-border dark:hover:bg-dark-border"
                  title="Next Match"
                >
                  <ChevronDown size={18} className="text-light-text-secondary" />
                </button>
              </>
            )}
            <button onClick={() => handleCopy('modified')} className="px-2 py-1 rounded-md text-sm font-medium transition-colors bg-light-surface text-light-text-primary hover:bg-light-border dark:bg-dark-surface dark:text-dark-text-primary dark:hover:bg-dark-border" title="Copy Right"><Copy size={18} /></button>
            <button onClick={() => handlePaste('modified')} className="px-2 py-1 rounded-md text-sm font-medium transition-colors bg-light-surface text-light-text-primary hover:bg-light-border dark:bg-dark-surface dark:text-dark-text-primary dark:hover:bg-dark-border" title="Paste Right"><Clipboard size={18} /></button>
            {compareMode === 'json' ? (
              <>
                <button onClick={() => handleFormat('modified')} className="px-2 py-1 rounded-md text-sm font-medium transition-colors bg-light-surface text-light-text-primary hover:bg-light-border dark:bg-dark-surface dark:text-dark-text-primary dark:hover:bg-dark-border" title="Format Right"><FileUp size={18} /></button>
                <button onClick={() => handleMinify('modified')} className="px-2 py-1 rounded-md text-sm font-medium transition-colors bg-light-surface text-light-text-primary hover:bg-light-border dark:bg-dark-surface dark:text-dark-text-primary dark:hover:bg-dark-border" title="Minify Right"><FileDown size={18} /></button>
              </>
            ) : (
              <button onClick={() => handleTrimWhitespace('modified')} className="px-2 py-1 rounded-md text-sm font-medium transition-colors bg-light-surface text-light-text-primary hover:bg-light-border dark:bg-dark-surface dark:text-dark-text-primary dark:hover:bg-dark-border" title="Trim Whitespace">Trim</button>
            )}
          </div>
          <button
            onClick={handleExitCompareMode}
            className="p-2 hover:bg-red-500 dark:hover:bg-red-600 rounded-md transition-colors"
            title="Exit Compare Mode"
          >
            <X size={18} className="text-gray-700 dark:text-dark-text-secondary" />
          </button>
        </div>
      )}
      <div ref={diffEditorRef} className="flex-1 border border-gray-300 dark:border-dark-border rounded-md" />
    </div>
  );
};

export default CompareEditorLayout;