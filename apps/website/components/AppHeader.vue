<script setup lang="ts">
  import { Icon } from '@workspace/ui';
  import { topNav } from '~/modules/home/data';
  import { paths } from '~/router/paths';
  import { useAuthStore } from '~/stores/auth';

  /**
   * Public site header (Figma: Navigation Bar 11422:34002).
   * Green bar: logo, main links, search, then language / account / cart.
   * Below 1025px the links, language and join button move into the menu (SiteMenu.vue).
   * Below 641px the search bar becomes an icon that opens SiteSearchPanel.
   * Gold bar: platform sections, then the "join" call to action.
   * DOM order is reading order, so the same markup mirrors itself in Arabic (RTL) and English.
   */
  const { t } = useI18n();
  const localePath = useLocalePath();
  const authStore = useAuthStore();
  const logout = useLogout();
</script>

<template>
  <header class="site-header">
    <div class="bar bar--green on-dark">
      <div class="row container">
        <div class="primary">
          <NuxtLink :to="localePath(paths.home)" class="flex-none rounded-lg">
            <img
              src="/images/brand/ibbil-logo.svg"
              :alt="t('home.header.logoAlt')"
              width="120"
              height="38"
              class="logo__img"
            />
          </NuxtLink>
          <span class="sep primary__sep" aria-hidden="true" />
          <nav class="links" :aria-label="t('home.header.mainNav')">
            <NuxtLink
              :to="localePath(paths.home)"
              class="links__item"
              exact-active-class="links__on"
            >
              {{ t('home.header.home') }}
            </NuxtLink>
            <a class="links__item" href="#about">{{ t('home.header.about') }}</a>
            <a class="links__item" href="#">{{ t('home.header.contact') }}</a>
          </nav>
        </div>

        <SiteSearch class="search" />

        <div class="ctrls">
          <!-- Wrapped: the switcher and the menu have no root element of their own to take a class -->
          <span class="ctrls__wide"><LazyLocaleSwitcher tone="glass" hydrate-on-visible /></span>
          <span class="sep ctrls__wide" aria-hidden="true" />
          <span class="ctrls__phone"><SiteSearchPanel /></span>
          <!-- The session is in cookies, so the server renders the right item: a signed-in user
               never gets a sign-in link (the login page would send them straight back home) -->
          <button
            v-if="authStore.isAuthenticated"
            type="button"
            class="ctrls__item"
            data-test-id="header-logout"
            @click="logout"
          >
            <Icon icon="site--user-square" class="size-6" />
            <span class="ctrls__label">{{ t('home.header.logout') }}</span>
          </button>
          <NuxtLink
            v-else
            :to="localePath(paths.auth.login)"
            class="ctrls__item"
            data-test-id="header-login"
          >
            <Icon icon="site--user-square" class="size-6" />
            <span class="ctrls__label">{{ t('home.header.login') }}</span>
          </NuxtLink>
          <span class="sep" aria-hidden="true" />
          <a href="#" class="ctrls__item" :aria-label="t('home.header.cart')">
            <Icon icon="site--cart" class="size-6" />
          </a>
          <span class="ctrls__narrow"><SiteMenu /></span>
        </div>
      </div>
    </div>

    <div class="bar bar--gold">
      <div class="row container justify-between">
        <nav class="sections" :aria-label="t('home.header.sectionsNav')">
          <a
            v-for="item in topNav"
            :key="item.id"
            :href="item.to"
            class="sections__item text-white hover:underline hover:underline-offset-4"
          >
            <Icon :icon="item.icon" class="size-5" />
            {{ t(`home.topNav.${item.id}`) }}
          </a>
        </nav>
        <a class="btn btn--primary join ctrls__wide-sm" href="#">{{ t('home.header.join') }}</a>
      </div>
    </div>
  </header>
</template>

<style scoped>
  .site-header {
    font: 700 12px/16px var(--font);
  }
  /* Stays in view on desktop. On smaller screens the wrapped header would cover too much. */
  @media (min-width: 1025px) {
    .site-header {
      position: sticky;
      top: 0;
      z-index: 40;
    }
  }
  .bar--green {
    background: var(--primary);
    border-bottom: 0.5px solid var(--border-on-dark);
    color: #fff;
  }
  /* Figma sets white text on the gold bar; dark green is used instead for 4.5:1 contrast */
  .bar--gold {
    background: var(--secondary);
    color: var(--on-secondary);
  }
  .row {
    display: flex;
    align-items: center;
    gap: 24px;
    padding-block: 12px;
  }
  .links__item:hover,
  .links__on,
  .ctrls__item:hover {
    background: var(--glass);
  }
  .sep {
    flex: none;
    width: 1px;
    height: 24px;
    background: var(--glass);
  }

  /* Logo + main links */
  .primary {
    display: flex;
    align-items: center;
    gap: 24px;
    flex: none;
  }
  .logo__img {
    width: 120px;
    height: auto;
  }
  .links {
    display: flex;
    align-items: center;
    gap: 20px;
  }
  .links__item {
    display: inline-flex;
    align-items: center;
    min-height: 26px;
    padding: 5px 10px;
    border-radius: 8px;
    white-space: nowrap;
  }

  .search {
    flex: 1;
    min-width: 0;
  }

  /* Cart, account, language */
  .ctrls {
    display: flex;
    align-items: center;
    gap: 8px;
    flex: none;
  }
  .ctrls__item {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    min-height: 32px;
    padding: 4px;
    border-radius: 8px;
    white-space: nowrap;
    cursor: pointer;
  }

  /* Gold bar */
  .sections {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 8px 24px;
  }
  .sections__item {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    min-height: 24px;
    border-radius: 4px;
  }
  .join {
    min-height: 36px;
    padding: 8px;
  }

  .ctrls__narrow,
  .ctrls__phone {
    display: none;
  }

  /* Tablet and phone: logo + account / cart / menu, full-width search, one swipeable gold row */
  @media (max-width: 1024px) {
    .row {
      flex-wrap: wrap;
      gap: 12px 16px;
    }
    .links,
    .primary__sep,
    .ctrls__wide {
      display: none;
    }
    .ctrls__narrow {
      display: grid;
    }
    .search {
      order: 3;
      flex-basis: 100%;
    }
    .ctrls {
      margin-inline-start: auto;
      gap: 4px;
    }
    .bar--gold .row {
      flex-wrap: nowrap;
      padding-block: 0;
    }
    /* Faded inline end hints that the row scrolls */
    .sections {
      flex: 1;
      min-width: 0;
      flex-wrap: nowrap;
      gap: 8px;
      padding-block: 10px;
      overflow-x: auto;
      scrollbar-width: none;
      mask-image: linear-gradient(to left, transparent, #000 32px);
    }
    [dir='rtl'] .sections {
      mask-image: linear-gradient(to right, transparent, #000 32px);
    }
    .sections__item {
      flex: none;
      min-height: 32px;
      padding: 4px 10px;
      border-radius: 99px;
      background: rgb(31 58 43 / 0.14);
      white-space: nowrap;
    }
  }
  /* Phone: icon-only account and cart (the text stays as their accessible name) */
  @media (max-width: 640px) {
    .row {
      padding-block: 8px;
    }
    .logo__img {
      width: 104px;
    }
    .ctrls__label {
      position: absolute;
      width: 1px;
      height: 1px;
      overflow: hidden;
      clip-path: inset(50%);
      white-space: nowrap;
    }
    .ctrls__item {
      min-width: 40px;
      min-height: 40px;
      justify-content: center;
    }
    .ctrls__wide-sm,
    .row > .search {
      display: none;
    }
    /* Search collapses to an icon that opens SiteSearchPanel */
    .ctrls__phone {
      display: grid;
    }
  }
</style>
