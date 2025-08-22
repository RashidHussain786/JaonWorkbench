import { useJsonStore } from '../../../store/jsonStore';
import { FolderFile } from '../types';
import { toast } from 'react-hot-toast';

// This hook encapsulates the logic for selecting and reading folder contents.
export const useFolderOperations = () => {
  const { setLeftFolderFiles, setRightFolderFiles, setActiveCompareFile, leftFolderFiles, rightFolderFiles } = useJsonStore();

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
          toast.error(`Error reading file: ${file.name}`);
          filesToProcess--;
          if (filesToProcess === 0) {
            resolve(folderFiles.sort((a, b) => a.path.localeCompare(b.path)));
          }
        };
        reader.readAsText(file);
      }
    });
  };

  // Programmatically opens the directory selector
  const selectDirectory = (): Promise<FileList | null> => {
    return new Promise((resolve) => {
      const input = document.createElement('input');
      input.type = 'file';
      input.webkitdirectory = true;
      input.multiple = true;
      document.body.appendChild(input);
      input.style.display = 'none';

      let resolved = false;

      input.onchange = (e: any) => {
        if (resolved) return;
        resolved = true;
        if (e.target.files.length > 0) {
          resolve(e.target.files);
        } else {
          resolve(null);
        }
        document.body.removeChild(input);
        window.removeEventListener('focus', onFocus);
      };

      const onFocus = () => {
        setTimeout(() => {
          if (!resolved) {
            resolved = true;
            resolve(null);
            document.body.removeChild(input);
            window.removeEventListener('focus', onFocus);
          }
        }, 500);
      };

      window.addEventListener('focus', onFocus);
      input.click();
    });
  };

  // Handler for selecting the left folder
  const selectLeftFolder = async () => {
    const filesList = await selectDirectory();
    if (!filesList) {
      toast.error('Folder selection cancelled or failed.');
      return;
    }
    const files = await readFilesInDirectory(filesList);
    setLeftFolderFiles(files);
    toast.success(`${files.length} files loaded for the left side.`);

    // If this is the first folder being loaded, set its first file as active
    if (rightFolderFiles.length === 0 && files.length > 0) {
      setActiveCompareFile(files[0].path);
    }
  };

  // Handler for selecting the right folder
  const selectRightFolder = async () => {
    const filesList = await selectDirectory();
    if (!filesList) {
      toast.error('Folder selection cancelled or failed.');
      return;
    }
    const files = await readFilesInDirectory(filesList);
    setRightFolderFiles(files);
    toast.success(`${files.length} files loaded for the right side.`);

    // If this is the first folder being loaded, set its first file as active
    if (leftFolderFiles.length === 0 && files.length > 0) {
      setActiveCompareFile(files[0].path);
    }

    // Check for root mismatch after both folders are loaded
    // if (leftOriginalRoot && rightOriginalRoot && leftOriginalRoot !== rightOriginalRoot) {
    //   toast.error(`Root folders are different: '${leftOriginalRoot}' vs '${rightOriginalRoot}'. File matching might be inconsistent if folder structures are not parallel.`, { duration: 8000 });
    // }
  };

  return { selectLeftFolder, selectRightFolder };
};
