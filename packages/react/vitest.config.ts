import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
    css: { include: [/tokens\/(?:src|dist)\/.*\.css/, /react\/src\/styles\.css/] },
  },
});
