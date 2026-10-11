<script setup lang="ts">
  /**
   * "Didn't receive the code? Resend code", with a cooldown countdown in place of the
   * button until a new code can be requested.
   * Screen readers get the countdown as a full sentence ("in 42 seconds", not "42s"), and a
   * polite announcement once, when a new code can be requested. The countdown itself is
   * not a live region, so it isn't read out every second.
   */
  import { Button } from '@workspace/ui/ui/button';

  defineProps<{ remaining: number; canResend: boolean; testId: string }>();
  defineEmits<{ resend: [] }>();

  const { t } = useI18n();
</script>

<template>
  <div class="text-center text-sm">
    <p class="text-[oklch(0.45_0_0)]">
      {{ t('auth.verify.noCode') }}
      <Button
        v-if="canResend"
        type="button"
        variant="link"
        :test-id="testId"
        class="text-gold-800 hover:text-gold-900 h-auto rounded-md px-1 py-1 text-[length:inherit] font-semibold focus-visible:ring-0"
        @click="$emit('resend')"
      >
        {{ t('auth.verify.resend') }}
      </Button>
      <span v-else class="text-text-placeholder py-1 tabular-nums">
        <span aria-hidden="true">{{ t('auth.verify.resendIn', { seconds: remaining }) }}</span>
        <span class="sr-only">{{ t('auth.a11y.resendInLong', { seconds: remaining }) }}</span>
      </span>
    </p>
    <span class="sr-only" aria-live="polite">{{
      canResend ? t('auth.a11y.resendReady') : ''
    }}</span>
  </div>
</template>
