import * as monaco from 'monaco-editor';

export const defineMonacoThemes = (monacoInstance: typeof monaco) => {

  monacoInstance.editor.defineTheme('json-light', {
    base: 'vs',
    inherit: true,
    rules: [
      { token: 'string.key.json', foreground: '268bd2' },
      { token: 'string.value.json', foreground: '859900' },
      { token: 'number.json', foreground: 'dc322f' },
      { token: 'keyword.json', foreground: 'cb4b16' },
    ],
    colors: {
      'editor.background': '#fdf6e3',
      'editor.foreground': '#657b83',
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
      'editor.background': '#111827',
      'editor.foreground': '#D4D4D4',
    }
  });
};
