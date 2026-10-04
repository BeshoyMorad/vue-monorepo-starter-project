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

/** Backend message for a failed request, or `fallback`. Prefer the translated helpers. */
export function getApiErrorMessage(err: unknown, fallback: string): string {
  return getApiError(err)?.message || fallback;
}

export interface FieldErrorEntry {
  code?: string;
  message?: string;
}

/**
 * Per-field errors of a validation response, whatever the format:
 * `error.fields` = { phone: 'INVALID_PHONE' } (current API) or
 * `error.details.fields` = { phone: { code, message } } (API docs).
 */
export function getApiFieldErrorEntries(err: unknown): Record<string, FieldErrorEntry> | undefined {
  const error = getApiError(err);
  const fields = error?.fields ?? error?.details?.fields;
  if (!fields || typeof fields !== 'object') {
    return undefined;
  }

  const result: Record<string, FieldErrorEntry> = {};
  for (const [field, value] of Object.entries(fields)) {
    if (typeof value === 'string') {
      result[field] = { code: value };
    } else if (value && typeof value === 'object') {
      result[field] = { code: value.code, message: value.message };
    }
  }
  return Object.keys(result).length > 0 ? result : undefined;
}
