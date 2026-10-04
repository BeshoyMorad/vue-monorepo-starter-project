<script setup lang="ts">
  import { paths } from '@/constants/route-names';

  definePageMeta({
    name: paths.errors.notFound,
    layout: false,
    title: 'Page Not Found',
    auth: false,
  });

  const goHome = () => navigateTo({ name: paths.dashboard.root });
</script>

<template>
  <ExceptionState
    icon="hugeicons--alert-02"
    title="Oops! We can't find that page."
    description="The page you’re looking for doesn’t exist or has been removed. Please go back to the home page."
    button-label="Back to home"
    :button-action="goHome"
  />
</template>
