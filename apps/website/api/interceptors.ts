import type { FetchContext, FetchResponse } from 'ofetch';
import type { ApiFailure } from '~/types/api';

export interface InterceptorContext {
  /** Current access token, if any. */
  getToken: () => string | null | undefined;
  /** Active UI locale, sent to the backend so messages come back translated. */
  getLocale: () => string;
  /** Translates an i18n key. */
  t: (key: string) => string;
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
 * Maps a failed response to a user-facing message, or null when the caller should
 * decide what to show (404 renders a page-level error).
 */
function resolveErrorMessage(status: number, data: unknown, t: InterceptorContext['t']) {
  const backendMessage = (data as ApiFailure | undefined)?.error?.message;

  if (status === 404) {
    return null;
  }
  if (status === 403) {
    return backendMessage || t('errors.forbidden');
  }
  if (status === 429) {
    return t('errors.tooManyRequests');
  }
  if (status >= 500) {
    return t('errors.serverError');
  }
  return backendMessage || t('errors.generic');
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

    const message = resolveErrorMessage(response.status, response._data, ctx.t);
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
