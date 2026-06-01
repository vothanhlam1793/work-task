import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './tests/unit/setup.js',
    css: true,
    include: ['tests/unit/**/*.test.{js,jsx}'],
    coverage: {
      reporter: ['text', 'html'],
    },
  },
});
