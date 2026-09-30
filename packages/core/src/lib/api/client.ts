import axios, {
  type AxiosError,
  type AxiosInstance,
  type AxiosRequestConfig,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
  type RawAxiosRequestHeaders,
} from 'axios';
import { getCurrentInstance, inject } from 'vue';
import { getDeviceId } from '@workspace/core/utils/device';
import { handleOffline } from '@workspace/core/composables/useNetwork';

let defaultApiClient: AxiosInstance | null = null;

/**
 * Sets the default Axios API client for the application.
 */
export function setApiClient(client: AxiosInstance): void {
  defaultApiClient = client;
}

/**
 * Retrieves the active API client instance.
 * Checks Vue injection context (`inject('api')`) first, then falls back to `defaultApiClient`.
 */
export function getApiClient(): AxiosInstance {
  if (getCurrentInstance()) {
    const injected = inject<AxiosInstance | null>('api', null);
    if (injected) {
      return injected;
    }
  }

  if (defaultApiClient) {
    return defaultApiClient;
  }

  throw new Error(
    '[ApiClient]: No API client found. Please register an API client using `setApiClient(api)` or provide it via `app.provide("api", api)`.'
  );
}

export type TokenGetter = () => string | null | undefined | Promise<string | null | undefined>;

export interface CreateApiClientOptions {
  /**
   * Base URL for all HTTP requests
   */
  baseURL?: string;
  /**
   * Default request timeout in milliseconds (default: 15000)
   */
  timeout?: number;
  /**
   * Custom default request headers
   */
  headers?: RawAxiosRequestHeaders;
  /**
   * Function returning the Bearer token (string, null, or Promise)
   */
  getToken?: TokenGetter;
  /**
   * Callback invoked when a 401 Unauthorized response is received
   */
  onUnauthorized?: (error: AxiosError) => void | Promise<void>;
  /**
   * Callback invoked when a 403 Forbidden response is received
   */
  onForbidden?: (error: AxiosError) => void | Promise<void>;
  /**
   * Callback invoked when a 500+ Server Error response is received
   */
  onServerError?: (error: AxiosError) => void | Promise<void>;
  /**
   * Custom request interceptor hook
   */
  onRequest?: (
    config: InternalAxiosRequestConfig
  ) => InternalAxiosRequestConfig | Promise<InternalAxiosRequestConfig>;
  /**
   * Custom response success interceptor hook
   */
  onResponse?: (response: AxiosResponse) => AxiosResponse | Promise<AxiosResponse>;
  /**
   * Custom response error interceptor hook
   */
  onResponseError?: (error: AxiosError) => unknown;
}

async function applyRequestAuth(
  config: InternalAxiosRequestConfig,
  getToken?: TokenGetter
): Promise<void> {
  const deviceId = getDeviceId();
  if (deviceId) {
    config.headers.set('device-id', deviceId);
  }

  if (getToken) {
    const token = await getToken();
    if (token && !config.headers.get('Authorization')) {
      config.headers.set('Authorization', `Bearer ${token}`);
    }
  }
}

async function handleResponseError(
  error: AxiosError,
  options: CreateApiClientOptions
): Promise<unknown> {
  if (!error.response && typeof navigator !== 'undefined' && !navigator.onLine) {
    handleOffline();
  }

  const status = error.response?.status;
  if (status === 401 && options.onUnauthorized) {
    await options.onUnauthorized(error);
  } else if (status === 403 && options.onForbidden) {
    await options.onForbidden(error);
  } else if (status && status >= 500 && options.onServerError) {
    await options.onServerError(error);
  }

  if (options.onResponseError) {
    return options.onResponseError(error);
  }

  return Promise.reject(error);
}

/**
 * Creates a configured Axios API client instance with shared standard defaults.
 *
 * Each consumer application (Vite SPA or Nuxt) extends this base client with its
 * environment baseURL, storage token getter, and router navigation.
 */
export function createApiClient(options: CreateApiClientOptions = {}): AxiosInstance {
  const {
    baseURL = '',
    timeout = 15000,
    headers = {},
    getToken,
    onRequest: customOnRequest,
    onResponse: customOnResponse,
  } = options;

  const instance = axios.create({
    baseURL,
    timeout,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      ...headers,
    },
  });

  instance.interceptors.request.use(async (config: InternalAxiosRequestConfig) => {
    await applyRequestAuth(config, getToken);
    return customOnRequest ? await customOnRequest(config) : config;
  });

  instance.interceptors.response.use(
    (response: AxiosResponse) => (customOnResponse ? customOnResponse(response) : response),
    (error: AxiosError) => handleResponseError(error, options)
  );

  if (!defaultApiClient) {
    defaultApiClient = instance;
  }

  return instance;
}

// Re-export core Axios types for convenience in consumer applications
export type {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  AxiosError,
  InternalAxiosRequestConfig,
};
export { axios };
