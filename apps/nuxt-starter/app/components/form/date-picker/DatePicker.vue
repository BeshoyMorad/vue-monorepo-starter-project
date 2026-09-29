<script setup lang="ts">
  import type { FormFieldWrapperProps, BaseDatePickerProps } from '@/types/form';
  import { useVModel } from '@vueuse/core';
  import { FormField } from '@/components/ui/form';

  defineOptions({
    inheritAttrs: false,
  });

  type Props = BaseDatePickerProps & FormFieldWrapperProps;

  const props = withDefaults(defineProps<Props>(), {
    modelValue: undefined,
    defaultValue: undefined,
    dateFormat: undefined,
    minDate: undefined,
    maxDate: undefined,
    disabled: false,
    placeholder: undefined,
    label: undefined,
    id: undefined,
    name: undefined,
    description: undefined,
    containerClass: undefined,
  });

  const emits = defineEmits<{
    (e: 'update:modelValue', value: Date | null): void;
  }>();

  const modelValue = useVModel(props, 'modelValue', emits, {
    passive: true,
    defaultValue: props.defaultValue ?? null,
  });
</script>

<template>
  <template v-if="name">
    <FormField v-slot="{ componentField, errorMessage }" :name="name">
      <FormItem :class="containerClass">
        <FormLabel v-if="label">{{ label }}</FormLabel>

        <FormControl>
          <FormBaseDatePicker
            :id="id"
            :aria-invalid="!!errorMessage"
            :date-format="dateFormat"
            :disabled="disabled"
            :max-date="maxDate"
            :min-date="minDate"
            :placeholder="placeholder"
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
    <FormBaseDatePicker
      v-model="modelValue"
      v-bind="$attrs"
      :class="containerClass"
      :date-format="dateFormat"
      :disabled="disabled"
      :max-date="maxDate"
      :min-date="minDate"
      :placeholder="placeholder"
      :test-id="testId"
    />
  </template>
</template>
