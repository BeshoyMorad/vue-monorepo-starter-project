<script setup lang="ts">
  import { Field } from '@workspace/ui';
  import { useResetPasswordForm } from '~/modules/auth/composables/useForgotPasswordForms';
  import AuthCard from './AuthCard.vue';
  import AuthCardHeader from './AuthCardHeader.vue';
  import AuthFormError from './AuthFormError.vue';
  import AuthSubmitButton from './AuthSubmitButton.vue';

  /** Password reset step 3 of 3: choose the new password (the code was verified in step 2). */
  const props = defineProps<{ resetToken: string }>();
  const emit = defineEmits<{ expired: [] }>();

  const { t } = useI18n();
  const { onSubmit, canSubmit, formError, isPending } = useResetPasswordForm(
    toRef(props, 'resetToken'),
    () => emit('expired')
  );
</script>

<template>
  <AuthCard accent>
    <form class="space-y-5 p-6 sm:p-8" method="post" novalidate @submit="onSubmit">
      <AuthCardHeader
        icon="hugeicons--password-validation"
        :title="t('auth.forgot.resetTitle')"
        :step="{ current: 3, total: 3, label: t('auth.forgot.stepReset') }"
      >
        <p>{{ t('auth.forgot.resetSubtitle') }}</p>
      </AuthCardHeader>

      <Field.Password
        name="newPassword"
        test-id="reset-new-password"
        icon="hugeicons--square-lock-02"
        autocomplete="new-password"
        :label="t('auth.fields.newPassword.label')"
        container-class="auth-field field-required"
      />
      <Field.Password
        name="confirmPassword"
        test-id="reset-confirm-password"
        icon="hugeicons--square-lock-02"
        autocomplete="new-password"
        :label="t('auth.fields.confirmPassword.label')"
        container-class="auth-field field-required"
      />

      <AuthSubmitButton test-id="reset-submit" :loading="isPending" :disabled="!canSubmit">
        {{ t('auth.forgot.resetSubmit') }}
      </AuthSubmitButton>
      <AuthFormError test-id="reset-error" :message="formError" />
    </form>
  </AuthCard>
</template>
