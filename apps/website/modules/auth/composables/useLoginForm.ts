import { toTypedSchema } from '@vee-validate/yup';
import { useMutation } from '@tanstack/vue-query';
import { useForm } from 'vee-validate';
import { REDIRECT_QUERY_KEY } from '~/constants/auth';
import { paths } from '~/router/paths';
import { useAuthStore } from '~/stores/auth';
import { getApiError, getApiErrorCode } from '~/utils/apiError';
import { getSafeRedirect } from '~/utils/redirect';
import { createLoginSchema, type LoginFormValues } from '~/modules/auth/schemas';
import { useAuthService } from '~/modules/auth/services';
import { useVerificationStore } from '~/modules/auth/stores/verification';
import type { AccountNotVerifiedDetails, LoginRequest } from '~/modules/auth/types';
import { useApiFormError } from './useApiFormError';

/**
 * Login form: validates, signs in, then opens `?redirect=` or home.
 * An unverified account (403 AccountNotVerified) continues to the OTP screen.
 */
export function useLoginForm() {
  const { t } = useI18n();
  const route = useRoute();
  const localePath = useLocalePath();
  const authStore = useAuthStore();
  const verification = useVerificationStore();
  const service = useAuthService();
  const { showError } = useApiFormError();

  const { handleSubmit } = useForm<LoginFormValues>({
    validationSchema: toTypedSchema(createLoginSchema(t)),
    initialValues: { identifier: '', password: '', remember: false },
  });

  const login = useMutation({ mutationFn: (body: LoginRequest) => service.login(body) });

  const redirect = getSafeRedirect(route.query[REDIRECT_QUERY_KEY]);

  const onSubmit = handleSubmit(async (values, { setErrors }) => {
    try {
      const session = await login.mutateAsync({
        identifier: values.identifier,
        password: values.password,
      });
      authStore.setSession({
        tokens: session.tokens,
        user: session.user,
        remember: values.remember,
      });
      await navigateTo(redirect ?? localePath(paths.home));
    } catch (error) {
      if (getApiErrorCode(error) === 'AccountNotVerified') {
        const details = getApiError(error)?.details as unknown as AccountNotVerifiedDetails;
        verification.start({
          token: details.token,
          phone: values.identifier,
          source: 'login',
          remember: values.remember,
          redirect,
        });
        await navigateTo(localePath(paths.auth.verify));
        return;
      }
      // Wrong credentials etc. are shown under the password field
      showError(error, setErrors, 'password');
    }
  });

  return { onSubmit, isPending: login.isPending };
}
