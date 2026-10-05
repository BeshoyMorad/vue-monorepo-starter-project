<script setup lang="ts">
  import { useAvatarLocalCopies } from '~/modules/account/composables/useAvatarUpload';
  import { initials } from '~/modules/account/utils';

  /** Round avatar with a gold ring: the photo, or the initials on light blue */
  const props = defineProps<{ name?: string | null; src?: string | null; size?: number }>();
  const failed = ref(false);
  // A new photo gets a fresh chance to load
  watch(
    () => props.src,
    () => (failed.value = false)
  );
  const letters = computed(() => initials(props.name));
  // A photo uploaded in this session is shown from the browser's own copy
  const localCopies = useAvatarLocalCopies();
  const shown = computed(() => (props.src && localCopies.value[props.src]) || props.src);
</script>

<template>
  <span class="avatar" :style="{ '--size': `${size ?? 80}px` }" aria-hidden="true">
    <!-- Initials underneath: shown while a photo loads, and if it fails -->
    {{ letters }}
    <img v-if="shown?.startsWith('blob:')" :src="shown" alt="" class="avatar__img" />
    <NuxtImg
      v-else-if="shown && !failed"
      :src="shown"
      alt=""
      :width="size ?? 80"
      :height="size ?? 80"
      fit="cover"
      densities="x1 x2"
      class="avatar__img"
      @error="failed = true"
    />
  </span>
</template>

<style scoped>
  .avatar {
    position: relative;
    width: var(--size);
    height: var(--size);
    flex: none;
    display: grid;
    place-items: center;
    overflow: hidden;
    border: 2px solid var(--color-gold-500);
    border-radius: 50%;
    background: #d6e7fb;
    box-shadow: 0 0 0 3px rgb(255 255 255 / 0.85) inset;
    color: #1e4f8f;
    font: 500 calc(var(--size) * 0.24) / 1 var(--font, inherit);
  }
  .avatar__img {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
</style>
