<script setup lang="ts">
  import { Button } from '@workspace/ui/ui/button';
  import { Icon } from '@workspace/ui/icon';

  defineProps<{
    color: string;
    rgbDisplay: string;
    presets?: string[];
    showPresets?: boolean;
    showEyeDropper?: boolean;
    hasEyeDropper?: boolean;
    testId: string;
    isCopied: boolean;
  }>();

  const emit = defineEmits<{
    (e: 'selectPreset', color: string): void;
    (e: 'copyColor'): void;
    (e: 'openNativePicker'): void;
    (e: 'openEyeDropper'): void;
  }>();
</script>

<template>
  <div class="space-y-3">
    <!-- Live Preview & Values -->
    <div
      class="flex items-center gap-2.5 rounded-lg border border-neutral-200 bg-neutral-50 p-2 dark:border-neutral-800 dark:bg-neutral-900"
    >
      <div
        class="size-8 shrink-0 rounded-md border border-neutral-300 shadow-xs dark:border-neutral-700"
        :style="{ backgroundColor: color }"
      />
      <div class="min-w-0 flex-1">
        <p class="text-text-default text-xs font-semibold uppercase">
          {{ color }}
        </p>
        <p class="text-text-secondary text-[11px]">
          {{ rgbDisplay }}
        </p>
      </div>
      <button
        type="button"
        class="text-text-secondary hover:text-text-default flex size-7 items-center justify-center rounded-md hover:bg-neutral-200 dark:hover:bg-neutral-800"
        title="Copy Color"
        @click="emit('copyColor')"
      >
        <Icon :icon="isCopied ? 'hugeicons--tick-01' : 'hugeicons--copy-01'" class="size-4" />
      </button>
    </div>

    <!-- Color Presets -->
    <div v-if="showPresets && presets?.length" class="space-y-1.5">
      <label class="text-text-secondary text-[11px] font-medium tracking-wider uppercase">
        Presets
      </label>
      <div class="grid grid-cols-6 gap-1.5">
        <button
          v-for="presetColor in presets"
          :key="presetColor"
          type="button"
          :data-testid="`${testId}-preset-${presetColor}`"
          class="group focus:ring-primary-500 relative flex size-7 cursor-pointer items-center justify-center rounded-md border border-neutral-300 shadow-2xs transition-transform hover:scale-110 focus:ring-2 focus:outline-none dark:border-neutral-700"
          :style="{ backgroundColor: presetColor }"
          :title="presetColor"
          @click="emit('selectPreset', presetColor)"
        >
          <Icon
            v-if="color.toLowerCase() === presetColor.toLowerCase()"
            icon="hugeicons--tick-01"
            class="size-3.5 text-white drop-shadow-md"
          />
        </button>
      </div>
    </div>

    <!-- Quick Actions in Popover -->
    <div class="flex items-center gap-2 border-t border-neutral-200 pt-1 dark:border-neutral-800">
      <Button
        type="button"
        outline
        size="sm"
        :test-id="`${testId}-picker-btn`"
        class="flex-1 text-xs"
        @click="emit('openNativePicker')"
      >
        <Icon icon="hugeicons--color-picker" class="mr-1.5 size-3.5" />
        Custom Picker
      </Button>

      <Button
        v-if="showEyeDropper && hasEyeDropper"
        type="button"
        outline
        size="sm"
        :test-id="`${testId}-eyedropper-btn`"
        class="px-2 text-xs"
        title="Pick from Screen"
        @click="emit('openEyeDropper')"
      >
        <Icon icon="hugeicons--eyedropper" class="size-3.5" />
      </Button>
    </div>
  </div>
</template>
