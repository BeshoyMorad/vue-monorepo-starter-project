<script setup lang="ts">
  import { Field } from '@workspace/ui';
  import { useResetCodeForm } from '~/modules/auth/composables/useForgotPasswordForms';
  import AuthCard from './AuthCard.vue';
  import AuthIconTile from './AuthIconTile.vue';
  import AuthStepBadge from './AuthStepBadge.vue';
  import AuthSubmitButton from './AuthSubmitButton.vue';
  import ResendCode from './ResendCode.vue';

  /** Password reset step 2 of 3: verify the code sent to the phone. */
  const props = defineProps<{ phone: string; codeSentAt?: number }>();
  /** Reset session token; replaced when a new code is requested. */
  const token = defineModel<string>('token', { required: true });
  const emit = defineEmits<{ verified: [resetToken: string]; back: [] }>();

  const { t } = useI18n();
  const { onSubmit, canSubmit, validateOtp, isPending, resend, resendIn, canResend } =
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
      <div class="flex items-center gap-3">
        <AuthIconTile icon="hugeicons--sms-code" />
        <AuthStepBadge :current="2" :total="3" />
      </div>

      <div class="space-y-2">
        <h1 class="text-primary-500 text-[26.4px] leading-[33px] font-extrabold tracking-[-0.66px]">
          {{ t('auth.forgot.codeTitle') }}
        </h1>
        <p class="text-[oklch(0.45_0_0)]">
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
      </div>

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

      <ResendCode
        test-id="reset-resend"
        :remaining="resendIn"
        :can-resend="canResend"
        @resend="resend"
      />
    </form>
  </AuthCard>
</template>
