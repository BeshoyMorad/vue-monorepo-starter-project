<script setup lang="ts">
  import Icon from '@workspace/ui/icon/Icon.vue';
  import type { CustomerProfile } from '~/modules/account/types';
  import { paths } from '~/router/paths';
  import ProfileSidebar from './ProfileSidebar.vue';

  /**
   * Frame of the profile pages (pages/profile.vue): breadcrumb, sidebar and the page.
   * Each page has its own visually hidden h1 (id="profile-title"): the breadcrumb shows
   * where you are.
   */
  defineProps<{ profile?: CustomerProfile; settings?: boolean }>();
  const { t } = useI18n();
  const localePath = useLocalePath();
</script>

<template>
  <!-- auth-ui: the brand form styling of the auth screens (assets/css/brand.css) -->
  <section class="profile auth-ui" aria-labelledby="profile-title">
    <div class="profile__inner container">
      <nav :aria-label="t('account.breadcrumb.label')">
        <ol class="crumbs">
          <li>
            <NuxtLink :to="localePath(paths.home)" class="crumbs__link">
              <Icon icon="hugeicons--home-01" class="size-4" />
              <span class="icon-label">{{ t('account.breadcrumb.home') }}</span>
            </NuxtLink>
          </li>
          <li>
            <Icon icon="hugeicons--arrow-right-01" class="crumbs__sep size-3.5 rtl:rotate-180" />
            <NuxtLink v-if="settings" :to="localePath(paths.profile.overview)" class="crumbs__link">
              {{ t('account.breadcrumb.profile') }}
            </NuxtLink>
            <span v-else class="crumbs__here" aria-current="page">
              {{ t('account.breadcrumb.profile') }}
            </span>
          </li>
          <li v-if="settings">
            <Icon icon="hugeicons--arrow-right-01" class="crumbs__sep size-3.5 rtl:rotate-180" />
            <span class="crumbs__here" aria-current="page">{{
              t('account.breadcrumb.settings')
            }}</span>
          </li>
        </ol>
      </nav>

      <div class="profile__grid">
        <div class="profile__side">
          <ProfileSidebar :profile="profile" />
        </div>
        <div class="profile__main">
          <slot />
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
  .profile {
    padding-block: 16px 64px;
    background: #f7f7f5;
  }
  .profile__inner {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }
  .crumbs {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 8px;
    font: 500 14px/20px var(--font);
  }
  .crumbs li {
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .crumbs__link {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    border-radius: 6px;
    color: var(--caption);
  }
  .crumbs__link:hover {
    color: var(--primary);
  }
  .crumbs__sep {
    color: var(--muted);
  }
  .crumbs__here {
    color: var(--primary);
    font-weight: 700;
  }
  .profile__grid {
    display: grid;
    grid-template-columns: 350px 1fr;
    align-items: start;
    gap: 30px;
  }
  /* min-width: 0 lets the grid columns shrink, so the sidebar's scroll row can scroll */
  .profile__side {
    min-width: 0;
  }
  .profile__main {
    display: flex;
    flex-direction: column;
    gap: 28px;
    min-width: 0;
  }
  @media (max-width: 1100px) {
    .profile__grid {
      grid-template-columns: 300px 1fr;
      gap: 20px;
    }
  }
  @media (max-width: 900px) {
    .profile__grid {
      grid-template-columns: 1fr;
    }
  }
</style>
