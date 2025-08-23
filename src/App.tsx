import React, { useEffect, Suspense } from 'react';
import { Toaster } from 'react-hot-toast';
import ErrorBoundary from './components/ErrorBoundary';
import { Header, Sidebar, StatusBar, FileDropzone, ModeSelector, InputTypeSelector, CompareButton } from './features/layout/components/index';
import { SearchBar } from './features/search/components/index';
import { ActionButtons } from './features/file-operations/components/index';
import { useMainEditorStore } from './store/mainEditorStore';
import { useCompareStore } from './store/compareStore';
import { useFolderCompareStore } from './store/folderCompareStore';
import { JsonDataContext } from './features/json-data/context/JsonDataContext';
import { useJsonData } from './features/json-data/hooks/useJsonData';
import { ThemeContext } from './features/theme/context/ThemeContext';
import { useTheme } from './features/theme/hooks/useTheme';
import { X } from 'lucide-react';
import FeatureTour from './components/FeatureTour';
import Spinner from './components/Spinner';

// Dynamically import view mode components
const LazyTreeView = React.lazy(() => import('./features/json-data/components/TreeView'));
const LazyTableView = React.lazy(() => import('./features/json-data/components/TableView'));
const LazyCodeEditor = React.lazy(() => import('./features/json-data/components/CodeEditor'));
const LazyCompareEditorLayout = React.lazy(() => import('./features/json-data/components/CompareEditorLayout'));
const LazyFolderCompareLayout = React.lazy(() => import('./features/folder-compare/components/FolderCompareLayout'));


function App() {
  const { activeMode } = useMainEditorStore();
  const { isComparing, leftContent, rightContent, setLeftContent, setRightContent, setIsComparing, setCompareMode, compareMode, setOriginalJsonString, originalJsonString } = useCompareStore();
  const { setLeftFolderFiles, setRightFolderFiles, setActiveCompareFile } = useFolderCompareStore();
  const { validateAndUpdate, jsonString, undo, redo, formatJson, setJsonString } = useJsonData();

  const { theme } = useTheme();

  useEffect(() => {
    validateAndUpdate(jsonString);

    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme, validateAndUpdate, jsonString]);

  // Save original JSON string when entering comparison mode
  useEffect(() => {
    if (isComparing) {
      setOriginalJsonString(jsonString);
    }
  }, [isComparing, jsonString, setOriginalJsonString]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case 'z':
            if (!e.shiftKey) {
              e.preventDefault();
              undo();
            }
            break;
          case 'y':
            e.preventDefault();
            redo();
            break;
          case 'f':
            if (e.shiftKey) {
              e.preventDefault();
              formatJson();
            }
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [undo, redo, formatJson]);

  const renderEditor = () => {
    return (
      <Suspense fallback={<Spinner />}>
        {(() => { // Use an IIFE to handle switch inside JSX
          switch (activeMode) {
            case 'tree':
              return <LazyTreeView />;
            case 'table':
              return <LazyTableView />;
            case 'code':
            default:
              return <LazyCodeEditor />;
          }
        })()}
      </Suspense>
    );
  };

  const renderMainContent = () => {
    if (isComparing) {
      return (
        <Suspense fallback={<Spinner />}>
          {(() => {
            switch (compareMode) {
              case 'folder':
                return <LazyFolderCompareLayout />;
              case 'file':
              case 'json':
              default:
                return <LazyCompareEditorLayout originalContent={leftContent} modifiedContent={rightContent} />;
            }
          })()}
        </Suspense>
      );
    } else {
      return renderEditor();
    }
  };

  const handleExitCompareMode = () => {
    setIsComparing(false);
    setCompareMode(null);
    setLeftFolderFiles([]);
    setRightFolderFiles([]);
    setActiveCompareFile(null);
    setLeftContent('');
    setRightContent('');
    setJsonString(originalJsonString, 'restore_from_compare'); // Restore original JSON
  };

  return (
    <ErrorBoundary>
      <FeatureTour />
      <JsonDataContext.Provider value={useJsonData()}>
        <ThemeContext.Provider value={useTheme()}>
          <div className="h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
            <Header />

            <div className="flex-1 flex overflow-hidden">
              {/* Main Content */}
              <div className="flex-1 flex flex-col p-4">
                {/* Mode Selector and Ad Space */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <ModeSelector />
                    <InputTypeSelector />
                    <ActionButtons />
                    <SearchBar />
                    <CompareButton />
                    {isComparing && (
                      <div className="flex items-center space-x-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
                        <button
                          onClick={handleExitCompareMode}
                          className="px-2 py-1 hover:bg-red-500 dark:hover:bg-red-600 rounded-md transition-colors"
                          title="Exit Compare Mode"
                        >
                          <X size={18} className="text-gray-700 dark:text-gray-300" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Editor */}
                <div className="flex-1 min-h-0">
                  {renderMainContent()}
                </div>
              </div>

              {/* Sidebar */}
              <Sidebar />
            </div>

            {/* Status Bar */}
            <StatusBar />

            {/* File Dropzone */}
            <FileDropzone />

            {/* Toast Notifications */}
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 3000,
                style: {
                  background: theme === 'dark' ? '#374151' : '#fff',
                  color: theme === 'dark' ? '#fff' : '#000',
                },
              }}
            />
          </div>
        </ThemeContext.Provider>
      </JsonDataContext.Provider>
    </ErrorBoundary>
  );
}

export default App;