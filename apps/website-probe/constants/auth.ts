/** Cookie names used to persist the session. Readable on both server (SSR) and client. */
export const AUTH_COOKIES = {
  token: 'ibbil_access_token',
  user: 'ibbil_user',
} as const;

const DAY_IN_SECONDS = 60 * 60 * 24;

/** Session lifetime in seconds. `remember` applies when the user ticks "remember me". */
export const AUTH_SESSION_MAX_AGE = {
  default: DAY_IN_SECONDS,
  remember: DAY_IN_SECONDS * 30,
} as const;

/** Query parameter that carries the page to return to after login. */
export const REDIRECT_QUERY_KEY = 'redirect';
