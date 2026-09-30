export interface FormatCurrencyOptions {
  locale?: string;
  currency?: string;
  minimumFractionDigits?: number;
  maximumFractionDigits?: number;
}

export type FormatDateMode = 'date' | 'datetime' | 'month' | 'apiDate' | 'time';

export interface FormatDateOptions {
  mode?: FormatDateMode;
  skipConvert?: boolean;
}

export interface FormatTimeOptions {
  locale?: string;
  hour?: 'numeric' | '2-digit';
  minute?: 'numeric' | '2-digit';
  second?: 'numeric' | '2-digit';
  hour12?: boolean;
}

export interface FormatPercentageOptions {
  locale?: string;
  minimumFractionDigits?: number;
  maximumFractionDigits?: number;
}

export interface FormatNumberOptions {
  locale?: string;
  minimumFractionDigits?: number;
  maximumFractionDigits?: number;
}

export interface FormatListOptions {
  locale?: string;
  type?: Intl.ListFormatType;
  style?: Intl.ListFormatStyle;
}

export interface FormatSubscriptZerosOptions {
  maxDigits?: number;
  html?: boolean;
}

export interface FormatFileSizeOptions {
  decimals?: number;
  binary?: boolean;
}
