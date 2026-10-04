import { computed, onMounted, ref, type Ref } from 'vue';
import { toTypedSchema } from '@vee-validate/yup';
import { useMutation } from '@tanstack/vue-query';
import { useForm } from 'vee-validate';
import { notify } from '@workspace/core/utils/toast';
import { OTP_RESEND_COOLDOWN } from '~/constants/auth';
import { paths } from '~/router/paths';
import {
  createForgotPasswordSchema,
  createResetPasswordSchema,
  type ForgotPasswordFormValues,
  type ResetPasswordFormValues,
} from '~/modules/auth/schemas';
import { useAuthService } from '~/modules/auth/services';
import { useApiFormError } from './useApiFormError';
import { useCountdown } from './useCountdown';

/** Password reset step 1: sends a code to the phone. Emits the reset session via `onSent`. */
export function useForgotPasswordPhoneForm(onSent: (phone: string, token: string) => void) {
  const { t } = useI18n();
  const service = useAuthService();
  const { showError } = useApiFormError();

  const { handleSubmit } = useForm<ForgotPasswordFormValues>({
    validationSchema: toTypedSchema(createForgotPasswordSchema(t)),
    initialValues: { phone: '' },
  });

  const request = useMutation({ mutationFn: (phone: string) => service.forgotPassword(phone) });

  const onSubmit = handleSubmit(async ({ phone }, { setErrors }) => {
    try {
      const { token } = await request.mutateAsync(phone);
      onSent(phone, token);
    } catch (error) {
      showError(
        error,
        (errors) => setErrors({ phone: errors.identifier ?? errors.phone }),
        'phone'
      );
    }
  });

  return { onSubmit, isPending: request.isPending };
}

/**
 * Password reset step 2: verifies the code, then sets the new password.
 * The two API calls run on one submit; if only the reset fails, the verified token is
 * kept so the user doesn't need a new code.
 */
export function useResetPasswordForm(session: { phone: Ref<string>; token: Ref<string> }) {
  const { t } = useI18n();
  const localePath = useLocalePath();
  const service = useAuthService();
  const { showError } = useApiFormError();
  const cooldown = useCountdown(OTP_RESEND_COOLDOWN);
  const resetToken = ref<string | null>(null);

  const { handleSubmit, resetField } = useForm<ResetPasswordFormValues>({
    validationSchema: toTypedSchema(createResetPasswordSchema(t)),
    initialValues: { otp: '', newPassword: '', confirmPassword: '' },
  });

  const verify = useMutation({
    mutationFn: (otp: string) => service.verifyResetOtp({ otp, token: session.token.value }),
  });
  const reset = useMutation({
    mutationFn: (body: { newPassword: string; token: string }) => service.resetPassword(body),
  });
  const resend = useMutation({
    mutationFn: () => service.forgotPassword(session.phone.value),
    onSuccess: ({ token }) => {
      session.token.value = token;
      resetToken.value = null;
      resetField('otp');
      cooldown.start();
      notify('success', { title: t('auth.successTitle'), body: t('auth.verify.resent') });
    },
    onError: (error) => showError(error),
  });

  const onSubmit = handleSubmit(async ({ otp, newPassword }, { setErrors }) => {
    if (!resetToken.value) {
      try {
        resetToken.value = (await verify.mutateAsync(otp)).token;
      } catch (error) {
        showError(error, setErrors, 'otp');
        return;
      }
    }

    try {
      await reset.mutateAsync({ newPassword, token: resetToken.value });
      notify('success', { title: t('auth.successTitle'), body: t('auth.forgot.success') });
      await navigateTo(localePath(paths.auth.login));
    } catch (error) {
      showError(error, setErrors, 'newPassword');
    }
  });

  onMounted(() => cooldown.start());

  return {
    onSubmit,
    isPending: computed(() => verify.isPending.value || reset.isPending.value),
    resend: () => resend.mutate(),
    resendIn: cooldown.remaining,
    canResend: computed(() => !cooldown.isRunning.value && !resend.isPending.value),
  };
}
