import { useState, useRef } from 'react';
import * as monaco from 'monaco-editor';

export const useCompareSearch = () => {
  const [originalMatches, setOriginalMatches] = useState<monaco.editor.FindMatch[]>([]);
  const [modifiedMatches, setModifiedMatches] = useState<monaco.editor.FindMatch[]>([]);
  const [currentOriginalMatchIndex, setCurrentOriginalMatchIndex] = useState(-1);
  const [currentModifiedMatchIndex, setCurrentModifiedMatchIndex] = useState(-1);

  const originalDecorationsRef = useRef<string[]>([]);
  const modifiedDecorationsRef = useRef<string[]>([]);

  const handleSearch = (editor: monaco.editor.IStandaloneCodeEditor | null, query: string, isOriginal: boolean) => {
    if (!editor) return;

    const model = editor.getModel();
    if (!model) return;

    const matches = model.findMatches(query, true, false, true, null, true) || [];
    const decorations: monaco.editor.IModelDeltaDecoration[] = matches.map(match => ({
      range: match.range,
      options: { className: isOriginal ? 'search-highlight-original' : 'search-highlight-modified', isWholeLine: false },
    }));

    if (isOriginal) {
      originalDecorationsRef.current = editor.deltaDecorations(originalDecorationsRef.current, decorations);
      setOriginalMatches(matches);
      setCurrentOriginalMatchIndex(matches.length > 0 ? 0 : -1);
      if (matches.length > 0) {
        editor.revealRangeInCenterIfOutsideViewport(matches[0].range);
      }
    } else {
      modifiedDecorationsRef.current = editor.deltaDecorations(modifiedDecorationsRef.current, decorations);
      setModifiedMatches(matches);
      setCurrentModifiedMatchIndex(matches.length > 0 ? 0 : -1);
      if (matches.length > 0) {
        editor.revealRangeInCenterIfOutsideViewport(matches[0].range);
      }
    }
  };

  const handleNextMatch = (editor: monaco.editor.IStandaloneCodeEditor | null, isOriginal: boolean) => {
    if (!editor) return;

    const matches = isOriginal ? originalMatches : modifiedMatches;
    let currentIndex = isOriginal ? currentOriginalMatchIndex : currentModifiedMatchIndex;

    if (matches.length === 0) return;

    currentIndex = (currentIndex + 1) % matches.length;

    if (isOriginal) {
      setCurrentOriginalMatchIndex(currentIndex);
    } else {
      setCurrentModifiedMatchIndex(currentIndex);
    }

    const newDecorations = matches.map((match, index) => ({
      range: match.range,
      options: { 
        className: isOriginal ? 'search-highlight-original' : 'search-highlight-modified',
        isWholeLine: false,
        ...(index === currentIndex && { className: isOriginal ? 'search-highlight-original current-search-match' : 'search-highlight-modified current-search-match' })
      },
    }));

    if (isOriginal) {
      originalDecorationsRef.current = editor.deltaDecorations(originalDecorationsRef.current, newDecorations);
    } else {
      modifiedDecorationsRef.current = editor.deltaDecorations(modifiedDecorationsRef.current, newDecorations);
    }

    editor.revealRangeInCenterIfOutsideViewport(matches[currentIndex].range);
  };

  const handlePreviousMatch = (editor: monaco.editor.IStandaloneCodeEditor | null, isOriginal: boolean) => {
    if (!editor) return;

    const matches = isOriginal ? originalMatches : modifiedMatches;
    let currentIndex = isOriginal ? currentOriginalMatchIndex : currentModifiedMatchIndex;

    if (matches.length === 0) return;

    currentIndex = (currentIndex - 1 + matches.length) % matches.length;

    if (isOriginal) {
      setCurrentOriginalMatchIndex(currentIndex);
    } else {
      setCurrentModifiedMatchIndex(currentIndex);
    }

    const newDecorations = matches.map((match, index) => ({
      range: match.range,
      options: { 
        className: isOriginal ? 'search-highlight-original' : 'search-highlight-modified',
        isWholeLine: false,
        ...(index === currentIndex && { className: isOriginal ? 'search-highlight-original current-search-match' : 'search-highlight-modified current-search-match' })
      },
    }));

    if (isOriginal) {
      originalDecorationsRef.current = editor.deltaDecorations(originalDecorationsRef.current, newDecorations);
    } else {
      modifiedDecorationsRef.current = editor.deltaDecorations(modifiedDecorationsRef.current, newDecorations);
    }

    editor.revealRangeInCenterIfOutsideViewport(matches[currentIndex].range);
  };

  return {
    originalMatches,
    modifiedMatches,
    currentOriginalMatchIndex,
    currentModifiedMatchIndex,
    handleSearch,
    handleNextMatch,
    handlePreviousMatch,
    setCurrentOriginalMatchIndex,
    setCurrentModifiedMatchIndex,
  };
}; // Added a comment to force re-compilation
