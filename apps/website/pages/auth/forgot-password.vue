<script setup lang="ts">
  import ForgotPasswordPhoneStep from '~/modules/auth/components/ForgotPasswordPhoneStep.vue';
  import ForgotPasswordResetStep from '~/modules/auth/components/ForgotPasswordResetStep.vue';

  definePageMeta({ layout: 'auth', guestOnly: true });

  const { t } = useI18n();
  useSeoMeta({ title: () => t('auth.forgot.title') });

  // Step 1 sends the code; step 2 verifies it and sets the new password
  const phone = ref('');
  const token = ref('');

  const onSent = (sentTo: string, resetToken: string) => {
    phone.value = sentTo;
    token.value = resetToken;
  };
  const startOver = () => {
    token.value = '';
  };
</script>

<template>
  <ForgotPasswordResetStep v-if="token" v-model:token="token" :phone="phone" @back="startOver" />
  <ForgotPasswordPhoneStep v-else @sent="onSent" />
</template>
