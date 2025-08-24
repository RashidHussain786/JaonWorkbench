import React from 'react';
import { useMainEditorStore } from '../../../store/mainEditorStore';
import { useJsonData } from '../../json-data/hooks/useJsonData';

export const InputTypeSelector: React.FC = () => {
  const { inputType, setInputType } = useMainEditorStore();
  const { jsonString, validateAndUpdate } = useJsonData();

  const commonClasses = "px-3 py-1 rounded-md text-sm font-medium transition-colors";
  const activeClasses = "bg-light-primary text-white shadow-md";
  const inactiveClasses = "bg-light-surface text-light-text-secondary hover:bg-light-border dark:bg-dark-surface dark:text-dark-text-primary dark:hover:bg-dark-border";

  const handleTypeChange = (newInputType: 'json' | 'base64') => {
    setInputType(newInputType);
    validateAndUpdate(jsonString);
  };

  return (
    <div className="flex space-x-1 p-1 bg-light-surface dark:bg-dark-surface rounded-lg input-type-selector" data-tourid="input-type-selector">
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