import type { MediaValue } from '@/types/media';

/** Props of BaseFileUpload. FileUpload adds the vee-validate wrapper props. */
export interface BaseFileUploadProps {
  testId: string;
  modelValue?: MediaValue[];
  disabled?: boolean;
  placeholder?: string;
  buttonLabel?: string;
  ariaInvalid?: boolean;
  allowedTypes?: string[];
  maxFiles?: number;
  maxSizeMb?: number;
  hasDisplayHint?: boolean;
  hasPlaceholder?: boolean;
}
