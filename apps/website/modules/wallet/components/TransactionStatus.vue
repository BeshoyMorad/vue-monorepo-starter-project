<script setup lang="ts">
  import Icon from '@workspace/ui/icon/Icon.vue';
  import type { TransactionStatus } from '~/modules/wallet/types';

  /** Status chip: an icon and a word, never color alone */
  const props = defineProps<{ status: TransactionStatus }>();
  const { t } = useI18n();

  const TONES: Record<TransactionStatus, { tone: string; icon: string }> = {
    INITIATED: { tone: 'wait', icon: 'hugeicons--clock-01' },
    PENDING: { tone: 'wait', icon: 'hugeicons--clock-01' },
    HELD: { tone: 'wait', icon: 'hugeicons--pause' },
    CAPTURED: { tone: 'good', icon: 'hugeicons--tick-02' },
    SETTLED: { tone: 'good', icon: 'hugeicons--tick-double-02' },
    VOIDED: { tone: 'bad', icon: 'hugeicons--cancel-01' },
    EXPIRED: { tone: 'bad', icon: 'hugeicons--time-quarter-pass' },
  };
  const look = computed(() => TONES[props.status] ?? TONES.PENDING);
</script>

<template>
  <span class="chip" :class="`chip--${look.tone}`">
    <Icon :icon="look.icon" class="size-3.5" aria-hidden="true" />
    {{ t(`wallet.transactions.statuses.${status}`) }}
  </span>
</template>

<style scoped>
  .chip {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 2px 10px;
    border-radius: 99px;
    font: 600 12px/18px var(--font);
    white-space: nowrap;
  }
  .chip--good {
    background: var(--color-primary-50);
    color: var(--color-primary-700);
  }
  .chip--wait {
    background: var(--color-gold-50);
    color: var(--color-gold-800);
  }
  .chip--bad {
    background: oklch(0.96 0.03 25);
    color: oklch(0.45 0.17 25);
  }
</style>
