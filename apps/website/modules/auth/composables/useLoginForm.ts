import { toTypedSchema } from '@vee-validate/yup';
import { focusFirstInvalidField } from '~/utils/focus';
import { useMutation } from '@tanstack/vue-query';
import { useForm } from 'vee-validate';
import { useCanSubmit } from '~/composables/useCanSubmit';
import { REDIRECT_QUERY_KEY } from '~/constants/auth';
import { paths } from '~/router/paths';
import { useAuthStore } from '~/stores/auth';
import { getApiError } from '~/utils/apiError';
import { getSafeRedirect } from '~/utils/redirect';
import { createLoginSchema, type LoginFormValues } from '~/modules/auth/schemas';
import { useAuthService } from '~/modules/auth/services';
import { useVerificationStore } from '~/modules/auth/stores/verification';
import type { AccountNotVerifiedDetails, LoginRequest } from '~/modules/auth/types';
import { useApiFormError } from '~/composables/useApiFormError';

/**
 * The verification session of a 403 "account not verified" login response, if that's the
 * error. Accepts the documented code (AccountNotVerified) and the newer UPPER_SNAKE style,
 * with the token in `error.details` or directly on `error`.
 */
function getAccountNotVerifiedDetails(err: unknown): AccountNotVerifiedDetails | undefined {
  const error = getApiError(err);
  if (!error?.code || !/not[_]?verified/i.test(error.code)) {
    return undefined;
  }
  const source = (error.details ?? error) as Partial<AccountNotVerifiedDetails>;
  return source.token ? (source as AccountNotVerifiedDetails) : undefined;
}

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

  const schema = createLoginSchema(t);
  const { handleSubmit, values } = useForm<LoginFormValues>({
    validationSchema: toTypedSchema(schema),
    initialValues: { identifier: '', password: '', remember: false },
  });
  // Submit stays disabled until required fields are filled (project rule)
  const canSubmit = useCanSubmit(schema, values);
  const { showError, formError, clearFormError } = useApiFormError(values);

  const login = useMutation({ mutationFn: (body: LoginRequest) => service.login(body) });

  const redirect = getSafeRedirect(route.query[REDIRECT_QUERY_KEY]);

  const onSubmit = handleSubmit(async (values, { setErrors }) => {
    clearFormError();
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
      const details = getAccountNotVerifiedDetails(error);
      if (details) {
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
      // Wrong credentials etc. are shown under the submit button
      showError(error, setErrors);
    }
  }, focusFirstInvalidField);

  return { onSubmit, canSubmit, formError, isPending: login.isPending };
}
