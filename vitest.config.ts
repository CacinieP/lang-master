import { defineConfig } from 'vitest/config';
import path from 'path';

// Standalone Vitest config (takes precedence over vite.config.ts).
// Node environment + no jsdom keeps the "zero extra runtime deps" convention;
// storage tests use a lightweight localStorage mock instead.
export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
  },
});
