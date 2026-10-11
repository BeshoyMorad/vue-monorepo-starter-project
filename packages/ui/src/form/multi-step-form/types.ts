import type { HTMLAttributes } from 'vue';
import type { GenericObject } from 'vee-validate';

import type {
  StorageType,
  FormPersistenceConfig,
  FormPersistenceOption,
  StepDefinition,
  MultiStepFormOptions,
} from '@workspace/core/types/multiStepForm';

export type {
  StorageType,
  FormPersistenceConfig,
  FormPersistenceOption,
  StepDefinition,
  MultiStepFormOptions,
};

export interface MultiStepFormProps {
  testId: string;
  steps: StepDefinition[];
  initialValues?: GenericObject;
  nextLabel?: string;
  backLabel?: string;
  submitLabel?: string;
  loading?: boolean;
  showStepper?: boolean;
  /** CSS class applied to the form body area. */
  bodyClass?: HTMLAttributes['class'];
  /**
   * Persist form state and step in session storage (or local storage).
   * Can be:
   * - `true`: enables session persistence using a key derived from testId
   * - `string`: custom storage key
   * - `FormPersistenceConfig`: custom configuration object
   */
  persist?: FormPersistenceOption;
}

export interface MultiStepFormEmits {
  (e: 'submit', values: GenericObject): void;
}
