<script setup lang="ts">
  /** "Resend code" button with a cooldown countdown. */
  defineProps<{ remaining: number; canResend: boolean; testId: string }>();
  defineEmits<{ resend: [] }>();

  const { t } = useI18n();
</script>

<template>
  <div class="text-center text-sm">
    <button
      v-if="canResend"
      type="button"
      :data-test-id="testId"
      class="text-gold-600 hover:text-gold-700 cursor-pointer font-semibold"
      @click="$emit('resend')"
    >
      {{ t('auth.verify.resend') }}
    </button>
    <span v-else class="text-text-placeholder tabular-nums">
      {{ t('auth.verify.resendIn', { seconds: remaining }) }}
    </span>
  </div>
</template>
