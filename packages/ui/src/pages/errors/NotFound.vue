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
    icon="hugeicons--alert-02"
    title="Oops! We can't find that page."
    description="The page you’re looking for doesn’t exist or has been removed. Please go back to the home page."
    button-label="Back to home"
    :button-action="goHome"
  />
</template>
