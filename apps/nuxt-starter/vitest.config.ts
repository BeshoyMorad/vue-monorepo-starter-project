import { defineVitestConfig } from '@nuxt/test-utils/config';

export default defineVitestConfig({
  test: {
    globals: true,
    environment: 'nuxt',
    environmentOptions: {
      nuxt: {
        domEnvironment: 'jsdom',
        overrides: {
          runtimeConfig: {
            public: { apiBaseUrl: 'http://localhost:3000/api' },
          },
        },
      },
    },
    setupFiles: ['./tests/setup.ts'],
    // Node 25 ships an experimental global `localStorage` that shadows jsdom's.
    execArgv: ['--no-experimental-webstorage'],
  },
});
