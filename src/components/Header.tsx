import React from 'react';
import { FileDown, FileUp, Copy, Clipboard, Undo, Redo, Sun, Moon, Settings } from 'lucide-react';
import { useJsonStore } from '../store/jsonStore';
import { exportToFile, copyToClipboard, readFromClipboard } from '../utils/fileHelpers';
import toast from 'react-hot-toast';

export const Header: React.FC = () => {
  const {
    jsonData,
    jsonString,
    theme,
    setTheme,
    formatJson,
    minifyJson,
    undo,
    redo,
    canUndo,
    canRedo,
    setJsonString,
    isPremium,
    togglePremium
  } = useJsonStore();

  const handleExport = () => {
    try {
      exportToFile(jsonData);
      toast.success('JSON exported successfully!');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Export failed');
    }
  };

  const handleCopy = async () => {
    const success = await copyToClipboard(jsonString);
    if (success) {
      toast.success('JSON copied to clipboard!');
    } else {
      toast.error('Failed to copy to clipboard');
    }
  };

  const handlePaste = async () => {
    const text = await readFromClipboard();
    if (text) {
      setJsonString(text, 'paste');
      toast.success('JSON pasted from clipboard!');
    } else {
      toast.error('Failed to read from clipboard');
    }
  };

  const handleFormat = () => {
    formatJson();
    toast.success('JSON formatted!');
  };

  const handleMinify = () => {
    minifyJson();
    toast.success('JSON minified!');
  };

  return (
    <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-4 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">
            JSON Editor Pro
          </h1>
          {!isPremium && (
            <div className="hidden md:block bg-gradient-to-r from-blue-500 to-purple-600 text-white px-3 py-1 rounded-full text-sm">
              Free with Ads
            </div>
          )}
        </div>

        <div className="flex items-center space-x-2">
          {/* File Operations */}
          <div className="flex items-center space-x-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
            <button
              onClick={handleFormat}
              className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-md transition-colors"
              title="Format JSON (Ctrl+Shift+F)"
            >
              <FileUp size={18} className="text-gray-700 dark:text-gray-300" />
            </button>
            <button
              onClick={handleMinify}
              className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-md transition-colors"
              title="Minify JSON"
            >
              <FileDown size={18} className="text-gray-700 dark:text-gray-300" />
            </button>
          </div>

          {/* Clipboard Operations */}
          <div className="flex items-center space-x-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
            <button
              onClick={handleCopy}
              className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-md transition-colors"
              title="Copy to Clipboard (Ctrl+C)"
            >
              <Copy size={18} className="text-gray-700 dark:text-gray-300" />
            </button>
            <button
              onClick={handlePaste}
              className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-md transition-colors"
              title="Paste from Clipboard (Ctrl+V)"
            >
              <Clipboard size={18} className="text-gray-700 dark:text-gray-300" />
            </button>
          </div>

          {/* History */}
          <div className="flex items-center space-x-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
            <button
              onClick={undo}
              disabled={!canUndo()}
              className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              title="Undo (Ctrl+Z)"
            >
              <Undo size={18} className="text-gray-700 dark:text-gray-300" />
            </button>
            <button
              onClick={redo}
              disabled={!canRedo()}
              className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              title="Redo (Ctrl+Y)"
            >
              <Redo size={18} className="text-gray-700 dark:text-gray-300" />
            </button>
          </div>

          {/* Theme Toggle */}
          <button
            onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
            className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-md transition-colors"
            title="Toggle Theme"
          >
            {theme === 'light' ? (
              <Moon size={18} className="text-gray-700" />
            ) : (
              <Sun size={18} className="text-gray-300" />
            )}
          </button>

          {/* Premium Toggle (Demo) */}
          <button
            onClick={togglePremium}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              isPremium
                ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
            title="Toggle Premium Features (Demo)"
          >
            {isPremium ? 'Premium' : 'Upgrade'}
          </button>
        </div>
      </div>
    </header>
  );
};