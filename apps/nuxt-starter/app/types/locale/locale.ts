export type LocaleCode = 'en' | 'ar';

export type LocaleDirection = 'ltr' | 'rtl';

export interface LocaleMeta {
  code: LocaleCode;
  label: string;
  nativeLabel: string;
  direction: LocaleDirection;
  flag: string;
  dayjsLocale: string;
}
