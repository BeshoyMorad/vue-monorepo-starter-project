import type * as yup from 'yup';
import type { Ref } from 'vue';
import type { FormContext, GenericObject } from 'vee-validate';

export type StorageType = 'session' | 'local';

export interface FormPersistenceConfig {
  /** Unique key used in storage. */
  key: string;
  /** Storage mechanism to use. Defaults to 'session'. */
  storage?: StorageType;
  /** Whether to persist and restore the active step index. Defaults to true. */
  persistStep?: boolean;
  /** Whether to automatically clear storage upon successful form submission. Defaults to true. */
  clearOnSubmit?: boolean;
  /** List of field names to exclude from storage (e.g. passwords, sensitive data). */
  excludeFields?: string[];
  /** Optional custom transformer hook before saving values to storage. */
  beforeSave?: (values: GenericObject) => GenericObject;
}

export type FormPersistenceOption = boolean | string | FormPersistenceConfig;

export interface StepDefinition {
  title: string;
  description?: string;
  /** Field names that belong to this step (used for per-step validation). */
  fields: string[];
  schema: yup.ObjectSchema<GenericObject>;
}

export interface MultiStepFormOptions<T extends GenericObject = GenericObject> {
  steps: StepDefinition[];
  initialValues?: T;
  /**
   * Configuration for persisting form state in session or local storage.
   * Can be a string key or a FormPersistenceConfig object.
   */
  persist?: string | FormPersistenceConfig;
}

export interface UseMultiStepFormReturn {
  /** The underlying VeeValidate form context (exposes values, errors, setFieldValue, etc.). */
  form: FormContext<GenericObject>;

  currentStep: Ref<number>;
  totalSteps: number;
  isFirstStep: Ref<boolean>;
  isLastStep: Ref<boolean>;
  progress: Ref<number>;
  completedSteps: Ref<Set<number>>;

  /** Validate current step's fields, advance if valid. Returns `true` if advanced. */
  next: () => Promise<boolean>;
  /** Move to the previous step (no validation). */
  back: () => void;
  /** Jump to an arbitrary step index. */
  goTo: (step: number) => Promise<void>;
  /**
   * Validate all steps, then call the provided `onSubmit` callback.
   * If validation fails, auto-navigates to the first step with errors.
   * Returns `true` if submission was triggered.
   */
  submit: (onSubmit: (values: GenericObject) => void | Promise<void>) => Promise<boolean>;
  /**
   * Navigates to the first step containing an active error in the form.
   */
  goToStepWithError: (errors?: Record<string, unknown>) => void;
  /**
   * Applies an API error response to form fields and navigates to the first step with an error.
   */
  handleApiError: <TValues extends GenericObject>(
    err: unknown,
    fallbackField?: Extract<keyof TValues, string>
  ) => void;
  /** Clear persisted form state from storage. */
  clearStorage: () => void;
}
