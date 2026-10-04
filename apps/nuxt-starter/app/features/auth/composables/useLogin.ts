import { toTypedSchema } from '@vee-validate/yup';
import { useForm } from 'vee-validate';
import { schema } from '@/features/auth/schemas/login.schema';
import type { LoginForm } from '@/features/auth/types';
import { useLoginMutation } from '@/features/auth/composables/useLoginMutation';

export default function useLogin() {
  const validationSchema = toTypedSchema(schema);

  const { handleSubmit } = useForm<LoginForm>({
    validationSchema,
    initialValues: {
      identifier: '',
      password: '',
      remember: false,
    },
  });

  const { mutateAsync, isPending, isSuccess } = useLoginMutation();

  const onSubmit = handleSubmit((values, ctx) => {
    mutateAsync({ values, ctx });
  });

  return {
    onSubmit,
    isPending,
    isSuccess,
  };
}
