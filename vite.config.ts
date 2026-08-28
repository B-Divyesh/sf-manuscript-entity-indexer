import { defineConfig } from 'vite';

export default defineConfig({
  clearScreen: false,
  build: {
    outDir: 'dist/site',
    target: 'es2022',
    sourcemap: true,
    assetsInlineLimit: 2048
  },
  server: {
    port: 4173,
    strictPort: true
  },
  preview: {
    port: 4173,
    strictPort: true
  }
});
