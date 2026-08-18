import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@hfe/sdk': path.resolve(__dirname, '../headless-company-books/packages/hfe-sdk/src/index.ts'),
    },
  },
  server: {
    port: 3000,
    host: true,
  },
})
