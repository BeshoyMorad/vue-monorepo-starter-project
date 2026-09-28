<script setup lang="ts">
  import { paths } from '@/constants/route-names';

  definePageMeta({
    name: paths.errors.accessDenied,
    layout: false,
    title: 'Access Denied',
    auth: false,
  });

  const goHome = () => navigateTo({ name: paths.dashboard.root });
</script>

<template>
  <ExceptionState
    icon="hugeicons--unavailable"
    title="Access Denied!"
    description="We're sorry, but you don't have permission to access this page."
    button-label="Back to home"
    :button-action="goHome"
  />
</template>
