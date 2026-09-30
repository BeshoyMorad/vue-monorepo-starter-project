import type en from '~~/i18n/locales/en';
import type { datetimeFormats, numberFormats } from '~~/i18n/i18n.config';

type MessageSchema = typeof en;
type DateTimeSchema = Record<keyof (typeof datetimeFormats)['en'], Intl.DateTimeFormatOptions>;
type NumberSchema = Record<keyof (typeof numberFormats)['en'], Intl.NumberFormatOptions>;

declare module 'vue-i18n' {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  export interface DefineLocaleMessage extends MessageSchema {}
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  export interface DefineDateTimeFormat extends DateTimeSchema {}
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  export interface DefineNumberFormat extends NumberSchema {}
}
