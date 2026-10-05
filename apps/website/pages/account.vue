<script setup lang="ts">
  import Icon from '@workspace/ui/icon/Icon.vue';
  import { Skeleton } from '@workspace/ui/ui/skeleton';
  import AccountSummary from '~/modules/account/components/AccountSummary.vue';
  import BankCard from '~/modules/account/components/BankCard.vue';
  import ContactCard from '~/modules/account/components/ContactCard.vue';
  import DeleteAccountCard from '~/modules/account/components/DeleteAccountCard.vue';
  import ProfileForm from '~/modules/account/components/ProfileForm.vue';
  import StatsCard from '~/modules/account/components/StatsCard.vue';
  import { useAccountProfile } from '~/modules/account/composables/useAccountProfile';

  /**
   * The signed-in customer's account: profile, contact details, IBAN, activity and account
   * deletion. Guests are sent to sign in and come back here afterwards.
   */
  definePageMeta({ layout: 'site', requiresAuth: true });

  const { t } = useI18n();
  useSeoMeta({ title: () => t('account.seo.title'), robots: 'noindex, nofollow' });

  const profile = useServerPrefetch(useAccountProfile());
  const data = computed(() => profile.data.value ?? undefined);
</script>

<template>
  <!-- auth-ui: the brand form styling of the auth screens (assets/css/brand.css) -->
  <section class="section account auth-ui" aria-labelledby="account-title">
    <div class="account__inner container">
      <header class="account__head">
        <h1 id="account-title" class="account__title">{{ t('account.title') }}</h1>
        <p class="account__text">{{ t('account.subtitle') }}</p>
      </header>

      <div v-if="profile.isPending.value" class="account__grid" aria-busy="true">
        <Skeleton class="h-72 rounded-2xl" />
        <div class="account__main">
          <Skeleton v-for="n in 3" :key="n" class="h-48 rounded-2xl" />
        </div>
      </div>

      <div v-else-if="profile.isError.value && !data" class="state" role="alert">
        <Icon icon="hugeicons--alert-circle" class="size-7" />
        <p>{{ t('account.loadError') }}</p>
        <button type="button" class="btn btn--primary" @click="profile.refetch()">
          {{ t('account.retry') }}
        </button>
      </div>

      <div v-else class="account__grid">
        <div class="account__side">
          <AccountSummary :profile="data" />
        </div>
        <div class="account__main">
          <ProfileForm :profile="data" />
          <ContactCard :profile="data" />
          <BankCard :profile="data" />
          <StatsCard />
          <DeleteAccountCard />
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
  .account {
    align-items: stretch;
    background: var(--modal2);
  }
  .account__inner {
    display: flex;
    flex-direction: column;
    gap: 24px;
  }
  .account__title {
    color: var(--primary);
    font: 700 28px/36px var(--font);
  }
  .account__text {
    margin-top: 4px;
    color: var(--caption);
    font-size: 15px;
  }
  .account__grid {
    display: grid;
    grid-template-columns: 300px 1fr;
    align-items: start;
    gap: 24px;
  }
  .account__side {
    position: sticky;
    top: 156px;
  }
  .account__main {
    display: flex;
    flex-direction: column;
    gap: 20px;
    min-width: 0;
  }
  .state {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
    padding: 48px 24px;
    border-radius: var(--radius);
    background: #fff;
    color: var(--caption);
    text-align: center;
  }
  @media (max-width: 1024px) {
    .account__grid {
      grid-template-columns: 1fr;
    }
    .account__side {
      position: static;
    }
  }
  @media (max-width: 640px) {
    .account__title {
      font-size: 22px;
      line-height: 30px;
    }
  }
</style>
