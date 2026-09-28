<script setup lang="ts">
  import { CopyText, Tooltip } from '@/components';
  import type { DetailRow } from '@/features/tokenization/utils/detail-row';

  defineProps<{
    row: DetailRow;
    darkMode?: boolean;
  }>();
</script>

<template>
  <div class="flex items-center justify-between gap-4 py-3" :data-test-id="row.testId">
    <span :class="darkMode ? 'text-neutral-400' : 'text-foreground-caption'">{{ row.label }}</span>

    <div
      class="min-w-0 truncate text-end font-medium"
      :class="darkMode ? 'text-neutral-50' : 'text-foreground'"
    >
      <Tooltip v-if="row.tooltip && row.value">
        <template #trigger>
          <CopyText v-if="row.copy" :text="row.valueToShow ?? row.value" :copy-value="row.value" />
          <span v-else>{{ row.valueToShow ?? row.value }}</span>
        </template>
        {{ row.value }}
      </Tooltip>

      <CopyText
        v-else-if="row.copy && row.value"
        :text="row.valueToShow ?? row.value"
        :copy-value="row.value"
      />

      <span v-else>{{ row.valueToShow ?? row.value ?? '-' }}</span>
    </div>
  </div>
</template>
