import React from 'react';
import { GitMerge, FileCode, Table } from 'lucide-react';
import { useMainEditorStore } from '../../../store/mainEditorStore';
import { ViewMode } from '../../../common/types';

export const ModeSelector: React.FC = () => {
  const { activeMode, setActiveMode } = useMainEditorStore();

  const modes: Array<{ id: ViewMode; icon: React.ReactNode }> = [
    { id: 'tree', icon: <GitMerge size={18} /> },
    { id: 'code', icon: <FileCode size={18} /> },
    { id: 'table', icon: <Table size={18} /> },
  ];

  return (
    <div className="flex bg-light-surface dark:bg-dark-surface rounded-lg p-1 space-x-1 mode-selector" data-tourid="mode-selector">
      {modes.map(({ id, icon }) => (
        <button
          key={id}
          onClick={() => setActiveMode(id)}
          className={`px-2 py-1 rounded-md transition-all duration-200 ${activeMode === id
            ? 'bg-light-primary text-white dark:bg-light-primary dark:text-dark-text-primary shadow-sm'
            : 'text-light-text-secondary dark:bg-dark-surface dark:text-dark-text-secondary hover:text-light-text-primary dark:hover:bg-dark-border dark:hover:text-dark-text-primary'
            }`}
        >
          {icon}
        </button>
      ))}
    </div>
  );
};