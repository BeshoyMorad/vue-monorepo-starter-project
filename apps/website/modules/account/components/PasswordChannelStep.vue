<script setup lang="ts">
  import { useMutation } from '@tanstack/vue-query';
  import Icon from '@workspace/ui/icon/Icon.vue';
  import { useApiFormError } from '~/composables/useApiFormError';
  import AuthFormError from '~/modules/auth/components/AuthFormError.vue';
  import { useAuthService } from '~/modules/auth/services';
  import { maskEmail, maskPhone } from '~/modules/account/mask';
  import type { ContactChannel, CustomerProfile } from '~/modules/account/types';

  /** Step 1 of "change password": pick the phone or email to receive the code */
  const props = defineProps<{ profile?: CustomerProfile }>();
  const emit = defineEmits<{
    sent: [step: { token: string; channel: ContactChannel; target: string }];
    cancel: [];
  }>();

  const { t } = useI18n();
  const auth = useAuthService();
  const { showError, formError, clearFormError } = useApiFormError();
  const channel = ref<ContactChannel>('phone');

  const options = computed(() =>
    [
      {
        id: 'phone' as const,
        icon: 'hugeicons--smart-phone-01',
        label: t('account.contact.phone'),
        value: props.profile?.phone,
        masked: maskPhone(props.profile?.phone),
      },
      {
        id: 'email' as const,
        icon: 'hugeicons--mail-01',
        label: t('account.contact.email'),
        value: props.profile?.email,
        masked: maskEmail(props.profile?.email),
      },
    ].filter((option) => option.value)
  );

  const send = useMutation({
    mutationFn: (identifier: string) => auth.forgotPassword(identifier, channel.value),
  });
  const onSubmit = async () => {
    const option = options.value.find((item) => item.id === channel.value);
    if (!option?.value) return;
    clearFormError();
    try {
      const { token } = await send.mutateAsync(option.value);
      emit('sent', { token, channel: option.id, target: option.masked });
    } catch (error) {
      showError(error);
    }
  };
</script>

<template>
  <form class="space-y-5" novalidate @submit.prevent="onSubmit">
    <fieldset>
      <legend class="mb-3 text-sm font-semibold text-[var(--color-primary-500)]">
        {{ t('account.password.choose') }}
      </legend>
      <div class="choices">
        <label v-for="option in options" :key="option.id" class="choice">
          <input v-model="channel" type="radio" name="password-channel" :value="option.id" />
          <span class="choice__icon"><Icon :icon="option.icon" class="size-5" /></span>
          <span class="choice__text">
            <span class="choice__label">{{ option.label }}</span>
            <bdi dir="ltr" class="choice__value">{{ option.masked }}</bdi>
          </span>
        </label>
      </div>
    </fieldset>
    <AuthFormError test-id="password-channel-error" :message="formError" />
    <div class="actions">
      <button type="button" class="btn actions__cancel" @click="emit('cancel')">
        {{ t('account.password.cancel') }}
      </button>
      <button
        type="submit"
        class="btn btn--primary"
        data-test-id="password-send"
        :aria-disabled="send.isPending.value || undefined"
      >
        <Icon icon="hugeicons--sent" class="size-4 rtl:-scale-x-100" />
        {{ t('account.password.sendCode') }}
      </button>
    </div>
  </form>
</template>

<style scoped>
  .choices {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(190px, 1fr));
    gap: 12px;
  }
  .choice {
    position: relative;
    display: flex;
    align-items: center;
    gap: 12px;
    min-width: 0;
    padding: 14px;
    border: 1px solid #e5e7eb;
    border-radius: 14px;
    cursor: pointer;
  }
  .choice input {
    position: absolute;
    opacity: 0;
    pointer-events: none;
  }
  .choice:has(:checked) {
    border-color: var(--color-primary-500);
    background: #f7f8f7;
    box-shadow: 0 0 0 1px var(--color-primary-500);
  }
  .choice:has(:focus-visible) {
    outline: 2px solid rgb(45 83 61 / 0.45);
    outline-offset: 3px;
  }
  .choice__icon {
    width: 40px;
    height: 40px;
    flex: none;
    display: grid;
    place-items: center;
    border-radius: 10px;
    background: #f3f4f6;
    color: var(--color-primary-500);
  }
  .choice__text {
    min-width: 0;
    display: flex;
    flex-direction: column;
  }
  .choice__label {
    color: var(--color-primary-500);
    font-size: 14px;
    font-weight: 600;
  }
  .choice__value {
    overflow: hidden;
    color: oklch(0.45 0 0);
    font-size: 12px;
    text-overflow: ellipsis;
    white-space: nowrap;
    text-align: start;
  }
  .actions {
    display: flex;
    justify-content: space-between;
    gap: 12px;
    margin-inline: -24px;
    margin-bottom: -24px;
    padding: 16px 24px;
    border-top: 1px solid #e5e7eb;
  }
  .actions__cancel {
    color: oklch(0.3 0 0);
  }
  .actions__cancel:hover {
    background: #f3f4f6;
  }
</style>
