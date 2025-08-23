import React, { useMemo } from 'react';
import { useJsonData } from '../hooks/useJsonData';
const TableView: React.FC = () => {
  const { jsonData, isValid } = useJsonData();

  const tableData = useMemo(() => {
    if (!isValid || !jsonData) return null;

    // Handle array of objects (most common table format)
    if (Array.isArray(jsonData) && jsonData.length > 0 && typeof jsonData[0] === 'object') {
      const headers = new Set<string>();
      jsonData.forEach(item => {
        if (item && typeof item === 'object') {
          Object.keys(item).forEach(key => headers.add(key));
        }
      });

      return {
        headers: Array.from(headers),
        rows: jsonData.map((item, index) => ({
          id: index,
          data: item
        }))
      };
    }

    // Handle single object as key-value pairs
    if (jsonData && typeof jsonData === 'object' && !Array.isArray(jsonData)) {
      return {
        headers: ['Key', 'Value'],
        rows: Object.entries(jsonData).map(([key, value], index) => ({
          id: index,
          data: {
            Key: key,
            Value: typeof value === 'object' ? JSON.stringify(value) : value
          }
        }))
      };
    }

    return null;
  }, [jsonData, isValid]);

  if (!isValid) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="text-center p-8">
          <div className="text-red-500 text-lg font-medium mb-2">Invalid JSON</div>
          <div className="text-gray-600 dark:text-gray-400 text-sm">
            Please fix the JSON syntax errors to view the table.
          </div>
        </div>
      </div>
    );
  }

  if (!tableData) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="text-center p-8">
          <div className="text-yellow-500 text-lg font-medium mb-2">Not Tabular Data</div>
          <div className="text-gray-600 dark:text-gray-400 text-sm">
            Table view works best with arrays of objects or simple key-value objects.
          </div>
        </div>
      </div>
    );
  }

  const renderCellValue = (value: any) => {
    if (value === null) {
      return <span className="text-gray-400 italic">null</span>;
    }
    if (value === undefined) {
      return <span className="text-gray-400 italic">undefined</span>;
    }
    if (typeof value === 'boolean') {
      return <span className="text-orange-600 dark:text-orange-400">{String(value)}</span>;
    }
    if (typeof value === 'number') {
      return <span className="text-purple-600 dark:text-purple-400">{value}</span>;
    }
    if (typeof value === 'string') {
      return <span className="text-green-600 dark:text-green-400">{value}</span>;
    }
    if (typeof value === 'object') {
      return (
        <span className="text-gray-600 dark:text-gray-400 font-mono text-xs">
          {JSON.stringify(value)}
        </span>
      );
    }
    return String(value);
  };

  return (
    <div className="h-full bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 overflow-auto">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-800 sticky top-0">
            <tr>
              {tableData.headers.map((header, index) => (
                <th
                  key={index}
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider border-r border-gray-200 dark:border-gray-700 last:border-r-0"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
            {tableData.rows.map((row) => (
              <tr
                key={row.id}
                className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                {tableData.headers.map((header, cellIndex) => (
                  <td
                    key={cellIndex}
                    className="px-4 py-3 text-sm border-r border-gray-200 dark:border-gray-700 last:border-r-0 break-words"
                  >
                    {renderCellValue(row.data[header])}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {tableData.rows.length === 0 && (
        <div className="text-center p-8 text-gray-500 dark:text-gray-400">
          No data to display
        </div>
      )}
    </div>
  );
};

export default TableView;