import * as monaco from 'monaco-editor';

export const defineMonacoThemes = (monacoInstance: typeof monaco) => {
  
  monacoInstance.editor.defineTheme('json-light', {
    base: 'vs',
    inherit: true,
    rules: [
      { token: 'string.key.json', foreground: '0451A5' },
      { token: 'string.value.json', foreground: '0A7A37' },
      { token: 'number.json', foreground: '164BCB' },
      { token: 'keyword.json', foreground: 'AF00DB' },
    ],
    colors: {
      'editor.background': '#FFFFFF',
      'editor.foreground': '#000000',
    }
  });

  monacoInstance.editor.defineTheme('json-dark', {
    base: 'vs-dark',
    inherit: true,
    rules: [
      { token: 'string.key.json', foreground: '9CDCFE' },
      { token: 'string.value.json', foreground: 'CE9178' },
      { token: 'number.json', foreground: 'B5CEA8' },
      { token: 'keyword.json', foreground: 'C586C0' },
    ],
    colors: {
      'editor.background': '#1E1E1E',
      'editor.foreground': '#D4D4D4',
    }
  });
};
