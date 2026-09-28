import { defineStore } from 'pinia';
import { StorageSerializers, useLocalStorage } from '@vueuse/core';
import { basePaths } from '@workspace/core/router/paths';
import { getAppRouter } from '@workspace/core/router/factory';

const ACCESS_TOKEN_STORAGE_KEY = 'app_access_token';
const REFRESH_TOKEN_STORAGE_KEY = 'app_refresh_token';
const USER_STORAGE_KEY = 'user';

export const useAuthStore = defineStore('auth', () => {
  const accessToken = useLocalStorage<string>(ACCESS_TOKEN_STORAGE_KEY, '');
  const refreshToken = useLocalStorage<string>(REFRESH_TOKEN_STORAGE_KEY, '');
  // Replace with your exact User type
  const user = useLocalStorage<unknown>(USER_STORAGE_KEY, null, {
    serializer: StorageSerializers.object,
  });

  // const isAuthenticated = computed(() => !!accessToken.value);

  const login = async (payload: { access_token: string; refresh_token: string; user: unknown }) => {
    accessToken.value = payload.access_token;
    refreshToken.value = payload.refresh_token;
    user.value = payload.user;
  };

  const clearAuth = () => {
    accessToken.value = '';
    refreshToken.value = '';
    user.value = null;

    const activeRouter = getAppRouter();
    if (activeRouter) {
      activeRouter.push({ name: basePaths.auth.login });
    }
  };

  const getRefreshToken = async () => {
    try {
      // Execute token refresh API request here, for example:
      // const res = await api.post('/refresh-token', { refresh_token: refreshToken.value });
      // accessToken.value = res.data.access_token;
      // refreshToken.value = res.data.refresh_token;
    } catch {
      clearAuth();
    }
  };

  return {
    // isAuthenticated,
    accessToken,
    refreshToken,
    user,
    isAuthenticated: true,
    login,
    clearAuth,
    getRefreshToken,
  };
});
