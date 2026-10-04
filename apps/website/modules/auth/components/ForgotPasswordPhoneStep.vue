<script setup lang="ts">
  import { Icon } from '@workspace/ui';
  import { paths } from '~/router/paths';
  import { useForgotPasswordPhoneForm } from '~/modules/auth/composables/useForgotPasswordForms';
  import AuthCard from './AuthCard.vue';
  import SaudiPhoneField from './SaudiPhoneField.vue';
  import AuthCardHeader from './AuthCardHeader.vue';
  import AuthFormError from './AuthFormError.vue';
  import AuthPrompt from './AuthPrompt.vue';
  import AuthSubmitButton from './AuthSubmitButton.vue';

  const emit = defineEmits<{ sent: [phone: string, token: string] }>();

  const { t } = useI18n();
  const localePath = useLocalePath();
  const { onSubmit, canSubmit, formError, isPending } = useForgotPasswordPhoneForm((phone, token) =>
    emit('sent', phone, token)
  );
</script>

<template>
  <AuthCard accent>
    <form class="space-y-5 p-6 sm:p-8" method="post" novalidate @submit="onSubmit">
      <AuthCardHeader
        icon="hugeicons--reset-password"
        :title="t('auth.forgot.title')"
        :step="{ current: 1, total: 3, label: t('auth.forgot.stepPhone') }"
      />

      <SaudiPhoneField
        name="phone"
        test-id="forgot-phone"
        :label="t('auth.fields.phone.label')"
        :description="t('auth.fields.phone.hint')"
        :placeholder="t('auth.fields.phone.placeholder')"
        container-class="field-required"
      />

      <!-- items-start + mt-0.5: the icon sits on the first line when the text wraps -->
      <p class="text-text-placeholder flex items-start gap-2 text-sm">
        <Icon icon="hugeicons--smart-phone-01" class="mt-0.5 size-4 shrink-0" />
        <span class="icon-label">{{ t('auth.forgot.notice') }}</span>
      </p>

      <AuthSubmitButton test-id="forgot-submit" :loading="isPending" :disabled="!canSubmit">
        {{ t('auth.forgot.submit') }}
      </AuthSubmitButton>
      <AuthFormError test-id="forgot-error" :message="formError" />

      <AuthPrompt
        test-id="forgot-back-link"
        :link-text="t('auth.forgot.back')"
        :to="localePath(paths.auth.login)"
      />
    </form>
  </AuthCard>
</template>
