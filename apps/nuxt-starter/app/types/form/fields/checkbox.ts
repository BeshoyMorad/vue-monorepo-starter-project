/** Props of BaseCheckbox. Checkbox adds the vee-validate wrapper props. */
export interface BaseCheckboxProps {
  testId: string;
  modelValue?: boolean;
  defaultValue?: boolean;
  size?: 'small' | 'default' | 'large';
  shape?: 'circle' | 'square';
  disabled?: boolean;
  readonly?: boolean;
  label?: string;
  id?: string;
}
