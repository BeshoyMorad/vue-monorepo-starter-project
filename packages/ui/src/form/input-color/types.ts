import type { HTMLAttributes } from 'vue';
import type { BaseFormFieldProps, FormFieldValidationProps } from '@workspace/ui/form/types';

export type InputColorVariant = 'default' | 'wheel' | 'swatch';
export type InputColorShape = 'square' | 'circle';

export interface BaseInputColorProps extends BaseFormFieldProps {
  modelValue?: string;
  defaultValue?: string;
  placeholder?: string;
  disabled?: boolean;
  readonly?: boolean;
  presets?: string[];
  showPresets?: boolean;
  showEyeDropper?: boolean;
  showCopy?: boolean;
  variant?: InputColorVariant;
  shape?: InputColorShape;
  showInput?: boolean;
  wrapperClass?: HTMLAttributes['class'];
  inputClass?: HTMLAttributes['class'];
  triggerClass?: HTMLAttributes['class'];
  wheelClass?: HTMLAttributes['class'];
}

export type InputColorProps = BaseInputColorProps & FormFieldValidationProps;
