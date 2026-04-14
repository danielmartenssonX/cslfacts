import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./tests/setup/vitest.setup.js'],
    include: ['tests/**/*.test.{js,jsx}', 'tests/**/*.spec.{ts,tsx,js,jsx}'],
    exclude: ['tests/e2e/**', '**/node_modules/**'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      thresholds: {
        lines: 85,
        functions: 40,
        statements: 85,
        branches: 74,
      },
      exclude: [
        'tests/**',
        'scripts/**',
        'docs/**',
        'playwright.config.js',
        'postcss.config.js',
        'tailwind.config.js',
        'eslint.config.js',
        'vite.config.js',
        'vitest.config.js',
        'dist/**',
        'src/main.jsx',
        'src/global.d.ts',
      ],
    },
  },
});
