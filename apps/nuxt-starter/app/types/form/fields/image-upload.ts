import type { MediaValue } from '@/types/media';

/** Props of BaseImageUpload. ImageUpload adds the vee-validate wrapper props. */
export interface BaseImageUploadProps {
  testId: string;
  modelValue?: MediaValue | null;
  disabled?: boolean;
  placeholder?: string;
  sizePreset?: 'logo' | 'smallLogo' | 'avatar' | 'default';
  ariaInvalid?: boolean;
  allowedTypes?: string[];
  crop?: boolean;
  cropAspectRatio?: number;
  maxSizeMb?: number;
}
