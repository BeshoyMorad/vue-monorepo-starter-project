<script setup lang="ts">
  import ExceptionState from '@workspace/ui/ExceptionState.vue';
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
    icon="hugeicons--work-alert"
    title="Oops! Something went wrong on our end."
    description="Server issues are often temporary. Try refreshing the page in a few moments."
    button-label="Back to home"
    :button-action="goHome"
  />
</template>
