<script setup lang="ts">
  import { computed, ref, watch } from 'vue';
  import { useDarkTheme } from '@workspace/core/composables';
  import { getImagePath } from '@workspace/core/utils';

  const props = withDefaults(
    defineProps<{
      src?: string;
      alt?: string;
      fallback?: string;
    }>(),
    {
      src: undefined,
      alt: '',
      fallback: undefined,
    }
  );

  const { isDark } = useDarkTheme();

  const resolvedFallback = computed(
    () =>
      props.fallback ??
      (isDark.value
        ? getImagePath('default-image-dark.png')
        : getImagePath('default-image-light.png'))
  );

  const isUsingFallback = ref(!props.src);
  const currentSrc = ref(props.src || resolvedFallback.value);

  watch(
    () => props.src,
    (newSrc) => {
      if (newSrc) {
        currentSrc.value = newSrc;
        isUsingFallback.value = false;
      } else {
        currentSrc.value = resolvedFallback.value;
        isUsingFallback.value = true;
      }
    }
  );

  watch(resolvedFallback, () => {
    if (isUsingFallback.value) {
      currentSrc.value = resolvedFallback.value;
    }
  });

  function handleError() {
    if (isUsingFallback.value) return;
    currentSrc.value = resolvedFallback.value;
    isUsingFallback.value = true;
  }
</script>

<template>
  <img :src="currentSrc" :alt="alt" @error="handleError" />
</template>
