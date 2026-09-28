<script setup lang="ts">
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

  // Built-in placeholders live in public/images.
  const placeholderName = computed(() => (isDark.value ? 'dark-placeholder' : 'light-placeholder'));

  const resolvedFallback = computed(
    () => props.fallback ?? `/images/${placeholderName.value}.webp`
  );

  /** Density srcset for built-in placeholders only (custom `fallback` is a single URL). */
  const fallbackSrcset = computed(() => {
    if (props.fallback) return undefined;
    const name = placeholderName.value;
    return `/images/${name}.webp 1x, /images/${name}@2x.webp 2x`;
  });

  const hasFailed = ref(false);

  watch(
    () => props.src,
    () => {
      hasFailed.value = false;
    }
  );

  const isUsingFallback = computed(() => !props.src || hasFailed.value);
</script>

<template>
  <img v-if="isUsingFallback" :src="resolvedFallback" :srcset="fallbackSrcset" :alt="alt" />
  <NuxtImg v-else :src="src" :alt="alt" @error="hasFailed = true" />
</template>
