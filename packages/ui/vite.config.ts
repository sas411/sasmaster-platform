import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@sasmaster/tokens': path.resolve(__dirname, '../tokens/src/index.css'),
      '@sasmaster/types': path.resolve(__dirname, '../types/src'),
    },
  },
  css: {
    postcss: './postcss.config.js',
  },
})
