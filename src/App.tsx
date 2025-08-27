import React, { useEffect, Suspense } from 'react';
import { Toaster } from 'react-hot-toast';
import ErrorBoundary from './common/components/ErrorBoundary';
import { Header, Sidebar, StatusBar, FileDropzone, ModeSelector, InputTypeSelector, CompareButton } from './features/layout/components/index';
import { JsonEditorSearchBar } from './features/search/components/JsonEditorSearchBar';
import { ActionButtons } from './features/file-operations/components/index';
import { useMainEditorStore } from './store/mainEditorStore';
import { useCompareStore } from './store/compareStore';
import { useFolderCompareStore } from './store/folderCompareStore';
import { JsonDataContext } from './features/json-data/context/JsonDataContext';
import { useJsonData } from './features/json-data/hooks/useJsonData';
import { ThemeContext } from './features/theme/context/ThemeContext';
import { useTheme } from './features/theme/hooks/useTheme';
import FeatureTour from './common/components/FeatureTour';
import Spinner from './common/components/Spinner';
import { useSidebarStore } from './store/sidebarStore';

// Dynamically import view mode components
const LazyTreeView = React.lazy(() => import('./features/json-data/components/TreeView'));
const LazyTableView = React.lazy(() => import('./features/json-data/components/TableView'));
const LazyCodeEditor = React.lazy(() => import('./features/json-data/components/CodeEditor'));
const LazyCompareEditorLayout = React.lazy(() => import('./features/json-data/components/CompareEditorLayout'));
const LazyFolderCompareLayout = React.lazy(() => import('./features/folder-compare/components/FolderCompareLayout'));


function App() {
  const { activeMode, setInputType } = useMainEditorStore();
  const { isComparing, leftContent, rightContent, setLeftContent, setRightContent, setIsComparing, setCompareMode, compareMode, setOriginalJsonString, originalJsonString } = useCompareStore();
  const { setLeftFolderFiles, setRightFolderFiles, setActiveCompareFile } = useFolderCompareStore();
  const { validateAndUpdate, jsonString, undo, redo, formatJson, setJsonString } = useJsonData();
  const { isCollapsed } = useSidebarStore();

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

  const handleExitCompareMode = () => {
    setIsComparing(false);
    setCompareMode(null);
    setLeftFolderFiles([]);
    setRightFolderFiles([]);
    setActiveCompareFile(null);
    setLeftContent('');
    setRightContent('');
    setJsonString(originalJsonString, 'restore_from_compare');
    setInputType('json');
  };

  const renderMainContent = () => {
    if (isComparing) {
      return (
        <Suspense fallback={<Spinner />}>
          {(() => {
            switch (compareMode) {
              case 'folder':
                return <LazyFolderCompareLayout handleExitCompareMode={handleExitCompareMode} />;
              case 'file':
              case 'json':
              default:
                return <LazyCompareEditorLayout originalContent={leftContent} modifiedContent={rightContent} handleExitCompareMode={handleExitCompareMode} />;
            }
          })()}
        </Suspense>
      );
    } else {
      return renderEditor();
    }
  };

  return (
    <ErrorBoundary>
      <FeatureTour />
      <JsonDataContext.Provider value={useJsonData()}>
        <ThemeContext.Provider value={useTheme()}>
          <div className="h-screen flex flex-col bg-light-background dark:bg-dark-background text-light-text-primary dark:text-dark-text-primary">
            <Header />

            <div className="flex-1 flex overflow-hidden">
              {/* Main Content */}
              <div className={`flex-1 flex flex-col p-4 transition-all duration-300 ease-in-out ${isCollapsed ? 'w-full' : 'w-[calc(100%-20rem)]'}`}>
                {/* Mode Selector and Ad Space */}
                {!isComparing && (
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <ModeSelector />
                      <InputTypeSelector />
                      <ActionButtons />
                      <JsonEditorSearchBar />
                      <CompareButton />
                    </div>
                  </div>
                )}

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
                  background: theme === 'dark' ? 'dark-surface' : '#fff',
                  color: theme === 'dark' ? 'dark-text-primary' : '#000',
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