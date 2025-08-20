import { useCallback } from 'react';
import toast from 'react-hot-toast';
import { exportToFile, copyToClipboard, readFromClipboard } from '../utils/fileHelpers';
import { useJsonData } from '../../json-data/hooks/useJsonData';

export const useFileOperations = () => {
  const { jsonData, jsonString, setJsonString, formatJson, minifyJson, undo, redo, canUndo, canRedo } = useJsonData();

  const handleExport = useCallback(() => {
    try {
      exportToFile(jsonData);
      toast.success('JSON exported successfully!');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Export failed');
    }
  }, [jsonData]);

  const handleCopy = useCallback(async () => {
    const success = await copyToClipboard(jsonString);
    if (success) {
      toast.success('JSON copied to clipboard!');
    } else {
      toast.error('Failed to copy to clipboard');
    }
  }, [jsonString]);

  const handlePaste = useCallback(async () => {
    const text = await readFromClipboard();
    if (text) {
      setJsonString(text, 'paste');
      toast.success('JSON pasted from clipboard!');
    } else {
      toast.error('Failed to read from clipboard');
    }
  }, [setJsonString]);

  const handleFormat = useCallback(() => {
    formatJson();
    toast.success('JSON formatted!');
  }, [formatJson]);

  const handleMinify = useCallback(() => {
    minifyJson();
    toast.success('JSON minified!');
  }, [minifyJson]);

  return {
    handleExport,
    handleCopy,
    handlePaste,
    handleFormat,
    handleMinify,
    undo,
    redo,
    canUndo,
    canRedo,
  };
};
