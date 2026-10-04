<script setup lang="ts">
  import VerifyAccountForm from '~/modules/auth/components/VerifyAccountForm.vue';
  import { useVerificationStore } from '~/modules/auth/stores/verification';
  import { AUTH_TRANSITION } from '~/constants/auth';
  import { paths } from '~/router/paths';
  import { getRouteLocale } from '~/utils/locale';

  definePageMeta({
    layout: 'auth',
    guestOnly: true,
    pageTransition: AUTH_TRANSITION,
    // Only reachable with a pending verification (after register or an unverified login)
    middleware: (to) => {
      if (!useVerificationStore().pending) {
        return navigateTo(useLocalePath()(paths.auth.register, getRouteLocale(to)));
      }
    },
  });

  const { t } = useI18n();
  useSeoMeta({ title: () => t('auth.verify.title') });
</script>

<template>
  <VerifyAccountForm />
</template>
