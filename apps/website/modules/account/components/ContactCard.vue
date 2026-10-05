<script setup lang="ts">
  import { useQueryClient } from '@tanstack/vue-query';
  import { notify } from '@workspace/core/utils/toast';
  import { queryKeys } from '~/api/query-keys';
  import { useAccountService } from '~/modules/account/services';
  import type { ContactChannel, CustomerProfile } from '~/modules/account/types';
  import Icon from '@workspace/ui/icon/Icon.vue';
  import { splitSaudiPhone } from '~/modules/account/mask';
  import AccountCard from './AccountCard.vue';
  import ChangeFlowDialog from './ChangeFlowDialog.vue';
  import ContactRequestForm from './ContactRequestForm.vue';

  /** Phone and email, each changed through a code sent to the new value */
  const props = defineProps<{ profile?: CustomerProfile }>();
  const { t } = useI18n();
  const service = useAccountService();
  const queryClient = useQueryClient();

  const editing = ref<ContactChannel | null>(null);
  const open = computed({
    get: () => editing.value !== null,
    set: (value) => !value && (editing.value = null),
  });

  const rows = computed(() => [
    {
      channel: 'phone' as const,
      icon: 'hugeicons--smart-phone-01',
      label: t('account.contact.phone'),
      value: props.profile?.phone,
      verified: Boolean(props.profile?.phoneVerified),
    },
    {
      channel: 'email' as const,
      icon: 'hugeicons--mail-01',
      label: t('account.contact.email'),
      value: props.profile?.email,
      verified: Boolean(props.profile?.emailVerified),
    },
  ]);
  const dialogTitle = computed(() =>
    editing.value === 'phone'
      ? t('account.contact.changePhone')
      : props.profile?.email
        ? t('account.contact.changeEmail')
        : t('account.contact.addEmail')
  );

  const onDone = async () => {
    const channel = editing.value;
    await queryClient.invalidateQueries({ queryKey: queryKeys.account.profile() });
    notify('success', {
      title: t('auth.successTitle'),
      body: t(
        channel === 'phone' ? 'account.contact.phoneChanged' : 'account.contact.emailChanged'
      ),
    });
  };
</script>

<template>
  <AccountCard id="account-contact" :title="t('account.contact.title')">
    <ul class="rows">
      <li v-for="row in rows" :key="row.channel" class="row">
        <span class="row__icon"><Icon :icon="row.icon" class="size-5" /></span>
        <div class="row__body">
          <h3 class="row__label">{{ row.label }}</h3>
          <p v-if="row.value && row.channel === 'phone'" class="row__value" dir="ltr">
            <span class="row__code">
              <span aria-hidden="true">🇸🇦</span>{{ splitSaudiPhone(row.value).code }}
            </span>
            {{ splitSaudiPhone(row.value).local }}
          </p>
          <p v-else-if="row.value" class="row__value">
            <bdi dir="ltr">{{ row.value }}</bdi>
          </p>
          <p v-else class="row__empty">{{ t('account.contact.noEmail') }}</p>
          <p v-if="row.value" class="row__state" :class="{ 'row__state--no': !row.verified }">
            <Icon
              :icon="row.verified ? 'hugeicons--checkmark-circle-02' : 'hugeicons--alert-circle'"
              class="size-3.5"
            />
            <span class="icon-label">{{
              row.verified ? t('account.summary.verified') : t('account.summary.notVerified')
            }}</span>
          </p>
        </div>
        <button
          type="button"
          class="row__btn"
          :data-test-id="`contact-${row.channel}-change`"
          @click="editing = row.channel"
        >
          <Icon icon="hugeicons--pencil-edit-01" class="size-4" />
          {{ row.value ? t('account.contact.change') : t('account.contact.add') }}
          <span class="sr-only">{{ row.label }}</span>
        </button>
      </li>
    </ul>

    <ChangeFlowDialog
      v-model:open="open"
      :test-id="`contact-${editing}`"
      :title="dialogTitle"
      :description="t('account.contact.text')"
      :submit-label="t('account.contact.confirm')"
      :back-label="t('account.contact.back')"
      :confirm="service.confirmContactChange"
      :on-done="onDone"
    >
      <template #request="{ sent }">
        <ContactRequestForm
          v-if="editing"
          :channel="editing"
          :current="editing === 'phone' ? profile?.phone : profile?.email"
          :on-sent="sent"
        />
      </template>
    </ChangeFlowDialog>
  </AccountCard>
</template>

<style scoped>
  .rows {
    display: flex;
    flex-direction: column;
    margin: -24px;
  }
  .row {
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 22px 24px;
  }
  .row + .row {
    border-top: 1px solid #eef0ef;
  }
  .row__icon {
    width: 44px;
    height: 44px;
    flex: none;
    align-self: flex-start;
    display: grid;
    place-items: center;
    border-radius: 12px;
    background: #f3f4f6;
    color: var(--caption);
  }
  .row__body {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 4px;
  }
  .row__label {
    color: var(--primary);
    font: 700 14px/20px var(--font);
  }
  .row__value {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: flex-start;
    gap: 8px;
    color: var(--text);
    font: 500 15px/22px var(--font);
    overflow-wrap: anywhere;
  }
  [dir='rtl'] .row__value[dir='ltr'] {
    justify-content: flex-end;
  }
  .row__code {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 1px 8px;
    border-radius: 6px;
    background: #f3f4f6;
    color: var(--primary);
    font-size: 13px;
    font-weight: 600;
  }
  .row__empty {
    color: var(--muted);
    font-size: 15px;
  }
  .row__state {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    color: var(--color-primary-600);
    font-size: 12px;
    line-height: 16px;
  }
  .row__state--no {
    color: var(--color-gold-800);
  }
  .row__btn {
    flex: none;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    min-height: 36px;
    padding: 6px 14px;
    border: 1px solid #d1d5db;
    border-radius: 99px;
    color: var(--primary);
    font: 500 14px/20px var(--font);
    cursor: pointer;
  }
  .row__btn:hover {
    background: #f3f4f6;
  }
  @media (max-width: 640px) {
    .rows {
      margin-inline: -16px;
    }
    .row {
      flex-wrap: wrap;
      padding-inline: 16px;
    }
  }
</style>
