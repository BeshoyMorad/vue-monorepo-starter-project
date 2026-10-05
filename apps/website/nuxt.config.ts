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

  // Global CSS ships as one cached file instead of being inlined into every HTML response
  // (it was ~130KB per page, re-downloaded on every visit and never cached).
  features: { inlineStyles: false },

  // Serve pre-compressed (brotli + gzip) copies of the built JS, CSS, fonts and SVGs.
  nitro: { compressPublicAssets: true },

  // Nuxt Modules
  modules: ['@pinia/nuxt', '@nuxtjs/i18n', '@nuxt/image'],

  // Nuxt Image: use <NuxtImg>/<NuxtPicture> for raster images (png, jpg, webp).
  // SVGs stay as plain <img>, since there is nothing to resize or re-encode.
  // The default IPX provider resizes and converts images from /public on the fly.
  image: {
    quality: 80,
    // Remote hosts IPX may fetch and resize (search result logos from the Ibbil API)
    domains: ['nyc3.digitaloceanspaces.com', 'fra1.digitaloceanspaces.com'],
    // WebP only: at the same quality setting sharp's AVIF output came out ~40% larger than WebP for our photos.
    // <NuxtPicture> still adds the original format as the <img> fallback.
    format: ['webp'],
    // Mirrors Tailwind's default breakpoints so `sizes="lg:50vw"` style hints line up
    screens: {
      sm: 640,
      md: 768,
      lg: 1024,
      xl: 1280,
      '2xl': 1536,
    },
  },

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
      { code: 'en', language: 'en-US', name: 'English', file: 'en.ts', dir: 'ltr' },
      { code: 'ar', language: 'ar-SA', name: 'العربية', file: 'ar.ts', dir: 'rtl' },
    ],
    defaultLocale: 'en',
    lazy: false,
    langDir: 'locales',
    strategy: 'prefix_except_default',
    detectBrowserLanguage: false,
  },

  // Values are overridable at runtime through NUXT_PUBLIC_* env variables
  runtimeConfig: {
    public: {
      apiBaseUrl: process.env.NUXT_PUBLIC_API_BASE_URL || 'https://api.ibbil.com/api/v1',
      appName: process.env.NUXT_PUBLIC_APP_NAME || 'Ibbil',
    },
  },

  app: {
    head: {
      titleTemplate: '%s | Ibbil',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      ],
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
