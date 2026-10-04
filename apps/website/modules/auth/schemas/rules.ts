import * as yup from 'yup';

/** vue-i18n `t`: a key plus optional named values, e.g. t(key, { count: 3 }). */
export type Translate = (key: string, named?: Record<string, unknown>) => string;

/** Saudi mobile number in E.164 format, as the API expects: +9665XXXXXXXX. */
export const SAUDI_PHONE_REGEX = /^\+9665\d{8}$/;
const SAUDI_DIAL_CODE = '+966';
/** Digits after +966 in a Saudi mobile number. */
const SAUDI_LOCAL_LENGTH = 9;
export const OTP_LENGTH = 6;
export const OTP_REGEX = new RegExp(`^\\d{${OTP_LENGTH}}$`);
export const NATIONAL_ID_REGEX = /^\d{10,14}$/;
const NATIONAL_ID_MIN = 10;
const NATIONAL_ID_MAX = 14;
export const PASSWORD_MIN = 8;
export const FULL_NAME_MIN = 2;
export const FULL_NAME_MAX = 201;
/** Arabic-Indic (٠-٩) and Persian (۰-۹) digits, typed by Arabic keyboards. */
const EASTERN_DIGITS_REGEX = /[٠-٩۰-۹]/;

const key = (name: string) => `auth.validation.${name}`;

/**
 * A yup test whose message says exactly what is wrong with the value, instead of repeating
 * the field's hint. `explain` returns the message, or nothing when the value is fine.
 * Empty values pass: `.required()` reports those.
 */
export const explained = (name: string, explain: (value: string) => string | undefined) => ({
  name,
  test(value: string | undefined, ctx: yup.TestContext) {
    const message = value ? explain(value) : undefined;
    return message ? ctx.createError({ message }) : true;
  },
});

/** "a", "a and b", "a, b and c" in the current language. */
const joinList = (t: Translate, items: string[]) =>
  items.length < 2
    ? (items[0] ?? '')
    : items.slice(0, -1).join(t(key('listSeparator'))) + t(key('listAnd')) + items.at(-1);

export const phoneRule = (t: Translate) =>
  yup
    .string()
    .required(t(key('required')))
    .test(
      explained('phone', (value) => {
        const local = value.replace(SAUDI_DIAL_CODE, '');
        if (!local.startsWith('5')) {
          return t(key('phoneStart'));
        }
        if (local.length < SAUDI_LOCAL_LENGTH) {
          return t(key('phoneShort'), { count: local.length, length: SAUDI_LOCAL_LENGTH });
        }
        if (local.length > SAUDI_LOCAL_LENGTH) {
          return t(key('phoneLong'), { count: local.length, length: SAUDI_LOCAL_LENGTH });
        }
        return SAUDI_PHONE_REGEX.test(value) ? undefined : t(key('phone'));
      })
    );

const passwordShort = (t: Translate, value: string) =>
  value.length < PASSWORD_MIN
    ? t(key('passwordShort'), { count: value.length, min: PASSWORD_MIN })
    : undefined;

/** Existing password: only the API's minimum length is checked. */
export const currentPasswordRule = (t: Translate) =>
  yup
    .string()
    .required(t(key('required')))
    .test(explained('passwordLength', (value) => passwordShort(t, value)));

/**
 * New password: min 8 characters with uppercase, lowercase, a number and a symbol (API rule).
 * The message lists everything still missing, e.g. "Too short: 5 of 8 characters. Add an
 * uppercase letter and a symbol."
 */
export const newPasswordRule = (t: Translate) =>
  yup
    .string()
    .required(t(key('required')))
    .test(
      explained('passwordStrength', (value) => {
        const missing = [
          [/[A-Z]/, 'passwordUpper'],
          [/[a-z]/, 'passwordLower'],
          [/\d/, 'passwordNumber'],
          [/[^A-Za-z0-9]/, 'passwordSymbol'],
        ]
          .filter(([pattern]) => !(pattern as RegExp).test(value))
          .map(([, name]) => t(key(name as string)));
        const problems = [
          passwordShort(t, value),
          missing.length ? t(key('passwordAdd'), { items: joinList(t, missing) }) : undefined,
        ];
        return problems.filter(Boolean).join(' ') || undefined;
      })
    );

export const confirmPasswordRule = (t: Translate, field: string) =>
  yup
    .string()
    .required(t(key('required')))
    .oneOf([yup.ref(field)], t(key('passwordMatch')));

export const otpRule = (t: Translate) =>
  yup
    .string()
    .required(t(key('otpRequired')))
    .test(
      explained('otp', (value) => {
        if (OTP_REGEX.test(value)) {
          return undefined;
        }
        return value.length < OTP_LENGTH
          ? t(key('otpShort'), { count: value.length, length: OTP_LENGTH })
          : t(key('otp'));
      })
    );

export const nationalIdRule = (t: Translate) =>
  yup
    .string()
    .required(t(key('required')))
    .test(
      explained('nationalId', (value) => {
        if (EASTERN_DIGITS_REGEX.test(value)) {
          return t(key('latinDigits'));
        }
        if (/\s/.test(value)) {
          return t(key('nationalIdSpaces'));
        }
        if (/\D/.test(value)) {
          return t(key('nationalIdDigits'));
        }
        if (value.length < NATIONAL_ID_MIN) {
          return t(key('nationalIdShort'), { count: value.length, min: NATIONAL_ID_MIN });
        }
        if (value.length > NATIONAL_ID_MAX) {
          return t(key('nationalIdLong'), { count: value.length, max: NATIONAL_ID_MAX });
        }
        return NATIONAL_ID_REGEX.test(value) ? undefined : t(key('nationalIdDigits'));
      })
    );

export const fullNameRule = (t: Translate) =>
  yup
    .string()
    .trim()
    .required(t(key('required')))
    .test(
      explained('fullName', (value) => {
        if (value.length < FULL_NAME_MIN) {
          return t(key('fullNameShort'), { min: FULL_NAME_MIN });
        }
        if (value.length > FULL_NAME_MAX) {
          return t(key('fullNameLong'), { count: value.length, max: FULL_NAME_MAX });
        }
        return undefined;
      })
    );

export const emailRule = (t: Translate) =>
  yup
    .string()
    .trim()
    .required(t(key('required')))
    .test(
      explained('email', (value) => {
        if (/\s/.test(value)) {
          return t(key('emailSpaces'));
        }
        const parts = value.split('@');
        if (parts.length === 1) {
          return t(key('emailNoAt'));
        }
        if (parts.length > 2) {
          return t(key('emailManyAt'));
        }
        const [name, domain] = parts as [string, string];
        if (!name) {
          return t(key('emailNoName'));
        }
        if (!domain || !/^[^.]+(\.[^.]+)+$/.test(domain)) {
          return t(key('emailNoDomain'));
        }
        return yup.string().email().isValidSync(value) ? undefined : t(key('email'));
      })
    );
