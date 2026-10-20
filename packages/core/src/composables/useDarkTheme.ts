import {
  computed,
  inject,
  ref,
  watchEffect,
  type App,
  type InjectionKey,
  type Ref,
  type WritableComputedRef,
} from 'vue';
import { usePreferredDark, useStorage } from '@vueuse/core';
import { THEME_STORAGE_KEY } from '@workspace/core/constants/theme';

/** Where the user's theme choice lives; the app provides it with `provideTheme`. */
export const THEME_CHOICE_KEY: InjectionKey<Ref<Theme | null>> = Symbol('theme-choice');

/**
 * Hands the theme choice to every `useDarkTheme()` in the app. The app decides where it is kept:
 * a cookie in Nuxt (the server renders <html data-theme>, no flash), localStorage in a SPA.
 */
export function provideTheme(app: App, choice: Ref<Theme | null>): void {
  app.provide(THEME_CHOICE_KEY, choice);
}

// Module-level singleton for SPA applications to avoid boilerplate in main.ts
let spaThemeChoice: Ref<Theme | null> | null = null;
let spaWatchInitialized = false;

function getSpaThemeChoice(): Ref<Theme | null> {
  if (!spaThemeChoice) {
    spaThemeChoice = useStorage<Theme | null>(THEME_STORAGE_KEY, null);
    if (typeof window !== 'undefined' && !spaWatchInitialized) {
      spaWatchInitialized = true;
      watchEffect(() => {
        if (spaThemeChoice?.value) {
          document.documentElement.setAttribute('data-theme', spaThemeChoice.value);
        } else {
          document.documentElement.removeAttribute('data-theme');
        }
      });
    }
  }
  return spaThemeChoice;
}

export interface UseDarkThemeReturn {
  theme: Ref<Theme | null>;
  isDark: WritableComputedRef<boolean>;
  toggleDark: () => void;
}

/**
 * Light / dark theme composable.
 * - `theme`: The user's explicit theme choice ('light' | 'dark' | null). null means follow the device.
 * - `isDark`: Reactive boolean reflecting whether the current applied mode is dark.
 * - `toggleDark`: Switches between light and dark modes (reversing current effective theme).
 */
export function useDarkTheme(): UseDarkThemeReturn {
  const injectedChoice = inject(THEME_CHOICE_KEY, null);
  const theme =
    injectedChoice ??
    (typeof window !== 'undefined' ? getSpaThemeChoice() : ref<Theme | null>(null));

  const preferredDark = usePreferredDark();

  const isDark = computed<boolean>({
    get: () => {
      if (theme.value === 'dark') return true;
      if (theme.value === 'light') return false;
      return preferredDark.value;
    },
    set: (val: boolean) => {
      theme.value = val ? 'dark' : 'light';
    },
  });

  function toggleDark() {
    const current = theme.value ?? (preferredDark.value ? 'dark' : 'light');
    theme.value = current === 'dark' ? 'light' : 'dark';
  }

  return {
    theme,
    isDark,
    toggleDark,
  };
}
