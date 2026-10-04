import * as yup from 'yup';

export type Translate = (key: string) => string;

/** Saudi mobile number in E.164 format, as the API expects: +9665XXXXXXXX. */
export const SAUDI_PHONE_REGEX = /^\+9665\d{8}$/;
export const OTP_LENGTH = 6;
export const OTP_REGEX = new RegExp(`^\\d{${OTP_LENGTH}}$`);
export const NATIONAL_ID_REGEX = /^\d{10,14}$/;

const key = (name: string) => `auth.validation.${name}`;

export const phoneRule = (t: Translate) =>
  yup
    .string()
    .required(t(key('required')))
    .matches(SAUDI_PHONE_REGEX, t(key('phone')));

/** Existing password: only the API's minimum length is checked. */
export const currentPasswordRule = (t: Translate) =>
  yup
    .string()
    .required(t(key('required')))
    .min(8, t(key('passwordMin')));

/** New password: min 8 characters with uppercase, lowercase, a number and a symbol (API rule). */
export const newPasswordRule = (t: Translate) =>
  yup
    .string()
    .required(t(key('required')))
    .min(8, t(key('passwordMin')))
    .matches(/[a-z]/, t(key('passwordStrength')))
    .matches(/[A-Z]/, t(key('passwordStrength')))
    .matches(/\d/, t(key('passwordStrength')))
    .matches(/[^A-Za-z0-9]/, t(key('passwordStrength')));

export const confirmPasswordRule = (t: Translate, field: string) =>
  yup
    .string()
    .required(t(key('required')))
    .oneOf([yup.ref(field)], t(key('passwordMatch')));

export const otpRule = (t: Translate) =>
  yup
    .string()
    .required(t(key('otpRequired')))
    .matches(OTP_REGEX, t(key('otp')));
