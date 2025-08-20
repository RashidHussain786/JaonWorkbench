import { useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { Header } from './components/Header';
import { ModeSelector } from './components/ModeSelector';
import { CodeEditor } from './components/CodeEditor';
import { TreeView } from './components/TreeView';
import { TableView } from './components/TableView';
import { Sidebar } from './components/Sidebar';
import { StatusBar } from './components/StatusBar';
import { FileDropzone } from './components/FileDropzone';
import { useJsonStore } from './store/jsonStore';

function App() {
  const { activeMode, theme, validateAndUpdate, jsonString } = useJsonStore();

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
              useJsonStore.getState().undo();
            }
            break;
          case 'y':
            e.preventDefault();
            useJsonStore.getState().redo();
            break;
          case 'f':
            if (e.shiftKey) {
              e.preventDefault();
              useJsonStore.getState().formatJson();
            }
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

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

  return (
    <div className="h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <Header />

      <div className="flex-1 flex overflow-hidden">
        {/* Main Content */}
        <div className="flex-1 flex flex-col p-4">
          {/* Mode Selector and Ad Space */}
          <div className="flex items-center justify-between mb-4">
            <ModeSelector />

            {/* Header Ad Space */}
            {useJsonStore.getState().showAds && !useJsonStore.getState().isPremium && (
              <div className="hidden lg:block bg-gray-100 dark:bg-gray-800 border-2 border-dashed 
                            border-gray-300 dark:border-gray-600 rounded-lg px-6 py-3 text-center">
                <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Advertisement</div>
                <div className="bg-gradient-to-r from-purple-400 to-pink-500 text-white text-xs py-1 px-3 rounded">
                  Your Ad Here • 728x90
                </div>
              </div>
            )}
          </div>

          {/* Editor */}
          <div className="flex-1 min-h-0">
            {renderEditor()}
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
  );
}

export default App;