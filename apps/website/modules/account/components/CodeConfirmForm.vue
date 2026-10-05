<script setup lang="ts">
  import InputOtp from '@workspace/ui/form/input-otp/InputOtp.vue';
  import AuthFormError from '~/modules/auth/components/AuthFormError.vue';
  import AuthSubmitButton from '~/modules/auth/components/AuthSubmitButton.vue';
  import ResendCode from '~/modules/auth/components/ResendCode.vue';
  import { useCodeConfirm } from '~/modules/account/composables/useCodeConfirm';
  import type { ConfirmChangeRequest } from '~/modules/account/types';

  /** Step 2 of a change: the 6-digit code (sent once complete) and "resend code" */
  const props = defineProps<{
    testId: string;
    token: string;
    /** "Enter the code sent to …" */
    text: string;
    submitLabel: string;
    backLabel: string;
    confirm: (body: ConfirmChangeRequest) => Promise<unknown>;
    resend: () => Promise<string>;
    onConfirmed: () => void | Promise<void>;
  }>();
  const emit = defineEmits<{ back: [] }>();

  const { t } = useI18n();
  const { onSubmit, canSubmit, formError, isPending, resend, resendIn, canResend } = useCodeConfirm(
    {
      token: toRef(props, 'token'),
      confirm: props.confirm,
      resend: props.resend,
      onConfirmed: props.onConfirmed,
    }
  );
</script>

<template>
  <form class="space-y-5" method="post" novalidate @submit="onSubmit">
    <p class="text-sm leading-[22px] text-[oklch(0.45_0_0)]">{{ text }}</p>
    <InputOtp
      name="otp"
      :test-id="`${testId}-otp`"
      :length="6"
      integer-only
      :label="t('auth.fields.otp.label')"
      validate-on-submit-only
      aria-required="true"
      container-class="auth-otp"
      dir="ltr"
    />
    <AuthSubmitButton :test-id="`${testId}-confirm`" :loading="isPending" :disabled="!canSubmit">
      {{ submitLabel }}
    </AuthSubmitButton>
    <AuthFormError :test-id="`${testId}-error`" :message="formError" />
    <ResendCode
      :test-id="`${testId}-resend`"
      :remaining="resendIn"
      :can-resend="canResend"
      @resend="resend"
    />
    <button
      type="button"
      class="text-gold-800 hover:text-gold-900 block rounded-md text-sm font-semibold hover:underline"
      @click="emit('back')"
    >
      {{ backLabel }}
    </button>
  </form>
</template>
