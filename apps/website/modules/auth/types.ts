import type { AuthSession } from '~/types/auth';

/** Portal sent with password reset requests. The website serves customers. */
export const AUTH_PORTAL = 'customer';

export interface LoginRequest {
  /** Saudi mobile number in E.164 format, e.g. +966501234567. */
  identifier: string;
  password: string;
}

export interface RegisterRequest {
  fullName: string;
  nationalId: string;
  phone: string;
  email?: string | null;
  password: string;
}

/** Registration succeeded and an OTP was sent to the phone. */
export interface RegisterResponse {
  userId: string;
  /** Verification session token for POST /auth/contact/verify and /auth/otp/resend. */
  token: string;
}

export interface VerifyOtpRequest {
  otp: string;
  token: string;
}

/** `error.details` of a 403 AccountNotVerified login response. */
export interface AccountNotVerifiedDetails {
  userId: string;
  token: string;
  expiresIn: string;
}

export interface ForgotPasswordRequest {
  channel: 'phone' | 'email';
  identifier: string;
  portal?: string;
}

export interface TokenStepResponse {
  success: boolean;
  token: string;
  message?: string;
}

export interface ResetPasswordRequest {
  newPassword: string;
  token: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface SuccessResponse {
  success: boolean;
  message?: string;
}

export type { AuthSession };
