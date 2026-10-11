<script setup lang="ts">
  import { notify } from '@workspace/core/utils/toast';
  import { Dialog, DialogDescription, DialogTitle } from '@workspace/ui/ui/dialog';
  import { useAuthService } from '~/modules/auth/services';
  import { DIALOG_STEP_TRANSITION } from '~/modules/account/constants';
  import type { ContactChannel, CustomerProfile } from '~/modules/account/types';
  import CodeConfirmForm from './CodeConfirmForm.vue';
  import DialogStepper from './DialogStepper.vue';
  import NewPasswordForm from './NewPasswordForm.vue';
  import PasswordChannelStep from './PasswordChannelStep.vue';

  /**
   * "Change password" in three steps, as on ibbil.com: choose phone or email → enter the
   * code sent there → set the new password. Uses the password-reset endpoints with the
   * signed-in user's own phone or email.
   */
  const props = defineProps<{ profile?: CustomerProfile }>();
  const open = defineModel<boolean>('open', { default: false });

  const { t } = useI18n();
  const auth = useAuthService();
  const STEPS = ['verify', 'code', 'password'] as const;
  const step = ref(0);
  const sent = ref<{ token: string; channel: ContactChannel; target: string } | null>(null);
  const resetToken = ref('');

  watch(open, (isOpen) => {
    if (!isOpen) {
      step.value = 0;
      sent.value = null;
      resetToken.value = '';
    }
  });

  const onSent = (value: NonNullable<typeof sent.value>) => {
    sent.value = value;
    step.value = 1;
  };
  // Step 2 returns the token that allows setting the new password
  const confirmCode = async (body: { token: string; otp: string }) => {
    resetToken.value = (await auth.verifyResetOtp(body)).token;
  };
  const resend = async () => {
    const identifier =
      sent.value?.channel === 'email' ? props.profile?.email : props.profile?.phone;
    return (await auth.forgotPassword(identifier ?? '', sent.value?.channel)).token;
  };
  const toPasswordStep = () => {
    step.value = 2;
  };
  const onDone = () => {
    open.value = false;
    notify('success', { title: t('auth.successTitle'), body: t('account.password.changed') });
  };
</script>

<template>
  <Dialog v-model:open="open" content-class="site-ui auth-ui font-brand sm:max-w-lg">
    <!-- The stepper shows the progress; screen readers get it as the dialog description -->
    <template #header>
      <DialogTitle class="text-primary-500 text-lg font-bold">
        {{ t('account.password.title') }}
      </DialogTitle>
      <DialogDescription class="sr-only">
        {{
          t('account.password.progress', {
            n: step + 1,
            name: t(`account.password.steps.${STEPS[step]}`),
          })
        }}
      </DialogDescription>
    </template>
    <DialogStepper
      :steps="STEPS.map((name) => t(`account.password.steps.${name}`))"
      :current="step"
    />

    <Transition v-bind="DIALOG_STEP_TRANSITION">
      <PasswordChannelStep
        v-if="step === 0"
        :profile="profile"
        @sent="onSent"
        @cancel="open = false"
      />
      <CodeConfirmForm
        v-else-if="step === 1 && sent"
        test-id="password-code"
        :token="sent.token"
        :text="t('account.password.codeSent', { target: `⁦${sent.target}⁩` })"
        :submit-label="t('account.password.verifyCode')"
        :back-label="t('account.password.back')"
        :confirm="confirmCode"
        :resend="resend"
        :on-confirmed="toPasswordStep"
        @back="step = 0"
      />
      <NewPasswordForm v-else-if="step === 2" :token="resetToken" @done="onDone" />
    </Transition>
  </Dialog>
</template>
