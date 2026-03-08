import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react()],
  root: 'src/webview',
  resolve: {
    alias: {
      '@': resolve(__dirname, '../src'),
    },
  },
  build: {
    outDir: resolve(__dirname, 'dist/webview'),
    emptyOutDir: true,
    cssCodeSplit: false,
    rollupOptions: {
      output: {
        entryFileNames: 'assets/index.js',
        // Single chunk — no code splitting (CSP nonce requires it)
        manualChunks: () => 'index',
        assetFileNames: 'assets/[name].[ext]',
      },
    },
  },
})
