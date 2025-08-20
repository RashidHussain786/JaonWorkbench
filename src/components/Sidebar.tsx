import React, { useState } from 'react';
import { Search, Info, Zap, X } from 'lucide-react';
import { useJsonStore } from '../store/jsonStore';
import { getJsonStats, searchInJson } from '../utils/jsonHelpers';

export const Sidebar: React.FC = () => {
  const { jsonData, isValid, showAds, isPremium } = useJsonStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Array<{path: string; value: any}>>([]);
  
  const stats = isValid ? getJsonStats(jsonData) : null;

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim() && isValid) {
      const results = searchInJson(jsonData, query);
      setSearchResults(results.slice(0, 20)); // Limit to 20 results
    } else {
      setSearchResults([]);
    }
  };

  const formatSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="w-80 bg-white dark:bg-gray-900 border-l border-gray-200 dark:border-gray-700 flex flex-col">
      {/* Search Section */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="relative">
          <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search in JSON..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg 
                     bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                     focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={!isValid}
          />
        </div>

        {/* Search Results */}
        {searchResults.length > 0 && (
          <div className="mt-3 max-h-48 overflow-y-auto">
            <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">
              Found {searchResults.length} result{searchResults.length !== 1 ? 's' : ''}
            </div>
            {searchResults.map((result, index) => (
              <div
                key={index}
                className="p-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded text-xs border-l-2 border-blue-400 pl-3 mb-1"
              >
                <div className="font-mono text-blue-600 dark:text-blue-400 mb-1">
                  {result.path}
                </div>
                <div className="text-gray-600 dark:text-gray-300 truncate">
                  {typeof result.value === 'object' 
                    ? JSON.stringify(result.value)
                    : String(result.value)
                  }
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Stats Section */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-2 mb-3">
          <Info size={18} className="text-gray-500" />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">JSON Stats</span>
        </div>
        
        {stats ? (
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Size:</span>
              <span className="font-mono text-gray-900 dark:text-white">{formatSize(stats.size)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Depth:</span>
              <span className="font-mono text-gray-900 dark:text-white">{stats.depth}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Keys:</span>
              <span className="font-mono text-gray-900 dark:text-white">{stats.keys}</span>
            </div>
          </div>
        ) : (
          <div className="text-sm text-gray-500 dark:text-gray-400 italic">
            {isValid ? 'No data' : 'Invalid JSON'}
          </div>
        )}
      </div>

      {/* Premium Upgrade Section */}
      {!isPremium && (
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 
                        border border-blue-200 dark:border-blue-700 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Zap size={18} className="text-blue-500" />
              <span className="text-sm font-medium text-gray-900 dark:text-white">Upgrade to Premium</span>
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400 mb-3 space-y-1">
              <div>✓ Remove all ads</div>
              <div>✓ Schema validation</div>
              <div>✓ JSON diff tool</div>
              <div>✓ CSV export</div>
              <div>✓ Advanced themes</div>
            </div>
            <button className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white text-xs 
                             font-medium py-2 px-4 rounded-md hover:shadow-lg transition-all duration-200">
              Upgrade Now
            </button>
          </div>
        </div>
      )}

      {/* Ad Space */}
      {showAds && !isPremium && (
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="bg-gray-100 dark:bg-gray-800 border-2 border-dashed border-gray-300 dark:border-gray-600 
                        rounded-lg p-4 text-center">
            <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">Advertisement</div>
            <div className="bg-gradient-to-r from-green-400 to-blue-500 text-white text-xs py-2 px-3 rounded">
              Your Ad Here
            </div>
            <div className="text-xs text-gray-400 mt-2">300x250</div>
          </div>
        </div>
      )}

      {/* Help Section */}
      <div className="p-4 flex-1">
        <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          Keyboard Shortcuts
        </div>
        <div className="space-y-2 text-xs text-gray-600 dark:text-gray-400">
          <div className="flex justify-between">
            <span>Format JSON</span>
            <kbd className="px-1 py-0.5 bg-gray-200 dark:bg-gray-700 rounded">Ctrl+Shift+F</kbd>
          </div>
          <div className="flex justify-between">
            <span>Copy JSON</span>
            <kbd className="px-1 py-0.5 bg-gray-200 dark:bg-gray-700 rounded">Ctrl+C</kbd>
          </div>
          <div className="flex justify-between">
            <span>Paste JSON</span>
            <kbd className="px-1 py-0.5 bg-gray-200 dark:bg-gray-700 rounded">Ctrl+V</kbd>
          </div>
          <div className="flex justify-between">
            <span>Undo</span>
            <kbd className="px-1 py-0.5 bg-gray-200 dark:bg-gray-700 rounded">Ctrl+Z</kbd>
          </div>
          <div className="flex justify-between">
            <span>Redo</span>
            <kbd className="px-1 py-0.5 bg-gray-200 dark:bg-gray-700 rounded">Ctrl+Y</kbd>
          </div>
        </div>
      </div>
    </div>
  );
};