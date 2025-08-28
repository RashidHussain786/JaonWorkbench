import React from 'react';
import { useSearch } from '../hooks/useSearch';
import { useJsonData } from '../../json-data/hooks/useJsonData';
import SearchBar from './SearchBar';

export const JsonEditorSearchBar: React.FC = () => {
  const { isValid } = useJsonData();
  const { searchQuery, handleSearchChange } = useSearch();

  return (
    <SearchBar 
      searchValue={searchQuery}
      onSearchChange={handleSearchChange}
      placeholder="Search in JSON..."
      disabled={!isValid}
    />
  );
};
