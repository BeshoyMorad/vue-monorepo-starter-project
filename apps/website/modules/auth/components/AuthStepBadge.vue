<script setup lang="ts">
  /** "Step 1 of 2" pill with an optional label next to it. */
  defineProps<{ current: number; total: number; label?: string }>();

  const { t } = useI18n();
</script>

<template>
  <div class="flex items-center gap-2 text-sm">
    <span class="bg-primary-50 text-primary-500 rounded-full px-3 py-1 font-bold">
      {{ t('auth.stepOf', { current, total }) }}
    </span>
    <span v-if="label" class="text-text-placeholder">{{ label }}</span>
  </div>
</template>
