import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../theme/hooks/useTheme';

export const Header: React.FC = () => {
  const { theme, setTheme } = useTheme();

  return (
    <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-4 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">
            JSON Workbench
          </h1>
        </div>

        <div className="flex items-center space-x-2">
          {/* Theme Toggle */}
          <button
            onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
            className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-md transition-colors"
            title="Toggle Theme"
          >
            {theme === 'light' ? (
              <Moon size={18} className="text-gray-700" />
            ) : (
              <Sun size={18} className="text-gray-300" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};