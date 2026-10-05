<script setup lang="ts">
  import { useMutation, useQueryClient } from '@tanstack/vue-query';
  import { notify } from '@workspace/core/utils/toast';
  import ConfirmDialog from '@workspace/ui/confirm-dialog/ConfirmDialog.vue';
  import { useApiFormError } from '~/composables/useApiFormError';
  import { useAccountService } from '~/modules/account/services';
  import { paths } from '~/router/paths';
  import { useAuthStore } from '~/stores/auth';
  import { usePermissionStore } from '~/stores/permissions';
  import AccountCard from './AccountCard.vue';

  /** Deletes the account after a confirmation, then ends the session and goes home */
  const { t } = useI18n();
  const service = useAccountService();
  const authStore = useAuthStore();
  const queryClient = useQueryClient();
  const localePath = useLocalePath();
  const { showError } = useApiFormError();
  const open = ref(false);

  const remove = useMutation({
    mutationFn: () => service.deleteAccount(),
    onSuccess: async () => {
      open.value = false;
      authStore.clearSession();
      usePermissionStore().$reset();
      queryClient.clear();
      await navigateTo(localePath(paths.home));
      notify('success', { title: t('auth.successTitle'), body: t('account.danger.deleted') });
    },
    onError: (error) => {
      open.value = false;
      // Nowhere on the card to show it: a toast
      showError(error);
    },
  });
</script>

<template>
  <AccountCard
    id="account-delete"
    tone="danger"
    :title="t('account.danger.title')"
    :text="t('account.danger.text')"
  >
    <div>
      <button type="button" class="danger-btn" data-test-id="account-delete" @click="open = true">
        {{ t('account.danger.button') }}
      </button>
    </div>
    <ConfirmDialog
      v-model:open="open"
      test-id="account-delete-confirm"
      icon="hugeicons--delete-02"
      icon-class="text-[oklch(0.5_0.18_25)]"
      :title="t('account.danger.confirmTitle')"
      :description="t('account.danger.confirmText')"
      :confirm-label="t('account.danger.confirm')"
      :cancel-label="t('account.danger.cancel')"
      confirm-variant="danger"
      :loading="remove.isPending.value"
      :auto-close="false"
      content-class="site-ui font-brand"
      @confirm="remove.mutate()"
    />
  </AccountCard>
</template>

<style scoped>
  .danger-btn {
    min-height: 40px;
    padding: 8px 16px;
    border: 1px solid oklch(0.8 0.1 25);
    border-radius: 8px;
    color: oklch(0.45 0.17 25);
    font: 600 14px/20px var(--font);
    cursor: pointer;
  }
  .danger-btn:hover {
    background: oklch(0.97 0.02 25);
  }
</style>
