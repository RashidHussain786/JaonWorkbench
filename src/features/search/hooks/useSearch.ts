import { useCallback } from 'react';
import { useMainEditorStore } from '../../../store/mainEditorStore';

export const useSearch = () => {
  const { searchQuery, setSearchQuery } = useMainEditorStore();

  const handleSearchChange = useCallback((query: string) => {
    setSearchQuery(query);
  }, [setSearchQuery]);

  return {
    searchQuery,
    handleSearchChange,
  };
};
