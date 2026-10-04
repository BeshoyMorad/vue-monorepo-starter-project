import { toTypedSchema } from '@vee-validate/yup';
import { useForm } from 'vee-validate';
import { useCanSubmit } from '~/composables/useCanSubmit';
import { createOtpSchema, type OtpFormValues } from '~/modules/auth/schemas';
import { OTP_LENGTH } from '~/modules/auth/schemas/rules';

/** Form for a 6-digit verification code, shared by account verification and password reset. */
export function useOtpForm() {
  const { t } = useI18n();
  const schema = createOtpSchema(t);
  const { handleSubmit, resetField, values, validateField } = useForm<OtpFormValues>({
    validationSchema: toTypedSchema(schema),
    initialValues: { otp: '' },
  });

  return {
    handleSubmit,
    clearOtp: () => resetField('otp'),
    // Submit stays disabled until all digits are entered (project rule)
    canSubmit: useCanSubmit(schema, values, {
      otp: (v) => String(v ?? '').length === OTP_LENGTH,
    }),
    // The code input doesn't report blur itself; call this when focus leaves it
    validateOtp: () => validateField('otp'),
  };
}
