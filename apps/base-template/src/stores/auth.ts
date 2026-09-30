import { defineStore } from 'pinia';
import { ref } from 'vue';
import { useLocalStorage } from '@vueuse/core';
import router from '@/router';
import { basePaths } from '@workspace/core/router/paths';

export interface User {
  id?: string | number;
  email?: string;
  name?: string;
  role?: string;
  [key: string]: unknown;
}

export interface LoginPayload {
  access_token: string;
  refresh_token?: string;
  user?: unknown;
}

/**
 * Base-Template Auth Store (Vite SPA)
 */
export const useAuthStore = defineStore('auth', () => {
  const token = useLocalStorage<string | null>('access_token', null);
  const user = useLocalStorage<User | null>('user', null);

  // const isAuthenticated = computed<boolean>(() => !!token.value);
  const isAuthenticated = ref(true);

  const setToken = (newToken: string | null) => {
    token.value = newToken;
  };

  const setUser = (newUser: User | null) => {
    user.value = newUser;
  };

  const clearToken = () => {
    token.value = null;
    user.value = null;
  };

  const login = (payload: LoginPayload) => {
    setToken(payload.access_token);
    user.value = (payload.user as User) ?? null;
  };

  const logout = () => {
    clearToken();
    void router.push({ name: basePaths.auth.login });
  };

  const clearAuth = () => {
    clearToken();
  };

  return {
    token,
    user,
    isAuthenticated,
    setToken,
    setUser,
    clearToken,
    login,
    logout,
    clearAuth,
  };
});
