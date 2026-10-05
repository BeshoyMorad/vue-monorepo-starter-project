import { useMutation } from '@tanstack/vue-query';
import { toTypedSchema } from '@vee-validate/yup';
import { useForm } from 'vee-validate';
import type { AnyObjectSchema } from 'yup';
import { useApiFormError } from '~/composables/useApiFormError';
import { useCanSubmit } from '~/composables/useCanSubmit';
import type { ChangeTokenResponse } from '~/modules/account/types';
import { focusFirstInvalidField } from '~/utils/focus';

/**
 * Step 1 of a change confirmed by a code: validates the new value and asks the API to send
 * a code. `onSent` gets the token and a function that asks again (for "resend code").
 */
export function useChangeRequestForm<T extends Record<string, string>>(options: {
  schema: AnyObjectSchema;
  initialValues: T;
  request: (values: T) => Promise<ChangeTokenResponse>;
  onSent: (token: string, values: T, again: () => Promise<string>) => void;
  /** Error codes about one field, shown under it, e.g. { CONTACT_IN_USE: 'identifier' } */
  codeFields?: Record<string, string>;
}) {
  const { handleSubmit, values } = useForm<T>({
    validationSchema: toTypedSchema(options.schema),
    initialValues: options.initialValues as never,
  });
  const canSubmit = useCanSubmit(options.schema, values);
  const { showError, formError, clearFormError } = useApiFormError(values);
  const request = useMutation({ mutationFn: options.request });

  const onSubmit = handleSubmit(async (submitted, { setErrors }) => {
    clearFormError();
    const sent = { ...submitted } as T;
    try {
      const { token } = await request.mutateAsync(sent);
      options.onSent(token, sent, async () => (await options.request(sent)).token);
    } catch (error) {
      // The generic form's setErrors is typed per field; field names are strings here
      showError(error, setErrors as (errors: Record<string, string>) => void, options.codeFields);
    }
  }, focusFirstInvalidField);

  return { onSubmit, canSubmit, formError, isPending: request.isPending };
}
