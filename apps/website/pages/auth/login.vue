<script setup lang="ts">
  import LoginForm from '~/modules/auth/components/LoginForm.vue';

  definePageMeta({ layout: 'auth', guestOnly: true });

  const { t } = useI18n();
  useSeoMeta({ title: () => t('auth.login.title') });
</script>

<template>
  <LoginForm />
</template>
