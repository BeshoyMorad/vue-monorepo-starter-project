<script setup lang="ts">
  import { ExceptionState } from '@workspace/ui';
  import { useRouter } from 'vue-router';

  const props = withDefaults(
    defineProps<{
      homeRoute?: string;
    }>(),
    {
      homeRoute: '/',
    }
  );

  const router = useRouter();

  const goHome = () => {
    void router.push(props.homeRoute);
  };
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
