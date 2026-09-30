import { useAuthStore } from '@/stores/auth';
import { config } from '@/config';
import { createApiClient } from '@workspace/core/lib';
import { error as toastError } from '@workspace/core/utils/toast';

/**
 * Base-Template Configured Axios API Client.
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
