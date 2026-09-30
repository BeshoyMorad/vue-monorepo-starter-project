import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vitest/config';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  plugins: [vue()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./tests/setup.ts'],
  },
  resolve: {
    alias: {
      '@workspace/ui/styles': fileURLToPath(
        new URL('../../packages/ui/src/css/index.css', import.meta.url)
      ),
      '@workspace/ui': fileURLToPath(new URL('../../packages/ui/src', import.meta.url)),
      '@workspace/core': fileURLToPath(new URL('../../packages/core/src', import.meta.url)),
      '@workspace/locales': fileURLToPath(new URL('../../packages/locales/src', import.meta.url)),
      '@/tests': fileURLToPath(new URL('./tests', import.meta.url)),
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
});
