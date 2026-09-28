import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios';
import { navigateTo } from '#imports';
import { useAuthStore } from '@/stores/auth';
import { paths } from '@/constants/route-names';
import { getDeviceId } from '@/utils/device';
import { handleOffline } from '@/composables/useNetwork';

interface ExtendedAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

const subscribeTokenRefresh = (cb: (token: string) => void) => {
  refreshSubscribers.push(cb);
};

const onTokenRefreshed = (newToken: string) => {
  refreshSubscribers.forEach((cb) => cb(newToken));
  refreshSubscribers = [];
};

function onRequest(config: InternalAxiosRequestConfig): InternalAxiosRequestConfig {
  const authStore = useAuthStore();
  config.headers.set('Accept', 'application/json');
  config.headers.set('Content-Type', 'application/json');
  config.headers.set('device-id', getDeviceId());

  if (authStore.accessToken) {
    config.headers.set('Authorization', `Bearer ${authStore.accessToken}`);
  }

  return config;
}

async function refreshAndRetry(originalRequest: ExtendedAxiosRequestConfig) {
  const authStore = useAuthStore();

  if (isRefreshing) {
    return new Promise((resolve) => {
      subscribeTokenRefresh((newToken: string) => {
        originalRequest.headers.set('Authorization', `Bearer ${newToken}`);
        resolve(api(originalRequest));
      });
    });
  }

  originalRequest._retry = true;
  isRefreshing = true;

  try {
    await authStore.getRefreshToken();
    const newToken = authStore.accessToken;
    if (!newToken) {
      throw new Error('Refresh failed - no valid token');
    }

    onTokenRefreshed(newToken);
    originalRequest.headers.set('Authorization', `Bearer ${newToken}`);
    return api(originalRequest);
  } catch (refreshError) {
    refreshSubscribers = [];
    authStore.clearAuth();
    return Promise.reject(refreshError);
  } finally {
    isRefreshing = false;
  }
}

async function onResponseError(error: AxiosError) {
  const originalRequest = error.config as ExtendedAxiosRequestConfig | undefined;

  if (!error.response) {
    if (import.meta.client && !navigator.onLine) {
      handleOffline();
    }
    return Promise.reject(error);
  }

  const status = error.response.status;

  if (status === 401) {
    useAuthStore().clearAuth();
    return Promise.reject(error);
  }
  if (status === 403) {
    await navigateTo({ name: paths.errors.accessDenied });
    return Promise.reject(error);
  }
  if (status === 500) {
    await navigateTo({ name: paths.errors.serverError });
    return Promise.reject(error);
  }

  // 419 means the access token expired.
  if (status === 419 && originalRequest && !originalRequest._retry) {
    return refreshAndRetry(originalRequest);
  }

  return Promise.reject(error);
}

/**
 * Shared Axios instance. `baseURL` and interceptors are set by `setupApiClient()`,
 * which the `api` Nuxt plugin calls once at startup.
 */
export const api = axios.create({
  timeout: 10000,
  headers: {
    'X-Requested-With': 'XMLHttpRequest',
  },
});

export function setupApiClient(baseURL: string): void {
  api.defaults.baseURL = baseURL;
  api.interceptors.request.use(onRequest, (err) => Promise.reject(err));
  api.interceptors.response.use((res) => res, onResponseError);
}
