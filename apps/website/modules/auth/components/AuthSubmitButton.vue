<script setup lang="ts">
  import { Button } from '@workspace/ui';

  /**
   * Full-width primary submit button with a trailing arrow (mirrored in RTL).
   * Disabled until the page is interactive (before hydration the browser would submit
   * the form natively and could put the password in the URL), and while `disabled` is
   * set, e.g. until the required fields are filled (see useCanSubmit).
   */
  defineProps<{ testId: string; loading?: boolean; disabled?: boolean }>();

  const isInteractive = ref(false);
  onMounted(() => {
    isInteractive.value = true;
  });
</script>

<template>
  <Button
    type="submit"
    size="lg"
    :test-id="testId"
    :loading="loading"
    :disabled="!isInteractive || disabled"
    icon="hugeicons--arrow-right-02"
    icon-position="right"
    icon-class="rtl:rotate-180"
    class="h-12 w-full rounded-lg text-sm font-medium shadow-[0_4px_6px_-1px_rgb(45_83_61/0.2),0_2px_4px_-2px_rgb(45_83_61/0.2)]"
  >
    <span class="icon-label"><slot /></span>
  </Button>
</template>
