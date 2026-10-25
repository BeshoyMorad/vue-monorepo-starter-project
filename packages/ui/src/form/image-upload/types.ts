import type { MediaValue } from '@workspace/core/types/media';
import type { BaseFormFieldProps, FormFieldValidationProps } from '@workspace/ui/form/types';

export type ImageUploadSizePreset = 'logo' | 'smallLogo' | 'avatar' | 'default';

export interface BaseImageUploadProps extends BaseFormFieldProps {
  modelValue?: MediaValue | null;
  disabled?: boolean;
  placeholder?: string;
  sizePreset?: ImageUploadSizePreset;
  ariaInvalid?: boolean;
  allowedTypes?: string[];
  crop?: boolean;
  cropAspectRatio?: number;
  maxSizeMb?: number;
}

export type ImageUploadProps = Omit<BaseImageUploadProps, 'ariaInvalid'> & FormFieldValidationProps;
