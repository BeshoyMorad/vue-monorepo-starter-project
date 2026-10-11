<script setup lang="ts">
  import { useMutation, useQueryClient } from '@tanstack/vue-query';
  import { toTypedSchema } from '@vee-validate/yup';
  import { notify } from '@workspace/core/utils/toast';
  import InputText from '@workspace/ui/form/input-text/InputText.vue';
  import { Button } from '@workspace/ui/ui/button';
  import { Dialog, DialogDescription, DialogTitle } from '@workspace/ui/ui/dialog';
  import { useForm } from 'vee-validate';
  import { queryKeys } from '~/api/query-keys';
  import { useApiFormError } from '~/composables/useApiFormError';
  import { useCanSubmit } from '~/composables/useCanSubmit';
  import AuthFormError from '~/modules/auth/components/AuthFormError.vue';
  import AuthSubmitButton from '~/modules/auth/components/AuthSubmitButton.vue';
  import {
    createDepositSchema,
    parseAmount,
    type DepositFormValues,
  } from '~/modules/wallet/schemas';
  import { useWalletService } from '~/modules/wallet/services';
  import { focusFirstInvalidField } from '~/utils/focus';

  /**
   * "Top up wallet": an amount in riyals, sent to the API's test gateway. The balance and
   * the history reload afterwards.
   */
  const props = defineProps<{ walletId: string }>();
  const open = defineModel<boolean>('open', { default: false });

  const { t, locale } = useI18n();
  const service = useWalletService();
  const queryClient = useQueryClient();
  const QUICK_AMOUNTS = [50, 100, 250, 500];

  const schema = createDepositSchema(t);
  const { handleSubmit, values, setFieldValue, resetForm } = useForm<DepositFormValues>({
    validationSchema: toTypedSchema(schema),
    initialValues: { amount: '' },
  });
  const canSubmit = useCanSubmit(schema, values);
  const { showError, formError, clearFormError } = useApiFormError(values);
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

  const format = (n: number) => new Intl.NumberFormat(`${locale.value}-u-nu-latn`).format(n);
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
</script>

<template>
  <Dialog v-model:open="open" content-class="site-ui auth-ui font-brand sm:max-w-md">
    <template #header>
      <div class="flex flex-col gap-1">
        <DialogTitle class="text-primary-500 text-lg font-bold">
          {{ t('wallet.deposit.title') }}
        </DialogTitle>
        <DialogDescription class="text-sm text-[oklch(0.45_0_0)]">
          {{ t('wallet.deposit.text') }}
        </DialogDescription>
      </div>
    </template>

    <form class="space-y-5" method="post" novalidate @submit="onSubmit">
      <div class="quick" role="group" :aria-label="t('wallet.deposit.quick')">
        <Button
          v-for="amount in QUICK_AMOUNTS"
          :key="amount"
          type="button"
          class="quick__item ui-bare"
          :test-id="`deposit-quick-${amount}`"
          :aria-pressed="values.amount === String(amount)"
          @click="setFieldValue('amount', String(amount))"
        >
          {{ format(amount) }}
        </Button>
      </div>
      <InputText
        name="amount"
        test-id="deposit-amount"
        inputmode="decimal"
        autocomplete="off"
        dir="ltr"
        placeholder="0.00"
        icon="hugeicons--saudi-riyal"
        :label="t('wallet.deposit.amount')"
        :description="t('wallet.deposit.hint')"
        aria-required="true"
        container-class="auth-field field-required"
      />
      <AuthSubmitButton
        test-id="deposit-submit"
        :loading="deposit.isPending.value"
        :disabled="!canSubmit"
      >
        {{ t('wallet.deposit.submit') }}
      </AuthSubmitButton>
      <AuthFormError test-id="deposit-error" :message="formError" />
    </form>
  </Dialog>
</template>

<style scoped>
  .quick {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 8px;
  }
  .quick__item {
    min-height: 40px;
    border: 1px solid #e5e7eb;
    border-radius: 10px;
    background: #fff;
    color: var(--primary);
    font: 600 14px/20px var(--font);
    cursor: pointer;
  }
  .quick__item:hover {
    background: #f3f4f6;
  }
  .quick__item[aria-pressed='true'] {
    border-color: var(--color-primary-300);
    background: var(--color-primary-50);
  }
</style>
