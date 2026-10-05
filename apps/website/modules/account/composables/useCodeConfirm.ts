import { useMutation } from '@tanstack/vue-query';
import { notify } from '@workspace/core/utils/toast';
import { useApiFormError } from '~/composables/useApiFormError';
import { OTP_RESEND_COOLDOWN } from '~/constants/auth';
import { useCountdown } from '~/modules/auth/composables/useCountdown';
import { useOtpForm } from '~/modules/auth/composables/useOtpForm';
import type { ConfirmChangeRequest } from '~/modules/account/types';
import { focusFirstInvalidField } from '~/utils/focus';

interface Options {
  /** Token from step 1 */
  token: Ref<string>;
  /** Sends the 6-digit code with the token */
  confirm: (body: ConfirmChangeRequest) => Promise<unknown>;
  /** Asks for a new code (repeats step 1) and returns its token */
  resend: () => Promise<string>;
  onConfirmed: () => void | Promise<void>;
}

/**
 * Step 2 of an OTP-confirmed change (phone, email, IBAN): the code form, sent as soon as
 * the 6th digit is in, plus "resend code" with the usual cooldown.
 */
export function useCodeConfirm(options: Options) {
  const { t } = useI18n();
  const cooldown = useCountdown(OTP_RESEND_COOLDOWN);
  const { handleSubmit, values, clearOtp, canSubmit, submitOnComplete } = useOtpForm();
  const { showError, formError, clearFormError } = useApiFormError(values);
  const token = ref(options.token.value);

  const confirm = useMutation({
    mutationFn: (otp: string) => options.confirm({ token: token.value, otp }),
  });
  const resend = useMutation({
    mutationFn: options.resend,
    onMutate: clearFormError,
    onSuccess: (newToken) => {
      token.value = newToken;
      cooldown.start();
      clearOtp();
      notify('success', { title: t('auth.successTitle'), body: t('auth.verify.resent') });
    },
    onError: (error) => showError(error),
  });

  const onSubmit = handleSubmit(async ({ otp }, { setErrors }) => {
    clearFormError();
    try {
      await confirm.mutateAsync(otp);
      await options.onConfirmed();
    } catch (error) {
      showError(error, setErrors);
    }
  }, focusFirstInvalidField);
  submitOnComplete(onSubmit, confirm.isPending);
  onMounted(() => cooldown.start());

  return {
    onSubmit,
    canSubmit,
    formError,
    isPending: confirm.isPending,
    resend: () => resend.mutate(),
    resendIn: cooldown.remaining,
    canResend: computed(() => !cooldown.isRunning.value && !resend.isPending.value),
  };
}
