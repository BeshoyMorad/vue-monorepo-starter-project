/** Props of BaseInputNumber. InputNumber adds the vee-validate wrapper props. */
export interface BaseInputNumberProps {
  testId: string;
  modelValue?: number;
  defaultValue?: number;
  icon?: string;
  iconPosition?: 'left' | 'right';
  loading?: boolean;
  hideSteppers?: boolean;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
  formatOptions?: Intl.NumberFormatOptions;
}
