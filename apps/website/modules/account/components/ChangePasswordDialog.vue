<script setup lang="ts">
  import { notify } from '@workspace/core/utils/toast';
  import Icon from '@workspace/ui/icon/Icon.vue';
  import { Dialog, DialogDescription, DialogTitle } from '@workspace/ui/ui/dialog';
  import { useAuthService } from '~/modules/auth/services';
  import type { ContactChannel, CustomerProfile } from '~/modules/account/types';
  import CodeConfirmForm from './CodeConfirmForm.vue';
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
    <ol class="stepper">
      <li
        v-for="(name, index) in STEPS"
        :key="name"
        class="stepper__item"
        :class="{ 'stepper__item--on': index === step, 'stepper__item--done': index < step }"
        :aria-current="index === step ? 'step' : undefined"
      >
        <span class="stepper__dot">
          <Icon v-if="index < step" icon="hugeicons--tick-02" class="size-3.5" />
          <template v-else>{{ index + 1 }}</template>
        </span>
        <span class="stepper__label">{{ t(`account.password.steps.${name}`) }}</span>
      </li>
    </ol>

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
  </Dialog>
</template>

<style scoped>
  .stepper {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    margin-bottom: 20px;
  }
  .stepper__item {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 6px;
    color: oklch(0.45 0 0);
    font: 500 12px/16px var(--font);
  }
  /* Connector to the next step */
  .stepper__item:not(:last-child)::after {
    content: '';
    position: absolute;
    top: 14px;
    inset-inline-start: calc(50% + 20px);
    width: calc(100% - 40px);
    height: 1px;
    background: #e5e7eb;
  }
  .stepper__item--done:not(:last-child)::after {
    background: var(--color-primary-300);
  }
  .stepper__dot {
    width: 28px;
    height: 28px;
    display: grid;
    place-items: center;
    border: 1px solid #e5e7eb;
    border-radius: 50%;
    background: #f3f4f6;
    font-weight: 600;
  }
  .stepper__item--on {
    color: var(--color-primary-500);
    font-weight: 600;
  }
  .stepper__item--on .stepper__dot {
    border-color: var(--color-primary-500);
    background: var(--color-primary-500);
    box-shadow: 0 0 0 3px var(--color-primary-100);
    color: #fff;
  }
  .stepper__item--done .stepper__dot {
    border-color: var(--color-primary-300);
    background: var(--color-primary-50);
    color: var(--color-primary-500);
  }
</style>
