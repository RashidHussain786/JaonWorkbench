import React, { useState } from 'react';
import { GitCompare } from 'lucide-react';
import { useCompareStore } from '../../../store/compareStore';

export const CompareButton: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { setIsComparing, setCompareMode } = useCompareStore();

  const handleCompareOption = (mode: 'file' | 'json' | 'folder') => {
    setCompareMode(mode);
    setIsComparing(true);
    setIsOpen(false);
  };

  return (
    <div className="flex items-center space-x-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="px-2 py-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-md transition-colors"
          title="Compare JSON/Files/Folders"
        >
          <GitCompare size={18} className="text-gray-700 dark:text-gray-300" />
        </button>

        {isOpen && (
          <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-800 rounded-md shadow-lg z-10">
            <button
              onClick={() => handleCompareOption('json')}
              className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              Compare JSON
            </button>
            <button
              onClick={() => handleCompareOption('file')}
              className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              Compare File
            </button>
            <button
              onClick={() => handleCompareOption('folder')}
              className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              Compare Folder
            </button>
          </div>
        )}
      </div>
    </div>
  );
};