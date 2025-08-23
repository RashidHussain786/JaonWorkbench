import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import monacoEditorPluginRaw from 'vite-plugin-monaco-editor';

const monacoEditorPlugin = (monacoEditorPluginRaw as any).default || monacoEditorPluginRaw;

export default defineConfig({
  base: '/',
  plugins: [
    react(),
    monacoEditorPlugin({
      languageWorkers: [
        'editorWorkerService',
        'json',
        'css',
        'html',
        'typescript',
      ],
      publicPath: "monacoeditorwork",
    }),
  ],
  optimizeDeps: {
    include: ['color'],
    exclude: ['lucide-react', 'react-json-tree'],
  },
});
