<script setup lang="ts">
  import { useMutation, useQueryClient } from '@tanstack/vue-query';
  import { toTypedSchema } from '@vee-validate/yup';
  import { notify } from '@workspace/core/utils/toast';
  import InputText from '@workspace/ui/form/input-text/InputText.vue';
  import Icon from '@workspace/ui/icon/Icon.vue';
  import { Button } from '@workspace/ui/ui/button';
  import { Dialog, DialogDescription, DialogTitle } from '@workspace/ui/ui/dialog';
  import { useForm } from 'vee-validate';
  import { queryKeys } from '~/api/query-keys';
  import { useApiFormError } from '~/composables/useApiFormError';
  import { useCanSubmit } from '~/composables/useCanSubmit';
  import AuthFormError from '~/modules/auth/components/AuthFormError.vue';
  import {
    createDepositSchema,
    parseAmount,
    type DepositFormValues,
  } from '~/modules/wallet/schemas';
  import { useWalletService } from '~/modules/wallet/services';
  import type { WalletCurrency } from '~/modules/wallet/types';
  import { focusFirstInvalidField } from '~/utils/focus';
  import WalletAmount from './WalletAmount.vue';

  /**
   * "Add balance to wallet", as in the Ibbil design: the balance now and after the top-up,
   * the amount (typed or picked), the accepted cards, then Cancel / Top up. The amount goes
   * to the API's test gateway; the balance and history reload afterwards.
   */
  const props = defineProps<{ walletId: string; balance: number; currency: WalletCurrency }>();
  const open = defineModel<boolean>('open', { default: false });

  const { t, locale } = useI18n();
  const service = useWalletService();
  const queryClient = useQueryClient();
  const QUICK_AMOUNTS = [100, 500, 1000, 2000];
  const CARDS = [
    { id: 'mada', src: '/images/payment/mada.svg' },
    { id: 'visa', src: '/images/payment/visa.svg' },
    { id: 'mastercard', src: '/images/payment/mastercard.svg' },
  ];

  const schema = createDepositSchema(t);
  const { handleSubmit, values, setFieldValue, resetForm } = useForm<DepositFormValues>({
    validationSchema: toTypedSchema(schema),
    initialValues: { amount: '' },
  });
  const canSubmit = useCanSubmit(schema, values);
  const { showError, formError, clearFormError } = useApiFormError(values);
  const hintId = useId();
  const deposit = useMutation({
    mutationFn: (amount: number) => service.deposit(props.walletId, amount),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.wallet.all() }),
  });

  watch(open, (isOpen) => {
    if (!isOpen) {
      resetForm();
      clearFormError();
    }
  });

  /** What the balance becomes; the current balance while the amount isn't a valid one */
  const after = computed(() =>
    schema.isValidSync({ amount: values.amount })
      ? props.balance + parseAmount(values.amount ?? '')
      : props.balance
  );
  const format = (n: number) => new Intl.NumberFormat(`${locale.value}-u-nu-latn`).format(n);
  const isPicked = (amount: number) => parseAmount(values.amount ?? '') === amount;

  const onSubmit = handleSubmit(async ({ amount }, { setErrors }) => {
    clearFormError();
    const value = parseAmount(amount);
    try {
      await deposit.mutateAsync(value);
      open.value = false;
      notify('success', {
        title: t('auth.successTitle'),
        body: t('wallet.deposit.done', { amount: format(value) }),
      });
    } catch (error) {
      showError(error, setErrors as (errors: Record<string, string>) => void);
    }
  }, focusFirstInvalidField);
  const submit = (event: Event) => {
    if (!canSubmit.value || deposit.isPending.value) return;
    void onSubmit(event);
  };
</script>

<template>
  <Dialog v-model:open="open" content-class="site-ui auth-ui font-brand sm:max-w-lg">
    <template #header>
      <DialogTitle class="text-primary-500 text-lg font-bold">
        {{ t('wallet.deposit.title') }}
      </DialogTitle>
      <DialogDescription class="sr-only">{{ t('wallet.deposit.text') }}</DialogDescription>
    </template>

    <form method="post" novalidate @submit.prevent="submit">
      <p class="intro" aria-hidden="true">{{ t('wallet.deposit.text') }}</p>

      <!-- Now → after the top-up; announced politely as the amount changes -->
      <div class="preview" role="group" :aria-label="t('wallet.deposit.preview')">
        <div class="preview__item">
          <span class="preview__label">{{ t('wallet.deposit.current') }}</span>
          <WalletAmount class="preview__value" :value="balance" :currency="currency" />
        </div>
        <Icon
          icon="hugeicons--arrow-right-02"
          class="preview__arrow size-4 rtl:rotate-180"
          aria-hidden="true"
        />
        <div class="preview__item preview__item--after" aria-live="polite">
          <span class="preview__label">{{ t('wallet.deposit.after') }}</span>
          <WalletAmount class="preview__value" :value="after" :currency="currency" />
        </div>
      </div>

      <InputText
        name="amount"
        test-id="deposit-amount"
        inputmode="decimal"
        autocomplete="off"
        placeholder="0"
        icon="hugeicons--saudi-riyal"
        icon-position="right"
        :label="t('wallet.deposit.amount')"
        aria-required="true"
        container-class="auth-field field-required amount"
      />

      <div class="quick" role="group" :aria-label="t('wallet.deposit.quick')">
        <Button
          v-for="amount in QUICK_AMOUNTS"
          :key="amount"
          type="button"
          class="quick__item ui-bare"
          :test-id="`deposit-quick-${amount}`"
          :aria-pressed="isPicked(amount)"
          @click="setFieldValue('amount', String(amount))"
        >
          {{ format(amount) }}
        </Button>
      </div>

      <ul class="cards" :aria-label="t('wallet.deposit.methods')">
        <li v-for="card in CARDS" :key="card.id" class="cards__item">
          <img :src="card.src" alt="" class="cards__logo" :class="`cards__logo--${card.id}`" />
        </li>
      </ul>

      <AuthFormError test-id="deposit-error" :message="formError" class="mt-4" />

      <div class="actions">
        <Button
          type="button"
          class="btn actions__cancel"
          test-id="deposit-cancel"
          @click="open = false"
        >
          {{ t('wallet.deposit.cancel') }}
        </Button>
        <Button
          type="submit"
          class="btn btn--primary actions__submit"
          test-id="deposit-submit"
          icon="hugeicons--wallet-add-02"
          :loading="deposit.isPending.value"
          :aria-disabled="!canSubmit || undefined"
          :aria-describedby="canSubmit ? undefined : hintId"
        >
          {{ t('wallet.deposit.submit') }}
        </Button>
        <span v-if="!canSubmit" :id="hintId" class="sr-only">{{ t('auth.a11y.submitHint') }}</span>
      </div>
    </form>
  </Dialog>
</template>

<style scoped>
  .intro {
    margin-bottom: 20px;
    color: oklch(0.4 0 0);
    font-size: 14px;
    line-height: 22px;
  }
  .preview {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    margin-bottom: 24px;
    padding: 14px 16px;
    border: 1px solid #e5e7eb;
    border-radius: 16px;
    background: #f9faf9;
  }
  .preview__item {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }
  .preview__item--after {
    align-items: flex-end;
  }
  .preview__label {
    color: oklch(0.4 0 0);
    font-size: 12px;
    font-weight: 600;
  }
  .preview__item--after .preview__label {
    color: var(--color-gold-800);
  }
  .preview__value {
    color: var(--color-primary-500);
    font: 700 20px/28px var(--font);
  }
  .preview__item--after .preview__value {
    color: var(--color-gold-800);
  }
  .preview__arrow {
    color: var(--color-gold-700);
  }
  .amount :deep(input) {
    font-size: 18px;
    font-weight: 700;
  }
  .amount :deep([data-slot='form-label']) {
    color: var(--color-primary-500);
    font-weight: 700;
  }
  .quick {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-top: 16px;
  }
  .quick__item {
    min-width: 70px;
    min-height: 38px;
    padding: 6px 16px;
    border-radius: 12px;
    background: var(--color-gold-50);
    color: var(--color-gold-800);
    font: 700 14px/20px var(--font);
    cursor: pointer;
    transition:
      background-color 150ms,
      color 150ms;
  }
  .quick__item:hover {
    background: var(--color-gold-100);
  }
  /* Picked: solid gold as in the design, with dark text for contrast (4.6:1) */
  .quick__item[aria-pressed='true'] {
    background: var(--color-gold-500);
    color: var(--color-gold-900);
  }
  .cards {
    display: flex;
    gap: 8px;
    margin-top: 20px;
    padding: 12px;
    border: 1px solid #e5e7eb;
    border-radius: 16px;
  }
  .cards__item {
    display: grid;
    place-items: center;
    height: 32px;
    padding: 0 8px;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    background: #fff;
  }
  .cards__logo {
    height: 16px;
    width: auto;
  }
  .cards__logo--mada {
    height: 20px;
  }
  .cards__logo--mastercard {
    height: 18px;
  }
  /* Footer across the dialog's full width, as in the PIN dialog */
  .actions {
    display: flex;
    justify-content: space-between;
    gap: 12px;
    margin: 24px -24px -24px;
    padding: 16px 24px;
    border-top: 1px solid #e5e7eb;
  }
  .actions__cancel {
    color: oklch(0.3 0 0);
  }
  .actions__cancel:hover {
    background: #f3f4f6;
  }
  .actions__submit {
    min-width: 176px;
  }
  .actions__submit[aria-disabled='true'] {
    opacity: 0.5;
    cursor: not-allowed;
  }
  @media (prefers-reduced-motion: reduce) {
    .quick__item {
      transition: none;
    }
  }
</style>
