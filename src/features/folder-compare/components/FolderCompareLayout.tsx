import React, { useMemo, useRef, useEffect } from 'react';
import { useFolderCompareStore } from '../../../store/folderCompareStore';
import CompareEditorLayout from '../../json-data/components/CompareEditorLayout';
import { useFolderOperations } from '../hooks/useFolderOperations';
import { FolderPlus, X } from 'lucide-react';

interface FolderCompareLayoutProps {
  handleExitCompareMode: () => void;
}

const Tab: React.FC<{ path: string; isActive: boolean; onClick: () => void; }> = ({ path, isActive, onClick }) => {
  const baseClasses = 'px-3 py-2 text-sm whitespace-nowrap cursor-pointer transition-colors duration-150';
  const activeClasses = 'border-b-2 border-light-primary text-light-primary bg-light-surface dark:bg-dark-surface';
  const inactiveClasses = 'text-light-text-secondary dark:text-dark-text-secondary hover:bg-light-border dark:hover:bg-dark-border';

  const classes = `${baseClasses} ${isActive ? activeClasses : inactiveClasses}`;

  const fileName = path.split('/').pop();

  return (
    <button onClick={onClick} className={classes} title={path} data-path={path}>
      {fileName}
    </button>
  );
};

const TabPanel: React.FC <{
  isLeftPanel: boolean;
  isSelecting: boolean;
  selectFolder: () => void;
}> = ({ isLeftPanel, isSelecting, selectFolder }) => {
  const { leftFolderFiles, rightFolderFiles, activeCompareFile, setActiveCompareFile } = useFolderCompareStore();
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const files = isLeftPanel ? leftFolderFiles : rightFolderFiles;

  useEffect(() => {
    if (scrollContainerRef.current && activeCompareFile) {
      const activeTab = scrollContainerRef.current.querySelector(`[data-path="${activeCompareFile.replace(/"/g, '\"')}"]`) as HTMLElement;
      if (activeTab) {
        activeTab.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    }
  }, [activeCompareFile]);

  if (files.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-start px-1 py-1 bg-light-background dark:bg-dark-background/50">
        <button
          onClick={selectFolder}
          disabled={isSelecting}
          className="flex items-center space-x-2 px-4 py-2 bg-light-surface text-light-text-primary rounded-md hover:bg-light-border transition-colors dark:bg-dark-surface dark:text-dark-text-primary dark:hover:bg-dark-border disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <FolderPlus size={20} />
          <span>Select</span>
        </button>
        <p className="text-sm text-light-text-secondary dark:text-orange-400 ml-2">
          For best results, select folders with similar structures (e.g., 'project-v1' and 'project-v2').
        </p>
      </div>
    );
  }

  return (
    <div ref={scrollContainerRef} className="flex overflow-x-auto bg-light-background dark:bg-dark-background/50">
      {files.map(file => (
        <Tab
          key={file.path}
          path={file.path}
          isActive={file.path === activeCompareFile}
          onClick={() => setActiveCompareFile(file.path)}
        />
      ))}
    </div>
  );
};

const FolderCompareLayout: React.FC<FolderCompareLayoutProps> = ({ handleExitCompareMode }) => {
  const { leftFolderFiles, rightFolderFiles, activeCompareFile } = useFolderCompareStore();
  const { selectLeftFolder, selectRightFolder, isSelecting } = useFolderOperations();

  const activeFileContent = useMemo(() => {
    if (!activeCompareFile) {
      const message = (leftFolderFiles.length > 0 || rightFolderFiles.length > 0)
        ? 'Select a file to see the comparison'
        : 'Select a folder to begin';
      return { left: message, right: message };
    }
    const leftFile = leftFolderFiles.find(f => f.path === activeCompareFile);
    const rightFile = rightFolderFiles.find(f => f.path === activeCompareFile);
    return {
      left: leftFile?.content ?? 'File not found on this side',
      right: rightFile?.content ?? 'File not found on this side',
    };
  }, [activeCompareFile, leftFolderFiles, rightFolderFiles]);

  return (
    <div className="flex flex-col h-full relative">
      <button
        onClick={handleExitCompareMode}
        className="absolute top-2 right-2 z-10 px-2 py-1 bg-red-200 dark:bg-red-800 hover:bg-red-500 dark:hover:bg-red-600 rounded-md transition-colors"
        title="Exit Compare Mode"
      >
        <X size={18} className="text-gray-700 dark:text-dark-text-secondary" />
      </button>
      <div className="grid grid-cols-2 min-h-0 border-b border-light-border dark:border-dark-border gap-x-4">
        <div className="flex flex-col min-w-0">
          <TabPanel 
            isLeftPanel={true} 
            isSelecting={isSelecting} 
            selectFolder={selectLeftFolder} 
          />
        </div>
        <div className="flex flex-col min-w-0 border-l border-light-border dark:border-dark-border">
          <TabPanel 
            isLeftPanel={false} 
            isSelecting={isSelecting} 
            selectFolder={selectRightFolder} 
          />
        </div>
      </div>
      <div className="flex-1 min-h-0">
        <CompareEditorLayout
          originalContent={activeFileContent.left}
          modifiedContent={activeFileContent.right}
          showControls={false}
          handleExitCompareMode={handleExitCompareMode}
        />
      </div>
    </div>
  );
};

export default FolderCompareLayout;
