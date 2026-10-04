<script setup lang="ts">
  import { AUTH_TRANSITION } from '~/constants/auth';
  import RegisterForm from '~/modules/auth/components/RegisterForm.vue';

  definePageMeta({ layout: 'auth', guestOnly: true, pageTransition: AUTH_TRANSITION });

  const { t } = useI18n();
  useSeoMeta({ title: () => t('auth.register.title') });
</script>

<template>
  <RegisterForm />
</template>
