<script setup lang="ts">
  import { ref, computed, onMounted } from 'vue';
  import { useVModel } from '@vueuse/core';
  import { cn } from '@workspace/core/utils';
  import { copyToClipboard } from '@workspace/core/utils/clipboard';
  import { Popover } from '@workspace/ui/ui/popover';
  import { Icon } from '@workspace/ui/icon';
  import { inputVariants } from '@workspace/ui/ui/input';
  import type { BaseInputColorProps } from './types';
  import { DEFAULT_PRESETS } from './constants';
  import ColorPopoverContent from './ColorPopoverContent.vue';

  defineOptions({
    inheritAttrs: false,
  });

  const props = withDefaults(defineProps<BaseInputColorProps>(), {
    modelValue: undefined,
    defaultValue: '#3b82f6',
    placeholder: '#3b82f6',
    disabled: false,
    readonly: false,
    presets: () => [...DEFAULT_PRESETS],
    showPresets: true,
    showEyeDropper: false,
    showCopy: true,
    testId: 'input-color',
    variant: 'default',
    shape: 'square',
    showInput: undefined,
    wrapperClass: undefined,
    inputClass: undefined,
    triggerClass: undefined,
    wheelClass: undefined,
  });

  const emits = defineEmits<{
    (e: 'update:modelValue', value: string): void;
  }>();

  const modelValue = useVModel(props, 'modelValue', emits, {
    passive: true,
    defaultValue: props.defaultValue ?? '#3b82f6',
  });

  const nativeInputRef = ref<HTMLInputElement | null>(null);
  const isCopied = ref(false);
  const hasEyeDropper = ref(false);
  const isPopoverOpen = ref(false);

  onMounted(() => {
    hasEyeDropper.value = typeof window !== 'undefined' && 'EyeDropper' in window;
  });

  const activeColor = computed(() => {
    return modelValue.value || props.defaultValue || '#3b82f6';
  });

  const shouldShowInput = computed(() => {
    if (typeof props.showInput === 'boolean') return props.showInput;
    return props.variant === 'default';
  });

  const shapeClass = computed(() => {
    if (props.shape === 'circle' || props.variant === 'wheel') {
      return 'rounded-full';
    }
    return 'rounded-md';
  });

  // Ensure 6-digit hex for native input: e.g. #fff -> #ffffff
  const normalizedHex = computed(() => {
    const val = (modelValue.value || '').trim();
    if (!val) return '#000000';
    let hex = val.startsWith('#') ? val.slice(1) : val;
    if (hex.length === 3) {
      hex = hex
        .split('')
        .map((c) => c + c)
        .join('');
    }
    if (/^[0-9A-Fa-f]{6}$/.test(hex)) {
      return `#${hex.toLowerCase()}`;
    }
    return '#000000';
  });

  // Convert hex to rgb string for preview
  const rgbDisplay = computed(() => {
    const hex = normalizedHex.value.slice(1);
    const r = parseInt(hex.slice(0, 2), 16) || 0;
    const g = parseInt(hex.slice(2, 4), 16) || 0;
    const b = parseInt(hex.slice(4, 6), 16) || 0;
    return `rgb(${r}, ${g}, ${b})`;
  });

  // Dynamic right padding depending on which icon buttons are rendered
  const rightPaddingClass = computed(() => {
    const hasRightDropper = props.showEyeDropper && hasEyeDropper.value;
    const hasRightCopy = props.showCopy;

    if (hasRightDropper && hasRightCopy) return 'pr-20';
    if (hasRightDropper || hasRightCopy) return 'pr-11';
    return 'pr-3';
  });

  function handleTextInput(e: Event) {
    const target = e.target as HTMLInputElement;
    let val = target.value.trim();
    if (val && !val.startsWith('#')) {
      val = `#${val}`;
    }
    modelValue.value = val;
  }

  function handleNativePickerChange(e: Event) {
    const target = e.target as HTMLInputElement;
    modelValue.value = target.value;
  }

  function openNativePicker() {
    if (props.disabled || props.readonly) return;
    nativeInputRef.value?.click();
  }

  async function openEyeDropper() {
    if (props.disabled || props.readonly || !props.showEyeDropper) return;
    try {
      // @ts-expect-error EyeDropper is a modern Web API
      const eyeDropper = new window.EyeDropper();
      const result = await eyeDropper.open();
      if (result?.sRGBHex) {
        modelValue.value = result.sRGBHex;
      }
    } catch {
      // User canceled eyedropper
    }
  }

  function selectPreset(color: string) {
    if (props.disabled || props.readonly) return;
    modelValue.value = color;
  }

  async function copyColor() {
    if (!modelValue.value) return;
    await copyToClipboard(modelValue.value);
    isCopied.value = true;
    setTimeout(() => {
      isCopied.value = false;
    }, 1500);
  }
</script>

<template>
  <!-- Hidden native color input (used by wheel trigger and popover custom picker) -->
  <input
    ref="nativeInputRef"
    type="color"
    :value="normalizedHex"
    tabindex="-1"
    aria-hidden="true"
    class="sr-only"
    :disabled="disabled || readonly"
    @input="handleNativePickerChange"
  />

  <!-- 1. Custom Trigger Slot Override -->
  <div v-if="$slots.trigger" :class="cn('inline-flex items-center gap-3', wrapperClass)">
    <Popover v-model:open="isPopoverOpen" align="start" class="w-64 p-3" :show-arrow="true">
      <template #trigger>
        <slot
          name="trigger"
          :color="activeColor"
          :is-open="isPopoverOpen"
          :open-popover="() => (isPopoverOpen = true)"
          :close-popover="() => (isPopoverOpen = false)"
          :open-native-picker="openNativePicker"
          :open-eye-dropper="openEyeDropper"
          :disabled="disabled || readonly"
        />
      </template>

      <ColorPopoverContent
        :color="activeColor"
        :rgb-display="rgbDisplay"
        :presets="presets"
        :show-presets="showPresets"
        :show-eye-dropper="showEyeDropper"
        :has-eye-dropper="hasEyeDropper"
        :test-id="testId"
        :is-copied="isCopied"
        @select-preset="selectPreset"
        @copy-color="copyColor"
        @open-native-picker="openNativePicker"
        @open-eye-dropper="openEyeDropper"
      />
    </Popover>
  </div>

  <!-- 2. Variant: Wheel (First wheel chooses the color, second circle displays the color) -->
  <div v-else-if="variant === 'wheel'" :class="cn('inline-flex items-center gap-3', wrapperClass)">
    <!-- First Wheel: Trigger for choosing color -->
    <Popover v-model:open="isPopoverOpen" align="start" class="w-64 p-3" :show-arrow="true">
      <template #trigger>
        <button
          type="button"
          :disabled="disabled || readonly"
          :data-testid="`${testId}-wheel-trigger`"
          title="Choose color"
          :class="
            cn(
              'group focus:ring-primary-500 relative flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-full border border-neutral-300 shadow-xs transition-transform hover:scale-110 focus:ring-2 focus:outline-none active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 dark:border-neutral-700',
              wheelClass
            )
          "
          style="
            background: conic-gradient(
              from 0deg,
              #ff0000,
              #ffff00,
              #00ff00,
              #00ffff,
              #0000ff,
              #ff00ff,
              #ff0000
            );
          "
        >
          <span class="sr-only">Choose color</span>
        </button>
      </template>

      <ColorPopoverContent
        :color="activeColor"
        :rgb-display="rgbDisplay"
        :presets="presets"
        :show-presets="showPresets"
        :show-eye-dropper="showEyeDropper"
        :has-eye-dropper="hasEyeDropper"
        :test-id="testId"
        :is-copied="isCopied"
        @select-preset="selectPreset"
        @copy-color="copyColor"
        @open-native-picker="openNativePicker"
        @open-eye-dropper="openEyeDropper"
      />
    </Popover>

    <!-- Second Circle: Displays the color (no function) -->
    <div
      :data-testid="`${testId}-display`"
      :class="
        cn(
          'size-8 shrink-0 rounded-full border border-neutral-300 shadow-xs dark:border-neutral-700',
          triggerClass
        )
      "
      :style="{ backgroundColor: activeColor }"
      :title="`Selected color: ${activeColor}`"
    />

    <!-- Optional Hex Text Input if requested -->
    <input
      v-if="shouldShowInput"
      :value="modelValue"
      :placeholder="placeholder"
      :disabled="disabled"
      :readonly="readonly"
      :data-testid="testId"
      v-bind="$attrs"
      :class="
        cn(
          inputVariants(),
          'inline-flex h-10 w-32 px-3 font-mono text-sm tracking-wider',
          inputClass,
          $attrs.class
        )
      "
      @input="handleTextInput"
    />
  </div>

  <!-- 3. Variant: Swatch (Single button swatch without text input) -->
  <div v-else-if="variant === 'swatch'" :class="cn('inline-flex items-center gap-3', wrapperClass)">
    <Popover v-model:open="isPopoverOpen" align="start" class="w-64 p-3" :show-arrow="true">
      <template #trigger>
        <button
          type="button"
          :disabled="disabled"
          :data-testid="`${testId}-swatch-trigger`"
          :class="
            cn(
              'group focus:ring-primary-500 relative flex size-8 shrink-0 cursor-pointer items-center justify-center border border-neutral-300 shadow-xs transition-transform hover:scale-110 focus:ring-2 focus:outline-none active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 dark:border-neutral-700',
              shapeClass,
              triggerClass
            )
          "
          :style="{ backgroundColor: activeColor }"
          :title="`Current color: ${activeColor}`"
        >
          <span class="sr-only">Open color palette</span>
        </button>
      </template>

      <ColorPopoverContent
        :color="activeColor"
        :rgb-display="rgbDisplay"
        :presets="presets"
        :show-presets="showPresets"
        :show-eye-dropper="showEyeDropper"
        :has-eye-dropper="hasEyeDropper"
        :test-id="testId"
        :is-copied="isCopied"
        @select-preset="selectPreset"
        @copy-color="copyColor"
        @open-native-picker="openNativePicker"
        @open-eye-dropper="openEyeDropper"
      />
    </Popover>

    <!-- Optional Hex Text Input if requested -->
    <input
      v-if="shouldShowInput"
      :value="modelValue"
      :placeholder="placeholder"
      :disabled="disabled"
      :readonly="readonly"
      :data-testid="testId"
      v-bind="$attrs"
      :class="
        cn(
          inputVariants(),
          'inline-flex h-10 w-32 px-3 font-mono text-sm tracking-wider',
          inputClass,
          $attrs.class
        )
      "
      @input="handleTextInput"
    />
  </div>

  <!-- 4. Variant: Default (Text input with embedded left swatch trigger) -->
  <div v-else :class="cn('relative flex w-full items-center', wrapperClass)">
    <!-- Swatch Trigger + Popover inside the input -->
    <div class="absolute inset-y-0 left-2.5 z-10 flex items-center">
      <Popover v-model:open="isPopoverOpen" align="start" class="w-64 p-3" :show-arrow="true">
        <template #trigger>
          <button
            type="button"
            :disabled="disabled"
            :data-testid="`${testId}-swatch-trigger`"
            :class="
              cn(
                'group focus:ring-primary-500 relative flex size-6 shrink-0 cursor-pointer items-center justify-center border border-neutral-300 shadow-xs transition-transform hover:scale-105 focus:ring-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 dark:border-neutral-700',
                shapeClass,
                triggerClass
              )
            "
            :style="{ backgroundColor: activeColor }"
            :title="`Current color: ${activeColor}`"
          >
            <span class="sr-only">Open color palette</span>
          </button>
        </template>

        <ColorPopoverContent
          :color="activeColor"
          :rgb-display="rgbDisplay"
          :presets="presets"
          :show-presets="showPresets"
          :show-eye-dropper="showEyeDropper"
          :has-eye-dropper="hasEyeDropper"
          :test-id="testId"
          :is-copied="isCopied"
          @select-preset="selectPreset"
          @copy-color="copyColor"
          @open-native-picker="openNativePicker"
          @open-eye-dropper="openEyeDropper"
        />
      </Popover>
    </div>

    <!-- Hex Text Input -->
    <input
      :value="modelValue"
      :placeholder="placeholder"
      :disabled="disabled"
      :readonly="readonly"
      :data-testid="testId"
      v-bind="$attrs"
      :class="
        cn(
          inputVariants(),
          'inline-flex h-10 w-full pl-11 font-mono text-sm tracking-wider',
          rightPaddingClass,
          inputClass,
          $attrs.class
        )
      "
      @input="handleTextInput"
    />

    <!-- Right Controls: EyeDropper & Copy -->
    <div
      v-if="(showEyeDropper && hasEyeDropper) || showCopy"
      class="absolute inset-y-0 right-2.5 flex items-center gap-1"
    >
      <button
        v-if="showEyeDropper && hasEyeDropper"
        type="button"
        tabindex="-1"
        :disabled="disabled || readonly"
        :data-testid="`${testId}-eyedropper`"
        title="Pick color from screen"
        class="text-text-secondary hover:text-text-default flex size-7 items-center justify-center rounded-md transition-colors hover:bg-neutral-100 focus:outline-none disabled:opacity-40 dark:hover:bg-neutral-800"
        @click="openEyeDropper"
      >
        <Icon icon="hugeicons--eyedropper" class="size-4" />
      </button>

      <button
        v-if="showCopy"
        type="button"
        tabindex="-1"
        :data-testid="`${testId}-copy`"
        title="Copy color hex"
        class="text-text-secondary hover:text-text-default flex size-7 items-center justify-center rounded-md transition-colors hover:bg-neutral-100 focus:outline-none dark:hover:bg-neutral-800"
        @click="copyColor"
      >
        <Icon
          :icon="isCopied ? 'hugeicons--tick-01' : 'hugeicons--copy-01'"
          :class="isCopied ? 'size-4 text-emerald-500' : 'size-4'"
        />
      </button>
    </div>
  </div>
</template>
