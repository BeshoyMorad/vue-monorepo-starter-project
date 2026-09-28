<script setup lang="ts">
  import { Tooltip } from '@/components/ui/tooltip';
</script>

<template>
  <TooltipProvider>
    <Tooltip>
      <TooltipTrigger>
        <slot name="trigger" />
      </TooltipTrigger>

      <TooltipContent>
        <slot />
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
</template>
