import { fileURLToPath } from 'node:url';
import tailwindcss from '@tailwindcss/vite';
import { validateNuxtEnv } from '@workspace/core/env';

// Fail fast during build/dev startup if environment variables are missing or invalid
validateNuxtEnv(process.env);

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },

  // Workspace package transpilation (ensures raw .ts and .vue packages compile seamlessly)
  build: {
    transpile: ['@workspace/ui', '@workspace/core', '@workspace/locales'],
  },

  // Path aliases mirroring the SPA setup
  alias: {
    '@workspace/ui/styles': fileURLToPath(
      new URL('../../packages/ui/src/css/index.css', import.meta.url)
    ),
    '@workspace/ui': fileURLToPath(new URL('../../packages/ui/src', import.meta.url)),
    '@workspace/core': fileURLToPath(new URL('../../packages/core/src', import.meta.url)),
    '@workspace/locales': fileURLToPath(new URL('../../packages/locales/src', import.meta.url)),
  },

  css: ['~/assets/css/main.css'],

  // Nuxt Modules
  modules: ['@pinia/nuxt', '@nuxtjs/i18n'],

  // Auto-import UI components from @workspace/ui and local components
  components: [
    // 1. Primitive UI components (e.g. <UiButton>, <UiTextarea>, <UiTable>)
    {
      path: '../../packages/ui/src/ui',
      pathPrefix: false,
      prefix: 'Ui',
      extensions: ['.vue'],
    },
    // 2. Form field components (e.g. <UiFormTextarea>, <UiFormCheckbox>, <UiFormRadioGroup>)
    {
      path: '../../packages/ui/src/form',
      pathPrefix: false,
      prefix: 'UiForm',
      extensions: ['.vue'],
    },
    // 3. Composite Data Table components (e.g. <UiDataTable>, <UiDataTableHead>)
    {
      path: '../../packages/ui/src/data-table',
      pathPrefix: false,
      prefix: 'UiDataTable',
      extensions: ['.vue'],
    },
    // 4. Standalone top-level components (e.g. <UiPageWrapper>, <UiStatusBadge>, <UiTabs>)
    {
      path: '../../packages/ui/src',
      pathPrefix: false,
      prefix: 'Ui',
      extensions: ['.vue'],
      ignore: [
        '**/node_modules/**',
        '**/tests/**',
        '**/css/**',
        '**/ui/**',
        '**/form/**',
        '**/data-table/**',
        '**/tooltip/**',
      ],
    },
    // 5. Local website components
    '~/components',
  ],

  // Tailwind CSS v4 integration with Vite
  vite: {
    plugins: [tailwindcss()],
    optimizeDeps: {
      include: ['@tanstack/vue-query'],
    },
  },

  // Localization configuration via @nuxtjs/i18n
  i18n: {
    restructureDir: false,
    locales: [
      { code: 'en', name: 'English', file: 'en.ts', dir: 'ltr' },
      { code: 'ar', name: 'العربية', file: 'ar.ts', dir: 'rtl' },
    ],
    defaultLocale: 'en',
    lazy: false,
    langDir: 'locales',
    strategy: 'prefix_except_default',
    detectBrowserLanguage: false,
  },

  runtimeConfig: {
    public: {
      apiBaseUrl: process.env.NUXT_PUBLIC_API_BASE_URL || 'https://api.example.com',
    },
  },

  // Hybrid Rendering & Caching Rules
  // Demonstrating SSR, SSG (Prerendering), ISR (Incremental Static Regeneration), and SPA modes
  routeRules: {
    // 1. SSR (Default): Rendered dynamically on every incoming request
    '/': { ssr: true },
    '/dashboard': { ssr: true },

    // 2. SSG (Static Site Generation): Pre-rendered at build time
    '/ssg-example': { prerender: true },

    // 3. ISR / SWR (Stale-While-Revalidate): Cached for 60 seconds on server/CDN, regenerated in the background
    '/isr-example': { isr: 60 },

    // 4. SPA Mode: Client-side only rendering, ideal for heavy interactive authenticated dashboards
    '/spa-portal/**': { ssr: false },
  },

  typescript: {
    strict: true,
    typeCheck: false,
  },
});
