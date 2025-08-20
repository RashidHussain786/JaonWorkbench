import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileJson } from 'lucide-react';
import { useJsonStore } from '../store/jsonStore';
import { importFromFile } from '../utils/fileHelpers';
import toast from 'react-hot-toast';

export const FileDropzone: React.FC = () => {
  const { setJsonData, setLoading } = useJsonStore();

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;
    
    const file = acceptedFiles[0];
    setLoading(true);
    
    try {
      const result = await importFromFile(file);
      if (result.success && result.data) {
        setJsonData(result.data, 'import');
        toast.success(`Imported ${file.name} successfully!`);
      } else {
        toast.error(result.error || 'Failed to import file');
      }
    } catch (error) {
      toast.error('Failed to process file');
    } finally {
      setLoading(false);
    }
  }, [setJsonData, setLoading]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/json': ['.json'],
      'text/plain': ['.txt'],
    },
    maxFiles: 1,
    maxSize: 100 * 1024 * 1024, // 100MB
  });

  return (
    <div
      {...getRootProps()}
      className={`
        fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm
        transition-all duration-300 pointer-events-none opacity-0
        ${isDragActive ? 'opacity-100 pointer-events-auto' : ''}
      `}
    >
      <input {...getInputProps()} />
      <div className={`
        bg-white dark:bg-gray-800 rounded-lg border-2 border-dashed p-8 text-center max-w-md mx-4
        transition-all duration-300 transform
        ${isDragActive 
          ? 'border-blue-400 bg-blue-50 dark:bg-blue-900/20 scale-105' 
          : 'border-gray-300 dark:border-gray-600 scale-100'
        }
      `}>
        <FileJson size={48} className={`mx-auto mb-4 ${isDragActive ? 'text-blue-500' : 'text-gray-400'}`} />
        <div className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          {isDragActive ? 'Drop your JSON file here!' : 'Drop JSON file to import'}
        </div>
        <div className="text-sm text-gray-600 dark:text-gray-400">
          Supports JSON and TXT files up to 100MB
        </div>
      </div>
    </div>
  );
};