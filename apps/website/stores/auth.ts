import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import { ACCESS_TOKEN_REFRESH_SKEW_MS, AUTH_COOKIES } from '~/constants/auth';
import type { AuthTokens, AuthUser, SessionUser } from '~/types/auth';

export interface SessionPayload {
  tokens: AuthTokens;
  user?: AuthUser | SessionUser | null;
  /** Keep the session after the browser closes (until the refresh token expires). */
  remember?: boolean;
}

/**
 * Writes a session cookie, or deletes it when `value` is null.
 * `maxAge` undefined makes it a browser-session cookie.
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

const readCookie = <T>(name: string) => useCookie<T | null>(name).value ?? null;

/** Seconds until `expiresAt`, or undefined (browser-session cookie) when unknown or past. */
function secondsUntil(expiresAt: string | null): number | undefined {
  if (!expiresAt) {
    return undefined;
  }
  const seconds = Math.floor((Date.parse(expiresAt) - Date.now()) / 1000);
  return seconds > 0 ? seconds : undefined;
}

function writeTokenCookies(tokens: AuthTokens, maxAge: number | undefined) {
  writeCookie(AUTH_COOKIES.accessToken, tokens.accessToken.value, maxAge);
  writeCookie(AUTH_COOKIES.accessTokenExpiresAt, tokens.accessToken.expiresIn, maxAge);
  writeCookie(AUTH_COOKIES.refreshToken, tokens.refreshToken.value, maxAge);
  writeCookie(AUTH_COOKIES.refreshTokenExpiresAt, tokens.refreshToken.expiresIn, maxAge);
}

function readSessionCookies() {
  const accessToken = readCookie<string>(AUTH_COOKIES.accessToken);
  return {
    accessToken,
    accessTokenExpiresAt: readCookie<string>(AUTH_COOKIES.accessTokenExpiresAt),
    refreshToken: readCookie<string>(AUTH_COOKIES.refreshToken),
    refreshTokenExpiresAt: readCookie<string>(AUTH_COOKIES.refreshTokenExpiresAt),
    remember: readCookie<string>(AUTH_COOKIES.remember) === '1',
    // A user without a token is stale (the token cookie expired first), so ignore it
    user: accessToken ? readCookie<SessionUser>(AUTH_COOKIES.user) : null,
  };
}

function clearSessionCookies() {
  for (const name of Object.values(AUTH_COOKIES)) {
    if (name !== AUTH_COOKIES.verification) {
      writeCookie(name, null);
    }
  }
}

/** True when a token is expired or about to expire (within the refresh skew). */
const isExpiringSoon = (expiresAt: string | null) =>
  expiresAt !== null && Date.parse(expiresAt) - ACCESS_TOKEN_REFRESH_SKEW_MS <= Date.now();

const toSessionUser = (user: AuthUser | SessionUser): SessionUser => ({
  id: user.id,
  fullName: user.fullName,
  phone: user.phone,
  email: user.email,
  avatar: user.avatar,
  emailVerified: user.emailVerified,
  phoneVerified: user.phoneVerified,
});

/**
 * Session store.
 *
 * Tokens live in cookies so they are available during SSR (the server calls the API on
 * behalf of the user) and in the browser. Access and refresh tokens are both kept;
 * the API client refreshes the access token automatically (see api/client.ts).
 */
export const useAuthStore = defineStore('auth', () => {
  const initial = readSessionCookies();
  const accessToken = ref(initial.accessToken);
  const accessTokenExpiresAt = ref(initial.accessTokenExpiresAt);
  const refreshToken = ref(initial.refreshToken);
  const refreshTokenExpiresAt = ref(initial.refreshTokenExpiresAt);
  const remember = ref(initial.remember);
  const user = ref(initial.user);

  const isAuthenticated = computed(() => Boolean(accessToken.value));

  const isAccessTokenExpired = () => isExpiringSoon(accessTokenExpiresAt.value);

  /** Cookie lifetime: until the refresh token expires ("remember me"), or the browser session. */
  const cookieMaxAge = (refreshExpiresAt: string | null = refreshTokenExpiresAt.value) =>
    remember.value ? secondsUntil(refreshExpiresAt) : undefined;

  /** Stores new tokens (after login or refresh), keeping the current "remember me" choice. */
  const setTokens = (tokens: AuthTokens) => {
    const maxAge = cookieMaxAge(tokens.refreshToken.expiresIn);
    writeTokenCookies(tokens, maxAge);
    if (user.value) {
      writeCookie(AUTH_COOKIES.user, user.value, maxAge);
    }
    accessToken.value = tokens.accessToken.value;
    accessTokenExpiresAt.value = tokens.accessToken.expiresIn;
    refreshToken.value = tokens.refreshToken.value;
    refreshTokenExpiresAt.value = tokens.refreshToken.expiresIn;
  };

  /** Starts a session. Call it after a successful login or OTP verification. */
  const setSession = ({ tokens, user: newUser = null, remember: keep = false }: SessionPayload) => {
    remember.value = keep;
    const maxAge = cookieMaxAge(tokens.refreshToken.expiresIn);
    writeCookie(AUTH_COOKIES.remember, keep ? '1' : null, maxAge);
    user.value = newUser ? toSessionUser(newUser) : null;
    setTokens(tokens);
  };

  /** Updates the stored user (e.g. after editing the profile). */
  const setUser = (newUser: AuthUser | SessionUser | null) => {
    user.value = newUser ? toSessionUser(newUser) : null;
    writeCookie(AUTH_COOKIES.user, user.value, cookieMaxAge());
  };

  /** Removes the session locally. Does not call the backend or navigate. */
  const clearSession = () => {
    clearSessionCookies();
    accessToken.value = null;
    accessTokenExpiresAt.value = null;
    refreshToken.value = null;
    refreshTokenExpiresAt.value = null;
    remember.value = false;
    user.value = null;
  };

  return {
    accessToken,
    accessTokenExpiresAt,
    refreshToken,
    refreshTokenExpiresAt,
    remember,
    user,
    isAuthenticated,
    isAccessTokenExpired,
    setTokens,
    setSession,
    setUser,
    clearSession,
  };
});
