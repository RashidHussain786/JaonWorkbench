import React from 'react';
import * as JSONTreeModule from 'react-json-tree';
import { useJsonStore } from '../store/jsonStore';

const lightTheme = {
  scheme: 'light',
  author: 'JSON Editor Pro',
  base00: '#ffffff',
  base01: '#f5f5f5',
  base02: '#c8c8fa',
  base03: '#969896',
  base04: '#969896',
  base05: '#333333',
  base06: '#282828',
  base07: '#1d1f21',
  base08: '#cc6666',
  base09: '#de935f',
  base0A: '#f0c674',
  base0B: '#b5bd68',
  base0C: '#8abeb7',
  base0D: '#81a2be',
  base0E: '#b294bb',
  base0F: '#a3685a'
};

const darkTheme = {
  scheme: 'dark',
  author: 'JSON Editor Pro',
  base00: '#1e1e1e',
  base01: '#323232',
  base02: '#464646',
  base03: '#5a5a5a',
  base04: '#969696',
  base05: '#d4d4d4',
  base06: '#e8e8e8',
  base07: '#ffffff',
  base08: '#f48771',
  base09: '#fc9867',
  base0A: '#fce94f',
  base0B: '#a6e22e',
  base0C: '#56c2d6',
  base0D: '#6d9cbe',
  base0E: '#dc75e1',
  base0F: '#b18e62'
};

export const TreeView: React.FC = () => {
  const { jsonData, theme, setJsonData, isValid } = useJsonStore();

  const handleValueChange = (newValue: any) => {
    setJsonData(newValue, 'tree-edit');
  };

  if (!isValid) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="text-center p-8">
          <div className="text-red-500 text-lg font-medium mb-2">Invalid JSON</div>
          <div className="text-gray-600 dark:text-gray-400 text-sm">
            Please fix the JSON syntax errors to view the tree structure.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 overflow-auto">
      <div className="p-4">
        <JSONTreeModule.default
          data={jsonData}
          theme={theme === 'dark' ? darkTheme : lightTheme}
          invertTheme={false}
          shouldExpandNode={(keyPath, data, level) => level < 2}
          sortObjectKeys={false}
          hideRoot={false}
          getItemString={(type, data, itemType, itemString, keyPath) => {
            const itemsCount = Array.isArray(data) ? data.length : 
                             (data && typeof data === 'object') ? Object.keys(data).length : 0;
            
            return (
              <span className="text-gray-500 dark:text-gray-400 text-sm ml-2">
                {type === 'Object' && `{${itemsCount} ${itemsCount === 1 ? 'key' : 'keys'}}`}
                {type === 'Array' && `[${itemsCount} ${itemsCount === 1 ? 'item' : 'items'}]`}
                {type !== 'Object' && type !== 'Array' && itemString}
              </span>
            );
          }}
          labelRenderer={(keyPath, nodeType, expanded, expandable) => {
            const key = keyPath[0];
            return (
              <span className="font-medium text-blue-600 dark:text-blue-400">
                {String(key)}:
              </span>
            );
          }}
          valueRenderer={(raw, value, ...keyPath) => {
            if (typeof value === 'string') {
              return (
                <span className="text-green-600 dark:text-green-400">
                  "{value}"
                </span>
              );
            }
            if (typeof value === 'number') {
              return (
                <span className="text-purple-600 dark:text-purple-400">
                  {value}
                </span>
              );
            }
            if (typeof value === 'boolean') {
              return (
                <span className="text-orange-600 dark:text-orange-400">
                  {String(value)}
                </span>
              );
            }
            if (value === null) {
              return (
                <span className="text-gray-500 dark:text-gray-400 italic">
                  null
                </span>
              );
            }
            return <span>{String(value)}</span>;
          }}
        />
      </div>
    </div>
  );
};