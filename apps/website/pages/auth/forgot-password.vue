<script setup lang="ts">
  import { AUTH_STEP_TRANSITION, AUTH_TRANSITION } from '~/constants/auth';
  import ForgotPasswordCodeStep from '~/modules/auth/components/ForgotPasswordCodeStep.vue';
  import ForgotPasswordPhoneStep from '~/modules/auth/components/ForgotPasswordPhoneStep.vue';
  import ForgotPasswordResetStep from '~/modules/auth/components/ForgotPasswordResetStep.vue';
  import { onBeforeRouteLeave } from 'vue-router';
  import { usePasswordResetStore } from '~/modules/auth/stores/passwordReset';

  definePageMeta({ layout: 'auth', guestOnly: true, pageTransition: AUTH_TRANSITION });

  const { t } = useI18n();

  // Step 1: phone → sends a code. Step 2: code → verified reset token. Step 3: new password.
  // The current step lives in a short-lived store, so switching language keeps it.
  const reset = usePasswordResetStore();

  // The steps share one URL, so the title names the current one (screen readers announce it)
  const step = computed(() =>
    reset.state?.resetToken
      ? { current: 3, title: 'auth.forgot.resetTitle' }
      : reset.state
        ? { current: 2, title: 'auth.forgot.codeTitle' }
        : { current: 1, title: 'auth.forgot.title' }
  );
  useSeoMeta({
    title: () =>
      t('auth.a11y.stepTitle', {
        title: t(step.value.title),
        current: step.value.current,
        total: 3,
      }),
  });
  const sessionToken = computed({
    get: () => reset.state?.sessionToken ?? '',
    set: (token: string) => reset.codeResent(token),
  });

  // Steps animate like the auth pages (AUTH_STEP_TRANSITION). The template keeps one
  // element root (no comments beside it either), which Nuxt page transitions require.

  // Leaving the flow (not just switching language) starts it fresh next time
  const getRouteBaseName = useRouteBaseName();
  onBeforeRouteLeave((to, from) => {
    if (getRouteBaseName(to) !== getRouteBaseName(from)) {
      reset.clear();
    }
  });
</script>

<template>
  <div class="flex w-full justify-center">
    <Transition v-bind="AUTH_STEP_TRANSITION">
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
    </Transition>
  </div>
</template>
