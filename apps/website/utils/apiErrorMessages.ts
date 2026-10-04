import { getApiError, getApiFieldErrorEntries, type FieldErrorEntry } from '~/utils/apiError';
import type { ApiErrorBody } from '~/types/api';

/** The two i18n functions the translators need (vue-i18n `t` and `te`). */
export interface Translator {
  t: (key: string) => string;
  te: (key: string) => boolean;
}

const warned = new Set<string>();

/** In development, report error codes that have no translation yet (once per code). */
function reportMissing(key: string) {
  if (import.meta.dev && import.meta.client && !warned.has(key)) {
    warned.add(key);
    // eslint-disable-next-line no-console
    console.warn(
      `[i18n] Missing API error translation: ${key} (add it to locales/en.ts and ar.ts)`
    );
  }
}

/** Translation of an error code (`apiErrors.codes.<CODE>`), or undefined if there is none. */
export function translateErrorCode(code: string | undefined, { t, te }: Translator) {
  if (!code) {
    return undefined;
  }
  const key = `apiErrors.codes.${code}`;
  if (te(key)) {
    return t(key);
  }
  reportMissing(key);
  return undefined;
}

/**
 * Message for a failed request, in the current language:
 * translated code → backend message → `fallbackKey`.
 */
export function describeApiErrorBody(
  error: Partial<ApiErrorBody> | null | undefined,
  translator: Translator,
  fallbackKey = 'errors.generic'
): string {
  return translateErrorCode(error?.code, translator) || error?.message || translator.t(fallbackKey);
}

export function describeApiError(err: unknown, translator: Translator, fallbackKey?: string) {
  return describeApiErrorBody(getApiError(err), translator, fallbackKey);
}

/**
 * Message for one field error: field-specific translation (`apiErrors.fields.<field>.<CODE>`)
 * → generic code translation → backend message → "invalid value".
 */
export function describeFieldError(
  field: string,
  entry: FieldErrorEntry,
  translator: Translator
): string {
  const { t, te } = translator;
  if (entry.code) {
    const specific = `apiErrors.fields.${field}.${entry.code}`;
    if (te(specific)) {
      return t(specific);
    }
  }
  return (
    translateErrorCode(entry.code, translator) ||
    entry.message ||
    t('apiErrors.codes.INVALID_VALUE')
  );
}

/** Translated per-field messages of a validation response, ready for vee-validate `setErrors`. */
export function describeApiFieldErrors(
  err: unknown,
  translator: Translator
): Record<string, string> | undefined {
  const entries = getApiFieldErrorEntries(err);
  if (!entries) {
    return undefined;
  }
  return Object.fromEntries(
    Object.entries(entries).map(([field, entry]) => [
      field,
      describeFieldError(field, entry, translator),
    ])
  );
}
