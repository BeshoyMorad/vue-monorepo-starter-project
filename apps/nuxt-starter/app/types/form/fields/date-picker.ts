/** Props of BaseDatePicker. DatePicker adds the vee-validate wrapper props. */
export interface BaseDatePickerProps {
  testId: string;
  modelValue?: Date | string | null;
  defaultValue?: Date | string | null;
  dateFormat?: string;
  minDate?: Date;
  maxDate?: Date;
  disabled?: boolean;
  placeholder?: string;
  id?: string;
}
