import * as yup from 'yup';
import { explained, type Translate } from '~/modules/auth/schemas/rules';

const key = (name: string) => `wallet.validation.${name}`;

/** Deposit limits of the API, in riyals */
export const DEPOSIT_MIN = 0.01;
export const DEPOSIT_MAX = 1_000_000_000;
/** Wallet PIN: six digits, one per box (as in the Ibbil design) */
export const PIN_LENGTH = 6;

/** Arabic-Indic and Persian digits become 0-9, and the Arabic decimal separator a dot */
export const toLatinDigits = (value: string) =>
  value
    .replace(/[٠-٩]/g, (digit) => String(digit.charCodeAt(0) - 0x0660))
    .replace(/[۰-۹]/g, (digit) => String(digit.charCodeAt(0) - 0x06f0))
    .replace(/[٫,]/g, '.');

/** The typed amount as a number of riyals (NaN when it isn't one) */
export const parseAmount = (value: string) => {
  const normalized = toLatinDigits(value.trim());
  return /^\d+(\.\d*)?$/.test(normalized) ? Number(normalized) : Number.NaN;
};

export const createDepositSchema = (t: Translate) =>
  yup.object({
    amount: yup
      .string()
      .required(t('auth.validation.required'))
      .test(
        explained('amount', (raw) => {
          const normalized = toLatinDigits(raw.trim());
          const amount = parseAmount(raw);
          if (Number.isNaN(amount)) return t(key('amountFormat'));
          const decimals = normalized.split('.')[1]?.length ?? 0;
          if (decimals > 2) return t(key('amountDecimals'), { count: decimals });
          if (amount < DEPOSIT_MIN) return t(key('amountZero'));
          return amount > DEPOSIT_MAX ? t(key('amountMax')) : undefined;
        })
      ),
  });
export type DepositFormValues = yup.InferType<ReturnType<typeof createDepositSchema>>;

const pinRule = (t: Translate) =>
  yup
    .string()
    .required(t('auth.validation.required'))
    .test(
      explained('pin', (raw) => {
        const value = toLatinDigits(raw);
        if (/\D/.test(value)) return t(key('pinDigits'));
        return value.length < PIN_LENGTH
          ? t(key('pinShort'), { count: value.length, length: PIN_LENGTH })
          : undefined;
      })
    );

/** The three steps of "change PIN"; the new PIN must differ and the confirmation match */
export const createPinSchema = (t: Translate) =>
  yup.object({
    oldPin: pinRule(t),
    newPin: pinRule(t).test({
      name: 'pinSame',
      message: t(key('pinSame')),
      test: (value, ctx) => !value || value !== ctx.parent.oldPin,
    }),
    confirmPin: yup
      .string()
      .required(t('auth.validation.required'))
      .test({
        name: 'pinMismatch',
        message: t(key('pinMismatch')),
        test: (value, ctx) => !value || value === ctx.parent.newPin,
      }),
  });
export type PinFormValues = yup.InferType<ReturnType<typeof createPinSchema>>;
