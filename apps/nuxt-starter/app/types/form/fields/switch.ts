/** Props of BaseSwitch. Switch adds the vee-validate wrapper props. */
export interface BaseSwitchProps {
  testId: string;
  modelValue?: boolean;
  defaultValue?: boolean;
  size?: 'small' | 'default' | 'large';
  disabled?: boolean;
  readonly?: boolean;
  label?: string;
  id?: string;
}
