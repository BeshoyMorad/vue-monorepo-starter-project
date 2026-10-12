/** Pending phone verification between the register / login screen and the OTP screen. */
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

/** Forgot-password flow in progress. */
export interface PasswordResetState {
  /** Phone the code was sent to (E.164). */
  phone: string;
  /** Reset session token from step 1; replaced when a new code is requested. */
  sessionToken: string;
  /** When the current code was sent (ms), so the resend countdown survives a remount. */
  codeSentAt: number;
  /** Token from step 2 (code verified); its presence means step 3. */
  resetToken?: string;
}

/** Registration details the user can go back and change from the verify screen. */
export interface RegisterDraft {
  fullName: string;
  nationalId: string;
  phone: string;
  email: string;
}
