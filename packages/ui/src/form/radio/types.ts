import type { BaseFormFieldProps, FormFieldValidationProps } from '@workspace/ui/form/types';

export interface BaseRadioProps extends BaseFormFieldProps {
  modelValue?: string;
  defaultValue?: string;
  value?: string;
  disabled?: boolean;
  label?: string;
  id?: string;
}

export type RadioProps = BaseRadioProps & FormFieldValidationProps;
