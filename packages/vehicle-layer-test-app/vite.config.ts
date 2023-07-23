/// <reference types="vitest" />
import { defineConfig, splitVendorChunkPlugin } from 'vite';
import react from '@vitejs/plugin-react';
import viteTsConfigPaths from 'vite-tsconfig-paths';

function manualChunks(id: string) {
	if (id.includes('@arcgis/core')) {
		return 'arcgis';
	}
  if (id.includes('@deck.gl')) {
		return 'deckgl';
	}
  if (id.includes('@mui')) {
		return 'mui';
	}
  if (id.includes('mapbox-gl')) {
		return 'mapbox-gl';
	}
  if (id.includes('maplibre-gl')) {
		return 'maplibre-gl';
	}
  if (id.includes('node_modules')) {
		return 'vendor';
	}
}

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
    splitVendorChunkPlugin(),
  ],

  build: {
    rollupOptions: {
      output: {
        manualChunks
      }
    }
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
