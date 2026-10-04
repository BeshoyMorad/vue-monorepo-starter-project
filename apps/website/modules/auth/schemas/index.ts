import * as yup from 'yup';
import {
  confirmPasswordRule,
  currentPasswordRule,
  emailRule,
  fullNameRule,
  nationalIdRule,
  newPasswordRule,
  otpRule,
  phoneRule,
  type Translate,
} from './rules';

export const createLoginSchema = (t: Translate) =>
  yup.object({
    identifier: phoneRule(t),
    password: currentPasswordRule(t),
    remember: yup.boolean().default(false),
  });
export type LoginFormValues = yup.InferType<ReturnType<typeof createLoginSchema>>;

export const createRegisterSchema = (t: Translate) =>
  yup.object({
    fullName: fullNameRule(t),
    nationalId: nationalIdRule(t),
    phone: phoneRule(t),
    email: emailRule(t),
    password: newPasswordRule(t),
    confirmPassword: confirmPasswordRule(t, 'password'),
  });
export type RegisterFormValues = yup.InferType<ReturnType<typeof createRegisterSchema>>;

export const createOtpSchema = (t: Translate) => yup.object({ otp: otpRule(t) });
export type OtpFormValues = yup.InferType<ReturnType<typeof createOtpSchema>>;

export const createForgotPasswordSchema = (t: Translate) => yup.object({ phone: phoneRule(t) });
export type ForgotPasswordFormValues = yup.InferType<ReturnType<typeof createForgotPasswordSchema>>;

/** Password reset step 3 (the code is verified in step 2). */
export const createResetPasswordSchema = (t: Translate) =>
  yup.object({
    newPassword: newPasswordRule(t),
    confirmPassword: confirmPasswordRule(t, 'newPassword'),
  });
export type ResetPasswordFormValues = yup.InferType<ReturnType<typeof createResetPasswordSchema>>;
