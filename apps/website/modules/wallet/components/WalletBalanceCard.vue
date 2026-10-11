<script setup lang="ts">
  import Icon from '@workspace/ui/icon/Icon.vue';
  import { Button } from '@workspace/ui/ui/button';
  import { Skeleton } from '@workspace/ui/ui/skeleton';
  import type { Wallet } from '~/modules/wallet/types';
  import WalletAmount from './WalletAmount.vue';

  /**
   * Balance, top up and withdraw, then four totals (deposits, money sent to the bank, number
   * of deposits, completed withdrawals), as in the Ibbil wallet design.
   */
  const props = defineProps<{
    wallet: Wallet;
    totals?: {
      totalDeposits: number;
      transferred: number;
      depositCount: number;
      withdrawals: number;
    };
    /** The totals cover only the latest `limit` transactions */
    partialLimit?: number;
  }>();
  const emit = defineEmits<{ topUp: [] }>();
  const { t, locale } = useI18n();

  /** Smallest balance that can be withdrawn, in riyals */
  const WITHDRAW_MIN = 10;
  const canTopUp = computed(() => props.wallet.status === 'ACTIVE');
  const withdrawHint = computed(() =>
    props.wallet.availableBalance < WITHDRAW_MIN
      ? t('wallet.balance.withdrawMin', { min: WITHDRAW_MIN })
      : t('wallet.balance.withdrawSoon')
  );
  const hintId = useId();
  const count = (n: number) => new Intl.NumberFormat(`${locale.value}-u-nu-latn`).format(n);

  const TILES = [
    { id: 'totalDeposits', icon: 'hugeicons--arrow-down-left-01', money: true, tone: 'grey' },
    { id: 'transferred', icon: 'hugeicons--bank', money: true, tone: 'gold' },
    { id: 'depositCount', icon: 'hugeicons--plus-sign-circle', money: false, tone: 'grey' },
    { id: 'withdrawals', icon: 'hugeicons--minus-sign-circle', money: false, tone: 'grey' },
  ] as const;
</script>

<template>
  <section class="balance" aria-labelledby="wallet-balance">
    <div class="balance__top">
      <div class="balance__now">
        <span class="balance__icon" aria-hidden="true">
          <Icon icon="hugeicons--wallet-01" class="size-5" />
        </span>
        <div>
          <h2 id="wallet-balance" class="balance__label">
            {{ t('wallet.balance.label') }}
            <span
              v-if="wallet.status !== 'ACTIVE'"
              class="balance__status"
              :class="`balance__status--${wallet.status.toLowerCase()}`"
            >
              {{ t(`wallet.status.${wallet.status}`) }}
            </span>
          </h2>
          <p class="balance__value">
            <WalletAmount :value="wallet.availableBalance" :currency="wallet.currency" />
          </p>
        </div>
      </div>

      <div class="balance__actions">
        <Button
          type="button"
          class="btn btn--primary"
          test-id="wallet-top-up"
          icon="hugeicons--plus-sign"
          :aria-disabled="!canTopUp || undefined"
          @click="canTopUp && emit('topUp')"
        >
          {{ t('wallet.balance.topUp') }}
        </Button>
        <!-- No customer withdrawal endpoint yet: the button explains why it's unavailable -->
        <Button
          type="button"
          class="withdraw ui-bare"
          test-id="wallet-withdraw"
          aria-disabled="true"
          :aria-describedby="hintId"
        >
          <Icon icon="hugeicons--bank" class="size-4" />
          {{ t('wallet.balance.withdraw') }}
        </Button>
        <p :id="hintId" class="balance__hint">{{ withdrawHint }}</p>
      </div>
    </div>

    <ul v-if="totals" class="tiles">
      <li v-for="tile in TILES" :key="tile.id" class="tile">
        <span class="tile__icon" :class="`tile__icon--${tile.tone}`" aria-hidden="true">
          <Icon :icon="tile.icon" class="size-4 rtl:-scale-x-100" />
        </span>
        <span class="tile__value">
          <WalletAmount v-if="tile.money" :value="totals[tile.id]" :currency="wallet.currency" />
          <template v-else>{{ count(totals[tile.id]) }}</template>
        </span>
        <span class="tile__label">{{ t(`wallet.balance.${tile.id}`) }}</span>
      </li>
    </ul>
    <div v-else class="tiles" aria-hidden="true">
      <Skeleton v-for="n in 4" :key="n" class="h-[94px] rounded-2xl" />
    </div>
    <p v-if="partialLimit" class="balance__note">
      {{ t('wallet.balance.partial', { n: partialLimit }) }}
    </p>
  </section>
</template>

<style scoped>
  .balance {
    position: relative;
    display: flex;
    flex-direction: column;
    gap: 24px;
    padding: 24px;
    border-radius: 20px;
    background: #fff;
    box-shadow: 0 1px 2px rgb(0 0 0 / 0.04);
  }
  /* Green-gold-green accent along the top, clipped by the card corners (as on the overview) */
  .balance::before {
    content: '';
    position: absolute;
    inset: 0 0 auto;
    height: 20px;
    border-radius: 20px 20px 0 0;
    background: linear-gradient(
        to right,
        var(--color-primary-500),
        var(--color-gold-500),
        var(--color-primary-500)
      )
      top / 100% 3px no-repeat;
    pointer-events: none;
  }
  .balance__top {
    display: flex;
    flex-wrap: wrap;
    align-items: flex-start;
    justify-content: space-between;
    gap: 20px;
  }
  .balance__now {
    display: flex;
    align-items: flex-start;
    gap: 16px;
  }
  .balance__icon {
    width: 52px;
    height: 52px;
    display: grid;
    flex: none;
    place-items: center;
    border-radius: 12px;
    background: #f3f4f6;
    color: var(--primary);
  }
  .balance__label {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 8px;
    color: var(--caption);
    font: 500 14px/20px var(--font);
  }
  .balance__status {
    padding: 1px 8px;
    border-radius: 99px;
    background: var(--color-gold-50);
    color: var(--color-gold-800);
    font-size: 12px;
    font-weight: 600;
  }
  .balance__status--suspended,
  .balance__status--closed {
    background: oklch(0.96 0.03 25);
    color: oklch(0.45 0.17 25);
  }
  .balance__value {
    margin-top: 4px;
    color: var(--primary);
    font: 700 32px/40px var(--font);
  }
  .balance__actions {
    display: flex;
    flex-direction: column;
    gap: 10px;
    width: min(100%, 220px);
  }
  .balance__actions .btn {
    min-height: 48px;
  }
  .withdraw {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    min-height: 40px;
    border: 1px solid #e5e7eb;
    border-radius: 12px;
    background: #fff;
    color: var(--muted);
    font: 500 14px/20px var(--font);
    cursor: not-allowed;
  }
  .balance__hint {
    color: var(--caption);
    font-size: 12px;
    line-height: 18px;
  }
  .balance__note {
    margin-top: -12px;
    color: var(--caption);
    font-size: 12px;
  }
  .tiles {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 12px;
  }
  /* Icon at the start, value at the end, label underneath (as in the design) */
  .tile {
    display: grid;
    grid-template-columns: auto 1fr;
    grid-template-areas: 'icon value' 'label label';
    align-items: center;
    gap: 12px 8px;
    padding: 16px;
    border: 1px solid #eef0ef;
    border-radius: 16px;
  }
  .tile__icon {
    grid-area: icon;
    width: 36px;
    height: 36px;
    display: grid;
    place-items: center;
    border-radius: 10px;
  }
  .tile__icon--grey {
    background: #f3f4f6;
    color: var(--caption);
  }
  .tile__icon--gold {
    background: var(--color-gold-50);
    color: var(--color-gold-700);
  }
  .tile__value {
    grid-area: value;
    color: var(--primary);
    font: 700 20px/28px var(--font);
    text-align: end;
  }
  .tile__label {
    grid-area: label;
    color: var(--caption);
    font-size: 14px;
  }
  @media (max-width: 1100px) {
    .tiles {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }
  @media (max-width: 640px) {
    .balance {
      padding: 20px 16px;
    }
    .balance__actions {
      width: 100%;
    }
  }
</style>
