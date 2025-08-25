
import {create} from 'zustand';

interface EditorState {
  wordWrap: 'on' | 'off';
  toggleWordWrap: () => void;
}

export const useEditorStore = create<EditorState>((set) => ({
  wordWrap: 'off',
  toggleWordWrap: () => set((state) => {
    console.log('current wordWrap state:', state.wordWrap);
    const newWordWrap = state.wordWrap === 'on' ? 'off' : 'on';
    console.log('new wordWrap state:', newWordWrap);
    return { wordWrap: newWordWrap };
  }),
}));
