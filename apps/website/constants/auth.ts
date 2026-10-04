import { focusHeading } from '~/utils/focus';

/**
 * Once a new auth screen or step has entered (client-side only: transitions don't run on
 * the first page load), focus its heading so screen readers announce it and keyboard users
 * continue from the top of the form.
 */
function focusEnteredHeading(el: Element) {
  focusHeading(el.querySelector('h1'));
}

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
  /** Forgot-password flow in progress (current step), short-lived. */
  passwordReset: 'ibbil_password_reset',
} as const;

/** Refresh the access token this long before it expires. */
export const ACCESS_TOKEN_REFRESH_SKEW_MS = 30_000;

/** How long a pending OTP verification is kept (seconds). */
export const VERIFICATION_MAX_AGE = 60 * 15;

/** Seconds to wait before the user can request a new OTP. */
export const OTP_RESEND_COOLDOWN = 60;

/** Seconds of resend cooldown left for a code sent at `sentAt` (ms timestamp). */
export const resendSecondsLeft = (sentAt?: number) =>
  sentAt
    ? Math.max(0, OTP_RESEND_COOLDOWN - Math.floor((Date.now() - sentAt) / 1000))
    : OTP_RESEND_COOLDOWN;

/** Query parameter that carries the page to return to after login. */
export const REDIRECT_QUERY_KEY = 'redirect';

/**
 * Page transition between auth screens (login, register, verify, forgot password).
 * Styles: .auth-swap-* in assets/css/brand.css. Skipped on language switch, see
 * middleware/auth-transition.global.ts.
 */
export const AUTH_TRANSITION = {
  name: 'auth-swap',
  mode: 'out-in',
  onAfterEnter: focusEnteredHeading,
} as const;

/** Same animation between the forgot-password steps; never skipped. */
export const AUTH_STEP_TRANSITION = {
  name: 'auth-step',
  mode: 'out-in',
  onAfterEnter: focusEnteredHeading,
} as const;
