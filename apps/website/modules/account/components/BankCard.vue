<script setup lang="ts">
  import { useQueryClient } from '@tanstack/vue-query';
  import { notify } from '@workspace/core/utils/toast';
  import Icon from '@workspace/ui/icon/Icon.vue';
  import { queryKeys } from '~/api/query-keys';
  import { useAccountService } from '~/modules/account/services';
  import type { CustomerProfile } from '~/modules/account/types';
  import AccountCard from './AccountCard.vue';
  import ChangeFlowDialog from './ChangeFlowDialog.vue';
  import IbanRequestForm from './IbanRequestForm.vue';

  /** Refund IBAN, changed through a code sent to the registered phone */
  const props = defineProps<{ profile?: CustomerProfile }>();
  const { t } = useI18n();
  const service = useAccountService();
  const queryClient = useQueryClient();
  const open = ref(false);

  /** Only the last 4 digits are shown: SA•• •••• •••• •••• •••• 1234 */
  const masked = computed(() => {
    const iban = props.profile?.iban?.replace(/\s+/g, '');
    return iban ? `${iban.slice(0, 2)}•• •••• •••• •••• •••• ${iban.slice(-4)}` : '';
  });

  const onDone = async () => {
    await queryClient.invalidateQueries({ queryKey: queryKeys.account.profile() });
    notify('success', { title: t('auth.successTitle'), body: t('account.bank.changed') });
  };
</script>

<template>
  <AccountCard id="account-bank" :title="t('account.bank.title')" :text="t('account.bank.text')">
    <div class="bank">
      <span class="bank__icon"><Icon icon="hugeicons--bank" class="size-6" /></span>
      <div class="bank__body">
        <span class="bank__label">{{ t('account.bank.iban') }}</span>
        <bdi v-if="masked" dir="ltr" class="bank__value">{{ masked }}</bdi>
        <span v-else class="bank__empty">{{ t('account.bank.none') }}</span>
      </div>
      <button type="button" class="btn btn--glass" data-test-id="iban-change" @click="open = true">
        {{ masked ? t('account.bank.change') : t('account.bank.add') }}
      </button>
    </div>

    <ChangeFlowDialog
      v-model:open="open"
      test-id="iban"
      :title="masked ? t('account.bank.change') : t('account.bank.add')"
      :description="t('account.bank.text')"
      :submit-label="t('account.bank.confirm')"
      :back-label="t('account.bank.back')"
      :confirm="service.confirmIbanChange"
      :on-done="onDone"
    >
      <template #request="{ sent }">
        <IbanRequestForm :phone="profile?.phone" :on-sent="sent" />
      </template>
    </ChangeFlowDialog>
  </AccountCard>
</template>

<style scoped>
  .bank {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 14px;
  }
  .bank__icon {
    width: 48px;
    height: 48px;
    display: grid;
    place-items: center;
    border-radius: 12px;
    background: var(--chip);
    color: var(--primary);
  }
  .bank__body {
    flex: 1;
    min-width: 180px;
    display: flex;
    flex-direction: column;
  }
  .bank__label {
    color: var(--caption);
    font-size: 13px;
  }
  .bank__value {
    color: var(--text);
    font: 600 15px/22px var(--font);
    letter-spacing: 0.04em;
  }
  .bank__empty {
    color: var(--muted);
    font-size: 15px;
  }
</style>
