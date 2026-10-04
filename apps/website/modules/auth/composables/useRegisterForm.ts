import { toTypedSchema } from '@vee-validate/yup';
import { useMutation } from '@tanstack/vue-query';
import { useForm } from 'vee-validate';
import { paths } from '~/router/paths';
import { createRegisterSchema, type RegisterFormValues } from '~/modules/auth/schemas';
import { useAuthService } from '~/modules/auth/services';
import { useVerificationStore } from '~/modules/auth/stores/verification';
import type { RegisterRequest } from '~/modules/auth/types';
import { useApiFormError } from './useApiFormError';

/** Registration step 1: creates the account, then continues to OTP verification (step 2). */
export function useRegisterForm() {
  const { t } = useI18n();
  const localePath = useLocalePath();
  const verification = useVerificationStore();
  const service = useAuthService();
  const { showError } = useApiFormError();

  const { handleSubmit } = useForm<RegisterFormValues>({
    validationSchema: toTypedSchema(createRegisterSchema(t)),
    initialValues: {
      fullName: '',
      nationalId: '',
      phone: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const register = useMutation({
    mutationFn: (body: RegisterRequest) => service.register(body),
  });

  const onSubmit = handleSubmit(async (values, { setErrors }) => {
    try {
      const { token } = await register.mutateAsync({
        fullName: values.fullName,
        nationalId: values.nationalId,
        phone: values.phone,
        email: values.email || null,
        password: values.password,
      });
      verification.start({ token, phone: values.phone, source: 'register' });
      await navigateTo(localePath(paths.auth.verify));
    } catch (error) {
      showError(error, setErrors);
    }
  });

  return { onSubmit, isPending: register.isPending };
}
