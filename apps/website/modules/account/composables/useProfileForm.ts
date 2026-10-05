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
import type { AvatarPick } from '~/modules/account/composables/useAvatarUpload';
import type { CustomerProfile, UpdateProfileRequest } from '~/modules/account/types';
import { useAuthStore } from '~/stores/auth';
import { focusFirstInvalidField } from '~/utils/focus';

/** The API keeps one `fullName`: the first word is the first name, the rest the last name */
export const splitName = (fullName = '') => {
  const [first = '', ...rest] = fullName.trim().split(/\s+/);
  return { firstName: first, lastName: rest.join(' ') };
};

const toValues = (profile?: CustomerProfile): ProfileFormValues => ({
  ...splitName(profile?.fullName),
  nationalId: profile?.nationalId ?? '',
});

/**
 * Edits the user details: name, national ID and photo. "Save details" sends one profile
 * update with only what changed; a newly picked photo is uploaded first and its URL goes
 * in that same update. The response replaces the cached profile, so the sidebar and the
 * header show the result without refetching.
 */
export function useProfileForm(profile: Ref<CustomerProfile | undefined>, photo: AvatarPick) {
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
    const body: UpdateProfileRequest = {};
    const fullName = `${values.firstName ?? ''} ${values.lastName ?? ''}`
      .trim()
      .replace(/\s+/g, ' ');
    if (fullName !== (profile.value?.fullName ?? '').trim()) body.fullName = fullName;
    const nationalId = String(values.nationalId ?? '').trim();
    if (nationalId !== (profile.value?.nationalId ?? '')) body.nationalId = nationalId;
    return body;
  });
  const hasChanges = computed(
    () => Object.keys(changes.value).length > 0 || Boolean(photo.file.value)
  );
  const filled = useCanSubmit(schema, values);
  const { showError, formError, clearFormError } = useApiFormError(values);

  const save = useMutation({
    mutationFn: async (body: UpdateProfileRequest) => {
      const file = photo.file.value;
      return service.updateProfile(
        file ? { ...body, avatar: await service.uploadImage(file) } : body
      );
    },
    onSuccess: (updated) => {
      if (updated.avatar && photo.file.value) photo.saved(updated.avatar);
      queryClient.setQueryData(queryKeys.account.profile(), updated);
      authStore.setUser(updated);
      notify('success', { title: t('auth.successTitle'), body: t('account.details.saved') });
    },
  });

  const onSubmit = handleSubmit(async (_values, { setErrors }) => {
    if (!hasChanges.value) return;
    clearFormError();
    try {
      await save.mutateAsync(changes.value);
    } catch (error) {
      // The API names the joined field; show its errors under the first name
      showError(error, (errors) =>
        setErrors({ ...errors, firstName: errors.fullName ?? errors.firstName })
      );
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
