import { defineStore } from 'pinia';
import { computed } from 'vue';

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
 * Nuxt 3 Website Auth Store.
 * Uses Nuxt's native `useCookie` to persist credentials.
 * Automatically accessible on both Server-Side (SSR) and Client-Side.
 */
export const useAuthStore = defineStore('auth', () => {
  // Native Nuxt SSR cookie state
  const token = useCookie<string | null>('access_token', {
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    default: () => null,
  });

  const user = useCookie<User | null>('user', {
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    default: () => null,
  });

  const isAuthenticated = computed<boolean>(() => !!token.value);

  // Actions
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

  const logout = async () => {
    clearToken();
    await navigateTo('/login');
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
