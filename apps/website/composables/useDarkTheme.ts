import { computed } from 'vue';

export type Theme = 'dark' | 'light';

export const DARK_THEME_STORAGE_KEY = 'vue-starter-theme';
export const ONE_YEAR_IN_SECONDS = 60 * 60 * 24 * 365;

/**
 * Returns the reactive Nuxt cookie holding the user's theme selection.
 */
export function useThemeCookie() {
  return useCookie<Theme>(DARK_THEME_STORAGE_KEY, {
    default: () => 'light' as Theme,
    sameSite: 'lax' as const,
    path: '/',
    maxAge: ONE_YEAR_IN_SECONDS,
  });
}

/**
 * Nuxt 3 SSR-first Dark Theme Composable.
 * Uses HTTP Cookie (`useCookie`) so theme state is known on the server during initial request.
 * Completely eliminates SSR-to-client hydration mismatch and FOUC without inline script hacks.
 */
export function useDarkTheme() {
  const theme = useThemeCookie();

  const isDark = computed<boolean>({
    get: () => theme.value === 'dark',
    set: (val: boolean) => {
      theme.value = val ? 'dark' : 'light';
    },
  });

  const toggleDark = () => {
    isDark.value = !isDark.value;
  };

  return {
    theme,
    isDark,
    toggleDark,
  };
}
