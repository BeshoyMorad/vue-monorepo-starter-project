import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import { AUTH_COOKIES, AUTH_SESSION_MAX_AGE } from '~/constants/auth';
import type { AuthUser } from '~/types/auth';

export interface SessionPayload {
  token: string;
  user?: AuthUser | null;
  /** Keep the session for AUTH_SESSION_MAX_AGE.remember instead of the default lifetime. */
  remember?: boolean;
}

/**
 * Writes a session cookie, or deletes it when `value` is null.
 * A fresh cookie ref is used per write so each write carries its own lifetime.
 * On the server this must run inside the Nuxt context (setup, middleware, plugin
 * or `nuxtApp.runWithContext`).
 */
function writeCookie<T>(name: string, value: T | null, maxAge?: number) {
  useCookie<T | null>(name, {
    maxAge,
    sameSite: 'lax',
    secure: !import.meta.dev,
    path: '/',
  }).value = value;
}

/**
 * Session store.
 *
 * The token lives in a cookie so it is available during SSR (the server calls the API
 * on behalf of the user) and on the client. The user is kept in a small cookie too, so
 * the UI can render the signed-in state on first paint without an extra request.
 */
export const useAuthStore = defineStore('auth', () => {
  const token = ref<string | null>(useCookie<string | null>(AUTH_COOKIES.token).value ?? null);
  // A user without a token is stale (the token cookie expired first), so ignore it
  const user = ref<AuthUser | null>(
    token.value ? (useCookie<AuthUser | null>(AUTH_COOKIES.user).value ?? null) : null
  );

  const isAuthenticated = computed(() => Boolean(token.value));

  /** Persists a new session. Call it after a successful login / register / OTP verification. */
  const setSession = ({
    token: newToken,
    user: newUser = null,
    remember = false,
  }: SessionPayload) => {
    const maxAge = remember ? AUTH_SESSION_MAX_AGE.remember : AUTH_SESSION_MAX_AGE.default;
    writeCookie(AUTH_COOKIES.token, newToken, maxAge);
    writeCookie(AUTH_COOKIES.user, newUser, maxAge);
    token.value = newToken;
    user.value = newUser;
  };

  /** Updates the stored user (e.g. after fetching or editing the profile). */
  const setUser = (newUser: AuthUser | null) => {
    writeCookie(AUTH_COOKIES.user, newUser, AUTH_SESSION_MAX_AGE.remember);
    user.value = newUser;
  };

  /** Removes the session locally. Does not call the backend or navigate. */
  const clearSession = () => {
    writeCookie(AUTH_COOKIES.token, null);
    writeCookie(AUTH_COOKIES.user, null);
    token.value = null;
    user.value = null;
  };

  return {
    token,
    user,
    isAuthenticated,
    setSession,
    setUser,
    clearSession,
  };
});
