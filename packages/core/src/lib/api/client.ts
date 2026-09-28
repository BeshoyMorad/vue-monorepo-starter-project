import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios';
import { useAuthStore } from '@workspace/core/stores/auth';
import { basePaths } from '@workspace/core/router/paths';
import { config } from '@workspace/core/config/env';
import { getDeviceId } from '@workspace/core/utils/device';
import { handleOffline } from '@workspace/core/composables/useNetwork';
import { getAppRouter } from '@workspace/core/router/factory';

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

function onRequest(reqConfig: InternalAxiosRequestConfig): InternalAxiosRequestConfig {
  const authStore = useAuthStore();
  reqConfig.headers.set('Accept', 'application/json');
  reqConfig.headers.set('Content-Type', 'application/json');
  reqConfig.headers.set('device-id', getDeviceId());

  if (authStore.accessToken) {
    reqConfig.headers.set('Authorization', `Bearer ${authStore.accessToken}`);
  }

  return reqConfig;
}

function handleAuthAndErrors(status: number) {
  const authStore = useAuthStore();
  const router = getAppRouter();

  if (status === 401) {
    authStore.clearAuth();
  } else if (status === 403) {
    if (router) {
      router.push({ name: basePaths.errors.accessDenied });
    }
  } else if (status === 500) {
    if (router) {
      router.push({ name: basePaths.errors.serverError });
    }
  }
}

async function onResponseError(error: AxiosError) {
  const authStore = useAuthStore();
  const originalRequest = error.config as ExtendedAxiosRequestConfig;

  if (!error.response) {
    if (typeof navigator !== 'undefined' && !navigator.onLine) {
      handleOffline();
    }
    return Promise.reject(error);
  }

  const status = error.response.status;
  handleAuthAndErrors(status);

  if (status === 401 || status === 403 || status === 500) {
    return Promise.reject(error);
  }

  // 419 status implies token expired/invalid
  if (status === 419 && originalRequest && !originalRequest._retry) {
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

  return Promise.reject(error);
}

export const api = axios.create({
  baseURL: config.apiBaseUrl,
  timeout: 10000,
  headers: {
    'X-Requested-With': 'XMLHttpRequest',
  },
});

api.interceptors.request.use(onRequest, (err) => Promise.reject(err));
api.interceptors.response.use((res) => res, onResponseError);
