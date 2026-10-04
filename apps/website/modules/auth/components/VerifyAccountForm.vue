<script setup lang="ts">
  import { Field } from '@workspace/ui';
  import { paths } from '~/router/paths';
  import { useVerifyAccountForm } from '~/modules/auth/composables/useVerifyAccountForm';
  import AuthCard from './AuthCard.vue';
  import AuthCardHeader from './AuthCardHeader.vue';
  import AuthFormError from './AuthFormError.vue';
  import AuthBackLink from './AuthBackLink.vue';
  import AuthSubmitButton from './AuthSubmitButton.vue';
  import ResendCode from './ResendCode.vue';

  const { t } = useI18n();
  const localePath = useLocalePath();
  const { pending, onSubmit, canSubmit, formError, isPending, resend, resendIn, canResend } =
    useVerifyAccountForm();

  // Keep "+9665…" left-to-right inside Arabic text
  const phone = computed(() => `⁦${pending.value?.phone ?? ''}⁩`);
</script>

<template>
  <AuthCard accent>
    <form class="space-y-6 p-6 sm:p-8" method="post" novalidate @submit="onSubmit">
      <!-- The step progress only makes sense when coming from registration -->
      <AuthCardHeader
        icon="hugeicons--sms-code"
        :title="t('auth.verify.title')"
        :step="
          pending?.source === 'register'
            ? { current: 2, total: 2, label: t('auth.verify.stepLabel') }
            : undefined
        "
      >
        <p v-if="pending?.source === 'login'" class="text-gold-800 text-sm">
          {{ t('auth.verify.notVerified') }}
        </p>
        <p>{{ t('auth.verify.subtitle', { phone }) }}</p>
      </AuthCardHeader>

      <!-- Errors only on submit, never while typing; the code submits itself once complete
           (typed, pasted or filled from the SMS; see useOtpForm) -->
      <Field.Otp
        name="otp"
        test-id="verify-otp"
        :length="6"
        integer-only
        :label="t('auth.fields.otp.label')"
        validate-on-submit-only
        aria-required="true"
        container-class="auth-otp"
        dir="ltr"
      />

      <AuthSubmitButton test-id="verify-submit" :loading="isPending" :disabled="!canSubmit">
        {{ t('auth.verify.submit') }}
      </AuthSubmitButton>
      <AuthFormError test-id="verify-error" :message="formError" />

      <ResendCode
        test-id="verify-resend"
        :remaining="resendIn"
        :can-resend="canResend"
        @resend="resend"
      />

      <!-- From registration: back to the (still filled-in) form; from login: back to sign in -->
      <AuthBackLink
        v-if="pending?.source === 'register'"
        test-id="verify-change-details"
        :to="localePath(paths.auth.register)"
      >
        {{ t('auth.verify.changeDetails') }}
      </AuthBackLink>
      <AuthBackLink v-else test-id="verify-back-link" :to="localePath(paths.auth.login)">
        {{ t('auth.verify.back') }}
      </AuthBackLink>
    </form>
  </AuthCard>
</template>
