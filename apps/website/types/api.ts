/**
 * Response envelope used by every Ibbil API endpoint.
 * Success: { status: 'success', data, error: null }
 * Failure: { status: 'fail', data: null, error: { code, message, details } }
 */
export interface ApiEnvelope<T> {
  status: 'success' | 'fail';
  data: T;
  error: ApiErrorBody | null;
  metadata?: ApiMetadata;
}

export interface ApiErrorBody {
  /**
   * Machine-readable code, e.g. 'VALIDATION_FAILED', 'AUTH_INVALID_CREDENTIALS', 'OTP_EXPIRED'.
   * The UI translates it (locales: apiErrors.codes); `message` is only a fallback.
   */
  code: string;
  /** Human-readable message. Not always sent: the current API returns codes only. */
  message?: string;
  /** Per-field validation errors (current API): { phone: 'INVALID_PHONE' }. */
  fields?: Record<string, ApiFieldError>;
  details?: ApiErrorDetails | null;
}

/** A field error: a code ('TOO_SHORT') or, in the older format, { code, message }. */
export type ApiFieldError = string | { code: string; message?: string };

export interface ApiErrorDetails {
  /** Per-field validation errors (older format, as in the API docs). */
  fields?: Record<string, ApiFieldError>;
  [key: string]: unknown;
}

export interface ApiMetadata {
  requestId: string;
  timestamp: string;
  path: string;
  method: string;
  correlationId?: string;
}

/** Body of a failed response. */
export type ApiFailure = Partial<ApiEnvelope<null>>;
