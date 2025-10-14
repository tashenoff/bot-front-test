import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Vendor chunk for React ecosystem
          if (id.includes('node_modules/react') ||
              id.includes('node_modules/react-dom') ||
              id.includes('node_modules/react-router')) {
            return 'vendor-react';
          }

          // UI libraries
          if (id.includes('node_modules/lodash') ||
              id.includes('node_modules/swiper') ||
              id.includes('node_modules/@popperjs')) {
            return 'vendor-ui';
          }

          // Custom split by feature
          if (id.includes('/src/data/')) {
            return 'data-static';
          }

          // Scenes and translations in separate chunks
          if (id.includes('/src/locales/') || id.includes('/scenes')) {
            return 'locales-scenes';
          }
        },
      },
    },
    chunkSizeWarningLimit: 600,
    minify: 'esbuild',
    cssMinify: true,
    reportCompressedSize: false,
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom', 'lodash', 'swiper'],
    exclude: ['@vite/client', '@vite/env'],
  },
  define: {
    __DEV__: process.env.NODE_ENV === 'development',
  },
})
