import React from 'react';
import { useMainEditorStore } from '../../../store/mainEditorStore';
import { useJsonData } from '../../json-data/hooks/useJsonData';

export const InputTypeSelector: React.FC = () => {
  const { inputType, setInputType } = useMainEditorStore();
  const { jsonString, validateAndUpdate } = useJsonData();

  const commonClasses = "px-3 py-1 rounded-md text-sm font-medium transition-colors";
  const activeClasses = "bg-blue-500 text-white shadow-md";
  const inactiveClasses = "bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600";

  const handleTypeChange = (newInputType: 'json' | 'base64') => {
    setInputType(newInputType);
    validateAndUpdate(jsonString);
  };

  return (
    <div className="flex space-x-1 p-1 bg-gray-100 dark:bg-gray-800 rounded-lg input-type-selector" data-tourid="input-type-selector">
      <button
        onClick={() => handleTypeChange('json')}
        className={`${commonClasses} ${inputType === 'json' ? activeClasses : inactiveClasses}`}
      >
        JSON
      </button>
      <button
        onClick={() => handleTypeChange('base64')}
        className={`${commonClasses} ${inputType === 'base64' ? activeClasses : inactiveClasses}`}
      >
        Base64
      </button>
    </div>
  );
};