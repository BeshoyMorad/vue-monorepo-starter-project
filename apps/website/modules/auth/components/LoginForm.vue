<script setup lang="ts">
  import { Field } from '@workspace/ui';
  import { paths } from '~/router/paths';
  import { useLoginForm } from '~/modules/auth/composables/useLoginForm';
  import AuthCard from './AuthCard.vue';
  import SaudiPhoneField from './SaudiPhoneField.vue';
  import AuthFormError from './AuthFormError.vue';
  import AuthPrompt from './AuthPrompt.vue';
  import AuthSubmitButton from './AuthSubmitButton.vue';

  const { t } = useI18n();
  const localePath = useLocalePath();
  const { onSubmit, canSubmit, formError, isPending } = useLoginForm();
</script>

<template>
  <AuthCard accent>
    <form class="space-y-5 p-6 sm:p-8" method="post" novalidate @submit="onSubmit">
      <h1 class="text-primary-500 text-[26.4px] leading-[33px] font-extrabold tracking-[-0.66px]">
        {{ t('auth.login.title') }}
      </h1>

      <SaudiPhoneField
        name="identifier"
        test-id="login-phone"
        :label="t('auth.fields.phone.label')"
        :description="t('auth.fields.phone.hint')"
        :placeholder="t('auth.fields.phone.placeholder')"
        required
        container-class="field-required"
      />

      <Field.Password
        :toggle-label="t('auth.a11y.showPassword')"
        name="password"
        test-id="login-password"
        icon="hugeicons--square-lock-02"
        autocomplete="current-password"
        :label="t('auth.fields.password.label')"
        :placeholder="t('auth.fields.password.placeholder')"
        aria-required="true"
        container-class="auth-field field-required"
      />

      <div class="flex items-center justify-between gap-4">
        <Field.Checkbox
          name="remember"
          test-id="login-remember"
          shape="circle"
          size="small"
          container-class="auth-check"
          :label="t('auth.login.remember')"
        />
        <NuxtLink
          :to="localePath(paths.auth.forgotPassword)"
          data-test-id="login-forgot-link"
          class="text-gold-800 hover:text-gold-900 shrink-0 rounded-md text-sm font-semibold hover:underline"
        >
          {{ t('auth.login.forgot') }}
        </NuxtLink>
      </div>

      <AuthSubmitButton test-id="login-submit" :loading="isPending" :disabled="!canSubmit">
        {{ t('auth.login.submit') }}
      </AuthSubmitButton>
      <AuthFormError test-id="login-error" :message="formError" />

      <AuthPrompt
        test-id="login-register-link"
        :text="t('auth.login.noAccount')"
        :link-text="t('auth.login.createAccount')"
        :to="localePath(paths.auth.register)"
      />
    </form>
  </AuthCard>
</template>
