import { computed, ref, watch, type Ref } from 'vue';
import { useForm, type FormContext, type GenericObject } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/yup';
import * as yup from 'yup';
import type {
  FormPersistenceConfig,
  MultiStepFormOptions,
  StorageType,
  UseMultiStepFormReturn,
} from '@/types/form';
import { applyApiErrorToForm, getApiFieldErrors } from '@/utils/apiError';
import { isMediaValue } from '@/composables/useFormMedia';

// ─── Persistence Helpers ───────────────────────────────────────────────────────

function resolvePersistenceConfig(
  persist?: string | FormPersistenceConfig
): FormPersistenceConfig | null {
  if (!persist) return null;
  if (typeof persist === 'string') {
    return { key: persist, storage: 'session', persistStep: true, clearOnSubmit: true };
  }
  return { storage: 'session', persistStep: true, clearOnSubmit: true, ...persist };
}

function getStorage(storageType: StorageType = 'session'): Storage | null {
  if (typeof window === 'undefined') return null;
  try {
    return storageType === 'local' ? window.localStorage : window.sessionStorage;
  } catch {
    return null;
  }
}

function sanitizeForStorage(val: unknown): unknown {
  if (val === null || val === undefined) return val;
  if (typeof val === 'function' || typeof val === 'symbol') return undefined;
  if (typeof val !== 'object') return val;

  if (typeof File !== 'undefined' && val instanceof File) return undefined;
  if (typeof Blob !== 'undefined' && val instanceof Blob) return undefined;
  if (typeof FileList !== 'undefined' && val instanceof FileList) return undefined;

  if (isMediaValue(val)) {
    if (val.mediaId || (val.initialUrl && !val.wasRemoved)) {
      return {
        ...val,
        file: null,
        tempUrl: '',
      };
    }
    return undefined;
  }

  if (Array.isArray(val)) {
    return val.map(sanitizeForStorage).filter((item) => item !== undefined);
  }

  const result: Record<string, unknown> = {};
  for (const [key, propVal] of Object.entries(val as Record<string, unknown>)) {
    const sanitized = sanitizeForStorage(propVal);
    if (sanitized !== undefined) result[key] = sanitized;
  }
  return result;
}

function loadPersistedData(config: FormPersistenceConfig | null): {
  values?: GenericObject;
  step?: number;
} | null {
  if (!config?.key) return null;
  const storage = getStorage(config.storage);
  if (!storage) return null;

  try {
    const raw = storage.getItem(config.key);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return typeof parsed === 'object' && parsed !== null ? parsed : null;
  } catch {
    return null;
  }
}

function saveToStorage(
  config: FormPersistenceConfig | null,
  values: GenericObject,
  step: number
): void {
  if (!config?.key) return;
  const storage = getStorage(config.storage);
  if (!storage) return;

  try {
    let valuesToSave = { ...values };
    if (config.excludeFields?.length) {
      for (const field of config.excludeFields) delete valuesToSave[field];
    }
    if (config.beforeSave) valuesToSave = config.beforeSave(valuesToSave);

    const sanitizedValues = sanitizeForStorage(valuesToSave) as GenericObject;
    const payload: { values: GenericObject; step?: number } = { values: sanitizedValues ?? {} };
    if (config.persistStep) payload.step = step;

    storage.setItem(config.key, JSON.stringify(payload));
  } catch {
    // Ignore storage write errors (e.g. quota exceeded)
  }
}

function removePersistedData(config: FormPersistenceConfig | null): void {
  if (!config?.key) return;
  const storage = getStorage(config.storage);
  if (!storage) return;
  try {
    storage.removeItem(config.key);
  } catch {
    // Ignore storage removal errors
  }
}

function setupPersistenceWatcher(
  config: FormPersistenceConfig | null,
  form: FormContext<GenericObject>,
  currentStep: Ref<number>
): void {
  if (!config) return;
  watch(
    [() => form.values, () => currentStep.value],
    ([newValues, newStep]) => {
      saveToStorage(config, newValues, newStep);
    },
    { deep: true }
  );
}

function resolveInitialStepState(
  config: FormPersistenceConfig | null,
  persistedStep: number | undefined,
  steps: MultiStepFormOptions['steps'],
  values: GenericObject
): { initialStep: number; initialCompleted: Set<number> } {
  const completed = new Set<number>();

  if (
    !config?.persistStep ||
    typeof persistedStep !== 'number' ||
    persistedStep <= 0 ||
    persistedStep >= steps.length
  ) {
    return { initialStep: 0, initialCompleted: completed };
  }

  let activeStep = 0;
  for (const [i, step] of steps.slice(0, persistedStep).entries()) {
    const isStepValid = step.schema.isValidSync(values);
    if (!isStepValid) {
      return { initialStep: i, initialCompleted: completed };
    }
    completed.add(i);
    activeStep = i + 1;
  }

  return { initialStep: activeStep, initialCompleted: completed };
}

// ─── Helpers ───────────────────────────────────────────────────────────────────

/**
 * Build a single Yup schema by merging the `fields` from every step's schema.
 */
function buildCombinedSchema(steps: MultiStepFormOptions['steps']) {
  const combinedShape = steps.reduce<Record<string, yup.Schema>>(
    (shape, step) => Object.assign(shape, step.schema.fields),
    {}
  );
  return yup.object(combinedShape);
}

/**
 * Validate only the fields that belong to a given step.
 * Returns `true` when every field is valid.
 */
async function validateStepFields(
  form: FormContext<GenericObject>,
  fields: string[]
): Promise<boolean> {
  const results = await Promise.all(fields.map((field) => form.validateField(field as never)));
  return results.every((r) => r.valid);
}

/**
 * Given the current error map, find the first step (by index) that
 * contains at least one field with an error.
 */
function findFirstStepWithError(
  options: MultiStepFormOptions,
  errors: Record<string, unknown>,
  fallback: number
): number {
  const errorFields = new Set(Object.keys(errors).filter((k) => Boolean(errors[k])));
  const stepIndex = options.steps.findIndex((step) =>
    step.fields.some((field) => errorFields.has(field))
  );
  return stepIndex === -1 ? fallback : stepIndex;
}

/**
 * Validate all steps up to the target step.
 * Stops and sets currentStep to the first invalid step encountered.
 */
async function validateAndNavigateToStep(
  form: FormContext<GenericObject>,
  steps: MultiStepFormOptions['steps'],
  targetStep: number,
  currentStep: Ref<number>,
  completedSteps: Ref<Set<number>>
): Promise<void> {
  const totalSteps = steps.length;
  if (targetStep >= 0 && targetStep < totalSteps) {
    for (const [i, step] of steps.slice(0, targetStep).entries()) {
      const isValid = await validateStepFields(form, step.fields);
      if (!isValid) {
        const nextCompleted = new Set(completedSteps.value);
        for (let j = i; j < totalSteps; j++) nextCompleted.delete(j);
        completedSteps.value = nextCompleted;
        currentStep.value = i;
        return;
      }
      completedSteps.value = new Set([...completedSteps.value, i]);
    }
    currentStep.value = targetStep;
  }
}

// ─── Navigation factory ────────────────────────────────────────────────────────

// eslint-disable-next-line max-lines-per-function
function createNavigation(
  form: FormContext<GenericObject>,
  options: MultiStepFormOptions,
  currentStep: Ref<number>,
  isFirstStep: Ref<boolean>,
  isLastStep: Ref<boolean>,
  completedSteps: Ref<Set<number>>,
  persistConfig: FormPersistenceConfig | null,
  clearStorage: () => void
) {
  const { steps } = options;

  const next = async (): Promise<boolean> => {
    const step = steps[currentStep.value];
    if (!step) return false;
    const isValid = await validateStepFields(form, step.fields);
    if (!isValid) return false;
    completedSteps.value = new Set([...completedSteps.value, currentStep.value]);
    if (!isLastStep.value) currentStep.value++;
    return true;
  };

  const back = (): void => {
    if (!isFirstStep.value) currentStep.value--;
  };

  const goTo = async (step: number): Promise<void> => {
    await validateAndNavigateToStep(form, steps, step, currentStep, completedSteps);
  };

  const submit = async (
    onSubmit: (values: GenericObject) => void | Promise<void>
  ): Promise<boolean> => {
    const validations = await Promise.all(
      steps.map((step) => validateStepFields(form, step.fields))
    );

    if (!validations.every(Boolean)) {
      await goTo(findFirstStepWithError(options, form.errors.value, currentStep.value));
      return false;
    }

    completedSteps.value = new Set(steps.map((_, i) => i));
    await form.handleSubmit(async (values) => {
      await onSubmit(values);
      if (persistConfig?.clearOnSubmit !== false) clearStorage();
    })();
    return true;
  };

  const goToStepWithError = (errors?: Record<string, unknown>): void => {
    const errorMap = errors ?? form.errors.value;
    const stepWithError = findFirstStepWithError(options, errorMap, currentStep.value);
    currentStep.value = stepWithError;
  };

  const handleApiError = <TValues extends GenericObject>(
    err: unknown,
    fallbackField?: Extract<keyof TValues, string>
  ): void => {
    applyApiErrorToForm(err, form.setErrors, fallbackField);
    const fieldErrors = getApiFieldErrors(err);
    if (fieldErrors) {
      goToStepWithError(fieldErrors);
    } else {
      goToStepWithError();
    }
  };

  return { next, back, goTo, submit, goToStepWithError, handleApiError };
}

export function useMultiStepForm(options: MultiStepFormOptions): UseMultiStepFormReturn {
  const { steps, initialValues, persist } = options;

  const persistConfig = resolvePersistenceConfig(persist);
  const persistedData = loadPersistedData(persistConfig);
  const effectiveInitialValues = { ...initialValues, ...(persistedData?.values ?? {}) };

  const form = useForm<GenericObject>({
    validationSchema: toTypedSchema(buildCombinedSchema(steps)),
    initialValues: effectiveInitialValues,
    keepValuesOnUnmount: true,
  });

  const { initialStep, initialCompleted } = resolveInitialStepState(
    persistConfig,
    persistedData?.step,
    steps,
    effectiveInitialValues
  );

  const currentStep = ref(initialStep);
  const completedSteps = ref<Set<number>>(initialCompleted);
  const totalSteps = steps.length;

  const isFirstStep = computed(() => currentStep.value === 0);
  const isLastStep = computed(() => currentStep.value === totalSteps - 1);
  const progress = computed(() => Math.round(((currentStep.value + 1) / totalSteps) * 100));

  const clearStorage = (): void => {
    removePersistedData(persistConfig);
  };

  const navigation = createNavigation(
    form,
    options,
    currentStep,
    isFirstStep,
    isLastStep,
    completedSteps,
    persistConfig,
    clearStorage
  );

  setupPersistenceWatcher(persistConfig, form, currentStep);

  return {
    form,
    currentStep,
    totalSteps,
    isFirstStep,
    isLastStep,
    progress,
    completedSteps,
    ...navigation,
    clearStorage,
  };
}
