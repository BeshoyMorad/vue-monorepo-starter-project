<script setup lang="ts">
  import type { FormFieldWrapperProps, BaseRadioProps } from '@/types/form';
  import { useVModel } from '@vueuse/core';
  import { FormField } from '@/components/ui/form';

  defineOptions({
    inheritAttrs: false,
  });

  type Props = BaseRadioProps & FormFieldWrapperProps;

  const props = withDefaults(defineProps<Props>(), {
    modelValue: undefined,
    defaultValue: undefined,
    value: '',
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
    <FormField
      v-slot="{ value: fieldValue, handleChange, errorMessage }"
      v-model="modelValue"
      :name="name"
    >
      <FormItem :class="containerClass">
        <FormControl>
          <FormBaseRadio
            :id="id"
            :aria-invalid="!!errorMessage"
            :disabled="disabled"
            :label="label"
            :model-value="fieldValue"
            :test-id="testId"
            :value="props.value"
            @update:model-value="handleChange"
          />
        </FormControl>

        <FormDescription v-if="description">{{ description }}</FormDescription>

        <FormMessage />
      </FormItem>
    </FormField>
  </template>

  <template v-else>
    <FormBaseRadio
      v-model="modelValue"
      v-bind="$attrs"
      :class="containerClass"
      :disabled="disabled"
      :label="label"
      :test-id="testId"
      :value="value"
    />
  </template>
</template>
