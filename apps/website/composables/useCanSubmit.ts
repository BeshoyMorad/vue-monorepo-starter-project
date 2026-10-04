import { computed, type ComputedRef } from 'vue';
import type { AnyObjectSchema } from 'yup';

type FieldCheck = (value: unknown) => boolean;

/** Field names the yup schema marks as `.required()`. */
export function getRequiredFields(schema: AnyObjectSchema): string[] {
  return Object.entries(schema.describe().fields)
    .filter(([, field]) => 'optional' in field && field.optional === false)
    .map(([name]) => name);
}

/** Default "has the user filled this in" check. */
export function isFilled(value: unknown): boolean {
  if (typeof value === 'string') {
    return value.trim().length > 0;
  }
  if (Array.isArray(value)) {
    return value.length > 0;
  }
  if (typeof value === 'boolean') {
    return value;
  }
  return value !== null && value !== undefined;
}

/**
 * Project rule: a form's submit button stays disabled until every required field is
 * filled in. Required fields come from the yup schema, so the button and the validation
 * always agree. Format checks still run on submit and show their messages as usual.
 *
 * `checks` overrides what "filled" means for a field, e.g. a complete 6-digit code:
 *   useCanSubmit(schema, values, { otp: (v) => String(v ?? '').length === 6 })
 */
export function useCanSubmit(
  schema: AnyObjectSchema,
  values: Record<string, unknown>,
  checks: Record<string, FieldCheck> = {}
): ComputedRef<boolean> {
  const required = getRequiredFields(schema);
  return computed(() => required.every((field) => (checks[field] ?? isFilled)(values[field])));
}
