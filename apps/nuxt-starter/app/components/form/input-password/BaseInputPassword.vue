<script setup lang="ts">
  import type { BaseInputPasswordProps } from '@/types/form';
  import { useVModel } from '@vueuse/core';

  defineOptions({
    inheritAttrs: false,
  });

  const props = withDefaults(defineProps<BaseInputPasswordProps>(), {
    modelValue: undefined,
    defaultValue: undefined,
  });

  const emits = defineEmits<{
    (e: 'update:modelValue', value: string | number): void;
  }>();

  const modelValue = useVModel(props, 'modelValue', emits, {
    passive: true,
    defaultValue: props.defaultValue,
  });

  const showPassword = ref(false);
  const inputType = computed(() => (showPassword.value ? 'text' : 'password'));
</script>

<template>
  <FormBaseInputText v-model="modelValue" v-bind="$attrs" :type="inputType" :test-id="testId">
    <template #right>
      <button
        type="button"
        class="text-text-disabled hover:text-text-default flex cursor-pointer items-center justify-center focus:outline-none"
        :test-id="`${testId}-toggle`"
        @click="showPassword = !showPassword"
      >
        <Icon
          :icon="showPassword ? 'hugeicons--view' : 'hugeicons--view-off-slash'"
          class="size-5"
        />
      </button>
    </template>
  </FormBaseInputText>
</template>
