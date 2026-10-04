<script setup lang="ts">
  // Direct imports: the `Field` object from '@workspace/ui' bundles every form field
  // (phone library, date picker, image cropper…) even when only one is used
  import InputCheckbox from '@workspace/ui/form/checkbox/Checkbox.vue';
  import InputPassword from '@workspace/ui/form/input-password/InputPassword.vue';
  import { paths } from '~/router/paths';
  import { useLoginForm } from '~/modules/auth/composables/useLoginForm';
  import SaudiPhoneField from './SaudiPhoneField.vue';
  import AuthFormError from './AuthFormError.vue';
  import AuthPrompt from './AuthPrompt.vue';
  import AuthSubmitButton from './AuthSubmitButton.vue';

  const { t } = useI18n();
  const localePath = useLocalePath();
  const { onSubmit, canSubmit, formError, isPending } = useLoginForm();
</script>

<template>
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

    <InputPassword
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
      <InputCheckbox
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
</template>
