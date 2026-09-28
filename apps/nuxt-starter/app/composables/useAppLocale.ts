import { computed, ref } from 'vue';
import { useNuxtApp } from '#imports';
import { FALLBACK_LOCALE, SUPPORTED_LOCALES, SUPPORTED_LOCALE_CODES } from '@/constants/locales';
import type { LocaleCode, LocaleMeta } from '@/types/locale';

const isLoadingLocale = ref(false);

export function isLocaleCode(value: string): value is LocaleCode {
  return (SUPPORTED_LOCALE_CODES as string[]).includes(value);
}

/**
 * App-level wrapper around the Nuxt i18n instance.
 * Adds locale metadata (flag, direction, labels) and a loading flag for the switcher.
 * `<html lang/dir>`, lazy loading and cookie persistence are handled by @nuxtjs/i18n.
 */
export function useAppLocale() {
  const i18n = useNuxtApp().$i18n;

  const currentLocale = computed<LocaleCode>(() =>
    isLocaleCode(i18n.locale.value) ? i18n.locale.value : FALLBACK_LOCALE
  );
  const currentLocaleMeta = computed<LocaleMeta>(() => SUPPORTED_LOCALES[currentLocale.value]);
  const isRTL = computed(() => currentLocaleMeta.value.direction === 'rtl');
  const supportedLocales = computed(() => Object.values(SUPPORTED_LOCALES));

  const setLocale = async (locale: LocaleCode): Promise<void> => {
    if (currentLocale.value === locale) return;
    isLoadingLocale.value = true;
    try {
      await i18n.setLocale(locale);
    } finally {
      isLoadingLocale.value = false;
    }
  };

  return {
    t: i18n.t,
    d: i18n.d,
    n: i18n.n,
    tm: i18n.tm,
    rt: i18n.rt,
    currentLocale,
    currentLocaleMeta,
    isRTL,
    supportedLocales,
    isLoadingLocale: computed(() => isLoadingLocale.value),
    setLocale,
  };
}
