import { useCallback } from 'react';
import toast from 'react-hot-toast';
import { exportToFile, copyToClipboard, readFromClipboard } from '../utils/fileHelpers';
import { useJsonData } from '../../json-data/hooks/useJsonData';
import { useMainEditorStore } from '../../../store/mainEditorStore';
import { isBase64, formatJson as formatJsonUtil } from '../../../utils/jsonHelpers';
import '../../../common/components/WarningToast';
import { escapeHtml } from '../../../utils/sanitize';

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
  const { inputType, setJsonString: setMainEditorJsonString, setInputType, jsonString: mainEditorJsonString } = useMainEditorStore();

  const handleExport = useCallback(() => {
    try {
      exportToFile(jsonData);
      toast.success('JSON exported successfully!');
    } catch (error) {
      toast.error(escapeHtml(error instanceof Error ? error.message : 'Export failed'));
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
      if (inputType === 'base64') {
        setMainEditorJsonString(text.trim());
      } else {
        setJsonString(text.trim(), 'paste');
      }
      toast.success('Content pasted from clipboard!');
    } else {
      toast.error('Failed to read from clipboard');
    }
  }, [setJsonString, setMainEditorJsonString, inputType]);

  const handleFormat = useCallback(() => {
    formatJson();
    toast.success('JSON formatted!');
  }, [formatJson]);

  const handleMinify = useCallback(() => {
    minifyJson();
    toast.success('JSON minified!');
  }, [minifyJson]);

  const handleDecodeBase64 = useCallback(() => {
    const contentToDecode = inputType === 'base64' ? mainEditorJsonString : jsonString;

    if (!contentToDecode) {
      toast.error('No content to decode.');
      return;
    }

    if (!isBase64(contentToDecode)) {
      toast.error('Content is not a valid Base64 string.');
      return;
    }

    try {
      const decoded = atob(contentToDecode);
      try {
        const parsedJson = JSON.parse(decoded);
        const formattedJson = formatJsonUtil(parsedJson);
        setJsonString(formattedJson, 'decode_base64');
        setInputType('json');
        toast.success('Base64 decoded and formatted as JSON!');
      } catch {
        setMainEditorJsonString(decoded);
        (toast as any).warning('Decoded successfully, but the content is not valid JSON.');
      }
    } catch (error) {
      toast.error('Failed to decode Base64: ' + escapeHtml(error instanceof Error ? error.message : 'Unknown error'));
    }
  }, [jsonString, setJsonString, setInputType, inputType, mainEditorJsonString, setMainEditorJsonString]);

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