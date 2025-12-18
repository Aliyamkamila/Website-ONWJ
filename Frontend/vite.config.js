import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  assetsInclude: ['**/*.png', '**/*.jpg', '**/*.webp'],
  build: {
    // ---- STEP 3 OPTIMIZATION ----
    // Vendor code splitting - separate node_modules into own chunks
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-ui': ['framer-motion', 'react-hot-toast'],
          'vendor-recharts': ['recharts', 'recharts-scale'],
          'vendor-maps': ['leaflet', 'react-leaflet'],
          'vendor-utils': ['axios', 'date-fns'],
          'vendor-export': ['jspdf', 'jspdf-autotable', 'xlsx'],
        },
      },
    },
    // Improved minification settings (for production deployment)
    minify: 'esbuild',                // Use esbuild for localhost, terser for production if installed
    // CSS code splitting for better caching
    cssCodeSplit: true,
    // Inline threshold: don't inline small assets (keep them separate for caching)
    assetsInlineLimit: 4096,          // Only inline assets < 4KB
    // Improved chunk size reporting
    reportCompressedSize: true,
    chunkSizeWarningLimit: 500,       // Warn if chunks > 500KB
    // Target modern browsers for smaller output
    target: 'es2020',
  },
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
    },
  },
});