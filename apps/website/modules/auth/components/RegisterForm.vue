<script setup lang="ts">
  import { Icon } from '@workspace/ui';
  // Direct imports: the `Field` object from '@workspace/ui' bundles every form field
  // (phone library, date picker, image cropper…) even when only one is used
  import InputPassword from '@workspace/ui/form/input-password/InputPassword.vue';
  import InputText from '@workspace/ui/form/input-text/InputText.vue';
  import { paths } from '~/router/paths';
  import { useRegisterForm } from '~/modules/auth/composables/useRegisterForm';
  import SaudiPhoneField from './SaudiPhoneField.vue';
  import AuthCardHeader from './AuthCardHeader.vue';
  import AuthFormError from './AuthFormError.vue';
  import AuthPrompt from './AuthPrompt.vue';
  import AuthSubmitButton from './AuthSubmitButton.vue';

  const { t } = useI18n();
  const localePath = useLocalePath();
  const { onSubmit, canSubmit, formError, isPending } = useRegisterForm();
</script>

<template>
  <div>
    <header class="border-border-disabled border-b p-6 sm:p-8">
      <AuthCardHeader
        icon="hugeicons--user-add-01"
        :title="t('auth.register.title')"
        :step="{ current: 1, total: 2, label: t('auth.register.stepLabel') }"
      >
        <p>{{ t('auth.register.subtitle') }}</p>
      </AuthCardHeader>
    </header>

    <form class="space-y-6 p-6 sm:p-8" method="post" novalidate @submit="onSubmit">
      <section class="space-y-4">
        <h2 class="text-primary-500 flex items-center gap-2 font-bold">
          <span class="bg-sand-100 inline-flex size-7 items-center justify-center rounded-lg">
            <Icon icon="hugeicons--user" class="size-4" />
          </span>
          <span class="icon-label">{{ t('auth.register.personal') }}</span>
        </h2>
        <div class="grid items-start gap-4 sm:grid-cols-2">
          <InputText
            name="fullName"
            test-id="register-full-name"
            autocomplete="name"
            :label="t('auth.fields.fullName.label')"
            :placeholder="t('auth.fields.fullName.placeholder')"
            aria-required="true"
            container-class="auth-field field-required"
          />
          <InputText
            name="nationalId"
            test-id="register-national-id"
            inputmode="numeric"
            maxlength="14"
            :label="t('auth.fields.nationalId.label')"
            :description="t('auth.fields.nationalId.hint')"
            aria-required="true"
            container-class="auth-field field-required"
          />
          <SaudiPhoneField
            name="phone"
            test-id="register-phone"
            :label="t('auth.fields.phone.label')"
            :description="t('auth.fields.phone.hint')"
            :placeholder="t('auth.fields.phone.placeholder')"
            required
            container-class="field-required"
          />
          <InputText
            name="email"
            type="email"
            test-id="register-email"
            autocomplete="email"
            :label="t('auth.fields.email.label')"
            aria-required="true"
            container-class="auth-field field-required"
          />
        </div>
      </section>

      <section class="border-border-disabled space-y-4 border-t pt-6">
        <h2 class="text-primary-500 flex items-center gap-2 font-bold">
          <span class="bg-sand-100 inline-flex size-7 items-center justify-center rounded-lg">
            <Icon icon="hugeicons--square-lock-02" class="size-4" />
          </span>
          <span class="icon-label">{{ t('auth.register.security') }}</span>
        </h2>
        <div class="grid items-start gap-4 sm:grid-cols-2">
          <InputPassword
            :toggle-label="t('auth.a11y.showPassword')"
            name="password"
            test-id="register-password"
            autocomplete="new-password"
            :label="t('auth.fields.password.label')"
            :description="t('auth.fields.password.rules')"
            aria-required="true"
            container-class="auth-field field-required"
          />
          <InputPassword
            :toggle-label="t('auth.a11y.showPassword')"
            name="confirmPassword"
            test-id="register-confirm-password"
            autocomplete="new-password"
            :label="t('auth.fields.confirmPassword.label')"
            aria-required="true"
            container-class="auth-field field-required"
          />
        </div>
      </section>

      <AuthSubmitButton test-id="register-submit" :loading="isPending" :disabled="!canSubmit">
        {{ t('auth.register.submit') }}
      </AuthSubmitButton>
      <AuthFormError test-id="register-error" :message="formError" />

      <AuthPrompt
        test-id="register-login-link"
        :text="t('auth.register.haveAccount')"
        :link-text="t('auth.register.signIn')"
        :to="localePath(paths.auth.login)"
      />
    </form>
  </div>
</template>
