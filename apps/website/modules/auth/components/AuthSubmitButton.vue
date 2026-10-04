<script setup lang="ts">
  import { Button } from '@workspace/ui';

  /**
   * Full-width primary submit button with a trailing arrow (mirrored in RTL).
   *
   * - Before hydration it is truly disabled: the browser would otherwise submit the form
   *   natively and could put the password in the URL.
   * - While `disabled` (e.g. until the required fields are filled, see useCanSubmit) it looks
   *   and acts disabled but stays focusable (aria-disabled), and screen readers hear why.
   *   Clicks, Enter and implicit form submission all go through a click, which is cancelled.
   * - The shared Button disables itself while loading, which drops keyboard focus; focus is
   *   put back on the button afterwards unless something else (an invalid field) took it.
   */
  const props = defineProps<{ testId: string; loading?: boolean; disabled?: boolean }>();

  const { t } = useI18n();
  const hintId = useId();
  const root = ref<{ $el: HTMLElement } | null>(null);

  const isInteractive = ref(false);
  onMounted(() => {
    isInteractive.value = true;
  });

  const blockIfNotReady = (event: Event) => {
    if (props.disabled) {
      event.preventDefault();
    }
  };

  watch(
    () => props.loading,
    (loading, wasLoading) => {
      if (wasLoading && !loading) {
        setTimeout(() => {
          if (document.activeElement === document.body) {
            root.value?.$el.focus();
          }
        });
      }
    }
  );
</script>

<template>
  <Button
    ref="root"
    type="submit"
    size="lg"
    :test-id="testId"
    :loading="loading"
    :disabled="!isInteractive"
    :aria-disabled="disabled || undefined"
    :aria-describedby="disabled ? hintId : undefined"
    icon="hugeicons--arrow-right-02"
    icon-position="right"
    icon-class="rtl:rotate-180"
    class="aria-disabled:hover:bg-bg-primary-default h-12 w-full rounded-lg text-sm font-medium shadow-[0_4px_6px_-1px_rgb(45_83_61/0.2),0_2px_4px_-2px_rgb(45_83_61/0.2)] aria-disabled:cursor-not-allowed aria-disabled:opacity-50"
    @click="blockIfNotReady"
  >
    <span class="icon-label"><slot /></span>
  </Button>
  <span v-if="disabled" :id="hintId" class="sr-only">{{ t('auth.a11y.submitHint') }}</span>
</template>
