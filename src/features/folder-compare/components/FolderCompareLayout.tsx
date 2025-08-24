import React, { useMemo } from 'react';
import { useFolderCompareStore } from '../../../store/folderCompareStore';
import CompareEditorLayout from '../../json-data/components/CompareEditorLayout';
import { useFolderOperations } from '../hooks/useFolderOperations';
import { FolderPlus } from 'lucide-react';

const Tab: React.FC<{ path: string; isActive: boolean; onClick: () => void; }> = ({ path, isActive, onClick }) => {
  const baseClasses = 'px-3 py-2 text-sm whitespace-nowrap cursor-pointer transition-colors duration-150';
  const activeClasses = 'border-b-2 border-light-primary text-light-primary bg-light-surface dark:bg-dark-surface';
  const inactiveClasses = 'text-light-text-secondary dark:text-dark-text-secondary hover:bg-light-border dark:hover:bg-dark-border';

  const classes = `${baseClasses} ${isActive ? activeClasses : inactiveClasses}`;

  const fileName = path.split('/').pop();

  return (
    <button onClick={onClick} className={classes} title={path}>
      {fileName}
    </button>
  );
};

const TabPanel: React.FC<{ isLeftPanel: boolean }> = ({ isLeftPanel }) => {
  const { leftFolderFiles, rightFolderFiles, activeCompareFile, setActiveCompareFile } = useFolderCompareStore();
  const { selectLeftFolder, selectRightFolder } = useFolderOperations();

  const files = isLeftPanel ? leftFolderFiles : rightFolderFiles;
  const selectFolder = isLeftPanel ? selectLeftFolder : selectRightFolder;

  React.useEffect(() => {
  }, [activeCompareFile, files]);

  if (files.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-start px-1 py-1 bg-light-background dark:bg-dark-background/50">
        <button
          onClick={selectFolder}
          className="flex items-center space-x-2 px-4 py-2 bg-light-surface text-light-text-primary rounded-md hover:bg-light-border transition-colors dark:bg-dark-surface dark:text-dark-text-primary dark:hover:bg-dark-border"
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
    <div className="flex overflow-x-auto bg-light-background dark:bg-dark-background/50">
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

const FolderCompareLayout: React.FC = () => {
  const { leftFolderFiles, rightFolderFiles, activeCompareFile } = useFolderCompareStore();

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
    <div className="flex flex-col h-full">
      <div className="grid grid-cols-2 min-h-0 border-b border-light-border dark:border-dark-border gap-x-4">
        <div className="flex flex-col min-w-0">
          <TabPanel isLeftPanel={true} />
        </div>
        <div className="flex flex-col min-w-0 border-l border-light-border dark:border-dark-border">
          <TabPanel isLeftPanel={false} />
        </div>
      </div>
      <div className="flex-1 min-h-0">
        <CompareEditorLayout
          originalContent={activeFileContent.left}
          modifiedContent={activeFileContent.right}
          showControls={false}
        />
      </div>
    </div>
  );
};

export default FolderCompareLayout;