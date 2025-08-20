import React from 'react';
import { Search } from 'lucide-react';
import { useSearch } from '../hooks/useSearch';
import { useJsonData } from '../../json-data/hooks/useJsonData';

export const SearchBar: React.FC = () => {
  const { isValid } = useJsonData();
  const { searchQuery, handleSearchChange } = useSearch();

  return (
    <div className="relative">
      <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
      <input
        type="text"
        placeholder="Search in JSON..."
        value={searchQuery}
        onChange={(e) => handleSearchChange(e.target.value)}
        className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg 
                 bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        disabled={!isValid}
      />
    </div>
  );
};