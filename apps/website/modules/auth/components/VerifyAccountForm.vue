<script setup lang="ts">
  import { Field } from '@workspace/ui';
  import { paths } from '~/router/paths';
  import { useVerifyAccountForm } from '~/modules/auth/composables/useVerifyAccountForm';
  import AuthCard from './AuthCard.vue';
  import AuthIconTile from './AuthIconTile.vue';
  import AuthPrompt from './AuthPrompt.vue';
  import AuthStepBadge from './AuthStepBadge.vue';
  import AuthSubmitButton from './AuthSubmitButton.vue';
  import ResendCode from './ResendCode.vue';

  const { t } = useI18n();
  const localePath = useLocalePath();
  const { pending, onSubmit, canSubmit, isPending, resend, resendIn, canResend } =
    useVerifyAccountForm();

  // Keep "+9665…" left-to-right inside Arabic text
  const phone = computed(() => `⁦${pending.value?.phone ?? ''}⁩`);
</script>

<template>
  <AuthCard accent>
    <form class="space-y-6 p-6 sm:p-8" method="post" novalidate @submit="onSubmit">
      <div class="flex items-center gap-3">
        <AuthIconTile icon="hugeicons--sms-code" />
        <AuthStepBadge
          v-if="pending?.source === 'register'"
          :current="2"
          :total="2"
          :label="t('auth.verify.stepLabel')"
        />
      </div>

      <div class="space-y-2">
        <h1 class="text-primary-500 text-[26.4px] leading-[33px] font-extrabold tracking-[-0.66px]">
          {{ t('auth.verify.title') }}
        </h1>
        <p v-if="pending?.source === 'login'" class="text-gold-700 text-sm">
          {{ t('auth.verify.notVerified') }}
        </p>
        <p class="text-text-placeholder">{{ t('auth.verify.subtitle', { phone }) }}</p>
      </div>

      <Field.Otp
        name="otp"
        test-id="verify-otp"
        :length="6"
        integer-only
        :label="t('auth.fields.otp.label')"
        container-class="[&_[data-slot=form-label]]:sr-only flex flex-col items-center"
        dir="ltr"
      />

      <AuthSubmitButton test-id="verify-submit" :loading="isPending" :disabled="!canSubmit">
        {{ t('auth.verify.submit') }}
      </AuthSubmitButton>

      <ResendCode
        test-id="verify-resend"
        :remaining="resendIn"
        :can-resend="canResend"
        @resend="resend"
      />

      <AuthPrompt
        test-id="verify-back-link"
        :link-text="t('auth.verify.back')"
        :to="localePath(paths.auth.login)"
      />
    </form>
  </AuthCard>
</template>
