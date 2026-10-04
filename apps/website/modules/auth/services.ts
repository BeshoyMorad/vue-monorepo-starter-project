import type { ApiFetch } from '~/api/client';
import { apiRoute, type WebsiteApiRoutes } from '~/api/endpoints';
import type { ApiEnvelope } from '~/types/api';
import {
  AUTH_PORTAL,
  type AuthSession,
  type ChangePasswordRequest,
  type LoginRequest,
  type RegisterRequest,
  type RegisterResponse,
  type ResetPasswordRequest,
  type SuccessResponse,
  type TokenStepResponse,
  type VerifyOtpRequest,
} from './types';

type RouteName = Extract<keyof WebsiteApiRoutes, string>;

/**
 * Auth endpoints. Every call returns the envelope's `data`; failures throw a FetchError
 * (read it with the helpers in utils/apiError.ts).
 * Calls are `silent`: forms show the errors inline instead of a global toast.
 */
export function createAuthService(api: ApiFetch) {
  /** Public endpoint: no bearer token, a 401 means bad input rather than an expired session. */
  const publicPost = async <T>(name: RouteName, body?: object) =>
    (
      await api<ApiEnvelope<T>>(apiRoute(name), {
        method: 'POST',
        body,
        silent: true,
        skipAuth: true,
        skipAuthRedirect: true,
      })
    ).data;

  return {
    login: (body: LoginRequest) => publicPost<AuthSession>('auth.customers.login', body),

    register: (body: RegisterRequest) =>
      publicPost<RegisterResponse>('auth.customers.register', body),

    /** Completes phone verification and returns a session. */
    verifyContact: (body: VerifyOtpRequest) => publicPost<AuthSession>('auth.contact.verify', body),

    resendOtp: (token: string) => publicPost<SuccessResponse>('auth.otp.resend', { token }),

    /** Sends a reset OTP. Succeeds even for unknown numbers (no account enumeration). */
    forgotPassword: (phone: string) =>
      publicPost<TokenStepResponse>('auth.password.forgot', {
        channel: 'phone',
        identifier: phone,
        portal: AUTH_PORTAL,
      }),

    verifyResetOtp: (body: VerifyOtpRequest) =>
      publicPost<TokenStepResponse>('auth.password.forgot.verify', body),

    resetPassword: (body: ResetPasswordRequest) =>
      publicPost<SuccessResponse>('auth.password.reset', body),

    /** Revokes the current session on the backend. */
    logout: async () =>
      (
        await api<ApiEnvelope<SuccessResponse>>(apiRoute('auth.logout'), {
          method: 'POST',
          silent: true,
          skipAuthRedirect: true,
        })
      ).data,

    /** Changes the password of the signed-in user. */
    changePassword: async (body: ChangePasswordRequest) =>
      (
        await api<ApiEnvelope<SuccessResponse>>(apiRoute('auth.password.update'), {
          method: 'PUT',
          body,
          silent: true,
        })
      ).data,
  };
}

export type AuthService = ReturnType<typeof createAuthService>;

/** Auth service bound to the app's fetch client. */
export const useAuthService = (): AuthService => createAuthService(useApi());
