<script setup lang="ts">
  import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
  } from '@workspace/ui/ui/tooltip';

  interface Props {
    testId?: string;
  }

  const props = withDefaults(defineProps<Props>(), {
    testId: 'ui-tooltip',
  });
</script>

<template>
  <TooltipProvider>
    <Tooltip :data-testid="props.testId">
      <TooltipTrigger>
        <slot name="trigger" />
      </TooltipTrigger>

      <TooltipContent :data-testid="`${props.testId}-content`">
        <slot />
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
</template>
