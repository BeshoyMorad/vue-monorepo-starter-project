<script setup lang="ts">
  import { Field } from '@workspace/ui';
  import { useResetPasswordForm } from '~/modules/auth/composables/useForgotPasswordForms';
  import AuthCard from './AuthCard.vue';
  import AuthIconTile from './AuthIconTile.vue';
  import AuthStepBadge from './AuthStepBadge.vue';
  import AuthSubmitButton from './AuthSubmitButton.vue';
  import ResendCode from './ResendCode.vue';

  const props = defineProps<{ phone: string }>();
  /** Reset session token; replaced when a new code is requested. */
  const token = defineModel<string>('token', { required: true });
  defineEmits<{ back: [] }>();

  const { t } = useI18n();
  const { onSubmit, isPending, resend, resendIn, canResend } = useResetPasswordForm({
    phone: toRef(props, 'phone'),
    token,
  });

  const phoneLabel = computed(() => `⁦${props.phone}⁩`);
</script>

<template>
  <AuthCard accent>
    <form class="space-y-5 p-6 sm:p-8" method="post" novalidate @submit="onSubmit">
      <div class="flex items-center gap-3">
        <AuthIconTile icon="hugeicons--password-validation" />
        <AuthStepBadge :current="2" :total="2" />
      </div>

      <div class="space-y-2">
        <h1 class="text-primary-500 text-[26.4px] leading-[33px] font-extrabold tracking-[-0.66px]">
          {{ t('auth.forgot.resetTitle') }}
        </h1>
        <p class="text-text-placeholder">
          {{ t('auth.forgot.resetSubtitle', { phone: phoneLabel }) }}
          <button
            type="button"
            data-test-id="reset-change-number"
            class="text-gold-600 hover:text-gold-700 cursor-pointer font-semibold"
            @click="$emit('back')"
          >
            {{ t('auth.forgot.changeNumber') }}
          </button>
        </p>
      </div>

      <Field.Otp
        name="otp"
        test-id="reset-otp"
        :length="6"
        integer-only
        :label="t('auth.fields.otp.label')"
        container-class="field-required flex flex-col items-center"
        dir="ltr"
      />

      <ResendCode
        test-id="reset-resend"
        :remaining="resendIn"
        :can-resend="canResend"
        @resend="resend"
      />

      <Field.Password
        name="newPassword"
        test-id="reset-new-password"
        autocomplete="new-password"
        :label="t('auth.fields.newPassword.label')"
        container-class="auth-field field-required"
      />
      <Field.Password
        name="confirmPassword"
        test-id="reset-confirm-password"
        autocomplete="new-password"
        :label="t('auth.fields.confirmPassword.label')"
        container-class="auth-field field-required"
      />

      <AuthSubmitButton test-id="reset-submit" :loading="isPending">
        {{ t('auth.forgot.resetSubmit') }}
      </AuthSubmitButton>
    </form>
  </AuthCard>
</template>
