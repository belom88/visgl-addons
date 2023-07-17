import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [react()],
  test: {
    include: ['**/*.spec.tsx', '**/*.spec.ts'],
    globals: true,
    environment: 'jsdom',
    alias: {
      '@belom88/deckgl-vehicle-layer': './packages/vehicle-layer/src'
    }
  },
});
