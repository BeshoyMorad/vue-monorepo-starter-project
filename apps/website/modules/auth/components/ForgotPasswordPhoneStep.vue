<script setup lang="ts">
  import { Icon } from '@workspace/ui';
  import { paths } from '~/router/paths';
  import { useForgotPasswordPhoneForm } from '~/modules/auth/composables/useForgotPasswordForms';
  import AuthCard from './AuthCard.vue';
  import SaudiPhoneField from './SaudiPhoneField.vue';
  import AuthIconTile from './AuthIconTile.vue';
  import AuthPrompt from './AuthPrompt.vue';
  import AuthStepBadge from './AuthStepBadge.vue';
  import AuthSubmitButton from './AuthSubmitButton.vue';

  const emit = defineEmits<{ sent: [phone: string, token: string] }>();

  const { t } = useI18n();
  const localePath = useLocalePath();
  const { onSubmit, canSubmit, isPending } = useForgotPasswordPhoneForm((phone, token) =>
    emit('sent', phone, token)
  );
</script>

<template>
  <AuthCard accent>
    <form class="space-y-5 p-6 sm:p-8" method="post" novalidate @submit="onSubmit">
      <div class="flex items-center gap-3">
        <AuthIconTile icon="hugeicons--reset-password" />
        <AuthStepBadge :current="1" :total="2" />
      </div>

      <h1 class="text-primary-500 text-[26.4px] leading-[33px] font-extrabold tracking-[-0.66px]">
        {{ t('auth.forgot.title') }}
      </h1>

      <SaudiPhoneField
        name="phone"
        test-id="forgot-phone"
        :label="t('auth.fields.phone.label')"
        :description="t('auth.fields.phone.hint')"
        :placeholder="t('auth.fields.phone.placeholder')"
        container-class="field-required"
      />

      <p class="text-text-placeholder flex items-start gap-2 text-sm">
        <Icon icon="hugeicons--smart-phone-01" class="mt-0.5 size-4 shrink-0" />
        {{ t('auth.forgot.notice') }}
      </p>

      <AuthSubmitButton test-id="forgot-submit" :loading="isPending" :disabled="!canSubmit">
        {{ t('auth.forgot.submit') }}
      </AuthSubmitButton>

      <AuthPrompt
        test-id="forgot-back-link"
        :link-text="t('auth.forgot.back')"
        :to="localePath(paths.auth.login)"
      />
    </form>
  </AuthCard>
</template>
