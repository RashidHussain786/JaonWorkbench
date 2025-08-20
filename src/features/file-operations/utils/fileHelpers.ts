import { saveAs } from 'file-saver';
import { FileImportResult } from '../../../common/types';

export async function importFromFile(file: File): Promise<FileImportResult> {
  try {
    const text = await file.text();
    const data = JSON.parse(text);
    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      error: `Failed to import file: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
}

export async function importFromUrl(url: string): Promise<FileImportResult> {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    const text = await response.text();
    const data = JSON.parse(text);
    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      error: `Failed to fetch from URL: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
}

export function exportToFile(data: any, filename = 'data.json', format: 'json' | 'csv' = 'json') {
  try {
    if (format === 'json') {
      const jsonString = JSON.stringify(data, null, 2);
      const blob = new Blob([jsonString], { type: 'application/json' });
      saveAs(blob, filename.endsWith('.json') ? filename : `${filename}.json`);
    } else if (format === 'csv') {
      const csv = jsonToCsv(data);
      const blob = new Blob([csv], { type: 'text/csv' });
      saveAs(blob, filename.endsWith('.csv') ? filename : `${filename}.csv`);
    }
  } catch (error) {
    throw new Error(`Failed to export file: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    // Fallback for older browsers
    try {
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      const successful = document.execCommand('copy');
      document.body.removeChild(textArea);
      return successful;
    } catch (fallbackError) {
      console.error('Failed to copy to clipboard:', fallbackError);
      return false;
    }
  }
}

export async function readFromClipboard(): Promise<string | null> {
  try {
    return await navigator.clipboard.readText();
  } catch (error) {
    console.error('Failed to read from clipboard:', error);
    return null;
  }
}

function jsonToCsv(data: any): string {
  if (!Array.isArray(data)) {
    throw new Error('CSV export requires JSON to be an array of objects');
  }

  if (data.length === 0) {
    return '';
  }

  // Get all unique keys
  const keys = new Set<string>();
  data.forEach(item => {
    if (typeof item === 'object' && item !== null) {
      Object.keys(item).forEach(key => keys.add(key));
    }
  });

  const headers = Array.from(keys);
  const rows = data.map(item => {
    return headers.map(header => {
      const value = item && typeof item === 'object' ? item[header] : '';
      if (value === null || value === undefined) return '';
      if (typeof value === 'object') return JSON.stringify(value);
      return String(value).replace(/"/g, '""'); // Escape quotes
    });
  });

  // Format as CSV
  const csvRows = [
    headers.map(h => `"${h}"`).join(','),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
  ];

  return csvRows.join('\n');
}

export function csvToJson(csvString: string): any[] {
  const lines = csvString.trim().split('\n');
  if (lines.length < 2) {
    throw new Error('CSV must have at least a header row and one data row');
  }

  const headers = parseCSVRow(lines[0]);
  const data = [];

  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVRow(lines[i]);
    const obj: any = {};

    headers.forEach((header, index) => {
      obj[header] = values[index] || '';
    });

    data.push(obj);
  }

  return data;
}

function parseCSVRow(row: string): string[] {
  const result = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < row.length; i++) {
    const char = row[i];
    const nextChar = row[i + 1];

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        // Escaped quote
        current += '"';
        i++; // Skip next quote
      } else {
        // Toggle quote state
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      // End of field
      result.push(current);
      current = '';
    } else {
      current += char;
    }
  }

  result.push(current);
  return result;
}