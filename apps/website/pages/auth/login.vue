<script setup lang="ts">
  import { AUTH_TRANSITION } from '~/constants/auth';
  import LoginForm from '~/modules/auth/components/LoginForm.vue';

  definePageMeta({ layout: 'auth', guestOnly: true, pageTransition: AUTH_TRANSITION });

  const { t } = useI18n();
  useSeoMeta({ title: () => t('auth.login.title') });
</script>

<template>
  <LoginForm />
</template>
