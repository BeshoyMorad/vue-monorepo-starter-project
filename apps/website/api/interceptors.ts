import type { FetchContext, FetchResponse } from 'ofetch';
import type { ApiFailure } from '~/types/api';
import { describeApiErrorBody } from '~/utils/apiErrorMessages';

export interface InterceptorContext {
  /** Current access token, if any. */
  getToken: () => string | null | undefined;
  /** Active UI locale, sent to the backend so messages come back translated. */
  getLocale: () => string;
  /** Translates an i18n key. */
  t: (key: string) => string;
  /** Whether an i18n key exists (used to translate API error codes). */
  te: (key: string) => boolean;
  /** Shows a global error message (toast). No-op on the server. */
  notify: (message: string) => void;
}

type ResponseContext = FetchContext & { response: FetchResponse<unknown> };
type RequestErrorContext = FetchContext & { error: Error };

/**
 * Adds the headers every request needs: JSON, locale and bearer token.
 * Only send headers the API allows in CORS (Accept, Accept-Language, Authorization,
 * Content-Type, X-Currency, X-Language, X-Request-ID, X-Requested-With, X-Tenant-ID):
 * any other header makes the browser's preflight fail.
 */
export const createRequestHook =
  (ctx: InterceptorContext) =>
  ({ options }: FetchContext): void => {
    const headers = new Headers(options.headers);
    headers.set('Accept', 'application/json');
    headers.set('Accept-Language', ctx.getLocale());

    const token = options.skipAuth ? null : ctx.getToken();
    if (token && !headers.has('Authorization')) {
      headers.set('Authorization', `Bearer ${token}`);
    }

    options.headers = headers;
  };

/**
 * Maps a failed response to a user-facing message in the current language, or null when
 * the caller should decide what to show (404 renders a page-level error).
 * The API's error code is translated (locales: apiErrors.codes); the status decides the
 * fallback when the code is unknown.
 */
function resolveErrorMessage(status: number, data: unknown, ctx: InterceptorContext) {
  if (status === 404) {
    return null;
  }
  if (status >= 500) {
    return ctx.t('errors.serverError');
  }
  const fallbackKey =
    status === 403
      ? 'errors.forbidden'
      : status === 429
        ? 'errors.tooManyRequests'
        : 'errors.generic';
  return describeApiErrorBody((data as ApiFailure | undefined)?.error, ctx, fallbackKey);
}

/**
 * Toasts HTTP errors (status >= 400) unless the request was sent with `silent: true`.
 * A 401 on a request that carried a token is left to the client, which refreshes the
 * session or redirects to login (see api/client.ts).
 * The request still rejects with a FetchError, so TanStack Query / callers see the error.
 */
export const createResponseErrorHook =
  (ctx: InterceptorContext) =>
  ({ response, options }: ResponseContext): void => {
    const sentToken = new Headers(options.headers).has('Authorization');
    if (options.silent || (response.status === 401 && sentToken)) {
      return;
    }

    const message = resolveErrorMessage(response.status, response._data, ctx);
    if (message) {
      ctx.notify(message);
    }
  };

/** Handles requests that never got a response (offline, DNS, timeout). Aborts are ignored. */
export const createRequestErrorHook =
  (ctx: InterceptorContext) =>
  ({ error, options }: RequestErrorContext): void => {
    if (error.name === 'AbortError' || options.silent) {
      return;
    }
    ctx.notify(ctx.t('errors.network'));
  };
