<script setup lang="ts">
  import { useVModel } from '@vueuse/core';
  import { Field } from '@/components/form';

  interface Props {
    name?: string;
    label: string;
    testId: string;
    tooltip: string;
    modelValue?: boolean;
  }

  const props = withDefaults(defineProps<Props>(), {
    name: undefined,
    modelValue: undefined,
  });

  const emits = defineEmits<{
    (e: 'update:modelValue', value: boolean): void;
  }>();

  const modelValue = useVModel(props, 'modelValue', emits, {
    passive: true,
  });
</script>

<template>
  <div class="flex gap-2.5">
    <Field.Switch v-model="modelValue" :name="name" :label="label" :test-id="testId" />

    <AppTooltip>
      <template #trigger>
        <Icon icon="hugeicons--information-circle" class="text-foreground-placeholder" size="lg" />
      </template>

      <p>{{ tooltip }}</p>
    </AppTooltip>
  </div>
</template>
