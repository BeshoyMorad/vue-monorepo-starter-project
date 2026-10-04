<script setup lang="ts">
  import { useVModel } from '@vueuse/core';
  import {
    FormField,
    FormItem,
    FormLabel,
    FormControl,
    FormDescription,
    FormMessage,
  } from '@workspace/ui/ui/form';
  import BaseInputOtp from './BaseInputOtp.vue';

  defineOptions({
    inheritAttrs: false,
  });

  interface Props {
    testId: string;
    modelValue?: string;
    defaultValue?: string;
    length?: number;
    integerOnly?: boolean;
    disabled?: boolean;
    label?: string;
    // Form validation wrapper props
    name?: string;
    description?: string;
    containerClass?: string;
    /**
     * Validate only when the form is submitted, not on input, change, blur or v-model
     * updates (vee-validate's defaults), so a half-typed code doesn't show "incomplete"
     * while the user is typing.
     */
    validateOnSubmitOnly?: boolean;
  }

  const props = withDefaults(defineProps<Props>(), {
    modelValue: undefined,
    defaultValue: undefined,
    length: 6,
    integerOnly: false,
    disabled: false,
    label: undefined,
    name: undefined,
    description: undefined,
    containerClass: undefined,
    validateOnSubmitOnly: false,
  });

  const emits = defineEmits<{
    (e: 'update:modelValue', value: string): void;
  }>();

  const modelValue = useVModel(props, 'modelValue', emits, {
    passive: true,
    defaultValue: props.defaultValue ?? '',
  });
</script>

<template>
  <template v-if="name">
    <FormField
      v-slot="{ componentField }"
      :name="name"
      :validate-on-model-update="!validateOnSubmitOnly"
      :validate-on-blur="!validateOnSubmitOnly"
      :validate-on-change="!validateOnSubmitOnly"
      :validate-on-input="false"
    >
      <FormItem :class="containerClass">
        <FormLabel v-if="label">{{ label }}</FormLabel>

        <FormControl>
          <BaseInputOtp
            v-bind="{ ...$attrs, ...componentField }"
            :disabled="disabled"
            :integer-only="integerOnly"
            :length="length"
            :test-id="testId"
          />
        </FormControl>

        <FormDescription v-if="description">{{ description }}</FormDescription>

        <FormMessage />
      </FormItem>
    </FormField>
  </template>

  <template v-else>
    <BaseInputOtp
      v-model="modelValue"
      v-bind="$attrs"
      :class="containerClass"
      :disabled="disabled"
      :integer-only="integerOnly"
      :length="length"
      :test-id="testId"
    />
  </template>
</template>
