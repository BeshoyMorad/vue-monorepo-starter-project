import { notify } from '@workspace/core/utils/toast';
import { describeApiError, describeApiFieldErrors } from '~/utils/apiErrorMessages';

type SetErrors = (errors: Record<string, string>) => void;

/**
 * Shows a failed request on a form, in the current language:
 * field validation errors go to their inputs; any other error goes under `fallbackField`
 * when given, otherwise into an error toast. Error codes are translated from
 * locales (apiErrors.*), so it works whether or not the API sends a message.
 */
export function useApiFormError() {
  const { t, te } = useI18n();
  const translator = { t: (key: string) => t(key), te: (key: string) => te(key) };

  const toast = (message: string) => notify('error', { title: t('errors.title'), body: message });

  const showError = (error: unknown, setErrors?: SetErrors, fallbackField?: string) => {
    const fieldErrors = describeApiFieldErrors(error, translator);
    if (fieldErrors && setErrors) {
      setErrors(fieldErrors);
      return;
    }

    const message = describeApiError(error, translator);
    if (fallbackField && setErrors) {
      setErrors({ [fallbackField]: message });
    } else {
      toast(message);
    }
  };

  return { showError, toast, describe: (error: unknown) => describeApiError(error, translator) };
}
