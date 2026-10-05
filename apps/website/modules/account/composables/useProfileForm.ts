import { useMutation, useQueryClient } from '@tanstack/vue-query';
import { toTypedSchema } from '@vee-validate/yup';
import { notify } from '@workspace/core/utils/toast';
import { useForm } from 'vee-validate';
import type { Ref } from 'vue';
import { queryKeys } from '~/api/query-keys';
import { useApiFormError } from '~/composables/useApiFormError';
import { useCanSubmit } from '~/composables/useCanSubmit';
import { createProfileSchema, type ProfileFormValues } from '~/modules/account/schemas';
import { useAccountService } from '~/modules/account/services';
import type { CustomerProfile, UpdateProfileRequest } from '~/modules/account/types';
import { useAuthStore } from '~/stores/auth';
import { focusFirstInvalidField } from '~/utils/focus';

const toValues = (profile?: CustomerProfile): ProfileFormValues => ({
  fullName: profile?.fullName ?? '',
  nationalId: profile?.nationalId ?? '',
  addressLink: profile?.addressLink ?? '',
});

/** Edits name, national ID and address link. Sends only what changed. */
export function useProfileForm(profile: Ref<CustomerProfile | undefined>) {
  const { t } = useI18n();
  const service = useAccountService();
  const queryClient = useQueryClient();
  const authStore = useAuthStore();

  const schema = createProfileSchema(t);
  const { handleSubmit, values, resetForm } = useForm<ProfileFormValues>({
    validationSchema: toTypedSchema(schema),
    initialValues: toValues(profile.value),
  });
  watch(profile, (value) => resetForm({ values: toValues(value) }));

  const changes = computed<UpdateProfileRequest>(() => {
    const saved = toValues(profile.value);
    return Object.fromEntries(
      (Object.keys(saved) as (keyof ProfileFormValues)[])
        .filter((name) => String(values[name] ?? '').trim() !== saved[name])
        .map((name) => [name, String(values[name] ?? '').trim()])
    );
  });
  const hasChanges = computed(() => Object.keys(changes.value).length > 0);
  const filled = useCanSubmit(schema, values);
  const { showError, formError, clearFormError } = useApiFormError(values);

  const save = useMutation({
    mutationFn: (body: UpdateProfileRequest) => service.updateProfile(body),
    onSuccess: (updated) => {
      queryClient.setQueryData(queryKeys.account.profile(), updated);
      authStore.setUser(updated);
      notify('success', { title: t('auth.successTitle'), body: t('account.profile.saved') });
    },
  });

  const onSubmit = handleSubmit(async (_values, { setErrors }) => {
    if (!hasChanges.value) return;
    clearFormError();
    try {
      await save.mutateAsync(changes.value);
    } catch (error) {
      showError(error, setErrors);
    }
  }, focusFirstInvalidField);

  return {
    onSubmit,
    // Submit waits for the required fields (project rule) and for an actual change
    canSubmit: computed(() => filled.value && hasChanges.value),
    hasChanges,
    formError,
    isPending: save.isPending,
  };
}
