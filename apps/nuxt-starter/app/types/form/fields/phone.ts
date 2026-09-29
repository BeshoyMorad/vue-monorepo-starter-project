import type { CountryCode } from 'libphonenumber-js';

/** Props of BasePhoneInput. PhoneInput adds the vee-validate wrapper props. */
export interface BasePhoneInputProps {
  testId: string;
  modelValue?: string;
  defaultCountry?: CountryCode;
  placeholder?: string;
  disabled?: boolean;
  showClear?: boolean;
}
