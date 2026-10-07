import { useAuthStore } from '@/stores/auth';
import { config } from '@/config';
import { createApiClient } from '@workspace/core/lib';
import { error as toastError } from '@workspace/core/utils/toast';

/**
 * Shared ofetch API client.
 * Set VITE_API_BASE_URL in apps/ap-dashboard/.env to configure its base URL.
 * VITE_ variables are exposed to the browser, so do not store secrets in them.
 */
export const api = createApiClient({
  baseURL: config.apiBaseUrl,
  getToken: () => {
    const authStore = useAuthStore();
    return authStore.token;
  },
  onUnauthorized: () => {
    const authStore = useAuthStore();
    authStore.logout();
  },
  onServerError: () => {
    toastError('Server error occurred. Please try again later.');
  },
});

export * from './endpoints';
export default api;
