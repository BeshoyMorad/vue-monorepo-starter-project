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

  // Auto-imports: Vue and Nuxt APIs, `app/composables/*` and `app/stores/*` (via @pinia/nuxt).
  // `app/utils/` is left out on purpose: the toast helpers `error()`, `warn()`, `info()` and
  // `success()` would otherwise become globals. Import utils explicitly from `@/utils/*`.
  imports: {
    scan: true,
  },

  hooks: {
    'imports:dirs'(dirs) {
      const utilsIndex = dirs.findIndex((dir) => dir.replace(/\\/g, '/').endsWith('/app/utils'));
      if (utilsIndex !== -1) dirs.splice(utilsIndex, 1);
    },
  },

  // Components are auto-imported in templates. Only .vue files count, because the shadcn
  // folders also hold index.ts barrels. More specific folders come first: Nuxt skips files a
  // previous entry already registered.
  //   ui/*               shadcn primitives, plain names:     <Button>, <Tooltip>, <TableRow>
  //   data-table/*       'Data' prefix:                      <DataTable>, <DataInfiniteScrollTable>
  //   tooltip/*          'App' prefix (ui has a Tooltip):    <AppTooltip>
  //   form/multi-step-form/*  plain names:                   <MultiStepForm>, <StepIndicator>
  //   form/*             'Form' prefix:                      <FormInputText>, <FormBaseCheckbox>
  //   everything else    plain names:                        <Icon>, <PageWrapper>, <ExceptionState>
  // Pages normally use form fields through the `Field` namespace from `@/components/form`,
  // which is a plain object and must still be imported. Script code (h(), typeof) imports
  // components from `#components` by these names.
  components: [
    { path: '~/components/ui', pathPrefix: false, extensions: ['.vue'] },
    { path: '~/components/data-table', pathPrefix: false, prefix: 'Data', extensions: ['.vue'] },
    { path: '~/components/tooltip', pathPrefix: false, prefix: 'App', extensions: ['.vue'] },
    { path: '~/components/form/multi-step-form', pathPrefix: false, extensions: ['.vue'] },
    { path: '~/components/form', pathPrefix: false, prefix: 'Form', extensions: ['.vue'] },
    { path: '~/components', pathPrefix: false, extensions: ['.vue'] },
  ],

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
