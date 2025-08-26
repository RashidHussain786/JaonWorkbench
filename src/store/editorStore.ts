
import {create} from 'zustand';

interface EditorState {
  jsonWordWrap: 'on' | 'off';
  base64WordWrap: 'on' | 'off';
  fileWordWrap: 'on' | 'off';
  toggleWordWrap: (type: 'json' | 'base64' | 'file') => void;
}

export const useEditorStore = create<EditorState>((set) => ({
  jsonWordWrap: 'off',
  base64WordWrap: 'on',
  fileWordWrap: 'off',
  toggleWordWrap: (type: 'json' | 'base64' | 'file') => set((state) => {
    switch (type) {
      case 'json':
        return { jsonWordWrap: state.jsonWordWrap === 'on' ? 'off' : 'on' };
      case 'base64':
        return { base64WordWrap: state.base64WordWrap === 'on' ? 'off' : 'on' };
      case 'file':
        return { fileWordWrap: state.fileWordWrap === 'on' ? 'off' : 'on' };
      default:
        return state;
    }
  }),
}));
