import { computed, onMounted, type Ref } from 'vue';
import { toTypedSchema } from '@vee-validate/yup';
import { useMutation } from '@tanstack/vue-query';
import { useForm } from 'vee-validate';
import { useCanSubmit } from '~/composables/useCanSubmit';
import { notify } from '@workspace/core/utils/toast';
import { OTP_RESEND_COOLDOWN, resendSecondsLeft } from '~/constants/auth';
import { paths } from '~/router/paths';
import {
  createForgotPasswordSchema,
  createResetPasswordSchema,
  type ForgotPasswordFormValues,
  type ResetPasswordFormValues,
} from '~/modules/auth/schemas';
import { getApiErrorCode } from '~/utils/apiError';
import { useAuthService } from '~/modules/auth/services';
import { useApiFormError } from '~/composables/useApiFormError';
import { useCountdown } from './useCountdown';
import { useOtpForm } from './useOtpForm';

/** Password reset step 1: sends a code to the phone. Emits the reset session via `onSent`. */
export function useForgotPasswordPhoneForm(onSent: (phone: string, token: string) => void) {
  const { t } = useI18n();
  const service = useAuthService();
  const schema = createForgotPasswordSchema(t);
  const { handleSubmit, values } = useForm<ForgotPasswordFormValues>({
    validationSchema: toTypedSchema(schema),
    initialValues: { phone: '' },
  });
  // Submit stays disabled until required fields are filled (project rule)
  const canSubmit = useCanSubmit(schema, values);
  const { showError, formError, clearFormError } = useApiFormError(values);

  const request = useMutation({ mutationFn: (phone: string) => service.forgotPassword(phone) });

  const onSubmit = handleSubmit(async ({ phone }, { setErrors }) => {
    clearFormError();
    try {
      const { token } = await request.mutateAsync(phone);
      onSent(phone, token);
    } catch (error) {
      // The API may report the number as `identifier`
      showError(error, (errors) => setErrors({ phone: errors.identifier ?? errors.phone }));
    }
  });

  return { onSubmit, canSubmit, formError, isPending: request.isPending };
}

/** Error codes meaning the reset session is gone and the flow must restart. */
const RESET_SESSION_EXPIRED = ['PASSWORD_RESET_TOKEN_INVALID', 'OTP_EXPIRED', 'UNAUTHENTICATED'];

/**
 * Password reset step 2: verifies the code sent to the phone.
 * On success it hands the reset token to step 3 via `onVerified`.
 */
export function useResetCodeForm(
  session: { phone: Ref<string>; token: Ref<string>; codeSentAt: Ref<number | undefined> },
  onVerified: (resetToken: string) => void
) {
  const { t } = useI18n();
  const service = useAuthService();
  const cooldown = useCountdown(OTP_RESEND_COOLDOWN);

  const { handleSubmit, values, clearOtp, canSubmit, validateOtp } = useOtpForm();
  const { showError, formError, clearFormError } = useApiFormError(values);

  const verify = useMutation({
    mutationFn: (otp: string) => service.verifyResetOtp({ otp, token: session.token.value }),
  });
  // Re-requesting the code issues a new reset session token
  const resend = useMutation({
    mutationFn: () => service.forgotPassword(session.phone.value),
    onMutate: clearFormError,
    onSuccess: ({ token }) => {
      session.token.value = token;
      clearOtp();
      cooldown.start();
      notify('success', { title: t('auth.successTitle'), body: t('auth.verify.resent') });
    },
    onError: (error) => showError(error),
  });

  const onSubmit = handleSubmit(async ({ otp }, { setErrors }) => {
    clearFormError();
    try {
      const { token } = await verify.mutateAsync(otp);
      onVerified(token);
    } catch (error) {
      showError(error, setErrors);
    }
  });

  // Resume the countdown (the step remounts when the language changes)
  onMounted(() => cooldown.start(resendSecondsLeft(session.codeSentAt.value)));

  return {
    onSubmit,
    canSubmit,
    formError,
    validateOtp,
    isPending: verify.isPending,
    resend: () => resend.mutate(),
    resendIn: cooldown.remaining,
    canResend: computed(() => !cooldown.isRunning.value && !resend.isPending.value),
  };
}

/**
 * Password reset step 3: sets the new password with the token from step 2, then goes to
 * login. If the reset session has expired, `onExpired` restarts the flow.
 */
export function useResetPasswordForm(resetToken: Ref<string>, onExpired: () => void) {
  const { t } = useI18n();
  const localePath = useLocalePath();
  const service = useAuthService();
  const schema = createResetPasswordSchema(t);
  const { handleSubmit, values } = useForm<ResetPasswordFormValues>({
    validationSchema: toTypedSchema(schema),
    initialValues: { newPassword: '', confirmPassword: '' },
  });
  // Submit stays disabled until required fields are filled (project rule)
  const canSubmit = useCanSubmit(schema, values);
  const { showError, formError, clearFormError, toast, describe } = useApiFormError(values);

  const reset = useMutation({
    mutationFn: (newPassword: string) =>
      service.resetPassword({ newPassword, token: resetToken.value }),
  });

  const onSubmit = handleSubmit(async ({ newPassword }, { setErrors }) => {
    clearFormError();
    try {
      await reset.mutateAsync(newPassword);
      notify('success', { title: t('auth.successTitle'), body: t('auth.forgot.success') });
      await navigateTo(localePath(paths.auth.login));
    } catch (error) {
      if (RESET_SESSION_EXPIRED.includes(getApiErrorCode(error) ?? '')) {
        toast(describe(error));
        onExpired();
        return;
      }
      showError(error, setErrors);
    }
  });

  return { onSubmit, canSubmit, formError, isPending: reset.isPending };
}
