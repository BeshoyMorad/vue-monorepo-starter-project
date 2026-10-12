import type { BaseFormFieldProps, FormFieldValidationProps } from '@workspace/ui/form/types';

export interface BaseInputPasswordProps extends BaseFormFieldProps {
  modelValue?: string | number;
  defaultValue?: string | number;
  /** Accessible name of the show/hide toggle (translate it in the app) */
  toggleLabel?: string;
}

export type InputPasswordProps = BaseInputPasswordProps & FormFieldValidationProps;
