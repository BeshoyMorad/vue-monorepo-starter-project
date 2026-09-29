<script setup lang="ts">
  import type { FormFieldWrapperProps, BaseTagsInputProps } from '@/types/form';
  import { useVModel } from '@vueuse/core';
  import { FormField } from '@/components/ui/form';

  defineOptions({
    inheritAttrs: false,
  });

  type Props = BaseTagsInputProps & FormFieldWrapperProps;

  const props = withDefaults(defineProps<Props>(), {
    modelValue: () => [],
    defaultValue: () => [],
    placeholder: undefined,
    disabled: false,
    tagClass: undefined,
    name: undefined,
    label: undefined,
    description: undefined,
    containerClass: undefined,
  });

  const emits = defineEmits<{
    (e: 'update:modelValue', value: string[]): void;
  }>();

  const modelValue = useVModel(props, 'modelValue', emits, {
    passive: true,
    defaultValue: props.defaultValue,
  });
</script>

<template>
  <template v-if="name">
    <FormField v-slot="{ value, handleChange, errorMessage }" v-model="modelValue" :name="name">
      <FormItem :class="containerClass">
        <FormLabel v-if="label">{{ label }}</FormLabel>

        <FormControl>
          <FormBaseTagsInput
            v-bind="$attrs"
            :model-value="value"
            :disabled="disabled"
            :aria-invalid="!!errorMessage"
            :test-id="testId"
            :tag-class="tagClass"
            :placeholder="placeholder"
            @update:model-value="handleChange"
          >
            <template v-if="$slots.tag" #tag="{ value: tagValue }">
              <slot name="tag" :value="tagValue" />
            </template>
          </FormBaseTagsInput>
        </FormControl>

        <FormDescription v-if="description">{{ description }}</FormDescription>

        <FormMessage />
      </FormItem>
    </FormField>
  </template>

  <template v-else>
    <FormBaseTagsInput
      v-model="modelValue"
      v-bind="$attrs"
      :class="containerClass"
      :disabled="disabled"
      :test-id="testId"
      :tag-class="tagClass"
      :placeholder="placeholder"
    >
      <template v-if="$slots.tag" #tag="{ value }">
        <slot name="tag" :value="value" />
      </template>
    </FormBaseTagsInput>
  </template>
</template>
