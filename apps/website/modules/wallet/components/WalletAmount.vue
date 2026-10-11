<script setup lang="ts">
  import Icon from '@workspace/ui/icon/Icon.vue';
  import type { WalletCurrency } from '~/modules/wallet/types';

  /**
   * An amount of money with Western digits in both languages (as on ibbil.com). Riyals use the
   * Saudi riyal sign, read out as "SAR"; other currencies use their code.
   */
  const props = withDefaults(
    defineProps<{ value: number; currency?: WalletCurrency; sign?: '+' | '−' }>(),
    { currency: 'SAR', sign: undefined }
  );
  const { t, locale } = useI18n();
  const text = computed(() =>
    new Intl.NumberFormat(`${locale.value}-u-nu-latn`, {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(props.value)
  );
</script>

<template>
  <span class="amount" dir="ltr">
    <span>{{ sign }}{{ text }}</span>
    <template v-if="currency === 'SAR'">
      <Icon icon="hugeicons--saudi-riyal" class="amount__sign" aria-hidden="true" />
      <span class="sr-only">{{ t('wallet.currency') }}</span>
    </template>
    <span v-else class="amount__code">{{ currency }}</span>
  </span>
</template>

<style scoped>
  .amount {
    display: inline-flex;
    align-items: center;
    gap: 0.2em;
    white-space: nowrap;
  }
  /* In Arabic the sign follows the number on the reading side, as in the design */
  [dir='rtl'] .amount {
    flex-direction: row-reverse;
  }
  .amount__sign {
    width: 0.85em;
    height: 0.85em;
  }
  .amount__code {
    font-size: 0.6em;
    font-weight: 600;
  }
</style>
