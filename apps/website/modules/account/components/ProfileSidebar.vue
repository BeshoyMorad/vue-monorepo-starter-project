<script setup lang="ts">
  import Icon from '@workspace/ui/icon/Icon.vue';
  import { useGlideMarker } from '~/modules/account/composables/useGlideMarker';
  import type { CustomerProfile } from '~/modules/account/types';
  import { activityDate } from '~/modules/account/utils';
  import { paths } from '~/router/paths';
  import ProfileAvatar from './ProfileAvatar.vue';

  /**
   * Profile sidebar (as on ibbil.com/en/profile): who is signed in, the profile sections
   * and sign out. Sections without a page yet link to '#'.
   */
  const props = defineProps<{ profile?: CustomerProfile }>();
  const { t } = useI18n();
  const localePath = useLocalePath();
  const route = useRoute();
  const logout = useLogout();
  const signingOut = useSigningOut();

  const items = computed(() => [
    {
      id: 'overview',
      icon: 'hugeicons--dashboard-square-01',
      to: localePath(paths.profile.overview),
    },
    { id: 'profile', icon: 'hugeicons--user-account', to: localePath(paths.profile.settings) },
    // TODO: link these once their pages exist
    { id: 'wallet', icon: 'hugeicons--wallet-01', to: '#' },
    { id: 'orders', icon: 'hugeicons--store-01', to: '#' },
    { id: 'trips', icon: 'hugeicons--delivery-truck-01', to: '#' },
    { id: 'veterinary', icon: 'hugeicons--stethoscope', to: '#' },
    { id: 'favorites', icon: 'hugeicons--favourite', to: '#' },
  ]);
  const isCurrent = (to: string) => to !== '#' && route.path === to;

  // One highlight glides to the current section (see useGlideMarker)
  const list = ref<HTMLElement>();
  const { box, animate, style } = useGlideMarker(list, () => route.path);
  const lastActivity = computed(() => activityDate(props.profile?.lastLoginAt));
</script>

<template>
  <aside class="side">
    <div class="side__head">
      <ProfileAvatar :name="profile?.fullName" :src="profile?.avatar" :size="80" />
      <p class="side__name">
        <bdi>{{ profile?.fullName }}</bdi>
      </p>
      <p v-if="lastActivity" class="side__pill">
        <Icon icon="hugeicons--clock-01" class="size-3.5" />
        <span class="icon-label">{{
          t('account.summary.lastActivity', { date: lastActivity })
        }}</span>
      </p>
    </div>

    <nav class="side__nav" :aria-label="t('account.nav.label')">
      <ul ref="list" class="side__list" :class="{ 'side__list--glide': box }">
        <li
          v-if="box"
          class="side__marker"
          :class="{ 'side__marker--animate': animate }"
          :style="style"
          aria-hidden="true"
        />
        <li v-for="item in items" :key="item.id">
          <NuxtLink
            :to="item.to"
            class="item"
            :class="{ 'item--on': isCurrent(item.to) }"
            :aria-current="isCurrent(item.to) ? 'page' : undefined"
          >
            <span class="item__icon"><Icon :icon="item.icon" class="size-4" /></span>
            <span class="item__label">{{ t(`account.nav.${item.id}`) }}</span>
            <Icon
              v-if="isCurrent(item.to)"
              icon="hugeicons--arrow-right-01"
              class="item__chev size-4 rtl:rotate-180"
            />
          </NuxtLink>
        </li>
      </ul>
      <div class="side__sep" />
      <button
        type="button"
        class="item"
        data-test-id="profile-logout"
        :aria-disabled="signingOut || undefined"
        @click="logout"
      >
        <span class="item__icon"
          ><Icon icon="hugeicons--logout-01" class="size-4 rtl:-scale-x-100"
        /></span>
        <span class="item__label">{{
          signingOut ? t('home.header.loggingOut') : t('home.header.logout')
        }}</span>
      </button>
    </nav>
  </aside>
</template>

<style scoped>
  .side {
    overflow: hidden;
    border-radius: 20px;
    background: #fff;
    box-shadow: 0 1px 2px rgb(0 0 0 / 0.04);
  }
  /* Dark green with a faint dot grid and a gold line at the bottom, as in the design */
  .side__head {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
    padding: 24px 20px 26px;
    border-bottom: 2px solid var(--color-gold-500);
    background:
      radial-gradient(rgb(255 255 255 / 0.07) 1px, transparent 1.5px) 0 0 / 14px 14px,
      linear-gradient(160deg, var(--color-primary-500), var(--color-primary-700));
    color: #fff;
    text-align: center;
  }
  .side__name {
    max-width: 100%;
    overflow: hidden;
    font: 700 16px/24px var(--font);
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .side__pill {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 4px 12px;
    border: 0.5px solid rgb(255 255 255 / 0.2);
    border-radius: 99px;
    background: rgb(255 255 255 / 0.1);
    color: rgb(255 255 255 / 0.9);
    font-size: 12px;
    line-height: 16px;
  }
  .side__nav {
    padding: 12px;
  }
  .side__list {
    position: relative;
    display: flex;
    flex-direction: column;
    gap: 4px;
  }
  /* The gliding highlight: soft fill and the gold bar on the start side */
  .side__marker {
    position: absolute;
    top: 0;
    left: 0;
    border-radius: 12px;
    background: linear-gradient(to right, #eef0ef, #f7f8f7);
    pointer-events: none;
  }
  [dir='rtl'] .side__marker {
    background: linear-gradient(to left, #eef0ef, #f7f8f7);
  }
  .side__marker::before {
    content: '';
    position: absolute;
    inset-block: 8px;
    inset-inline-start: -12px;
    width: 3px;
    border-radius: 99px;
    background: var(--color-gold-500);
  }
  .side__marker--animate {
    transition:
      transform 350ms cubic-bezier(0.2, 0.8, 0.2, 1),
      width 350ms cubic-bezier(0.2, 0.8, 0.2, 1),
      height 350ms cubic-bezier(0.2, 0.8, 0.2, 1);
  }
  /* With the marker in place, the current item drops its own fill and bar */
  .side__list--glide .item--on {
    background: none;
  }
  .side__list--glide .item--on::before {
    display: none;
  }
  .item__icon,
  .item__label {
    transition:
      background-color 250ms,
      color 250ms;
  }
  @media (prefers-reduced-motion: reduce) {
    .side__marker--animate,
    .item__icon,
    .item__label {
      transition: none;
    }
  }
  .item {
    position: relative;
    width: 100%;
    display: flex;
    align-items: center;
    gap: 12px;
    min-height: 52px;
    padding: 8px 12px;
    border-radius: 12px;
    color: var(--text);
    font: 500 14px/20px var(--font);
    text-align: start;
    cursor: pointer;
  }
  .item:hover {
    background: var(--modal2);
  }
  .item__icon {
    width: 36px;
    height: 36px;
    flex: none;
    display: grid;
    place-items: center;
    border-radius: 10px;
    background: #f3f4f6;
    color: var(--caption);
  }
  .item__label {
    flex: 1;
  }
  /* Current page: soft fill, gold bar on the start side, green icon tile, chevron */
  .item--on {
    background: linear-gradient(to right, #eef0ef, #f7f8f7);
    color: var(--primary);
    font-weight: 700;
  }
  [dir='rtl'] .item--on {
    background: linear-gradient(to left, #eef0ef, #f7f8f7);
  }
  .item--on::before {
    content: '';
    position: absolute;
    inset-block: 8px;
    inset-inline-start: -12px;
    width: 3px;
    border-radius: 99px;
    background: var(--color-gold-500);
  }
  .item--on .item__icon {
    background: var(--primary);
    color: #fff;
  }
  .item__chev {
    color: var(--color-gold-700);
  }
  .side__sep {
    height: 1px;
    margin: 12px -12px;
    background: var(--border);
  }
  /* Tablet and phone: a compact header and one swipeable row of sections */
  @media (max-width: 900px) {
    .side__head {
      flex-direction: row;
      flex-wrap: wrap;
      justify-content: center;
      padding: 16px;
    }
    .side__nav {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 10px;
      overflow-x: auto;
      scrollbar-width: none;
    }
    .side__list {
      flex-direction: row;
    }
    .side__marker::before {
      display: none;
    }
    .item {
      width: auto;
      min-height: 44px;
      padding: 4px 12px 4px 4px;
      white-space: nowrap;
    }
    [dir='rtl'] .item {
      padding: 4px 4px 4px 12px;
    }
    .item--on::before,
    .item__chev {
      display: none;
    }
    .item__icon {
      width: 32px;
      height: 32px;
    }
    .side__sep {
      width: 1px;
      height: 28px;
      flex: none;
      margin: 0;
    }
  }
</style>
