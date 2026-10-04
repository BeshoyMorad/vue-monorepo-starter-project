/** Props of BaseInputText. InputText adds the vee-validate wrapper props. */
export interface BaseInputTextProps {
  testId: string;
  modelValue?: string | number;
  defaultValue?: string | number;
  icon?: string;
  iconPosition?: 'left' | 'right';
  loading?: boolean;
}
