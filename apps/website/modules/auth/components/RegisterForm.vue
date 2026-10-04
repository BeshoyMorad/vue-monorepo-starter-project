<script setup lang="ts">
  import { Field, Icon } from '@workspace/ui';
  import { paths } from '~/router/paths';
  import { useRegisterForm } from '~/modules/auth/composables/useRegisterForm';
  import AuthCard from './AuthCard.vue';
  import SaudiPhoneField from './SaudiPhoneField.vue';
  import AuthIconTile from './AuthIconTile.vue';
  import AuthStepBadge from './AuthStepBadge.vue';
  import AuthSubmitButton from './AuthSubmitButton.vue';

  const { t } = useI18n();
  const localePath = useLocalePath();
  const { onSubmit, canSubmit, isPending } = useRegisterForm();
</script>

<template>
  <AuthCard wide>
    <header class="border-border-disabled space-y-5 border-b p-6 sm:p-8">
      <AuthStepBadge :current="1" :total="2" :label="t('auth.register.stepLabel')" />
      <div class="flex items-center gap-4">
        <AuthIconTile icon="hugeicons--user-add-01" />
        <div>
          <h1 class="text-primary-500 text-2xl font-bold">{{ t('auth.register.title') }}</h1>
          <p class="text-text-placeholder mt-1">{{ t('auth.register.subtitle') }}</p>
        </div>
      </div>
    </header>

    <form class="space-y-6 p-6 sm:p-8" method="post" novalidate @submit="onSubmit">
      <section class="space-y-4">
        <h2 class="text-primary-500 flex items-center gap-2 font-bold">
          <span class="bg-sand-100 inline-flex size-7 items-center justify-center rounded-lg">
            <Icon icon="hugeicons--user" class="size-4" />
          </span>
          {{ t('auth.register.personal') }}
        </h2>
        <div class="grid items-start gap-4 sm:grid-cols-2">
          <Field.Text
            name="fullName"
            test-id="register-full-name"
            autocomplete="name"
            :label="t('auth.fields.fullName.label')"
            :placeholder="t('auth.fields.fullName.placeholder')"
            container-class="auth-field field-required"
          />
          <Field.Text
            name="nationalId"
            test-id="register-national-id"
            inputmode="numeric"
            maxlength="14"
            :label="t('auth.fields.nationalId.label')"
            :description="t('auth.fields.nationalId.hint')"
            container-class="auth-field field-required"
          />
          <SaudiPhoneField
            name="phone"
            test-id="register-phone"
            :label="t('auth.fields.phone.label')"
            :description="t('auth.fields.phone.hint')"
            :placeholder="t('auth.fields.phone.placeholder')"
            container-class="field-required"
          />
          <Field.Text
            name="email"
            type="email"
            test-id="register-email"
            autocomplete="email"
            :label="t('auth.fields.email.label')"
            container-class="auth-field field-required"
          />
        </div>
      </section>

      <section class="border-border-disabled space-y-4 border-t pt-6">
        <h2 class="text-primary-500 flex items-center gap-2 font-bold">
          <span
            class="bg-gold-50 text-gold-600 inline-flex size-7 items-center justify-center rounded-lg"
          >
            <Icon icon="hugeicons--square-lock-02" class="size-4" />
          </span>
          {{ t('auth.register.security') }}
        </h2>
        <div class="grid items-start gap-4 sm:grid-cols-2">
          <Field.Password
            name="password"
            test-id="register-password"
            autocomplete="new-password"
            :label="t('auth.fields.password.label')"
            container-class="auth-field field-required"
          />
          <Field.Password
            name="confirmPassword"
            test-id="register-confirm-password"
            autocomplete="new-password"
            :label="t('auth.fields.confirmPassword.label')"
            container-class="auth-field field-required"
          />
        </div>
      </section>

      <AuthSubmitButton test-id="register-submit" :loading="isPending" :disabled="!canSubmit">
        {{ t('auth.register.submit') }}
      </AuthSubmitButton>

      <p class="text-text-placeholder text-center text-sm">
        {{ t('auth.register.haveAccount') }}
        <NuxtLink
          :to="localePath(paths.auth.login)"
          data-test-id="register-login-link"
          class="text-primary-500 font-bold hover:underline"
        >
          {{ t('auth.register.signIn') }}
        </NuxtLink>
      </p>
    </form>
  </AuthCard>
</template>
