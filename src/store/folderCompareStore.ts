import { create } from 'zustand';
import { FolderFile } from '../features/folder-compare/types';

interface FolderCompareStore {
  leftFolderFiles: FolderFile[];
  rightFolderFiles: FolderFile[];
  activeCompareFile: string | null;

  setLeftFolderFiles: (files: FolderFile[]) => void;
  setRightFolderFiles: (files: FolderFile[]) => void;
  setActiveCompareFile: (path: string | null) => void;
}

export const useFolderCompareStore = create<FolderCompareStore>((set) => ({
  leftFolderFiles: [],
  rightFolderFiles: [],
  activeCompareFile: null,

  setLeftFolderFiles: (files) => set({ leftFolderFiles: files }),
  setRightFolderFiles: (files) => set({ rightFolderFiles: files }),
  setActiveCompareFile: (path) => set({ activeCompareFile: path }),
}));
