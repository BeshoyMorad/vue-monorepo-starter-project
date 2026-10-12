import { defineStore } from 'pinia';
import { computed } from 'vue';
import { AUTH_COOKIES, VERIFICATION_MAX_AGE } from '~/constants/auth';
import type { PasswordResetState } from '~/modules/auth/types';

/**
 * Forgot-password flow in progress. Kept in a short-lived cookie so switching language
 * (a new URL) or reloading the page keeps the user on the same step.
 */
export const usePasswordResetStore = defineStore('auth-password-reset', () => {
  const cookie = useCookie<PasswordResetState | null>(AUTH_COOKIES.passwordReset, {
    maxAge: VERIFICATION_MAX_AGE,
    sameSite: 'lax',
    secure: !import.meta.dev,
    path: '/',
    default: () => null,
  });

  const state = computed(() => cookie.value);

  /** Step 1 done: a code was sent to `phone`. */
  const codeSent = (phone: string, sessionToken: string) => {
    cookie.value = { phone, sessionToken, codeSentAt: Date.now() };
  };

  /** A new code was requested in step 2 (it comes with a new session token). */
  const codeResent = (sessionToken: string) => {
    if (cookie.value) {
      cookie.value = { ...cookie.value, sessionToken, codeSentAt: Date.now() };
    }
  };

  /** Step 2 done: the code was verified. */
  const codeVerified = (resetToken: string) => {
    if (cookie.value) {
      cookie.value = { ...cookie.value, resetToken };
    }
  };

  const clear = () => {
    cookie.value = null;
  };

  return { state, codeSent, codeResent, codeVerified, clear };
});
