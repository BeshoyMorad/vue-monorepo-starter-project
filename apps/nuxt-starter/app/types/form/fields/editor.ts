import type { HTMLAttributes } from 'vue';

export interface ToolbarItem {
  id: string;
  label: string;
  icon: string;
  action: () => void;
  isActive?: () => boolean;
  disabled?: () => boolean;
  class?: string;
}

/** Props of BaseEditor. Editor adds the vee-validate wrapper props. */
export interface BaseEditorProps {
  testId: string;
  modelValue?: string;
  defaultValue?: string;
  placeholder?: string;
  disabled?: boolean;
  readonly?: boolean;
  minHeight?: string;
  maxHeight?: string;
  class?: HTMLAttributes['class'];
  invalid?: boolean;
}
