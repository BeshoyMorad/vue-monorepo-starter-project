<script setup lang="ts">
  import { ExceptionState } from '@workspace/ui';
  import { useNetwork } from '@workspace/core/composables';

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
