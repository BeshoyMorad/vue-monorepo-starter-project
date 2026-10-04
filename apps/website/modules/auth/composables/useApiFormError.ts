import { notify } from '@workspace/core/utils/toast';
import { getApiErrorMessage, getApiFieldErrors } from '~/utils/apiError';

type SetErrors = (errors: Record<string, string>) => void;

/**
 * Shows a failed auth request: validation errors go to their inputs; anything else goes
 * under `fallbackField` when given, otherwise into an error toast.
 */
export function useApiFormError() {
  const { t } = useI18n();

  const toast = (message: string) => notify('error', { title: t('errors.title'), body: message });

  const showError = (error: unknown, setErrors?: SetErrors, fallbackField?: string) => {
    const fieldErrors = getApiFieldErrors(error);
    if (fieldErrors && setErrors) {
      setErrors(fieldErrors);
      return;
    }

    const message = getApiErrorMessage(error, t('errors.generic'));
    if (fallbackField && setErrors) {
      setErrors({ [fallbackField]: message });
    } else {
      toast(message);
    }
  };

  return { showError, toast };
}
