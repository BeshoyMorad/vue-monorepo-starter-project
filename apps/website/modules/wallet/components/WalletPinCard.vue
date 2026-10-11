<script setup lang="ts">
  import Icon from '@workspace/ui/icon/Icon.vue';
  import { Button } from '@workspace/ui/ui/button';
  import type { WalletStatus } from '~/modules/wallet/types';
  import ChangePinDialog from './ChangePinDialog.vue';

  /** "Wallet PIN" row with the change button. A wallet that isn't active yet is told why. */
  defineProps<{ status: WalletStatus }>();
  const { t } = useI18n();
  const open = ref(false);
</script>

<template>
  <section class="pin" aria-labelledby="wallet-pin">
    <span class="pin__icon" aria-hidden="true">
      <Icon icon="hugeicons--shield-key" class="size-5" />
    </span>
    <div class="pin__body">
      <h2 id="wallet-pin" class="pin__title">{{ t('wallet.pin.title') }}</h2>
      <p class="pin__text" :class="{ 'pin__text--todo': status === 'PENDING_ACTIVATION' }">
        {{ status === 'PENDING_ACTIVATION' ? t('wallet.pin.activate') : t('wallet.pin.text') }}
      </p>
    </div>
    <Button
      type="button"
      class="btn btn--primary"
      test-id="wallet-pin-change"
      icon="hugeicons--square-lock-02"
      @click="open = true"
    >
      {{ t('wallet.pin.change') }}
    </Button>
    <ChangePinDialog v-model:open="open" />
  </section>
</template>

<style scoped>
  .pin {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 14px;
    padding: 20px 24px;
    border-radius: 20px;
    background: #fff;
    box-shadow: 0 1px 2px rgb(0 0 0 / 0.04);
  }
  .pin__icon {
    width: 48px;
    height: 48px;
    display: grid;
    place-items: center;
    border-radius: 12px;
    background: #f3f4f6;
    color: var(--caption);
  }
  .pin__body {
    flex: 1;
    min-width: 12rem;
  }
  .pin__title {
    color: var(--primary);
    font: 700 18px/26px var(--font);
  }
  .pin__text {
    color: var(--caption);
    font-size: 13px;
    line-height: 20px;
  }
  .pin__text--todo {
    color: var(--color-gold-800);
    font-weight: 600;
  }
  .pin .btn {
    min-height: 48px;
    padding-inline: 24px;
  }
  @media (max-width: 640px) {
    .pin {
      padding-inline: 16px;
    }
    .pin .btn {
      width: 100%;
    }
  }
</style>
