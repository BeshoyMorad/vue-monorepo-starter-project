<script setup lang="ts">
  import ForgotPasswordCodeStep from '~/modules/auth/components/ForgotPasswordCodeStep.vue';
  import ForgotPasswordPhoneStep from '~/modules/auth/components/ForgotPasswordPhoneStep.vue';
  import ForgotPasswordResetStep from '~/modules/auth/components/ForgotPasswordResetStep.vue';
  import { onBeforeRouteLeave } from 'vue-router';
  import { usePasswordResetStore } from '~/modules/auth/stores/passwordReset';

  definePageMeta({ layout: 'auth', guestOnly: true });

  const { t } = useI18n();
  useSeoMeta({ title: () => t('auth.forgot.title') });

  // Step 1: phone → sends a code. Step 2: code → verified reset token. Step 3: new password.
  // The current step lives in a short-lived store, so switching language keeps it.
  const reset = usePasswordResetStore();
  const sessionToken = computed({
    get: () => reset.state?.sessionToken ?? '',
    set: (token: string) => reset.codeResent(token),
  });

  // Leaving the flow (not just switching language) starts it fresh next time
  const getRouteBaseName = useRouteBaseName();
  onBeforeRouteLeave((to, from) => {
    if (getRouteBaseName(to) !== getRouteBaseName(from)) {
      reset.clear();
    }
  });
</script>

<template>
  <ForgotPasswordResetStep
    v-if="reset.state?.resetToken"
    :reset-token="reset.state.resetToken"
    @expired="reset.clear"
  />
  <ForgotPasswordCodeStep
    v-else-if="reset.state"
    v-model:token="sessionToken"
    :phone="reset.state.phone"
    :code-sent-at="reset.state.codeSentAt"
    @verified="reset.codeVerified"
    @back="reset.clear"
  />
  <ForgotPasswordPhoneStep v-else @sent="reset.codeSent" />
</template>
