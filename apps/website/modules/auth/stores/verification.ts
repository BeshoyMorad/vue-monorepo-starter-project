import { defineStore } from 'pinia';
import { computed } from 'vue';
import { AUTH_COOKIES, VERIFICATION_MAX_AGE } from '~/constants/auth';

export interface PendingVerification {
  /** Session token for POST /auth/contact/verify and /auth/otp/resend. */
  token: string;
  /** Phone the OTP was sent to (E.164), shown on the verify screen. */
  phone: string;
  /** Where the user came from: registration (step 2 of 2) or an unverified login. */
  source: 'register' | 'login';
  /** "Remember me" choice from the login form, applied once verified. */
  remember?: boolean;
  /** Page to open after verification. */
  redirect?: string | null;
  /** When the current code was sent (ms), so the resend countdown survives a remount. */
  codeSentAt?: number;
}

/**
 * Pending phone verification between the register / login screen and the OTP screen.
 * Kept in a short-lived cookie so a page reload doesn't lose it.
 */
export const useVerificationStore = defineStore('auth-verification', () => {
  const cookie = useCookie<PendingVerification | null>(AUTH_COOKIES.verification, {
    maxAge: VERIFICATION_MAX_AGE,
    sameSite: 'lax',
    secure: !import.meta.dev,
    path: '/',
    default: () => null,
  });

  const pending = computed(() => cookie.value);

  const start = (value: PendingVerification) => {
    cookie.value = { codeSentAt: Date.now(), ...value };
  };

  /** Records that a new code was just sent. */
  const markCodeSent = () => {
    if (cookie.value) {
      cookie.value = { ...cookie.value, codeSentAt: Date.now() };
    }
  };

  const updateToken = (token: string) => {
    if (cookie.value) {
      cookie.value = { ...cookie.value, token };
    }
  };

  const clear = () => {
    cookie.value = null;
  };

  return { pending, start, updateToken, markCodeSent, clear };
});
