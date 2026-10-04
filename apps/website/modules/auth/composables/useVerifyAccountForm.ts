import { computed, onMounted } from 'vue';
import { toTypedSchema } from '@vee-validate/yup';
import { useMutation } from '@tanstack/vue-query';
import { useForm } from 'vee-validate';
import { useCanSubmit } from '~/composables/useCanSubmit';
import { OTP_LENGTH } from '~/modules/auth/schemas/rules';
import { notify } from '@workspace/core/utils/toast';
import { OTP_RESEND_COOLDOWN } from '~/constants/auth';
import { paths } from '~/router/paths';
import { useAuthStore } from '~/stores/auth';
import { createOtpSchema, type OtpFormValues } from '~/modules/auth/schemas';
import { useAuthService } from '~/modules/auth/services';
import { useVerificationStore } from '~/modules/auth/stores/verification';
import { useApiFormError } from '~/composables/useApiFormError';
import { useCountdown } from './useCountdown';

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
  const { showError } = useApiFormError();
  const cooldown = useCountdown(OTP_RESEND_COOLDOWN);

  const schema = createOtpSchema(t);
  const { handleSubmit, resetField, values } = useForm<OtpFormValues>({
    validationSchema: toTypedSchema(schema),
    initialValues: { otp: '' },
  });
  // Submit stays disabled until required fields are filled (project rule)
  const canSubmit = useCanSubmit(schema, values, {
    otp: (v) => String(v ?? '').length === OTP_LENGTH,
  });

  const verify = useMutation({
    mutationFn: (otp: string) =>
      service.verifyContact({ otp, token: verification.pending?.token ?? '' }),
  });

  const resend = useMutation({
    mutationFn: () => service.resendOtp(verification.pending?.token ?? ''),
    onSuccess: () => {
      cooldown.start();
      resetField('otp');
      notify('success', { title: t('auth.successTitle'), body: t('auth.verify.resent') });
    },
    onError: (error) => showError(error),
  });

  const onSubmit = handleSubmit(async ({ otp }, { setErrors }) => {
    const pending = verification.pending;
    if (!pending) {
      return;
    }
    try {
      const session = await verify.mutateAsync(otp);
      authStore.setSession({
        tokens: session.tokens,
        user: session.user,
        remember: pending.remember ?? false,
      });
      verification.clear();
      notify('success', { title: t('auth.successTitle'), body: t('auth.verify.success') });
      await navigateTo(pending.redirect ?? localePath(paths.home));
    } catch (error) {
      showError(error, setErrors, 'otp');
    }
  });

  // The API sends the first code when the flow starts
  onMounted(() => cooldown.start());

  return {
    pending: computed(() => verification.pending),
    onSubmit,
    canSubmit,
    isPending: verify.isPending,
    resend: () => resend.mutate(),
    isResending: resend.isPending,
    resendIn: cooldown.remaining,
    canResend: computed(() => !cooldown.isRunning.value && !resend.isPending.value),
  };
}
