<script setup lang="ts">
  import { notify } from '@workspace/core/utils/toast';
  import { Dialog, DialogDescription, DialogTitle } from '@workspace/ui/ui/dialog';
  import ChangePinForm from './ChangePinForm.vue';

  /**
   * "Change wallet PIN" in three steps, as in the Ibbil design. Saving also activates a
   * wallet that isn't active yet.
   */
  const open = defineModel<boolean>('open', { default: false });
  const { t } = useI18n();
  const STEPS = ['oldPin', 'newPin', 'confirmPin'] as const;
  const step = ref(0);
  watch(open, (isOpen) => {
    if (!isOpen) step.value = 0;
  });

  const onDone = () => {
    open.value = false;
    notify('success', { title: t('auth.successTitle'), body: t('wallet.pin.changed') });
  };
</script>

<template>
  <Dialog
    v-model:open="open"
    content-class="site-ui auth-ui font-brand grid-cols-[minmax(0,1fr)] overflow-x-hidden sm:max-w-lg"
  >
    <template #header>
      <DialogTitle class="text-primary-500 text-lg font-bold">
        {{ t('wallet.pin.dialogTitle') }}
      </DialogTitle>
      <DialogDescription class="sr-only">
        {{ t('wallet.pin.progress', { n: step + 1, name: t(`wallet.pin.steps.${STEPS[step]}`) }) }}
      </DialogDescription>
    </template>
    <ChangePinForm v-model:step="step" @done="onDone" @cancel="open = false" />
  </Dialog>
</template>
