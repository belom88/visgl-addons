/// <reference types="vitest" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import viteTsConfigPaths from 'vite-tsconfig-paths';

const getManualChunks = (id: string) => {
  if (id.includes('node_modules/@deck.gl')) {
    return 'deck-gl';
  } else if (id.includes('node_modules/@mui')) {
    return 'mui';
  }
};

export default defineConfig({
  cacheDir: '../../node_modules/.vite/vehicle-layer-test-app',

  server: {
    port: 4200,
    host: 'localhost',
  },

  preview: {
    port: 4300,
    host: 'localhost',
  },

  plugins: [
    react(),
    viteTsConfigPaths({
      root: '../../',
    }),
  ],

  build: {
    rollupOptions: {
      output: {
        manualChunks: getManualChunks,
      },
    },
  },

  // Uncomment this if you are using workers.
  // worker: {
  //  plugins: [
  //    viteTsConfigPaths({
  //      root: '../../',
  //    }),
  //  ],
  // },

  test: {
    globals: true,
    cache: {
      dir: '../../node_modules/.vitest',
    },
    environment: 'jsdom',
    include: ['src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
  },
});
