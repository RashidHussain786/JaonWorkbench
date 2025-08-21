import { useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { Header, Sidebar, StatusBar, FileDropzone, ModeSelector, InputTypeSelector, CompareButton } from './features/layout/components/index';
import { SearchBar } from './features/search/components/index';
import { ActionButtons } from './features/file-operations/components/index';
import { CodeEditor, TreeView, TableView, CompareEditorLayout } from './features/json-data/components/index'; CompareEditorLayout
import { useJsonStore } from './store/jsonStore';
import { JsonDataContext } from './features/json-data/context/JsonDataContext';
import { useJsonData } from './features/json-data/hooks/useJsonData';
import { ThemeContext } from './features/theme/context/ThemeContext';
import { useTheme } from './features/theme/hooks/useTheme';
import { X } from 'lucide-react';

function App() {
  const { activeMode, isComparing, leftContent, rightContent, setRightContent, setIsComparing, setCompareMode } = useJsonStore();
  const { validateAndUpdate, jsonString, undo, redo, formatJson, setJsonString } = useJsonData();

  const { theme } = useTheme();

  // Initialize with sample data and apply theme
  useEffect(() => {
    validateAndUpdate(jsonString);

    // Apply theme to document
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme, validateAndUpdate, jsonString]);

  // Keyboard shortcuts
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
    switch (activeMode) {
      case 'tree':
        return <TreeView />;
      case 'table':
        return <TableView />;
      case 'code':
      default:
        return <CodeEditor />;
    }
  };

  const handleExitCompareMode = () => {
    setIsComparing(false);
    setCompareMode(null);
    // If rightContent has content, set it as the main jsonString
    if (rightContent) {
      setJsonString(rightContent); // Update main editor content
    }
    setRightContent(''); // Clear right content when exiting compare mode
  };

  return (
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
                {isComparing ? (
                  <CompareEditorLayout originalContent={leftContent} modifiedContent={rightContent} />
                ) : (
                  renderEditor()
                )}
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
  );
}

export default App;