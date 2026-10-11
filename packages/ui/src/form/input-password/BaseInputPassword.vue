<script setup lang="ts">
  import { ref, computed } from 'vue';
  import { useVModel } from '@vueuse/core';
  import BaseInputText from '@workspace/ui/form/input-text/BaseInputText.vue';
  import { Icon } from '@workspace/ui/icon';
  import type { BaseInputPasswordProps } from './types';

  defineOptions({
    inheritAttrs: false,
  });

  const props = withDefaults(defineProps<BaseInputPasswordProps>(), {
    modelValue: undefined,
    defaultValue: undefined,
    toggleLabel: 'Show password',
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
  <BaseInputText v-model="modelValue" v-bind="$attrs" :type="inputType" :test-id="testId">
    <template #right>
      <!-- Named for screen readers, with a 28px target and a visible keyboard focus ring -->
      <button
        type="button"
        class="text-text-disabled hover:text-text-default focus-visible:ring-border-primary -m-1 flex cursor-pointer items-center justify-center rounded-md p-1 focus:outline-none focus-visible:ring-2"
        :test-id="`${testId}-toggle`"
        :aria-label="toggleLabel"
        :aria-pressed="showPassword"
        @click="showPassword = !showPassword"
      >
        <Icon
          :icon="showPassword ? 'hugeicons--view' : 'hugeicons--view-off-slash'"
          class="size-5"
          aria-hidden="true"
        />
      </button>
    </template>
  </BaseInputText>
</template>
