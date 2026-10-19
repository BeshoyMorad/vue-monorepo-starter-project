import { DARK_THEME_STORAGE_KEY, ONE_YEAR_IN_SECONDS } from '~/composables/useDarkTheme';

/**
 * Global SSR Theme Plugin for Nuxt 3.
 * Reads the theme cookie during server-side rendering (SSR)
 * and sets <html data-theme="..."> and style="color-scheme: ..." on the initial HTML response.
 * Eliminates FOUC and hydration mismatches without inline script hacks.
 */
export default defineNuxtPlugin(() => {
  const themeCookie = useCookie<'dark' | 'light'>(DARK_THEME_STORAGE_KEY, {
    default: () => 'light',
    sameSite: 'lax',
    path: '/',
    maxAge: ONE_YEAR_IN_SECONDS,
  });

  useHead({
    htmlAttrs: {
      'data-theme': () => themeCookie.value,
      style: () => `color-scheme: ${themeCookie.value}`,
    },
  });
});
