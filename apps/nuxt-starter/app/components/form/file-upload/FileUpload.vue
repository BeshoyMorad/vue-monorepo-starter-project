<script setup lang="ts">
  import { useVModel } from '@vueuse/core';
  import { FormField } from '@/components/ui/form';

  import type { MediaValue } from '@/types/media';

  defineOptions({
    inheritAttrs: false,
  });

  interface Props {
    testId: string;
    modelValue?: MediaValue[];
    disabled?: boolean;
    placeholder?: string;
    buttonLabel?: string;
    allowedTypes?: string[];
    maxFiles?: number;
    maxSizeMb?: number;
    // Form validation wrapper props
    name?: string;
    label?: string;
    description?: string;
    containerClass?: string;
  }

  const props = withDefaults(defineProps<Props>(), {
    modelValue: () => [],
    disabled: false,
    placeholder: undefined,
    buttonLabel: undefined,
    allowedTypes: undefined,
    maxFiles: undefined,
    maxSizeMb: undefined,
    name: undefined,
    label: undefined,
    description: undefined,
    containerClass: undefined,
  });

  const emits = defineEmits<{
    (e: 'update:modelValue', value: MediaValue[]): void;
  }>();

  const modelValue = useVModel(props, 'modelValue', emits, {
    passive: true,
    defaultValue: [],
  });
</script>

<template>
  <template v-if="name">
    <FormField v-slot="{ value, handleChange, errorMessage }" :name="name">
      <FormItem :class="containerClass">
        <FormLabel v-if="label">{{ label }}</FormLabel>

        <FormControl>
          <FormBaseFileUpload
            :test-id="testId"
            :disabled="disabled"
            :placeholder="placeholder"
            :button-label="buttonLabel"
            :allowed-types="allowedTypes"
            :max-files="maxFiles"
            :max-size-mb="maxSizeMb"
            :aria-invalid="!!errorMessage"
            :model-value="value || []"
            v-bind="$attrs"
            @update:model-value="handleChange"
          >
            <template v-for="(_, slotName) in $slots" #[slotName]="slotProps">
              <slot :name="slotName" v-bind="slotProps ?? {}" />
            </template>
          </FormBaseFileUpload>
        </FormControl>

        <FormDescription v-if="description">{{ description }}</FormDescription>

        <FormMessage />
      </FormItem>
    </FormField>
  </template>

  <template v-else>
    <FormBaseFileUpload
      v-model="modelValue"
      v-bind="$attrs"
      :test-id="testId"
      :disabled="disabled"
      :placeholder="placeholder"
      :button-label="buttonLabel"
      :allowed-types="allowedTypes"
      :max-files="maxFiles"
      :max-size-mb="maxSizeMb"
      :class="containerClass"
    >
      <template v-for="(_, slotName) in $slots" #[slotName]="slotProps">
        <slot :name="slotName" v-bind="slotProps ?? {}" />
      </template>
    </FormBaseFileUpload>
  </template>
</template>
