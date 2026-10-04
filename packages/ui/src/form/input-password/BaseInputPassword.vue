<script setup lang="ts">
  import { ref, computed } from 'vue';
  import { useVModel } from '@vueuse/core';
  import BaseInputText from '@workspace/ui/form/input-text/BaseInputText.vue';
  import { Icon } from '@workspace/ui';

  defineOptions({
    inheritAttrs: false,
  });

  interface Props {
    testId: string;
    modelValue?: string | number;
    defaultValue?: string | number;
    /**
     * Accessible name of the visibility toggle; pass translated text in non-English UIs.
     * The name stays fixed and `aria-pressed` reports whether the password is shown.
     */
    toggleLabel?: string;
  }

  const props = withDefaults(defineProps<Props>(), {
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
