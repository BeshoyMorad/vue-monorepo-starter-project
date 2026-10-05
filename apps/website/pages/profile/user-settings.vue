<script setup lang="ts">
  import Icon from '@workspace/ui/icon/Icon.vue';
  import { Skeleton } from '@workspace/ui/ui/skeleton';
  import BankCard from '~/modules/account/components/BankCard.vue';
  import ChangePasswordCard from '~/modules/account/components/ChangePasswordCard.vue';
  import ContactCard from '~/modules/account/components/ContactCard.vue';
  import DeleteAccountCard from '~/modules/account/components/DeleteAccountCard.vue';
  import ProfileForm from '~/modules/account/components/ProfileForm.vue';
  import { useAccountProfile } from '~/modules/account/composables/useAccountProfile';

  /**
   * Account settings (ibbil.com/en/profile/user-settings): user details, contact
   * information, password, bank account and account deletion. Guests sign in first.
   */
  definePageMeta({ requiresAuth: true });

  const { t } = useI18n();
  useSeoMeta({ title: () => t('account.seo.settings'), robots: 'noindex, nofollow' });

  // Same cached query as the parent page (pages/profile.vue): no second request
  const profile = useAccountProfile();
  const data = computed(() => profile.data.value ?? undefined);
</script>

<template>
  <div class="page">
    <h1 id="profile-title" class="sr-only">{{ t('account.seo.settings') }}</h1>
    <template v-if="profile.isPending.value">
      <Skeleton v-for="n in 3" :key="n" class="h-56 rounded-[20px]" />
    </template>
    <div v-else-if="profile.isError.value && !data" class="state" role="alert">
      <Icon icon="hugeicons--alert-circle" class="size-7" />
      <p>{{ t('account.loadError') }}</p>
      <button type="button" class="btn btn--primary" @click="profile.refetch()">
        {{ t('account.retry') }}
      </button>
    </div>
    <template v-else>
      <ProfileForm :profile="data" />
      <ContactCard :profile="data" />
      <ChangePasswordCard :profile="data" />
      <BankCard :profile="data" />
      <DeleteAccountCard />
    </template>
  </div>
</template>

<style scoped>
  .page {
    display: flex;
    flex-direction: column;
    gap: 28px;
  }
  .state {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
    padding: 48px 24px;
    border-radius: 20px;
    background: #fff;
    color: var(--caption);
    text-align: center;
  }
</style>
