import React from 'react';
import { Info, Zap, X } from 'lucide-react';
import { useJsonStore } from '../store/jsonStore';
import { getJsonStats } from '../utils/jsonHelpers';

export const Sidebar: React.FC = () => {
  const { jsonData, isValid } = useJsonStore();
  
  const stats = isValid ? getJsonStats(jsonData) : null;

  const formatSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="w-80 bg-white dark:bg-gray-900 border-l border-gray-200 dark:border-gray-700 flex flex-col">
      

      {/* Stats Section */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-2 mb-3">
          <Info size={18} className="text-gray-500" />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">JSON Stats</span>
        </div>
        
        {stats ? (
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Size:</span>
              <span className="font-mono text-gray-900 dark:text-white">{formatSize(stats.size)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Depth:</span>
              <span className="font-mono text-gray-900 dark:text-white">{stats.depth}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Keys:</span>
              <span className="font-mono text-gray-900 dark:text-white">{stats.keys}</span>
            </div>
          </div>
        ) : (
          <div className="text-sm text-gray-500 dark:text-gray-400 italic">
            {isValid ? 'No data' : 'Invalid JSON'}
          </div>
        )}
      </div>

      

      {/* Help Section */}
      <div className="p-4 flex-1">
        <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          Keyboard Shortcuts
        </div>
        <div className="space-y-2 text-xs text-gray-600 dark:text-gray-400">
          <div className="flex justify-between">
            <span>Format JSON</span>
            <kbd className="px-1 py-0.5 bg-gray-200 dark:bg-gray-700 rounded">Ctrl+Shift+F</kbd>
          </div>
          <div className="flex justify-between">
            <span>Copy JSON</span>
            <kbd className="px-1 py-0.5 bg-gray-200 dark:bg-gray-700 rounded">Ctrl+C</kbd>
          </div>
          <div className="flex justify-between">
            <span>Paste JSON</span>
            <kbd className="px-1 py-0.5 bg-gray-200 dark:bg-gray-700 rounded">Ctrl+V</kbd>
          </div>
          <div className="flex justify-between">
            <span>Undo</span>
            <kbd className="px-1 py-0.5 bg-gray-200 dark:bg-gray-700 rounded">Ctrl+Z</kbd>
          </div>
          <div className="flex justify-between">
            <span>Redo</span>
            <kbd className="px-1 py-0.5 bg-gray-200 dark:bg-gray-700 rounded">Ctrl+Y</kbd>
          </div>
        </div>
      </div>
    </div>
  );
};