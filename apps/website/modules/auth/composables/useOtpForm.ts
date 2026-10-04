import { toTypedSchema } from '@vee-validate/yup';
import { useForm } from 'vee-validate';
import { watch, type Ref } from 'vue';
import { useCanSubmit } from '~/composables/useCanSubmit';
import { createOtpSchema, type OtpFormValues } from '~/modules/auth/schemas';
import { OTP_LENGTH } from '~/modules/auth/schemas/rules';

/** Form for a 6-digit verification code, shared by account verification and password reset. */
export function useOtpForm() {
  const { t } = useI18n();
  const schema = createOtpSchema(t);
  const { handleSubmit, resetField, values } = useForm<OtpFormValues>({
    validationSchema: toTypedSchema(schema),
    initialValues: { otp: '' },
  });

  /**
   * Submits as soon as the code becomes complete (the 6th digit typed, or the whole code
   * pasted or filled from the SMS), once per completion and never while a request is in
   * flight. Watches the form value itself: the input's own `complete` event re-fires on
   * re-renders and caused repeated requests.
   */
  const submitOnComplete = (submit: () => unknown, isPending: Ref<boolean>) =>
    watch(
      () => String(values.otp ?? ''),
      (code, previous) => {
        if (code.length === OTP_LENGTH && previous.length < OTP_LENGTH && !isPending.value) {
          void submit();
        }
      }
    );

  return {
    handleSubmit,
    values,
    submitOnComplete,
    clearOtp: () => resetField('otp'),
    // Submit stays disabled until all digits are entered (project rule)
    canSubmit: useCanSubmit(schema, values, {
      otp: (v) => String(v ?? '').length === OTP_LENGTH,
    }),
  };
}
