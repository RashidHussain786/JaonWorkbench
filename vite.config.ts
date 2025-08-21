import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import monacoEditorPlugin from 'vite-plugin-monaco-editor';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    (monacoEditorPlugin as any).default({
      languageWorkers: ['json', 'editorWorker'],
    }),
  ],
  optimizeDeps: {
    include: ['color'],
    exclude: ['lucide-react', 'react-json-tree'],
  },
});