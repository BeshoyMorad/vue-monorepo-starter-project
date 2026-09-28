<script setup lang="ts">
  import { paths } from '@/constants/route-names';

  definePageMeta({
    name: paths.errors.noInternet,
    layout: false,
    title: 'No Internet Connection',
    auth: false,
  });

  const { tryAgain } = useNetwork();
</script>

<template>
  <ExceptionState
    icon="hugeicons--wifi-disconnected-01"
    title="Oops! It seems like your internet connection is slow or not working at all."
    description="Please check your connection or try again."
    button-label="Try Again"
    :button-action="tryAgain"
  />
</template>
