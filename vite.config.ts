import { defineConfig, loadEnv, type ProxyOptions } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

function localServiceProxy(target: string): ProxyOptions {
  return {
    target,
    changeOrigin: true,
    rewrite: (requestPath) => requestPath.replace(/^\/(?:id|core)/, ''),
  }
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), 'VITE_')
  const proxy = {
    ...(env.VITE_TOGROW_ORIGIN ? { '/id': localServiceProxy(env.VITE_TOGROW_ORIGIN) } : {}),
    ...(env.VITE_HFE_CORE_ORIGIN ? { '/core': localServiceProxy(env.VITE_HFE_CORE_ORIGIN) } : {}),
  }

  return {
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@hfe/sdk': path.resolve(__dirname, './packages/hfe-sdk/src/index.ts'),
    },
  },
  server: {
    port: 3000,
    host: true,
    allowedHosts: true,
    proxy,
  },
  preview: {
    port: 3000,
    host: true,
    allowedHosts: true,
    proxy,
  },
  build: {
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom')) {
              return 'vendor-react'
            }
            if (id.includes('lucide-react')) {
              return 'vendor-icons'
            }
            if (id.includes('@radix-ui') || id.includes('react-aria')) {
              return 'vendor-ui'
            }
            return 'vendor-core'
          }
        },
      },
    },
  },
  test: {
    globals: true,
    include: ['src/tests/**/*.{test,spec}.{ts,tsx}'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json-summary'],
      include: ['src/**/*.{ts,tsx}'],
      exclude: [
        'src/tests/**',
        'src/**/*.stories.tsx',
        'src/types/**',
        'src/main.tsx',
      ],
    },
  },
  }
})
