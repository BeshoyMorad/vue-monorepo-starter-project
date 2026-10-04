import { setLocale } from 'yup';

/**
 * Translates yup's built-in validation messages (used when a schema rule has no message
 * of its own). Messages are functions, so they're resolved at validation time in the
 * current language. Client-only: yup's locale is global, and validation runs in the browser.
 */
export default defineNuxtPlugin({
  name: 'yup-locale',
  setup(nuxtApp) {
    const i18n = nuxtApp.$i18n as { t: (key: string, values?: Record<string, unknown>) => string };
    /** Message resolver; `rename` maps yup's param names to the placeholders in locales. */
    const msg =
      (key: string, rename: Record<string, string> = {}) =>
      (params: object) => {
        const values: Record<string, unknown> = { ...params };
        for (const [from, to] of Object.entries(rename)) {
          values[to] = values[from];
        }
        return i18n.t(`validation.${key}`, values);
      };

    setLocale({
      mixed: {
        default: msg('invalid'),
        required: msg('required'),
        defined: msg('required'),
        notNull: msg('required'),
        oneOf: msg('oneOf'),
        notOneOf: msg('invalid'),
        notType: msg('invalid'),
      },
      string: {
        length: msg('length'),
        min: msg('minLength'),
        max: msg('maxLength'),
        matches: msg('format'),
        email: msg('email'),
        url: msg('url'),
        uuid: msg('invalid'),
        trim: msg('invalid'),
        lowercase: msg('invalid'),
        uppercase: msg('invalid'),
      },
      number: {
        min: msg('minNumber'),
        max: msg('maxNumber'),
        lessThan: msg('maxNumber', { less: 'max' }),
        moreThan: msg('minNumber', { more: 'min' }),
        positive: msg('positive'),
        negative: msg('invalid'),
        integer: msg('integer'),
      },
      date: { min: msg('minDate'), max: msg('maxDate') },
      boolean: { isValue: msg('invalid') },
      object: { noUnknown: msg('invalid') },
      array: { min: msg('minItems'), max: msg('maxItems'), length: msg('invalid') },
    });
  },
});
