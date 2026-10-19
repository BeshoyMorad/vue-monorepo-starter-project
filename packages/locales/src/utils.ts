import dayjs from 'dayjs';
import { unref, watch } from 'vue';
import {
  DEFAULT_LOCALE,
  LOCALE_STORAGE_KEY,
  SUPPORTED_LOCALES,
  type LocaleCode,
  type LocaleDirection,
} from './config';

/**
 * Gets the stored language preference from localStorage or returns the default locale.
 */
export function getStoredLocale(): LocaleCode {
  try {
    if (typeof localStorage !== 'undefined') {
      const saved = localStorage.getItem(LOCALE_STORAGE_KEY) as LocaleCode | null;
      if (saved && saved in SUPPORTED_LOCALES) {
        return saved;
      }
    }
  } catch {
    // Fallback if localStorage is inaccessible
  }
  return DEFAULT_LOCALE;
}

/**
 * Saves the selected locale code to localStorage.
 */
export function setStoredLocale(locale: string): void {
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(LOCALE_STORAGE_KEY, locale);
    }
  } catch {
    // Fallback if localStorage is inaccessible
  }
}

/**
 * Returns the direction ('ltr' | 'rtl') for a given locale code.
 */
export function getLocaleDirection(locale: LocaleCode): LocaleDirection {
  return SUPPORTED_LOCALES[locale]?.direction ?? 'ltr';
}

/**
 * Updates the document <html> tag with the corresponding lang and dir attributes.
 */
export function syncDocumentLocale(locale: LocaleCode): void {
  if (typeof document === 'undefined') return;
  const meta = SUPPORTED_LOCALES[locale];
  document.documentElement.setAttribute('lang', locale);
  document.documentElement.setAttribute('dir', meta?.direction ?? 'ltr');
}

/**
 * Dynamically loads and activates the Dayjs locale.
 */
export async function syncDayjsLocale(locale: LocaleCode): Promise<void> {
  try {
    if (locale === 'ar') {
      await import('dayjs/locale/ar');
    } else if (locale === 'en') {
      await import('dayjs/locale/en');
    }
    const dayjsLocale = SUPPORTED_LOCALES[locale]?.dayjsLocale ?? locale;
    dayjs.locale(dayjsLocale);
  } catch {
    // Safe fallback
  }
}

/**
 * Sets up a reactive watcher on an i18n instance to synchronize:
 * 1. Optional message chunk loader (e.g. dynamic import)
 * 2. Document <html> lang and dir attributes
 * 3. Day.js locale
 * 4. LocalStorage persistence
 */
export function setupLocaleSync(
  i18nInstance: { global: { locale: unknown } },
  onLocaleChange?: (locale: LocaleCode) => Promise<void> | void
): void {
  watch(
    () => unref(i18nInstance.global.locale) as LocaleCode,
    async (newLocale) => {
      if (onLocaleChange) {
        await onLocaleChange(newLocale);
      }
      syncDocumentLocale(newLocale);
      await syncDayjsLocale(newLocale);
      setStoredLocale(newLocale);
    },
    { immediate: true }
  );
}
