import type { BaseFormFieldProps, FormFieldValidationProps } from '@workspace/ui/form/types';

export interface BaseInputOtpProps extends BaseFormFieldProps {
  modelValue?: string;
  defaultValue?: string;
  length?: number;
  integerOnly?: boolean;
  disabled?: boolean;
}

export type InputOtpProps = BaseInputOtpProps & FormFieldValidationProps;
