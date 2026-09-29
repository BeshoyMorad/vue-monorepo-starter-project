import type { CountryCode } from 'libphonenumber-js';

export interface CountryOption {
  code: CountryCode;
  name: string;
  dialCode: string;
  flag: string;
}
