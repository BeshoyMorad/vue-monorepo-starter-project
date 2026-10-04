<script setup lang="ts">
  import { Field } from '@workspace/ui';
  import { useResetCodeForm } from '~/modules/auth/composables/useForgotPasswordForms';
  import AuthCard from './AuthCard.vue';
  import AuthCardHeader from './AuthCardHeader.vue';
  import AuthFormError from './AuthFormError.vue';
  import AuthSubmitButton from './AuthSubmitButton.vue';
  import ResendCode from './ResendCode.vue';

  /** Password reset step 2 of 3: verify the code sent to the phone. */
  const props = defineProps<{ phone: string; codeSentAt?: number }>();
  /** Reset session token; replaced when a new code is requested. */
  const token = defineModel<string>('token', { required: true });
  const emit = defineEmits<{ verified: [resetToken: string]; back: [] }>();

  const { t } = useI18n();
  const { onSubmit, canSubmit, formError, validateOtp, isPending, resend, resendIn, canResend } =
    useResetCodeForm(
      { phone: toRef(props, 'phone'), token, codeSentAt: toRef(props, 'codeSentAt') },
      (resetToken) => emit('verified', resetToken)
    );

  // Keep "+9665…" left-to-right inside Arabic text
  const phoneLabel = computed(() => `⁦${props.phone}⁩`);
</script>

<template>
  <AuthCard accent>
    <form class="space-y-6 p-6 sm:p-8" method="post" novalidate @submit="onSubmit">
      <AuthCardHeader
        icon="hugeicons--sms-code"
        :title="t('auth.forgot.codeTitle')"
        :step="{ current: 2, total: 3, label: t('auth.forgot.stepCode') }"
      >
        <p>
          {{ t('auth.forgot.codeSubtitle', { phone: phoneLabel }) }}
          <button
            type="button"
            data-test-id="reset-change-number"
            class="text-gold-600 hover:text-gold-700 cursor-pointer font-semibold"
            @click="$emit('back')"
          >
            {{ t('auth.forgot.changeNumber') }}
          </button>
        </p>
      </AuthCardHeader>

      <!-- focusout bubbles from the hidden code input, so this shows "required" on leave -->
      <div @focusout="validateOtp">
        <Field.Otp
          name="otp"
          test-id="reset-otp"
          :length="6"
          integer-only
          :label="t('auth.fields.otp.label')"
          container-class="auth-otp"
          dir="ltr"
        />
      </div>

      <AuthSubmitButton test-id="reset-code-submit" :loading="isPending" :disabled="!canSubmit">
        {{ t('auth.forgot.codeSubmit') }}
      </AuthSubmitButton>
      <AuthFormError test-id="reset-code-error" :message="formError" />

      <ResendCode
        test-id="reset-resend"
        :remaining="resendIn"
        :can-resend="canResend"
        @resend="resend"
      />
    </form>
  </AuthCard>
</template>
