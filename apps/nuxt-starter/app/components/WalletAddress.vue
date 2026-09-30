<script setup lang="ts">
  import { truncate } from '@/utils/formatText';

  const props = withDefaults(
    defineProps<{
      /** Full address. Nothing but a dash is shown when it is empty. */
      address?: string | null;
      /** Characters kept at the start of the shortened address. */
      startLength?: number;
      /** Characters kept at the end of the shortened address. */
      endLength?: number;
      class?: string;
    }>(),
    { address: null, startLength: 6, endLength: 4, class: '' }
  );

  const shortAddress = computed(() => truncate(props.address, props.startLength, props.endLength));
</script>

<template>
  <CopyText
    v-if="address"
    :text="shortAddress"
    :copy-value="address"
    :title="address"
    :class="props.class"
  />
  <span v-else :class="props.class">-</span>
</template>
