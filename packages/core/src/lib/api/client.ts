import {
  ofetch,
  createFetchError,
  type $Fetch,
  type FetchContext,
  type FetchOptions,
  type FetchRequest,
  type FetchResponse,
  type FetchError,
} from 'ofetch';
import { getCurrentInstance, inject } from 'vue';
import { getDeviceId } from '@workspace/core/utils/device';
import { handleOffline } from '@workspace/core/composables/useNetwork';

/**
 * Extended API Client type providing callable `$Fetch` behavior
 * along with standard HTTP verb helper methods (.get, .post, .put, .patch, .delete).
 */
export interface ApiClient extends $Fetch {
  get<T = unknown>(url: FetchRequest, options?: FetchOptions): Promise<T>;
  post<T = unknown>(url: FetchRequest, body?: unknown, options?: FetchOptions): Promise<T>;
  put<T = unknown>(url: FetchRequest, body?: unknown, options?: FetchOptions): Promise<T>;
  patch<T = unknown>(url: FetchRequest, body?: unknown, options?: FetchOptions): Promise<T>;
  delete<T = unknown>(url: FetchRequest, options?: FetchOptions): Promise<T>;
}

export type TokenGetter = () => string | null | undefined | Promise<string | null | undefined>;

export interface CreateApiClientOptions extends Omit<
  FetchOptions,
  'baseURL' | 'headers' | 'onRequest' | 'onResponse' | 'onResponseError' | 'onRequestError'
> {
  baseURL?: string;
  timeout?: number;
  headers?: HeadersInit;
  getToken?: TokenGetter;
  onUnauthorized?: (error: FetchError) => void | Promise<void>;
  onForbidden?: (error: FetchError) => void | Promise<void>;
  onServerError?: (error: FetchError) => void | Promise<void>;
  onRequest?: (context: FetchContext) => void | Promise<void>;
  onResponse?: (
    context: FetchContext & { response: FetchResponse<unknown> }
  ) => void | Promise<void>;
  onResponseError?: (
    context: FetchContext & { response: FetchResponse<unknown> }
  ) => void | Promise<void>;
  onRequestError?: (context: FetchContext & { error: Error }) => void | Promise<void>;
}

let defaultApiClient: ApiClient | null = null;

export function setApiClient(client: ApiClient): void {
  defaultApiClient = client;
}

export function getApiClient(): ApiClient {
  if (getCurrentInstance()) {
    const injected = inject<ApiClient | null>('api', null);
    if (injected) return injected;
  }

  if (defaultApiClient) return defaultApiClient;

  throw new Error(
    '[ApiClient]: No API client found. Please register an API client using `setApiClient(api)` or provide it via `app.provide("api", api)`.'
  );
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function checkOffline(): void {
  if (typeof navigator !== 'undefined' && !navigator.onLine) {
    handleOffline();
  }
}

async function applyAuth(context: FetchContext, getToken?: TokenGetter): Promise<void> {
  const headers = new Headers(context.options.headers);

  const deviceId = getDeviceId();
  if (deviceId && !headers.has('device-id')) {
    headers.set('device-id', deviceId);
  }

  if (getToken && !headers.has('Authorization')) {
    const token = await getToken();
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
  }

  context.options.headers = headers;
}

function withMethods(fetch: $Fetch): ApiClient {
  const request = <T>(url: FetchRequest, method: string, body?: unknown, opts?: FetchOptions) =>
    fetch<T>(url, {
      ...opts,
      method,
      query: opts?.query,
      ...(body !== undefined ? { body } : {}),
    } as FetchOptions<'json'>);

  return Object.assign(fetch, {
    get: <T = unknown>(url: FetchRequest, opts?: FetchOptions) =>
      request<T>(url, 'GET', undefined, opts),
    post: <T = unknown>(url: FetchRequest, body?: unknown, opts?: FetchOptions) =>
      request<T>(url, 'POST', body, opts),
    put: <T = unknown>(url: FetchRequest, body?: unknown, opts?: FetchOptions) =>
      request<T>(url, 'PUT', body, opts),
    patch: <T = unknown>(url: FetchRequest, body?: unknown, opts?: FetchOptions) =>
      request<T>(url, 'PATCH', body, opts),
    delete: <T = unknown>(url: FetchRequest, opts?: FetchOptions) =>
      request<T>(url, 'DELETE', undefined, opts),
  }) as ApiClient;
}

// ── Client Factory ───────────────────────────────────────────────────────────

export function createApiClient(options: CreateApiClientOptions = {}): ApiClient {
  const {
    baseURL = '',
    timeout = 15000,
    headers = {},
    getToken,
    onRequest: customOnRequest,
    onResponse: customOnResponse,
    onResponseError: customOnResponseError,
    onRequestError: customOnRequestError,
    onUnauthorized,
    onForbidden,
    onServerError,
    ...rest
  } = options;

  const baseFetch = ofetch.create({
    baseURL,
    timeout,
    headers: { Accept: 'application/json', ...headers },
    ...rest,
    async onRequest(context) {
      await applyAuth(context, getToken);
      await customOnRequest?.(context);
    },
    async onResponse(context) {
      await customOnResponse?.(context);
    },
    async onResponseError(context) {
      checkOffline();
      const status = context.response?.status;
      const error = createFetchError(context);

      if (status === 401) await onUnauthorized?.(error);
      else if (status === 403) await onForbidden?.(error);
      else if (status && status >= 500) await onServerError?.(error);

      await customOnResponseError?.(context);
    },
    async onRequestError(context) {
      checkOffline();
      await customOnRequestError?.(context);
    },
  });

  const client = withMethods(baseFetch);

  if (!defaultApiClient) {
    defaultApiClient = client;
  }

  return client;
}
