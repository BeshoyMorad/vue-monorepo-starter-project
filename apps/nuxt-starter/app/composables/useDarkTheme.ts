import { useDark, useToggle } from '@vueuse/core';

// Keep in sync with THEME_STORAGE_KEY in nuxt.config.ts (theme boot script).
export const DARK_THEME_STORAGE_KEY = 'vue-starter-theme';

export const useDarkTheme = () => {
  const isDark = useDark({
    selector: 'html',
    attribute: 'data-theme',
    valueDark: 'dark',
    valueLight: 'light',
    storageKey: DARK_THEME_STORAGE_KEY,
    initialValue: 'light',
    onChanged(isDark, defaultHandler) {
      defaultHandler(isDark ? 'dark' : 'light');
      if (import.meta.client) {
        document.documentElement.style.colorScheme = isDark ? 'dark' : 'light';
      }
    },
  });

  const toggleDark = useToggle(isDark);

  return { isDark, toggleDark };
};
