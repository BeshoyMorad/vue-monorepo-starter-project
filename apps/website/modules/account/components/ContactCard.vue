<script setup lang="ts">
  import { useQueryClient } from '@tanstack/vue-query';
  import { notify } from '@workspace/core/utils/toast';
  import { queryKeys } from '~/api/query-keys';
  import { useAccountService } from '~/modules/account/services';
  import type { ContactChannel, CustomerProfile } from '~/modules/account/types';
  import AccountCard from './AccountCard.vue';
  import ChangeFlowDialog from './ChangeFlowDialog.vue';
  import ContactRequestForm from './ContactRequestForm.vue';
  import VerifiedBadge from './VerifiedBadge.vue';

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
      label: t('account.contact.phone'),
      value: props.profile?.phone,
      verified: Boolean(props.profile?.phoneVerified),
    },
    {
      channel: 'email' as const,
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
  <AccountCard
    id="account-contact"
    :title="t('account.contact.title')"
    :text="t('account.contact.text')"
  >
    <dl class="rows">
      <div v-for="row in rows" :key="row.channel" class="row">
        <dt class="row__label">{{ row.label }}</dt>
        <dd class="row__value">
          <template v-if="row.value">
            <bdi dir="ltr">{{ row.value }}</bdi>
            <VerifiedBadge :verified="row.verified" />
          </template>
          <span v-else class="row__empty">{{ t('account.contact.noEmail') }}</span>
        </dd>
        <dd class="row__action">
          <button
            type="button"
            class="btn btn--glass row__btn"
            :data-test-id="`contact-${row.channel}-change`"
            @click="editing = row.channel"
          >
            {{ row.value ? t('account.contact.change') : t('account.contact.add') }}
            <span class="sr-only">{{ row.label }}</span>
          </button>
        </dd>
      </div>
    </dl>

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
  }
  .row {
    display: grid;
    grid-template-columns: 160px 1fr auto;
    align-items: center;
    gap: 8px 16px;
    padding-block: 14px;
  }
  .row + .row {
    border-top: 0.5px solid var(--border);
  }
  .row__label {
    color: var(--caption);
    font-size: 14px;
  }
  .row__value {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 8px;
    min-width: 0;
    color: var(--text);
    font: 600 15px/22px var(--font);
    overflow-wrap: anywhere;
  }
  .row__empty {
    color: var(--muted);
    font-weight: 400;
  }
  .row__btn {
    min-height: 36px;
    padding: 6px 14px;
  }
  @media (max-width: 640px) {
    .row {
      grid-template-columns: 1fr auto;
    }
    .row__label {
      grid-column: 1 / -1;
    }
  }
</style>
