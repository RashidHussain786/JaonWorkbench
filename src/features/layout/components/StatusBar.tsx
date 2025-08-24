import React from 'react';
import { CheckCircle, AlertCircle, Clock } from 'lucide-react';
import { useJsonData } from '../../json-data/hooks/useJsonData';
import { useMainEditorStore } from '../../../store/mainEditorStore';

export const StatusBar: React.FC = () => {
  const { isValid, errors, jsonData } = useJsonData();
  const { inputType } = useMainEditorStore();

  const getStatus = () => {
    if (isValid) {
      const statusText = inputType === 'base64' ? 'Valid Base64' : 'Valid JSON';
      return {
        icon: <CheckCircle size={16} className="text-green-600" />,
        text: statusText,
        bgColor: 'bg-green-100 dark:bg-dark-primary/20',
        textColor: 'text-green-700 dark:text-dark-primary'
      };
    } else {
      return {
        icon: <AlertCircle size={16} className="text-red-600" />,
        text: `${errors.length} error${errors.length !== 1 ? 's' : ''}`,
        bgColor: 'bg-red-100 dark:bg-red-900/20',
        textColor: 'text-red-700 dark:text-red-300'
      };
    }
  };

  const status = getStatus();
  const dataType = Array.isArray(jsonData) ? 'Array' : typeof jsonData;
  const itemCount = Array.isArray(jsonData)
    ? jsonData.length
    : (jsonData && typeof jsonData === 'object' ? Object.keys(jsonData).length : 0);

  return (
    <div className="bg-light-surface dark:bg-dark-surface border-t border-light-border dark:border-dark-border px-4 py-2 status-bar" data-tourid="status-bar">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {/* Validation Status */}
          <div className={`flex items-center space-x-2 px-3 py-1 rounded-full ${status.bgColor}`}>
            {status.icon}
            <span className={`text-sm font-medium ${status.textColor}`}>
              {status.text}
            </span>
          </div>

          {/* Data Info */}
          {isValid && (
            <div className="flex items-center space-x-4 text-sm text-light-text-secondary dark:text-dark-text-secondary">
              <span>Type: <span className="font-mono">{dataType}</span></span>
              <span>
                {Array.isArray(jsonData) ? 'Items' : 'Keys'}:
                <span className="font-mono ml-1">{itemCount}</span>
              </span>
            </div>
          )}
        </div>

        <div className="flex items-center space-x-4">
          {/* Processing Indicator */}
          <div className="flex items-center space-x-2 text-sm text-light-text-secondary dark:text-dark-text-secondary">
            <Clock size={14} />
            <span>Processed locally</span>
          </div>


        </div>
      </div>
    </div>
  );
};