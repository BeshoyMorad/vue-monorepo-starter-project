<script setup lang="ts">
  /**
   * Progress through a multi-step flow: "Step 2 of 3 … Verification" above a segmented bar.
   * Done steps are green, the current one gold, the rest faint.
   */
  defineProps<{ current: number; total: number; label?: string }>();

  const { t } = useI18n();
</script>

<template>
  <div class="space-y-2">
    <p class="flex items-center justify-between gap-3 text-xs leading-4 font-semibold">
      <span class="text-primary-500">{{ t('auth.stepOf', { current, total }) }}</span>
      <span v-if="label" class="text-[oklch(0.45_0_0)]">{{ label }}</span>
    </p>
    <div class="flex gap-1.5" aria-hidden="true">
      <span
        v-for="step in total"
        :key="step"
        class="h-1.5 flex-1 rounded-full"
        :class="
          step < current ? 'bg-primary-500' : step === current ? 'bg-gold-500' : 'bg-primary-500/10'
        "
      />
    </div>
  </div>
</template>
