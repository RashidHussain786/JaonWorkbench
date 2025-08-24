import React from 'react';
import { Search } from 'lucide-react';
import { useSearch } from '../hooks/useSearch';
import { useJsonData } from '../../json-data/hooks/useJsonData';

export const SearchBar: React.FC = () => {
  const { isValid } = useJsonData();
  const { searchQuery, handleSearchChange } = useSearch();

  return (
    <div className="relative">
      <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-light-text-secondary" />
      <input
        type="text"
        placeholder="Search in JSON..."
        value={searchQuery}
        onChange={(e) => handleSearchChange(e.target.value)}
        className="w-full pl-10 pr-4 py-1 border border-light-border dark:border-dark-border rounded-lg 
                 bg-light-surface dark:bg-dark-surface text-light-text-primary dark:text-dark-text-primary
                 focus:ring-2 focus:ring-light-primary focus:border-transparent"
        disabled={!isValid}
      />
    </div>
  );
};