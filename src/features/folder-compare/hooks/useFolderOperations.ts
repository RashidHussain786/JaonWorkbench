import { useFolderCompareStore } from '../../../store/folderCompareStore';
import { FolderFile } from '../types';
import { toast } from 'react-hot-toast';
import { useState } from 'react';
import { createDirectoryPicker } from '../../../utils/filePicker';
import { escapeHtml } from '../../../utils/sanitize';

// This hook encapsulates the logic for selecting and reading folder contents.
export const useFolderOperations = () => {
  const { setLeftFolderFiles, setRightFolderFiles, setActiveCompareFile, leftFolderFiles, rightFolderFiles } = useFolderCompareStore();
  const [isSelecting, setIsSelecting] = useState(false);

  // Generic function to read files from a FileList, normalizing their paths
  const readFilesInDirectory = (files: FileList): Promise<FolderFile[]> => {
    return new Promise((resolve) => {
      const folderFiles: FolderFile[] = [];
      let filesToProcess = files.length;

      if (filesToProcess === 0) {
        resolve([]);
        return;
      }

      const firstFilePath: string = files[0].webkitRelativePath;
      const rootFolderName = firstFilePath.split('/')[0];
      const rootFolderNameWithSlash: string = rootFolderName + '/';

      for (const file of files) {
        const reader = new FileReader();
        reader.onload = (e) => {
          // Normalize the path by removing the root folder name
          const normalizedPath = file.webkitRelativePath.replace(rootFolderNameWithSlash, '');
          folderFiles.push({
            path: normalizedPath,
            content: e.target?.result as string,
          });
          filesToProcess--;
          if (filesToProcess === 0) {
            resolve(folderFiles.sort((a, b) => a.path.localeCompare(b.path)));
          }
        };
        reader.onerror = () => {
          toast.error(`Error reading file: ${escapeHtml(file.name)}`);
          filesToProcess--;
          if (filesToProcess === 0) {
            resolve(folderFiles.sort((a, b) => a.path.localeCompare(b.path)));
          }
        };
        reader.readAsText(file);
      }
    });
  };
  // Handler for selecting the left folder
  const selectLeftFolder = async () => {
    setIsSelecting(true);
    const { input, promise } = createDirectoryPicker();
    document.body.appendChild(input);
    input.click();

    const filesList = await promise;

    if (!filesList) {
      toast.error('Folder selection cancelled or failed.');
      setIsSelecting(false);
      return;
    }
    const files = await readFilesInDirectory(filesList);
    setLeftFolderFiles(files);
    toast.success(`${files.length} files loaded for the left side.`);

    // If this is the first folder being loaded, set its first file as active
    if (rightFolderFiles.length === 0 && files.length > 0) {
      setActiveCompareFile(files[0].path);
    }
    setIsSelecting(false);
  };

  // Handler for selecting the right folder
  const selectRightFolder = async () => {
    setIsSelecting(true);
    const { input, promise } = createDirectoryPicker();
    document.body.appendChild(input);
    input.click();

    const filesList = await promise;

    if (!filesList) {
      toast.error('Folder selection cancelled or failed.');
      setIsSelecting(false);
      return;
    }
    const files = await readFilesInDirectory(filesList);
    setRightFolderFiles(files);
    toast.success(`${files.length} files loaded for the right side.`);

    // If this is the first folder being loaded, set its first file as active
    if (leftFolderFiles.length === 0 && files.length > 0) {
      setActiveCompareFile(files[0].path);
    }
    setIsSelecting(false);
  };

  return { selectLeftFolder, selectRightFolder, isSelecting };
};
