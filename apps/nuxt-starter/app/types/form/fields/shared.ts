/**
 * Props every vee-validate wrapper field adds on top of its base field.
 *
 * Field value props (`modelValue`, `defaultValue`) are declared in each field's own props type
 * instead of a shared generic: Vue's compiler caches generic prop types across files, so a
 * generic would give some fields the wrong runtime type (e.g. lose Boolean casting).
 */
export interface FormFieldWrapperProps {
  /** Field name in the vee-validate form. Without it the field is not validated. */
  name?: string;
  label?: string;
  description?: string;
  containerClass?: string;
}

export interface RadioGroupOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface CheckboxGroupOption {
  value: string;
  label: string;
  disabled?: boolean;
}
