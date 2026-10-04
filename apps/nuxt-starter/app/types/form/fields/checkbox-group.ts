import type { CheckboxGroupOption } from './shared';

/** Props of BaseCheckboxGroup. CheckboxGroup adds the vee-validate wrapper props. */
export interface BaseCheckboxGroupProps {
  testId: string;
  modelValue?: unknown[];
  defaultValue?: unknown[];
  options: CheckboxGroupOption[];
  layout?: 'vertical' | 'horizontal';
  size?: 'small' | 'default' | 'large';
  shape?: 'circle' | 'square';
  disabled?: boolean;
}
