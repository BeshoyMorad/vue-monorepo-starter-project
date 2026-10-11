import type { BaseFormFieldProps, FormFieldValidationProps } from '@workspace/ui/form/types';

export interface BaseInputOtpProps extends BaseFormFieldProps {
  modelValue?: string;
  defaultValue?: string;
  length?: number;
  integerOnly?: boolean;
  disabled?: boolean;
  /** Shows a dot instead of each typed character (PINs) */
  masked?: boolean;
}

export type InputOtpProps = BaseInputOtpProps & FormFieldValidationProps;
