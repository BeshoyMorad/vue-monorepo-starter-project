<script setup lang="ts">
  import RegisterForm from '~/modules/auth/components/RegisterForm.vue';

  definePageMeta({ layout: 'auth', guestOnly: true });

  const { t } = useI18n();
  useSeoMeta({ title: () => t('auth.register.title') });
</script>

<template>
  <RegisterForm />
</template>
