import { useCallback } from 'react';
import toast from 'react-hot-toast';
import { exportToFile, copyToClipboard, readFromClipboard } from '../utils/fileHelpers';
import { useJsonData } from '../../json-data/hooks/useJsonData';
import { useMainEditorStore } from '../../../store/mainEditorStore';
import { isBase64, formatJson as formatJsonUtil } from '../../../utils/jsonHelpers';

interface UseFileOperationsReturn {
  handleExport: () => void;
  handleCopy: () => Promise<void>;
  handlePaste: () => Promise<void>;
  handleFormat: () => void;
  handleMinify: () => void;
  undo: () => void;
  redo: () => void;
  canUndo: () => boolean;
  canRedo: () => boolean;
  handleDecodeBase64: () => void;
}

export const useFileOperations = (): UseFileOperationsReturn => {
  const { jsonData, jsonString, setJsonString, formatJson, minifyJson, undo, redo, canUndo, canRedo } = useJsonData();
  const { setInputType } = useMainEditorStore();

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
      setJsonString(text.trim(), 'paste');
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

  const handleDecodeBase64 = useCallback(() => {
    if (!jsonString) {
      toast.error('No content to decode.');
      return;
    }

    if (!isBase64(jsonString)) {
      toast.error('Content is not a valid Base64 string.');
      return;
    }

    try {
      const decoded = atob(jsonString);
      let parsedJson;
      try {
        parsedJson = JSON.parse(decoded);
      } catch (jsonError) {
        toast.error('Decoded content is not valid JSON.');
        return;
      }

      const formattedJson = formatJsonUtil(parsedJson);
      setJsonString(formattedJson, 'decode_base64');
      setInputType('json');
      toast.success('Base64 decoded and formatted as JSON!');
    } catch (error) {
      toast.error('Failed to decode Base64: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  }, [jsonString, setJsonString, setInputType]);

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
    handleDecodeBase64,
  };
};