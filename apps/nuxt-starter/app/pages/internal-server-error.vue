<script setup lang="ts">
  import { paths } from '@/constants/route-names';

  definePageMeta({
    name: paths.errors.serverError,
    layout: false,
    title: 'Internal Server Error',
    auth: false,
  });

  const goHome = () => navigateTo({ name: paths.dashboard.root });
</script>

<template>
  <ExceptionState
    icon="hugeicons--work-alert"
    title="Oops! Something went wrong on our end."
    description="Server issues are often temporary. Try accessing the Packages module again in a few minutes."
    button-label="Back to home"
    :button-action="goHome"
  />
</template>
