import { computed } from 'vue';

export const DARK_THEME_STORAGE_KEY = 'vue-starter-theme';
export const ONE_YEAR_IN_SECONDS = 60 * 60 * 24 * 365;

/**
 * Nuxt 3 SSR-first Dark Theme Composable.
 * Uses HTTP Cookie (`useCookie`) so theme state is known on the server during initial request.
 * Completely eliminates SSR-to-client hydration mismatch and FOUC without inline script hacks.
 */
export function useDarkTheme() {
  const themeCookie = useCookie<'dark' | 'light'>(DARK_THEME_STORAGE_KEY, {
    default: () => 'light',
    sameSite: 'lax',
    path: '/',
    maxAge: ONE_YEAR_IN_SECONDS,
  });

  const isDark = computed<boolean>({
    get: () => themeCookie.value === 'dark',
    set: (val: boolean) => {
      themeCookie.value = val ? 'dark' : 'light';
    },
  });

  const toggleDark = () => {
    isDark.value = !isDark.value;
  };

  useHead({
    htmlAttrs: {
      'data-theme': () => (isDark.value ? 'dark' : 'light'),
      style: () => `color-scheme: ${isDark.value ? 'dark' : 'light'}`,
    },
  });

  return { isDark, toggleDark };
}
