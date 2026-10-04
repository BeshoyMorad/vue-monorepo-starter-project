import { computed, onMounted } from 'vue';
import { focusFirstInvalidField } from '~/utils/focus';
import { useMutation } from '@tanstack/vue-query';
import { notify } from '@workspace/core/utils/toast';
import { OTP_RESEND_COOLDOWN, resendSecondsLeft } from '~/constants/auth';
import { paths } from '~/router/paths';
import { useAuthStore } from '~/stores/auth';
import { useAuthService } from '~/modules/auth/services';
import { useRegisterDraftStore } from '~/modules/auth/stores/registerDraft';
import { useVerificationStore } from '~/modules/auth/stores/verification';
import { useApiFormError } from '~/composables/useApiFormError';
import { useCountdown } from './useCountdown';
import { useOtpForm } from './useOtpForm';

/**
 * Phone verification (after registration or an unverified login).
 * On success the API returns a session, so the user is signed in right away.
 */
export function useVerifyAccountForm() {
  const { t } = useI18n();
  const localePath = useLocalePath();
  const authStore = useAuthStore();
  const verification = useVerificationStore();
  const service = useAuthService();
  const cooldown = useCountdown(OTP_RESEND_COOLDOWN);

  const { handleSubmit, values, clearOtp, canSubmit, submitOnComplete } = useOtpForm();
  const { showError, formError, clearFormError } = useApiFormError(values);

  const verify = useMutation({
    mutationFn: (otp: string) =>
      service.verifyContact({ otp, token: verification.pending?.token ?? '' }),
  });

  const resend = useMutation({
    mutationFn: () => service.resendOtp(verification.pending?.token ?? ''),
    onMutate: clearFormError,
    onSuccess: () => {
      verification.markCodeSent();
      cooldown.start();
      clearOtp();
      notify('success', { title: t('auth.successTitle'), body: t('auth.verify.resent') });
    },
    onError: (error) => showError(error),
  });

  const onSubmit = handleSubmit(async ({ otp }, { setErrors }) => {
    const pending = verification.pending;
    if (!pending) {
      return;
    }
    clearFormError();
    try {
      const session = await verify.mutateAsync(otp);
      authStore.setSession({
        tokens: session.tokens,
        user: session.user,
        remember: pending.remember ?? false,
      });
      verification.clear();
      useRegisterDraftStore().clear();
      notify('success', { title: t('auth.successTitle'), body: t('auth.verify.success') });
      await navigateTo(pending.redirect ?? localePath(paths.home));
    } catch (error) {
      showError(error, setErrors);
    }
  }, focusFirstInvalidField);
  submitOnComplete(onSubmit, verify.isPending);

  // The API sends the first code when the flow starts
  // Resume the countdown (the page remounts when the language changes)
  onMounted(() => cooldown.start(resendSecondsLeft(verification.pending?.codeSentAt)));

  return {
    pending: computed(() => verification.pending),
    onSubmit,
    canSubmit,
    formError,
    isPending: verify.isPending,
    resend: () => resend.mutate(),
    isResending: resend.isPending,
    resendIn: cooldown.remaining,
    canResend: computed(() => !cooldown.isRunning.value && !resend.isPending.value),
  };
}
