import type { FetchError } from 'ofetch';
import type { ApiErrorBody, ApiFailure } from '~/types/api';

/** True when `err` is an HTTP error thrown by the fetch client. */
export function isFetchError(err: unknown): err is FetchError<ApiFailure> {
  return err instanceof Error && err.name === 'FetchError';
}

/** HTTP status of a failed request, or undefined for network errors. */
export function getApiErrorStatus(err: unknown): number | undefined {
  return isFetchError(err) ? err.status : undefined;
}

/** True for 4xx responses: retrying them will not help. */
export function isClientError(err: unknown): boolean {
  const status = getApiErrorStatus(err);
  return status !== undefined && status >= 400 && status < 500;
}

/** The `error` object of a failed API response, if any. */
export function getApiError(err: unknown): ApiErrorBody | undefined {
  return (isFetchError(err) && err.data?.error) || undefined;
}

/** Backend error code, e.g. 'ValidationError' or 'AccountNotVerified'. */
export function getApiErrorCode(err: unknown): string | undefined {
  return getApiError(err)?.code;
}

/** Backend message for a failed request, or `fallback`. */
export function getApiErrorMessage(err: unknown, fallback: string): string {
  return getApiError(err)?.message || fallback;
}

/** Field errors from a validation response (`error.details.fields`), one message per field. */
export function getApiFieldErrors(err: unknown): Record<string, string> | undefined {
  const fields = getApiError(err)?.details?.fields;
  if (!fields || typeof fields !== 'object') {
    return undefined;
  }

  const result: Record<string, string> = {};
  for (const [field, value] of Object.entries(fields)) {
    if (value?.message) {
      result[field] = value.message;
    }
  }
  return Object.keys(result).length > 0 ? result : undefined;
}

/**
 * Shows a failed request on a vee-validate form: field errors go to their inputs,
 * anything else goes under `fallbackField`. Send such requests with `silent: true`
 * so the global toast doesn't duplicate the message.
 */
export function applyApiErrorToForm(
  err: unknown,
  setErrors: (errors: Record<string, string>) => void,
  fallbackField?: string,
  fallbackMessage = ''
): void {
  const fieldErrors = getApiFieldErrors(err);
  if (fieldErrors) {
    setErrors(fieldErrors);
    return;
  }
  if (fallbackField) {
    setErrors({ [fallbackField]: getApiErrorMessage(err, fallbackMessage) });
  }
}
