import { ref, watch } from 'vue';
import { notify } from '@workspace/core/utils/toast';
import { getApiErrorCode } from '~/utils/apiError';
import { describeApiError, describeApiFieldErrors } from '~/utils/apiErrorMessages';
import { focusFirstInvalidField } from '~/utils/focus';

type SetErrors = (errors: Record<string, string>) => void;

/**
 * Shows a failed request on a form, in the current language:
 * - field validation errors go under their inputs (via vee-validate `setErrors`), and focus
 *   moves to the first of them so screen readers read it out;
 * - any other error (wrong credentials, too many attempts…) goes to `formError`, which the
 *   form shows in one alert under its submit button (see AuthFormError).
 * Error codes are translated from locales (apiErrors.*), so it works whether or not the API
 * sends a message.
 *
 * `codeFields` sends error codes that are about one field to that field, e.g.
 * { PHONE_IN_USE: 'phone' }: the message shows under the phone input instead of the form.
 *
 * Pass the form `values` (vee-validate's reactive object) to clear the form error as soon as the user edits the form.
 */
export function useApiFormError(clearOnChange?: object) {
  const { t, te } = useI18n();
  const translator = { t: (key: string) => t(key), te: (key: string) => te(key) };

  /** Message for the whole form, shown under the submit button; '' when there is none. */
  const formError = ref('');
  const clearFormError = () => {
    formError.value = '';
  };
  if (clearOnChange) {
    watch(clearOnChange, clearFormError, { deep: true });
  }

  /** For errors with nowhere on the page to go, e.g. when the form is about to close. */
  const toast = (message: string) => notify('error', { title: t('errors.title'), body: message });

  const showError = (
    error: unknown,
    setErrors?: SetErrors,
    codeFields: Record<string, string> = {}
  ) => {
    const codeField = codeFields[getApiErrorCode(error) ?? ''];
    const fieldErrors =
      describeApiFieldErrors(error, translator) ??
      (codeField ? { [codeField]: describeApiError(error, translator) } : undefined);
    if (fieldErrors && setErrors) {
      clearFormError();
      setErrors(fieldErrors);
      void focusFirstInvalidField();
      return;
    }
    formError.value = describeApiError(error, translator);
  };

  return {
    showError,
    formError,
    clearFormError,
    toast,
    describe: (error: unknown) => describeApiError(error, translator),
  };
}
