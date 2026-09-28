<script setup lang="ts">
  import { useVModel } from '@vueuse/core';

  defineOptions({
    inheritAttrs: false,
  });

  interface Props {
    testId: string;
    modelValue?: string[];
    defaultValue?: string[];
    placeholder?: string;
    disabled?: boolean;
    tagClass?: string;
  }

  const props = withDefaults(defineProps<Props>(), {
    modelValue: () => [],
    defaultValue: () => [],
    placeholder: undefined,
    disabled: false,
    tagClass: undefined,
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
  <TagsInput v-model="modelValue" v-bind="$attrs" :disabled="disabled" :data-testid="testId">
    <template v-for="item in modelValue" :key="item">
      <slot name="tag" :value="item">
        <TagsInputItem :value="item" :class="tagClass">
          <TagsInputItemText />
          <TagsInputItemDelete />
        </TagsInputItem>
      </slot>
    </template>
    <TagsInputInput :placeholder="placeholder" />
  </TagsInput>
</template>
