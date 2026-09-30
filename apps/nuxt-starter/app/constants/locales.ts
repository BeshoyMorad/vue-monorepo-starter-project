import type { LocaleCode, LocaleMeta } from '@/types/locale';

export const DEFAULT_LOCALE: LocaleCode = 'en';
export const FALLBACK_LOCALE: LocaleCode = 'en';

export const SUPPORTED_LOCALES: Record<LocaleCode, LocaleMeta> = {
  en: {
    code: 'en',
    label: 'English',
    nativeLabel: 'English',
    direction: 'ltr',
    flag: '🇺🇸',
    dayjsLocale: 'en',
  },
  ar: {
    code: 'ar',
    label: 'Arabic',
    nativeLabel: 'العربية',
    direction: 'rtl',
    flag: '🇸🇦',
    dayjsLocale: 'ar',
  },
};

export const SUPPORTED_LOCALE_CODES = Object.keys(SUPPORTED_LOCALES) as LocaleCode[];
