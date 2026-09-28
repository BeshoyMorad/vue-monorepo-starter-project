import tailwindcss from '@tailwindcss/vite';

// Keep in sync with DARK_THEME_STORAGE_KEY in app/composables/useDarkTheme.ts.
const THEME_STORAGE_KEY = 'vue-starter-theme';

// Runs before the app mounts so the page never flashes the wrong theme.
const themeBootScript = `(() => {
  const theme =
    localStorage.getItem('${THEME_STORAGE_KEY}') ??
    (window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  document.documentElement.setAttribute('data-theme', theme);
  document.documentElement.style.colorScheme = theme;
})();`;

export default defineNuxtConfig({
  compatibilityDate: '2026-09-01',

  // SPA mode: auth tokens live in localStorage, so pages must render on the client.
  // See docs/NUXT_MIGRATION_REPORT.md before switching this on.
  ssr: false,

  devtools: { enabled: true },

  // Ports 3000-3002 are used by the Vite apps in this monorepo.
  devServer: { port: 3003 },

  modules: ['@pinia/nuxt', 'pinia-plugin-persistedstate/nuxt', '@nuxtjs/i18n', '@nuxt/image'],

  // <NuxtImg> resizes and converts files from public/ through the built-in IPX server.
  // Remote images are passed through untouched unless their host is listed in `domains`.
  image: {
    format: ['webp'],
    domains: [],
  },

  // Project code uses explicit imports. Scanning is off so helpers such as the toast
  // `error()` and `warn()` functions are not injected as globals into every file.
  // Vue and Nuxt APIs (ref, computed, navigateTo, ...) are still auto-imported.
  imports: {
    scan: false,
  },

  // Only .vue files are components. The shadcn folders also hold index.ts barrels,
  // which would otherwise register a second component with the same name.
  components: [{ path: '~/components', extensions: ['.vue'] }],

  css: ['~/assets/css/index.css'],

  app: {
    // Matches the asset folder the Vite build used before the migration.
    buildAssetsDir: '/project_assets/',
    head: {
      title: 'Nuxt Starter',
      meta: [{ name: 'viewport', content: 'width=device-width, initial-scale=1' }],
      link: [{ rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' }],
      script: [{ innerHTML: themeBootScript, tagPosition: 'head' }],
    },
  },

  // Values are overridden at runtime by NUXT_PUBLIC_* environment variables
  // and validated in app/config/env.ts.
  runtimeConfig: {
    public: {
      apiBaseUrl: '',
      appEnv: 'development',
      enableDevtools: false,
    },
  },

  i18n: {
    strategy: 'no_prefix',
    defaultLocale: 'en',
    locales: [
      { code: 'en', language: 'en-US', name: 'English', dir: 'ltr', file: 'en.ts' },
      { code: 'ar', language: 'ar-SA', name: 'العربية', dir: 'rtl', file: 'ar.ts' },
    ],
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'app_language_preference',
      redirectOn: 'root',
      fallbackLocale: 'en',
    },
    vueI18n: './i18n.config.ts',
  },

  vite: {
    plugins: [tailwindcss()],
  },

  typescript: {
    strict: true,
    tsConfig: {
      compilerOptions: {
        noUnusedLocals: true,
        noUnusedParameters: true,
        noFallthroughCasesInSwitch: true,
      },
    },
  },
});
