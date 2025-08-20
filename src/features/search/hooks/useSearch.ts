import { useCallback } from 'react';
import { useJsonStore } from '../../../store/jsonStore';

export const useSearch = () => {
  const { searchQuery, setSearchQuery } = useJsonStore();

  const handleSearchChange = useCallback((query: string) => {
    setSearchQuery(query);
  }, [setSearchQuery]);

  return {
    searchQuery,
    handleSearchChange,
  };
};
