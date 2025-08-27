import React from 'react';
import { X, Search as SearchIcon } from 'lucide-react';

interface SearchBarProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

const SearchBar: React.FC<SearchBarProps> = ({
  searchValue,
  onSearchChange,
  placeholder = "Search...",
  disabled = false,
}) => {
  return (
    <div className="relative w-full">
      <SearchIcon
        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
        size={18}
      />
      <input
        type="text"
        placeholder={placeholder}
        value={searchValue}
        onChange={(e) => onSearchChange(e.target.value)}
        className="w-full pl-10 pr-8 py-2 border border-light-border dark:border-dark-border rounded-md bg-light-surface dark:bg-dark-surface focus:outline-none focus:ring-1 focus:ring-light-primary dark:focus:ring-dark-primary disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={disabled}
      />
      {searchValue && (
        <button
          onClick={() => onSearchChange('')}
          className="absolute right-2 top-1/2 -translate-y-1/2"
        >
          <X size={18} className="text-gray-500 hover:text-gray-800 dark:hover:text-gray-200" />
        </button>
      )}
    </div>
  );
};

export default SearchBar;
