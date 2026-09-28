<script setup lang="ts">
  import { definePageMeta } from '#imports';
  import { paths } from '@/constants/route-names';
  import { ExceptionState } from '@/components';
  import { useNetwork } from '@/composables';

  definePageMeta({
    name: paths.errors.noInternet,
    layout: false,
    title: 'No Internet Connection',
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
