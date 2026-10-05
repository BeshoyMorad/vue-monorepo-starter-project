<script setup lang="ts">
  import { Dialog } from '@workspace/ui/ui/dialog';
  import { DIALOG_STEP_TRANSITION } from '~/modules/account/constants';
  import type { ConfirmChangeRequest } from '~/modules/account/types';
  import CodeConfirmForm from './CodeConfirmForm.vue';

  /**
   * Two-step change confirmed by a code (phone, email, IBAN). Step 1 is the `request`
   * slot: it calls `sent` with the token, where the code went, and how to ask again.
   * Step 2 is the shared code form. Closing the dialog starts over next time.
   */
  export interface SentStep {
    token: string;
    /** Text of step 2, e.g. "Enter the code sent to +9665…" */
    text: string;
    /** Repeats step 1 for a new code; returns its token */
    again: () => Promise<string>;
  }

  const props = defineProps<{
    testId: string;
    title: string;
    description: string;
    submitLabel: string;
    backLabel: string;
    confirm: (body: ConfirmChangeRequest) => Promise<unknown>;
    onDone: () => void | Promise<void>;
  }>();
  const open = defineModel<boolean>('open', { default: false });

  const step = ref<SentStep | null>(null);
  watch(open, (isOpen) => !isOpen && (step.value = null));

  const onConfirmed = async () => {
    await props.onDone();
    open.value = false;
  };
</script>

<template>
  <Dialog
    v-model:open="open"
    :title="title"
    :description="description"
    content-class="site-ui auth-ui font-brand sm:max-w-md"
  >
    <Transition v-bind="DIALOG_STEP_TRANSITION">
      <div v-if="!step" key="request">
        <slot name="request" :sent="(value: SentStep) => (step = value)" />
      </div>
      <CodeConfirmForm
        v-else
        :key="step.token"
        :test-id="testId"
        :token="step.token"
        :text="step.text"
        :submit-label="submitLabel"
        :back-label="backLabel"
        :confirm="confirm"
        :resend="step.again"
        :on-confirmed="onConfirmed"
        @back="step = null"
      />
    </Transition>
  </Dialog>
</template>
