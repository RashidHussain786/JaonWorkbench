import * as monaco from 'monaco-editor';

export const applyMonacoEditorShortcuts = (editor: monaco.editor.IStandaloneCodeEditor, monacoInstance: typeof monaco) => {
  editor.addCommand(monacoInstance.KeyMod.CtrlCmd | monacoInstance.KeyCode.KeyS, () => {
  });

  editor.addCommand(monacoInstance.KeyMod.CtrlCmd | monacoInstance.KeyMod.Shift | monacoInstance.KeyCode.KeyF, () => {
    const formatAction = editor.getAction('editor.action.formatDocument');
    if (formatAction) {
      formatAction.run();
    }
  });
};

export const getMonacoEditorOptions = (wordWrap: 'on' | 'off'): monaco.editor.IStandaloneEditorConstructionOptions => {
  return {
    minimap: { enabled: true },
    wordWrap,
    lineNumbers: 'on',
    folding: true,
    bracketPairColorization: { enabled: true },
    autoIndent: 'full',
    formatOnPaste: true,
    formatOnType: true,
    scrollBeyondLastLine: false,
    fontSize: 14,
    fontFamily: 'Consolas, Monaco, "Courier New", monospace',
    tabSize: 2,
    insertSpaces: true,
  };
};
