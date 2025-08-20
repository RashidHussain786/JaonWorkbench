import { JsonError } from "../common/types";


export interface JsonValidationResult {
  isValid: boolean;
  data?: any;
  errors?: JsonError[];
}

export function validateJson(jsonString: string): JsonValidationResult {
  try {
    const trimmed = jsonString.trim();
    if (!trimmed) {
      return {
        isValid: false,
        errors: [{ message: 'JSON string is empty', type: 'syntax' }]
      };
    }

    const data = JSON.parse(trimmed);
    return {
      isValid: true,
      data
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown parsing error';

    // Extract line and column info from syntax errors
    const match = errorMessage.match(/at position (\d+)/);
    let line, column;

    if (match) {
      const position = parseInt(match[1]);
      const lines = jsonString.substring(0, position).split('\n');
      line = lines.length;
      column = lines[lines.length - 1].length + 1;
    }

    return {
      isValid: false,
      errors: [{
        line,
        column,
        message: errorMessage,
        type: 'syntax'
      }]
    };
  }
}

export function formatJson(data: any, indent = 2): string {
  try {
    return JSON.stringify(data, null, indent);
  } catch (error) {
    throw new Error('Failed to format JSON: ' + (error instanceof Error ? error.message : 'Unknown error'));
  }
}

export function minifyJson(data: any): string {
  try {
    return JSON.stringify(data);
  } catch (error) {
    throw new Error('Failed to minify JSON: ' + (error instanceof Error ? error.message : 'Unknown error'));
  }
}

export function getJsonStats(data: any): { size: number; depth: number; keys: number } {
  const jsonString = JSON.stringify(data);
  const size = new Blob([jsonString]).size;

  function getDepth(obj: any, currentDepth = 0): number {
    if (obj === null || typeof obj !== 'object') {
      return currentDepth;
    }

    if (Array.isArray(obj)) {
      return obj.reduce((maxDepth: number, item: any) =>
        Math.max(maxDepth, getDepth(item, currentDepth + 1)), currentDepth);
    }

    return Object.values(obj).reduce((maxDepth: number, value: any) =>
      Math.max(maxDepth, getDepth(value, currentDepth + 1)), currentDepth);
  }

  function countKeys(obj: any): number {
    if (obj === null || typeof obj !== 'object') {
      return 0;
    }

    if (Array.isArray(obj)) {
      return obj.reduce((count: number, item: any) => count + countKeys(item), 0);
    }

    return Object.keys(obj).length + Object.values(obj).reduce((count: number, value: any) =>
      count + countKeys(value), 0);
  }

  return {
    size,
    depth: getDepth(data),
    keys: countKeys(data)
  };
}

export function searchInJson(data: any, query: string): Array<{ path: string; value: any }> {
  const results: Array<{ path: string; value: any }> = [];
  const queryLower = query.toLowerCase();

  function search(obj: any, path: string) {
    if (obj === null || obj === undefined) return;

    if (typeof obj === 'string' || typeof obj === 'number') {
      if (String(obj).toLowerCase().includes(queryLower)) {
        results.push({ path, value: obj });
      }
    } else if (typeof obj === 'object') {
      if (Array.isArray(obj)) {
        obj.forEach((item, index) => {
          search(item, `${path}[${index}]`);
        });
      } else {
        Object.entries(obj).forEach(([key, value]) => {
          const newPath = path ? `${path}.${key}` : key;

          // Search in key names
          if (key.toLowerCase().includes(queryLower)) {
            results.push({ path: newPath, value });
          }

          // Search in values
          search(value, newPath);
        });
      }
    }
  }

  search(data, '');
  return results;
}

export function isBase64(str: string): boolean {
  if (str === null || typeof str !== 'string') {
    return false;
  }
  // Check for valid Base64 characters and padding
  const base64Regex = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/;
  return base64Regex.test(str);
}