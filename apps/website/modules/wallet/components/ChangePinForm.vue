<script setup lang="ts">
  import { useMutation, useQueryClient } from '@tanstack/vue-query';
  import { toTypedSchema } from '@vee-validate/yup';
  import BaseInputOtp from '@workspace/ui/form/input-otp/BaseInputOtp.vue';
  import Icon from '@workspace/ui/icon/Icon.vue';
  import { Button } from '@workspace/ui/ui/button';
  import { useField, useForm } from 'vee-validate';
  import { queryKeys } from '~/api/query-keys';
  import { useApiFormError } from '~/composables/useApiFormError';
  import DialogStepper from '~/modules/account/components/DialogStepper.vue';
  import { DIALOG_STEP_TRANSITION } from '~/modules/account/constants';
  import AuthFormError from '~/modules/auth/components/AuthFormError.vue';
  import {
    createPinSchema,
    PIN_LENGTH,
    toLatinDigits,
    type PinFormValues,
  } from '~/modules/wallet/schemas';
  import { useWalletService } from '~/modules/wallet/services';

  /**
   * The three steps of "change wallet PIN" (see ChangePinDialog): current PIN → new PIN →
   * confirm it, each as six digit boxes, masked unless "Show" is on. Mounted with the
   * dialog's content, so every opening starts from a clean form.
   */
  const step = defineModel<number>('step', { default: 0 });
  const emit = defineEmits<{ done: []; cancel: [] }>();

  const { t } = useI18n();
  const service = useWalletService();
  const queryClient = useQueryClient();
  const STEPS = ['oldPin', 'newPin', 'confirmPin'] as const;
  const shown = ref(false);
  const field = computed(() => STEPS[step.value] ?? 'oldPin');
  const last = computed(() => step.value === STEPS.length - 1);

  const { handleSubmit, values, errors, validateField } = useForm<PinFormValues>({
    validationSchema: toTypedSchema(createPinSchema(t)),
    initialValues: { oldPin: '', newPin: '', confirmPin: '' },
  });
  /**
   * The boxes are bound here rather than through the kit's InputOtp field, which validates
   * on focus and blur even with validate-on-submit-only: errors would appear as soon as the
   * dialog moved focus. These only validate on Continue / Save.
   */
  const fields = Object.fromEntries(
    STEPS.map((name) => [name, useField<string>(name, undefined, { validateOnValueUpdate: false })])
  ) as Record<(typeof STEPS)[number], ReturnType<typeof useField<string>>>;
  const ids = Object.fromEntries(STEPS.map((name) => [name, useId()])) as Record<
    (typeof STEPS)[number],
    string
  >;
  const { showError, formError, clearFormError } = useApiFormError(values);
  // An error goes away as soon as that PIN is edited; it's checked again on Continue
  for (const name of STEPS) {
    watch(
      () => values[name],
      () => fields[name].setErrors([])
    );
  }
  const digits = (name: (typeof STEPS)[number]) => (values[name] ?? '').length;
  // Project rule: Continue stays unavailable until this step's six digits are in
  const ready = computed(() => digits(field.value) === PIN_LENGTH);
  const hintId = useId();

  const change = useMutation({
    mutationFn: service.changePin,
    onSuccess: (wallet) => {
      if (wallet) queryClient.setQueryData(queryKeys.wallet.current(), wallet);
      return queryClient.invalidateQueries({ queryKey: queryKeys.wallet.current() });
    },
  });

  // The dialog focuses its close button on open: start in the digit boxes instead
  const root = ref<HTMLElement>();
  onMounted(() =>
    requestAnimationFrame(() =>
      requestAnimationFrame(() => root.value?.querySelector<HTMLElement>('input')?.focus())
    )
  );

  const save = handleSubmit(async (pins, { setErrors }) => {
    clearFormError();
    try {
      await change.mutateAsync({
        oldPin: toLatinDigits(pins.oldPin),
        newPin: toLatinDigits(pins.newPin),
        confirmPin: toLatinDigits(pins.confirmPin),
      });
      emit('done');
    } catch (error) {
      showError(error, setErrors as (fieldErrors: Record<string, string>) => void);
      // A field error from the API (e.g. a wrong current PIN) takes the user to that step
      const wrong = STEPS.findIndex((name) => errors.value[name]);
      if (wrong >= 0) step.value = wrong;
    }
  });

  const next = async () => {
    if (!ready.value || change.isPending.value) return;
    clearFormError();
    const { valid } = await validateField(field.value);
    if (!valid) return;
    if (last.value) await save();
    else step.value += 1;
  };
  const back = () => {
    clearFormError();
    if (step.value === 0) emit('cancel');
    else step.value -= 1;
  };
</script>

<template>
  <div ref="root">
    <DialogStepper :steps="STEPS.map((name) => t(`wallet.pin.steps.${name}`))" :current="step" />

    <form method="post" novalidate @submit.prevent="next">
      <!-- All three stay mounted (v-show): vee-validate marks a schema field that isn't
           rendered as invalid, which would greet each new step with "required" -->
      <Transition
        v-for="name in STEPS"
        :key="name"
        name="auth-step"
        :duration="{ enter: 220, leave: 0 }"
        @after-enter="DIALOG_STEP_TRANSITION.onAfterEnter"
      >
        <div v-show="name === field" class="pin">
          <label :id="`${ids[name]}-label`" class="pin__label">
            {{ t(`wallet.pin.${name}`) }}
          </label>
          <div class="auth-otp" dir="ltr">
            <BaseInputOtp
              v-model="fields[name].value.value"
              :test-id="`pin-${name}`"
              :length="PIN_LENGTH"
              integer-only
              :masked="!shown"
              :autocomplete="name === 'oldPin' ? 'current-password' : 'new-password'"
              aria-required="true"
              :aria-labelledby="`${ids[name]}-label`"
              :aria-invalid="errors[name] ? 'true' : undefined"
              :aria-describedby="errors[name] ? `${ids[name]}-error` : undefined"
            />
          </div>
          <p v-if="errors[name]" :id="`${ids[name]}-error`" class="pin__error" role="alert">
            {{ errors[name] }}
          </p>
          <!-- After the boxes in the DOM, so a new step focuses the boxes first -->
          <Button
            type="button"
            class="pin__toggle ui-bare"
            :test-id="`pin-toggle-${name}`"
            :aria-pressed="shown"
            :aria-label="shown ? t('wallet.pin.hideLabel') : t('wallet.pin.showLabel')"
            @click="shown = !shown"
          >
            <Icon :icon="shown ? 'hugeicons--view-off' : 'hugeicons--view'" class="size-3.5" />
            {{ shown ? t('wallet.pin.hide') : t('wallet.pin.show') }}
          </Button>
          <!-- One dot per digit typed; screen readers hear the count instead -->
          <div class="pin__dots" aria-hidden="true">
            <span
              v-for="n in PIN_LENGTH"
              :key="n"
              class="pin__dot"
              :class="{ 'pin__dot--on': n <= digits(name) }"
            />
          </div>
          <p v-if="name === field" class="sr-only" aria-live="polite">
            {{ t('wallet.pin.entered', { count: digits(name), length: PIN_LENGTH }) }}
          </p>
        </div>
      </Transition>
      <AuthFormError test-id="pin-error" :message="formError" class="mt-4" />

      <div class="actions">
        <Button type="button" class="btn actions__back" test-id="pin-back" @click="back">
          {{ step === 0 ? t('wallet.pin.cancel') : t('wallet.pin.back') }}
        </Button>
        <Button
          type="submit"
          class="btn btn--primary actions__next"
          test-id="pin-next"
          icon="hugeicons--arrow-right-02"
          icon-position="right"
          icon-class="rtl:rotate-180"
          :loading="change.isPending.value"
          :aria-disabled="!ready || undefined"
          :aria-describedby="ready ? undefined : hintId"
        >
          {{ last ? t('wallet.pin.save') : t('wallet.pin.continue') }}
        </Button>
        <span v-if="!ready" :id="hintId" class="sr-only">{{ t('auth.a11y.submitHint') }}</span>
      </div>
    </form>
  </div>
</template>

<style scoped>
  .pin {
    position: relative;
  }
  /* "Show" sits at the end of the label row */
  .pin__toggle {
    position: absolute;
    top: 0;
    inset-inline-end: 0;
    z-index: 1;
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 2px 4px;
    border-radius: 6px;
    color: oklch(0.4 0 0);
    font: 600 12px/18px var(--font);
    cursor: pointer;
  }
  .pin__toggle:hover {
    color: var(--color-primary-500);
  }
  /* A bigger dot for each hidden digit */
  .pin :deep([data-slot='input-otp-slot']) {
    font-size: 28px;
  }
  .pin__label {
    display: block;
    margin-bottom: 12px;
    color: var(--color-primary-500);
    font: 700 15px/24px var(--font);
  }
  .pin__error {
    margin-top: 8px;
    color: oklch(0.5 0.2 25);
    font-size: 13px;
    text-align: center;
  }
  .pin__dots {
    display: flex;
    justify-content: center;
    gap: 6px;
    margin-top: 12px;
  }
  .pin__dot {
    width: 5px;
    height: 5px;
    border-radius: 50%;
    background: #d1d5db;
    transition: background-color 150ms;
  }
  .pin__dot--on {
    background: var(--color-primary-500);
  }
  /* Footer across the dialog's full width, as in the password dialog */
  .actions {
    display: flex;
    justify-content: space-between;
    gap: 12px;
    margin: 24px -24px -24px;
    padding: 16px 24px;
    border-top: 1px solid #e5e7eb;
  }
  .actions__back {
    color: oklch(0.3 0 0);
  }
  .actions__back:hover {
    background: #f3f4f6;
  }
  .actions__next {
    min-width: 160px;
  }
  .actions__next[aria-disabled='true'] {
    opacity: 0.5;
    cursor: not-allowed;
  }
  @media (prefers-reduced-motion: reduce) {
    .pin__dot {
      transition: none;
    }
  }
</style>
