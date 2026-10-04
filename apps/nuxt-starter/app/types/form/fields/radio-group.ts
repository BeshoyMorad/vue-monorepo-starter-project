import type { RadioGroupOption } from './shared';

/** Props of BaseRadioGroup. RadioGroup adds the vee-validate wrapper props. */
export interface BaseRadioGroupProps {
  testId: string;
  modelValue?: string;
  defaultValue?: string;
  options: RadioGroupOption[];
  layout?: 'vertical' | 'horizontal';
  size?: 'small' | 'default' | 'large';
  disabled?: boolean;
  id?: string;
}
