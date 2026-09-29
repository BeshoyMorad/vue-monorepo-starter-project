<script setup lang="ts">
  import type { FormFieldWrapperProps, BaseInputPasswordProps } from '@/types/form';
  import { useVModel } from '@vueuse/core';
  import { FormField } from '@/components/ui/form';

  defineOptions({
    inheritAttrs: false,
  });

  type Props = BaseInputPasswordProps & FormFieldWrapperProps;

  const props = withDefaults(defineProps<Props>(), {
    modelValue: undefined,
    defaultValue: undefined,
    name: undefined,
    label: undefined,
    description: undefined,
    containerClass: undefined,
  });

  const emits = defineEmits<{
    (e: 'update:modelValue', value: string | number): void;
  }>();

  const modelValue = useVModel(props, 'modelValue', emits, {
    passive: true,
    defaultValue: props.defaultValue,
  });
</script>

<template>
  <template v-if="name">
    <FormField v-slot="{ componentField }" :name="name">
      <FormItem :class="containerClass">
        <FormLabel v-if="label">{{ label }}</FormLabel>

        <FormControl>
          <FormBaseInputPassword v-bind="{ ...$attrs, ...componentField }" :test-id="testId" />
        </FormControl>

        <FormDescription v-if="description">{{ description }}</FormDescription>

        <FormMessage />
      </FormItem>
    </FormField>
  </template>

  <template v-else>
    <FormBaseInputPassword
      v-model="modelValue"
      v-bind="$attrs"
      :class="containerClass"
      :test-id="testId"
    />
  </template>
</template>
