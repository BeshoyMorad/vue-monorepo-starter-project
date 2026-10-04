import { toTypedSchema } from '@vee-validate/yup';
import { focusFirstInvalidField } from '~/utils/focus';
import { useMutation } from '@tanstack/vue-query';
import { useForm } from 'vee-validate';
import { useCanSubmit } from '~/composables/useCanSubmit';
import { paths } from '~/router/paths';
import { createRegisterSchema, type RegisterFormValues } from '~/modules/auth/schemas';
import { useAuthService } from '~/modules/auth/services';
import { useRegisterDraftStore } from '~/modules/auth/stores/registerDraft';
import { useVerificationStore } from '~/modules/auth/stores/verification';
import type { RegisterRequest } from '~/modules/auth/types';
import { useApiFormError } from '~/composables/useApiFormError';

/**
 * "Already has an account" errors, shown under the field they are about (the API sends both
 * the current *_IN_USE and the older *_ALREADY_EXISTS codes).
 */
const CONFLICT_FIELDS = {
  PHONE_IN_USE: 'phone',
  PHONE_ALREADY_EXISTS: 'phone',
  EMAIL_IN_USE: 'email',
  EMAIL_ALREADY_EXISTS: 'email',
  NATIONAL_ID_IN_USE: 'nationalId',
  NATIONAL_ID_ALREADY_EXISTS: 'nationalId',
};

/** Registration step 1: creates the account, then continues to OTP verification (step 2). */
export function useRegisterForm() {
  const { t } = useI18n();
  const localePath = useLocalePath();
  const verification = useVerificationStore();
  const registerDraft = useRegisterDraftStore();
  const service = useAuthService();

  const schema = createRegisterSchema(t);
  const { handleSubmit, values } = useForm<RegisterFormValues>({
    validationSchema: toTypedSchema(schema),
    // Back from "Change registration details": the earlier entries, passwords left empty
    initialValues: {
      fullName: '',
      nationalId: '',
      phone: '',
      email: '',
      ...registerDraft.draft,
      password: '',
      confirmPassword: '',
    },
  });
  // Submit stays disabled until required fields are filled (project rule)
  const canSubmit = useCanSubmit(schema, values);
  const { showError, formError, clearFormError } = useApiFormError(values);

  const register = useMutation({
    mutationFn: (body: RegisterRequest) => service.register(body),
  });

  const onSubmit = handleSubmit(async (values, { setErrors }) => {
    clearFormError();
    try {
      const { token } = await register.mutateAsync({
        fullName: values.fullName,
        nationalId: values.nationalId,
        phone: values.phone,
        email: values.email || null,
        password: values.password,
      });
      const { fullName, nationalId, phone, email } = values;
      registerDraft.save({ fullName, nationalId, phone, email });
      verification.start({ token, phone, source: 'register' });
      await navigateTo(localePath(paths.auth.verify));
    } catch (error) {
      showError(error, setErrors, CONFLICT_FIELDS);
    }
  }, focusFirstInvalidField);

  return { onSubmit, canSubmit, formError, isPending: register.isPending };
}
