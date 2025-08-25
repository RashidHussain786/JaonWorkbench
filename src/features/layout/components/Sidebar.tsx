import React, { useEffect } from 'react';
import { Info, ChevronsRight, ChevronsLeft } from 'lucide-react';
import { useJsonData } from '../../json-data/hooks/useJsonData';
import { getJsonStats } from '../../../utils/jsonHelpers';
import { useSidebarStore } from '../../../store/sidebarStore';
import { useCompareStore } from '../../../store/compareStore';

export const Sidebar: React.FC = () => {
  const { jsonData, isValid } = useJsonData();
  const { isCollapsed, setIsCollapsed } = useSidebarStore();
  const { isComparing } = useCompareStore();

  useEffect(() => {
    if (isComparing) {
      setIsCollapsed(true);
    } else {
      setIsCollapsed(false);
    }
  }, [isComparing, setIsCollapsed]);

  const stats = isValid ? getJsonStats(jsonData) : null;

  const formatSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div
      className={`
        bg-light-surface dark:bg-dark-background border-l border-light-border dark:border-dark-border
        flex flex-col transition-all duration-300 ease-in-out
        ${isCollapsed ? 'w-16' : 'w-80'}
      `}
    >
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="p-2 hover:bg-light-border dark:hover:bg-dark-border transition-colors"
      >
        {isCollapsed ? <ChevronsLeft size={18} /> : <ChevronsRight size={18} />}
      </button>

      <div className={`flex-1 overflow-y-auto ${isCollapsed ? 'hidden' : ''}`}>
        {/* Stats Section */}
        <div className="p-4 border-b border-light-border dark:border-dark-border">
          <div className="flex items-center space-x-2 mb-3">
            <Info size={18} className="text-light-text-secondary" />
            <span className="text-sm font-medium text-light-text-primary dark:text-dark-text-secondary">JSON Stats</span>
          </div>

          {stats ? (
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-light-text-secondary dark:text-dark-text-secondary">Size:</span>
                <span className="font-mono text-light-text-primary dark:text-dark-text-primary">{formatSize(stats.size)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-light-text-secondary dark:text-dark-text-secondary">Depth:</span>
                <span className="font-mono text-light-text-primary dark:text-dark-text-primary">{stats.depth}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-light-text-secondary dark:text-dark-text-secondary">Keys:</span>
                <span className="font-mono text-light-text-primary dark:text-dark-text-primary">{stats.keys}</span>
              </div>
            </div>
          ) : (
            <div className="text-sm text-light-text-secondary dark:text-dark-text-secondary italic">
              {isValid ? 'No data' : 'Invalid JSON'}
            </div>
          )}
        </div>

        {/* Help Section */}
        <div className="p-4 flex-1">
          <div className="text-sm font-medium text-light-text-primary dark:text-dark-text-secondary mb-3">
            Keyboard Shortcuts
          </div>
          <div className="space-y-2 text-xs text-light-text-secondary dark:text-dark-text-secondary">
            <div className="flex justify-between">
              <span>Format JSON</span>
              <kbd className="px-1 py-0.5 bg-light-border dark:bg-dark-surface rounded">Ctrl+Shift+F</kbd>
            </div>
            <div className="flex justify-between">
              <span>Copy JSON</span>
              <kbd className="px-1 py-0.5 bg-light-border dark:bg-dark-surface rounded">Ctrl+C</kbd>
            </div>
            <div className="flex justify-between">
              <span>Paste JSON</span>
              <kbd className="px-1 py-0.5 bg-light-border dark:bg-dark-surface rounded">Ctrl+V</kbd>
            </div>
            <div className="flex justify-between">
              <span>Undo</span>
              <kbd className="px-1 py-0.5 bg-light-border dark:bg-dark-surface rounded">Ctrl+Z</kbd>
            </div>
            <div className="flex justify-between">
              <span>Redo</span>
              <kbd className="px-1 py-0.5 bg-light-border dark:bg-dark-surface rounded">Ctrl+Y</kbd>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
