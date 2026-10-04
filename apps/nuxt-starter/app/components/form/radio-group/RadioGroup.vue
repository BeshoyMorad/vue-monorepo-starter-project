<script setup lang="ts">
  import type { FormFieldWrapperProps, BaseRadioGroupProps } from '@/types/form';
  import { useVModel } from '@vueuse/core';
  import { FormField } from '@/components/ui/form';

  defineOptions({
    inheritAttrs: false,
  });

  type Props = BaseRadioGroupProps & FormFieldWrapperProps;

  const props = withDefaults(defineProps<Props>(), {
    modelValue: undefined,
    defaultValue: undefined,
    layout: 'vertical',
    size: 'default',
    disabled: false,
    label: undefined,
    id: undefined,
    name: undefined,
    description: undefined,
    containerClass: undefined,
  });

  const emits = defineEmits<{
    (e: 'update:modelValue', value: string): void;
  }>();

  const modelValue = useVModel(props, 'modelValue', emits, {
    passive: true,
    defaultValue: props.defaultValue,
  });
</script>

<template>
  <template v-if="name">
    <FormField v-slot="{ componentField, errorMessage }" :name="name">
      <FormItem :class="containerClass">
        <FormLabel v-if="label">{{ label }}</FormLabel>

        <FormControl>
          <FormBaseRadioGroup
            :id="id"
            :aria-invalid="!!errorMessage"
            :disabled="disabled"
            :layout="layout"
            :options="options"
            :size="size"
            :test-id="testId"
            v-bind="componentField"
          />
        </FormControl>

        <FormDescription v-if="description">{{ description }}</FormDescription>

        <FormMessage />
      </FormItem>
    </FormField>
  </template>

  <template v-else>
    <FormBaseRadioGroup
      v-model="modelValue"
      v-bind="$attrs"
      :class="containerClass"
      :disabled="disabled"
      :layout="layout"
      :options="options"
      :size="size"
      :test-id="testId"
    />
  </template>
</template>
