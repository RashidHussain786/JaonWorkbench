import React from 'react';
import { GitMerge, FileCode, Table } from 'lucide-react';
import { useJsonStore } from '../../../store/jsonStore';
import { ViewMode } from '../../../common/types';

export const ModeSelector: React.FC = () => {
  const { activeMode, setActiveMode } = useJsonStore();

  const modes: Array<{ id: ViewMode; icon: React.ReactNode }> = [
    { id: 'tree', icon: <GitMerge size={18} /> },
    { id: 'code', icon: <FileCode size={18} /> },
    { id: 'table', icon: <Table size={18} /> },
  ];

  return (
    <div className="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1 space-x-1">
      {modes.map(({ id, icon }) => (
        <button
          key={id}
          onClick={() => setActiveMode(id)}
          className={`p-2 rounded-md transition-all duration-200 ${activeMode === id
              ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
            }`}
        >
          {icon}
        </button>
      ))}
    </div>
  );
};