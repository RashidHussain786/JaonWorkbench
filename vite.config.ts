import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import monacoEditorPlugin from 'vite-plugin-monaco-editor';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    (monacoEditorPlugin as any).default({
      languageWorkers: ['json', 'css', 'html', 'typescript', 'editorWorkerService'],
      customWorkers: [{
        label: 'editorWorker',
        entry: 'monaco-editor/esm/vs/editor/editor.worker'
      }]
    }),
  ],
  optimizeDeps: {
    include: ['color'],
    exclude: ['lucide-react', 'react-json-tree'],
  },
});