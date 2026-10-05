<script setup lang="ts">
  import { watch } from 'vue';
  import { Dialog, DialogClose, DialogDescription, DialogTitle } from '@workspace/ui/ui/dialog';
  import { Button } from '@workspace/ui/ui/button';
  import { Icon } from '@workspace/ui/icon';
  import { cn } from '@workspace/core';
  import type { ButtonVariants } from '@workspace/ui/ui/button';
  import type { HTMLAttributes } from 'vue';

  interface ConfirmDialogProps {
    testId?: string;
    icon?: string;
    title?: string;
    description?: string;
    cancelLabel?: string;
    confirmLabel?: string;
    confirmVariant?: ButtonVariants['variant'];
    loading?: boolean;
    autoClose?: boolean;
    hideCloseIcon?: boolean;
    hideHeader?: boolean;
    contentClass?: HTMLAttributes['class'];
    bodyClass?: HTMLAttributes['class'];
    iconClass?: HTMLAttributes['class'];
  }

  interface ConfirmDialogEmits {
    (e: 'cancel'): void;
    (e: 'confirm'): void;
  }

  const {
    testId = 'ui-confirm-dialog',
    icon = undefined,
    title = undefined,
    description = undefined,
    cancelLabel = 'Cancel',
    confirmLabel = 'Confirm',
    confirmVariant = 'default',
    loading = false,
    autoClose = true,
    hideCloseIcon = false,
    hideHeader = true,
    contentClass = '',
    bodyClass = '',
    iconClass = 'text-text-primary',
  } = defineProps<ConfirmDialogProps>();

  const isOpen = defineModel<boolean>('open');
  const emit = defineEmits<ConfirmDialogEmits>();

  // Track if close was triggered by confirm to prevent double-canceling
  let isConfirming = false;

  const confirm = () => {
    isConfirming = true;
    if (autoClose) {
      isOpen.value = false;
    }
    emit('confirm');
  };

  // Handle Cancel event when dialog is closed externally (Escape, Overlay click, etc.)
  watch(isOpen, (newVal) => {
    if (!newVal) {
      if (!isConfirming) {
        emit('cancel');
      }
      isConfirming = false; // Reset state
    }
  });
</script>

<template>
  <Dialog
    v-model:open="isOpen"
    :test-id="testId"
    :hide-close-icon="hideCloseIcon"
    :hide-header="hideHeader"
    :content-class="contentClass"
    :body-class="
      cn(
        'flex flex-col items-center justify-center px-6 py-16 grow w-full gap-6 relative',
        bodyClass
      )
    "
  >
    <!-- Forward trigger and header slots -->
    <template v-if="$slots.header" #header>
      <slot name="header" />
    </template>

    <template v-if="$slots.trigger" #trigger>
      <slot name="trigger" />
    </template>

    <slot>
      <div class="flex flex-col items-center gap-2 text-center">
        <div v-if="icon" class="flex items-center justify-center rounded-full p-5">
          <Icon :test-id="`${testId}-icon`" :icon="icon" :class="cn('h-8 w-8', iconClass)" />
        </div>

        <!-- Dialog title / description parts (not plain text) so the dialog is named and
             described for screen readers even with the header hidden. Caption color: the
             disabled grey was below 4.5:1 contrast. -->
        <DialogTitle v-if="title" class="m-0 text-xl leading-snug font-semibold">
          {{ title }}
        </DialogTitle>

        <DialogDescription
          v-if="description"
          class="text-text-caption m-0 text-sm font-medium whitespace-pre-line"
        >
          {{ description }}
        </DialogDescription>
      </div>
    </slot>

    <template #footer>
      <slot name="footer">
        <DialogClose :as-child="true">
          <Button
            :test-id="`${testId}-cancel-button`"
            variant="ghost"
            class="min-w-35.5"
            @click="emit('cancel')"
          >
            {{ cancelLabel }}
          </Button>
        </DialogClose>

        <Button
          :test-id="`${testId}-confirm-button`"
          :variant="confirmVariant"
          class="min-w-35.5"
          :loading="loading"
          @click="confirm"
        >
          {{ confirmLabel }}
        </Button>
      </slot>
    </template>
  </Dialog>
</template>
