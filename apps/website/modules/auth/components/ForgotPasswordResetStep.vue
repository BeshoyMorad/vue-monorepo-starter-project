<script setup lang="ts">
  import { Field } from '@workspace/ui';
  import { useResetPasswordForm } from '~/modules/auth/composables/useForgotPasswordForms';
  import AuthCard from './AuthCard.vue';
  import AuthIconTile from './AuthIconTile.vue';
  import AuthStepBadge from './AuthStepBadge.vue';
  import AuthSubmitButton from './AuthSubmitButton.vue';

  /** Password reset step 3 of 3: choose the new password (the code was verified in step 2). */
  const props = defineProps<{ resetToken: string }>();
  const emit = defineEmits<{ expired: [] }>();

  const { t } = useI18n();
  const { onSubmit, canSubmit, isPending } = useResetPasswordForm(toRef(props, 'resetToken'), () =>
    emit('expired')
  );
</script>

<template>
  <AuthCard accent>
    <form class="space-y-5 p-6 sm:p-8" method="post" novalidate @submit="onSubmit">
      <div class="flex items-center gap-3">
        <AuthIconTile icon="hugeicons--password-validation" />
        <AuthStepBadge :current="3" :total="3" />
      </div>

      <div class="space-y-2">
        <h1 class="text-primary-500 text-[26.4px] leading-[33px] font-extrabold tracking-[-0.66px]">
          {{ t('auth.forgot.resetTitle') }}
        </h1>
        <p class="text-[oklch(0.45_0_0)]">{{ t('auth.forgot.resetSubtitle') }}</p>
      </div>

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
    </form>
  </AuthCard>
</template>
