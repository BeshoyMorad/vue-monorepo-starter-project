/** Cookie names used to persist the session. Readable on both server (SSR) and client. */
export const AUTH_COOKIES = {
  accessToken: 'ibbil_access_token',
  accessTokenExpiresAt: 'ibbil_access_expires_at',
  refreshToken: 'ibbil_refresh_token',
  refreshTokenExpiresAt: 'ibbil_refresh_expires_at',
  user: 'ibbil_user',
  /** '1' when the user ticked "remember me": cookies outlive the browser session. */
  remember: 'ibbil_remember',
  /** Pending OTP verification (register / unverified login), short-lived. */
  verification: 'ibbil_verification',
} as const;

/** Refresh the access token this long before it expires. */
export const ACCESS_TOKEN_REFRESH_SKEW_MS = 30_000;

/** How long a pending OTP verification is kept (seconds). */
export const VERIFICATION_MAX_AGE = 60 * 15;

/** Seconds to wait before the user can request a new OTP. */
export const OTP_RESEND_COOLDOWN = 60;

/** Query parameter that carries the page to return to after login. */
export const REDIRECT_QUERY_KEY = 'redirect';
