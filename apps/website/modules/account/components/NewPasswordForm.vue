<script setup lang="ts">
  import { useMutation } from '@tanstack/vue-query';
  import { toTypedSchema } from '@vee-validate/yup';
  import InputPassword from '@workspace/ui/form/input-password/InputPassword.vue';
  import { useForm } from 'vee-validate';
  import { useApiFormError } from '~/composables/useApiFormError';
  import { useCanSubmit } from '~/composables/useCanSubmit';
  import AuthFormError from '~/modules/auth/components/AuthFormError.vue';
  import AuthSubmitButton from '~/modules/auth/components/AuthSubmitButton.vue';
  import { createResetPasswordSchema, type ResetPasswordFormValues } from '~/modules/auth/schemas';
  import { useAuthService } from '~/modules/auth/services';
  import { focusFirstInvalidField } from '~/utils/focus';

  /** Step 3 of "change password": the new password, sent with the verified token */
  const props = defineProps<{ token: string }>();
  const emit = defineEmits<{ done: [] }>();

  const { t } = useI18n();
  const auth = useAuthService();
  const schema = createResetPasswordSchema(t);
  const { handleSubmit, values } = useForm<ResetPasswordFormValues>({
    validationSchema: toTypedSchema(schema),
    initialValues: { newPassword: '', confirmPassword: '' },
  });
  const canSubmit = useCanSubmit(schema, values);
  const { showError, formError, clearFormError } = useApiFormError(values);
  const reset = useMutation({
    mutationFn: (newPassword: string) => auth.resetPassword({ newPassword, token: props.token }),
  });

  const onSubmit = handleSubmit(async ({ newPassword }, { setErrors }) => {
    clearFormError();
    try {
      await reset.mutateAsync(newPassword);
      emit('done');
    } catch (error) {
      showError(error, setErrors);
    }
  }, focusFirstInvalidField);
</script>

<template>
  <form class="space-y-5" method="post" novalidate @submit="onSubmit">
    <p class="text-sm leading-[22px] text-[oklch(0.45_0_0)]">
      {{ t('account.password.newPasswordText') }}
    </p>
    <InputPassword
      :toggle-label="t('auth.a11y.showPassword')"
      name="newPassword"
      test-id="password-new"
      icon="hugeicons--square-lock-02"
      autocomplete="new-password"
      :label="t('auth.fields.newPassword.label')"
      :description="t('auth.fields.password.rules')"
      aria-required="true"
      container-class="auth-field field-required"
    />
    <InputPassword
      :toggle-label="t('auth.a11y.showPassword')"
      name="confirmPassword"
      test-id="password-confirm"
      icon="hugeicons--square-lock-02"
      autocomplete="new-password"
      :label="t('auth.fields.confirmPassword.label')"
      aria-required="true"
      container-class="auth-field field-required"
    />
    <AuthSubmitButton
      test-id="password-save"
      :loading="reset.isPending.value"
      :disabled="!canSubmit"
    >
      {{ t('account.password.save') }}
    </AuthSubmitButton>
    <AuthFormError test-id="password-error" :message="formError" />
  </form>
</template>
