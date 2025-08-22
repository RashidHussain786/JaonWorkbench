import React, { useMemo } from 'react';
import { useJsonStore } from '../../../store/jsonStore';
import { CompareEditorLayout } from '../../json-data/components';
import { useFolderOperations } from '../hooks/useFolderOperations';
import { FolderPlus } from 'lucide-react';

// The Tab component is now simpler, it doesn't need a "missing" state
const Tab: React.FC<{ path: string; isActive: boolean; onClick: () => void; }> = ({ path, isActive, onClick }) => {
  const baseClasses = 'px-3 py-2 text-sm whitespace-nowrap cursor-pointer transition-colors duration-150';
  const activeClasses = 'border-b-2 border-blue-500 text-blue-500 dark:text-blue-400 bg-blue-50 dark:bg-gray-800';
  const inactiveClasses = 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800';

  const classes = `${baseClasses} ${isActive ? activeClasses : inactiveClasses}`;

  const fileName = path.split('/').pop();

  return (
    <button onClick={onClick} className={classes} title={path}>
      {fileName}
    </button>
  );
};

// The TabPanel now only knows about its own files
const TabPanel: React.FC<{ isLeftPanel: boolean }> = ({ isLeftPanel }) => {
  const { leftFolderFiles, rightFolderFiles, activeCompareFile, setActiveCompareFile } = useJsonStore();
  const { selectLeftFolder, selectRightFolder } = useFolderOperations();

  const files = isLeftPanel ? leftFolderFiles : rightFolderFiles;
  const selectFolder = isLeftPanel ? selectLeftFolder : selectRightFolder;

  // Scroll active tab into view
  React.useEffect(() => {
    // This functionality is removed as per user request to remove custom horizontal scrolling
    // If default browser scroll-into-view is desired, it would need to be re-added here
  }, [activeCompareFile, files]);

  if (files.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-start px-1 py-1 bg-gray-50 dark:bg-gray-900/50">
        <button
          onClick={selectFolder}
          className="flex items-center space-x-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
        >
          <FolderPlus size={20} />
          <span>Select Folder</span>
        </button>
        <p className="text-sm text-orange-500 dark:text-orange-400 ml-2">
          For best results, select folders with similar structures (e.g., 'project-v1' and 'project-v2').
        </p>
      </div>
    );
  }

  return (
    <div className="flex overflow-x-auto bg-gray-50 dark:bg-gray-900/50">
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

export const FolderCompareLayout: React.FC = () => {
  const { leftFolderFiles, rightFolderFiles, activeCompareFile } = useJsonStore();

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
      <div className="grid grid-cols-2 min-h-0 border-b border-gray-200 dark:border-gray-700 gap-x-4">
        <div className="flex flex-col min-w-0">
          <TabPanel isLeftPanel={true} />
        </div>
        <div className="flex flex-col min-w-0 border-l border-gray-200 dark:border-gray-700">
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
