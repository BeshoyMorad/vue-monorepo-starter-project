import * as yup from 'yup';
import {
  emailRule,
  explained,
  fullNameRule,
  nationalIdRule,
  phoneRule,
  type Translate,
} from '~/modules/auth/schemas/rules';
import type { ContactChannel } from './types';

const key = (name: string) => `account.validation.${name}`;

/** Spaces dropped and letters upper-cased: how the IBAN is checked and sent */
export const normalizeIban = (value: string) => value.replace(/\s+/g, '').toUpperCase();

/** ISO 13616 check digits: the rearranged IBAN, as a number, mod 97 must be 1 */
const ibanChecksumOk = (iban: string) => {
  const rearranged = iban.slice(4) + iban.slice(0, 4);
  const digits = rearranged.replace(/[A-Z]/g, (letter) => String(letter.charCodeAt(0) - 55));
  let rest = 0;
  for (const digit of digits) rest = (rest * 10 + Number(digit)) % 97;
  return rest === 1;
};

const SAUDI_IBAN_LENGTH = 24;

/** Saudi IBAN: SA + 22 digits (spaces allowed), with a valid checksum */
export const ibanRule = (t: Translate) =>
  yup
    .string()
    .required(t('auth.validation.required'))
    .test(
      explained('iban', (raw) => {
        const value = normalizeIban(raw);
        if (!value.startsWith('SA')) return t(key('ibanCountry'));
        if (/\D/.test(value.slice(2))) return t(key('ibanDigits'));
        if (value.length !== SAUDI_IBAN_LENGTH) {
          return t(key('ibanLength'), { count: value.length });
        }
        return ibanChecksumOk(value) ? undefined : t(key('ibanChecksum'));
      })
    );

/** Optional link, e.g. a Google Maps address */
const urlRule = (t: Translate) =>
  yup
    .string()
    .trim()
    .default('')
    .test(
      explained('url', (value) => {
        try {
          return ['http:', 'https:'].includes(new URL(value).protocol) ? undefined : t(key('url'));
        } catch {
          return t(key('url'));
        }
      })
    );

export const createProfileSchema = (t: Translate) =>
  yup.object({
    fullName: fullNameRule(t),
    nationalId: nationalIdRule(t),
    addressLink: urlRule(t),
  });
export type ProfileFormValues = yup.InferType<ReturnType<typeof createProfileSchema>>;

/** New phone or email; refuses the current one */
export const createContactSchema = (t: Translate, channel: ContactChannel, current = '') =>
  yup.object({
    identifier: (channel === 'phone' ? phoneRule(t) : emailRule(t)).test(
      explained('same', (value) =>
        current && value.trim().toLowerCase() === current.trim().toLowerCase()
          ? t('account.contact.sameValue', { channel: t(`account.contact.channel.${channel}`) })
          : undefined
      )
    ),
  });
export type ContactFormValues = yup.InferType<ReturnType<typeof createContactSchema>>;

export const createIbanSchema = (t: Translate) => yup.object({ iban: ibanRule(t) });
export type IbanFormValues = yup.InferType<ReturnType<typeof createIbanSchema>>;
