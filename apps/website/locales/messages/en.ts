/**
 * Messages for API error codes and generic validation, in English.
 * API codes: add new ones here AND in ar.ts (missing codes are reported in the dev console).
 * Both the current API style (UPPER_SNAKE) and the documented style (PascalCase) are covered.
 */
const invalidCredentials = 'Incorrect mobile number or password.';
const invalidOtp = 'The code is incorrect. Check it and try again.';
const sessionExpired = 'Your session has expired. Please sign in again.';
const notVerified = "Your account isn't verified yet.";
const tooMany = 'Too many attempts. Please wait a moment and try again.';
const required = 'This field is required';
const phone = 'Enter a valid Saudi mobile number, e.g. 5XXXXXXXX';
const passwordMin = 'Password must be at least 8 characters';
const passwordFormat = 'Use uppercase and lowercase letters, a number and a symbol';
const otp = 'Enter the 6-digit code';

export const apiErrorsEn = {
  codes: {
    // General
    VALIDATION_FAILED: 'Please check the highlighted fields.',
    ValidationError: 'Please check the highlighted fields.',
    BadRequest: 'Please check the highlighted fields.',
    UNAUTHENTICATED: sessionExpired,
    Unauthorized: sessionExpired,
    FORBIDDEN: "You don't have permission to do this.",
    Forbidden: "You don't have permission to do this.",
    NOT_FOUND: "We couldn't find what you're looking for.",
    NotFound: "We couldn't find what you're looking for.",
    TOO_MANY_REQUESTS: tooMany,
    RATE_LIMITED: tooMany,
    OTP_RATE_LIMITED: tooMany,
    TooManyRequests: tooMany,
    INTERNAL_ERROR: 'Something went wrong on our side. Please try again later.',
    // Auth
    AUTH_INVALID_CREDENTIALS: invalidCredentials,
    InvalidCredentials: invalidCredentials,
    ACCOUNT_NOT_VERIFIED: notVerified,
    AUTH_ACCOUNT_NOT_VERIFIED: notVerified,
    AccountNotVerified: notVerified,
    ACCOUNT_DISABLED: 'This account is disabled. Please contact support.',
    OTP_EXPIRED: 'This code has expired. Request a new one.',
    OTP_INVALID: invalidOtp,
    INVALID_OTP: invalidOtp,
    InvalidOtp: invalidOtp,
    PASSWORD_RESET_TOKEN_INVALID: 'This reset session has expired. Please start again.',
    PASSWORD_UNCHANGED: 'This is your current password. Choose a different one.',
    PHONE_ALREADY_EXISTS: 'This mobile number is already registered.',
    EMAIL_ALREADY_EXISTS: 'This email is already registered.',
    NATIONAL_ID_ALREADY_EXISTS: 'This national ID is already registered.',
    // Field-level codes (generic wording)
    INVALID_VALUE: 'Invalid value',
    INVALID_TYPE: required,
    REQUIRED: required,
    TypeMismatchError: required,
    TOO_SHORT: 'Too short',
    TOO_LONG: 'Too long',
    LengthError: 'Invalid length',
    INVALID_FORMAT: 'Invalid format',
    FormatError: 'Invalid format',
    INVALID_PHONE: phone,
    INVALID_EMAIL: 'Enter a valid email address',
    INVALID_ENUM: 'Choose one of the available options',
    ALREADY_EXISTS: 'This value is already registered.',
  },
  /** Field-specific wording; used before the generic code message. */
  fields: {
    identifier: { INVALID_PHONE: phone, INVALID_FORMAT: phone, FormatError: phone },
    phone: { INVALID_PHONE: phone, INVALID_FORMAT: phone, FormatError: phone },
    password: { TOO_SHORT: passwordMin, LengthError: passwordMin, INVALID_FORMAT: passwordFormat },
    newPassword: {
      TOO_SHORT: passwordMin,
      LengthError: passwordMin,
      INVALID_FORMAT: passwordFormat,
    },
    fullName: {
      TOO_SHORT: 'Enter your full name (2 characters or more)',
      TOO_LONG: 'Full name is too long',
    },
    nationalId: { INVALID_FORMAT: "This national ID isn't valid. Check the digits and try again." },
    otp: { TOO_SHORT: otp, TOO_LONG: otp, INVALID_FORMAT: otp },
  },
};

/** Generic validation messages (yup defaults), used when a schema doesn't set its own. */
export const validationEn = {
  required,
  invalid: 'Invalid value',
  oneOf: 'Choose one of the allowed values',
  minLength: 'Must be at least {min} characters',
  maxLength: 'Must be at most {max} characters',
  length: 'Must be exactly {length} characters',
  email: 'Enter a valid email address',
  url: 'Enter a valid link',
  format: 'Invalid format',
  minNumber: 'Must be {min} or more',
  maxNumber: 'Must be {max} or less',
  integer: 'Must be a whole number',
  positive: 'Must be greater than 0',
  minItems: 'Select at least {min}',
  maxItems: 'Select at most {max}',
  minDate: 'Must be on or after {min}',
  maxDate: 'Must be on or before {max}',
};
