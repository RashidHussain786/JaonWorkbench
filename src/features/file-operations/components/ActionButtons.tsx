import React from 'react';
import { FileDown, FileUp, Copy, Clipboard, Undo, Redo, Key, Download } from 'lucide-react';
import { useFileOperations } from '../hooks/useFileOperations';
import { useMainEditorStore } from '../../../store/mainEditorStore';

export const ActionButtons: React.FC = () => {
  const { handleCopy, handlePaste, handleFormat, handleMinify, undo, redo, canUndo, canRedo, handleDecodeBase64, handleExport } = useFileOperations();
  const { inputType } = useMainEditorStore();

  return (
    <div className="flex items-center space-x-2">
      {/* File Operations */}
      <div className="flex items-center space-x-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-1 quick-actions-buttons" data-tourid="quick-actions-buttons">
        <button
          onClick={handleDecodeBase64}
          disabled={inputType !== 'base64'}
          className="px-2 py-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          title="Decode Base64 to JSON"
        >
          <Key size={18} className="text-gray-700 dark:text-gray-300" />
        </button>
        <button
          onClick={handleFormat}
          className="px-2 py-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-md transition-colors"
          title="Format JSON (Ctrl+Shift+F)"
        >
          <FileUp size={18} className="text-gray-700 dark:text-gray-300" />
        </button>
        <button
          onClick={handleMinify}
          className="px-2 py-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-md transition-colors"
          title="Minify JSON"
        >
          <FileDown size={18} className="text-gray-700 dark:text-gray-300" />
        </button>
        <button
          onClick={handleExport}
          className="px-2 py-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-md transition-colors export-button"
          title="Export JSON to File"
          data-tourid="export-button"
        >
          <Download size={18} className="text-gray-700 dark:text-gray-300" />
        </button>
      </div>

      {/* Clipboard Operations */}
      <div className="flex items-center space-x-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-1 clipboard-operations" data-tourid="clipboard-operations">
        <button
          onClick={handleCopy}
          className="px-2 py-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-md transition-colors"
          title="Copy to Clipboard (Ctrl+C)"
        >
          <Copy size={18} className="text-gray-700 dark:text-gray-300" />
        </button>
        <button
          onClick={handlePaste}
          className="px-2 py-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-md transition-colors"
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
          className="px-2 py-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          title="Undo (Ctrl+Z)"
        >
          <Undo size={18} className="text-gray-700 dark:text-gray-300" />
        </button>
        <button
          onClick={redo}
          disabled={!canRedo()}
          className="px-2 py-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          title="Redo (Ctrl+Y)"
        >
          <Redo size={18} className="text-gray-700 dark:text-gray-300" />
        </button>
      </div>
    </div>
  );
};