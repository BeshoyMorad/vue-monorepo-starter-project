/**
 * Global SSR Theme Plugin for Nuxt 3.
 * Reads the theme cookie during server-side rendering (SSR)
 * and sets <html data-theme="..."> and style="color-scheme: ..." on the initial HTML response.
 * Eliminates FOUC and hydration mismatches without inline script hacks.
 */
export default defineNuxtPlugin(() => {
  const { theme } = useDarkTheme();

  useHead({
    htmlAttrs: {
      'data-theme': () => theme.value,
      style: () => `color-scheme: ${theme.value}`,
    },
  });
});
