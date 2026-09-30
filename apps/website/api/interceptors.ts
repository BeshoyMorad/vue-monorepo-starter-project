import type { FetchContext, FetchResponse } from 'ofetch';
import { getDeviceId } from '@workspace/core/utils/device';

export interface InterceptorContext {
  /** Current session token, if any. */
  getToken: () => string | null | undefined;
  /** Active UI locale, sent to the backend so messages come back translated. */
  getLocale: () => string;
  /** Translates an i18n key. */
  t: (key: string) => string;
  /** Shows a global error message (toast). No-op on the server. */
  notify: (message: string) => void;
  /** Clears the session and sends the user to login. */
  onSessionExpired: () => Promise<void>;
}

type ResponseContext = FetchContext & { response: FetchResponse<unknown> };
type RequestErrorContext = FetchContext & { error: Error };

/** Adds the headers every request needs: JSON, locale, device id and bearer token. */
export const createRequestHook =
  (ctx: InterceptorContext) =>
  ({ options }: FetchContext): void => {
    const headers = new Headers(options.headers);
    headers.set('Accept', 'application/json');
    headers.set('Accept-Language', ctx.getLocale());

    const deviceId = getDeviceId();
    if (deviceId) {
      headers.set('device-id', deviceId);
    }

    const token = ctx.getToken();
    if (token && !headers.has('Authorization')) {
      headers.set('Authorization', `Bearer ${token}`);
    }

    options.headers = headers;
  };

/**
 * Maps a failed response to a user-facing message, or null when the caller should
 * decide what to show (404 renders a page-level error, 401 is handled separately).
 */
function resolveErrorMessage(status: number, data: unknown, t: InterceptorContext['t']) {
  const backendMessage = (data as Partial<ApiErrorResponse> | undefined)?.message;

  if (status === 401 || status === 404) {
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
 * Handles HTTP error responses (status >= 400):
 * - 401 with a session → clear session and redirect to login (once, even for parallel requests)
 * - 403 / 429 / 5xx / other 4xx → toast, unless the request was sent with `silent: true`
 * The request still rejects with a FetchError, so TanStack Query / callers see the error.
 */
export const createResponseErrorHook = (ctx: InterceptorContext) => {
  let sessionExpiry: Promise<void> | null = null;

  return async ({ response, options }: ResponseContext): Promise<void> => {
    if (response.status === 401) {
      const hadSession = new Headers(options.headers).has('Authorization');
      if (hadSession && !options.skipAuthRedirect) {
        sessionExpiry ??= ctx.onSessionExpired().finally(() => {
          sessionExpiry = null;
        });
        await sessionExpiry;
      }
      return;
    }

    if (options.silent) {
      return;
    }

    const message = resolveErrorMessage(response.status, response._data, ctx.t);
    if (message) {
      ctx.notify(message);
    }
  };
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
