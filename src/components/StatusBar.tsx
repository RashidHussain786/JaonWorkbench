import React from 'react';
import { CheckCircle, AlertCircle, Clock } from 'lucide-react';
import { useJsonStore } from '../store/jsonStore';

export const StatusBar: React.FC = () => {
  const { isValid, errors, jsonData } = useJsonStore();

  const getStatus = () => {
    if (isValid) {
      return {
        icon: <CheckCircle size={16} className="text-green-500" />,
        text: 'Valid JSON',
        bgColor: 'bg-green-50 dark:bg-green-900/20',
        textColor: 'text-green-700 dark:text-green-300'
      };
    } else {
      return {
        icon: <AlertCircle size={16} className="text-red-500" />,
        text: `${errors.length} error${errors.length !== 1 ? 's' : ''}`,
        bgColor: 'bg-red-50 dark:bg-red-900/20',
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
    <div className="bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 px-4 py-2">
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
            <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
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
          <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
            <Clock size={14} />
            <span>Processed locally</span>
          </div>

          
        </div>
      </div>
    </div>
  );
};