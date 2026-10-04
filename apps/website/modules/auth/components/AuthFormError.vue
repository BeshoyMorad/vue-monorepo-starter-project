<script setup lang="ts">
  import { Icon } from '@workspace/ui';

  /**
   * Error for the whole form (wrong credentials, too many attempts…), shown under the
   * submit button. Errors about one field stay under that field instead.
   * Fed by `formError` from useApiFormError.
   */
  defineProps<{ message?: string; testId: string }>();
</script>

<template>
  <Transition
    enter-active-class="transition duration-200 ease-out"
    enter-from-class="opacity-0 -translate-y-1"
    leave-active-class="transition duration-150 ease-in"
    leave-to-class="opacity-0"
  >
    <p
      v-if="message"
      role="alert"
      :data-test-id="testId"
      class="flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 px-3.5 py-3 text-sm leading-5 text-red-700"
    >
      <Icon icon="hugeicons--alert-circle" class="mt-0.5 size-4 shrink-0" />
      <span class="icon-label">{{ message }}</span>
    </p>
  </Transition>
</template>
