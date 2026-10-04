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
  /** Machine-readable code, e.g. 'ValidationError', 'Unauthorized', 'AccountNotVerified'. */
  code: string;
  /** Human-readable message, translated according to Accept-Language. */
  message: string;
  details?: ApiErrorDetails | null;
}

export interface ApiErrorDetails {
  /** Per-field validation errors, keyed by the request body field name. */
  fields?: Record<string, { code: string; message: string }>;
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
