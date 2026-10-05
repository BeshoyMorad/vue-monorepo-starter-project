<script setup lang="ts">
  import { Icon } from '@workspace/ui';
  import { topNav } from '~/modules/home/data';
  import { paths } from '~/router/paths';
  import { useAuthStore } from '~/stores/auth';

  /** Public site header: green bar (logo, links, search, account, language) and gold section bar */
  const { t } = useI18n();
  const localePath = useLocalePath();
  const authStore = useAuthStore();
  const logout = useLogout();

  const scope = ref('all');
  const query = ref('');
  // TODO: send to the search page once it exists
  const search = () => undefined;
</script>

<template>
  <header class="site-header">
    <div class="bar bar--green on-dark">
      <div class="row container">
        <NuxtLink :to="localePath(paths.home)" class="logo">
          <img
            src="/images/brand/ibbil-logo.svg"
            :alt="t('home.header.logoAlt')"
            class="logo__img"
          />
        </NuxtLink>

        <nav class="links" :aria-label="t('home.header.mainNav')">
          <NuxtLink :to="localePath(paths.home)" class="links__item" exact-active-class="links__on">
            {{ t('home.header.home') }}
          </NuxtLink>
          <a class="links__item" href="#about">{{ t('home.header.about') }}</a>
          <a class="links__item" href="#">{{ t('home.header.contact') }}</a>
        </nav>

        <form role="search" class="search" @submit.prevent="search">
          <button type="submit" class="search__btn" :aria-label="t('home.header.search.submit')">
            <Icon icon="hugeicons--search-01" class="size-5" />
          </button>
          <input
            v-model="query"
            type="search"
            class="search__input"
            :aria-label="t('home.header.search.label')"
            :placeholder="t('home.header.search.placeholder')"
          />
          <select
            v-model="scope"
            class="search__scope"
            :aria-label="t('home.header.search.scopeLabel')"
          >
            <option value="all">{{ t('home.header.search.all') }}</option>
            <option v-for="item in topNav" :key="item.id" :value="item.id">
              {{ t(`home.topNav.${item.id}`) }}
            </option>
          </select>
        </form>

        <div class="ctrls">
          <a href="#" class="ctrls__icon" :aria-label="t('home.header.cart')">
            <Icon icon="hugeicons--shopping-cart-01" class="size-5" />
          </a>
          <span class="sep" aria-hidden="true" />
          <!-- The session is in cookies, so the server renders the right item: a signed-in user
               never gets a sign-in link (the login page would send them straight back home) -->
          <button
            v-if="authStore.isAuthenticated"
            type="button"
            class="ctrls__link"
            data-test-id="header-logout"
            @click="logout"
          >
            {{ t('home.header.logout') }}
          </button>
          <NuxtLink
            v-else
            :to="localePath(paths.auth.login)"
            class="ctrls__link"
            data-test-id="header-login"
          >
            {{ t('home.header.login') }}
          </NuxtLink>
          <span class="sep" aria-hidden="true" />
          <LazyLocaleSwitcher hydrate-on-visible />
        </div>
      </div>
    </div>

    <div class="bar bar--gold">
      <div class="row row--between container">
        <nav class="sections" :aria-label="t('home.header.sectionsNav')">
          <a v-for="item in topNav" :key="item.id" :href="item.to">{{
            t(`home.topNav.${item.id}`)
          }}</a>
        </nav>
        <a class="btn btn--primary" href="#">{{ t('home.header.join') }}</a>
      </div>
    </div>
  </header>
</template>

<style scoped>
  .bar--green {
    background: var(--primary);
    border-bottom: 0.5px solid var(--border-on-dark);
    color: #fff;
  }
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
  .row--between {
    justify-content: space-between;
  }
  .logo {
    flex: none;
    border-radius: 8px;
  }
  .logo__img {
    height: 40px;
  }
  .links {
    display: flex;
    align-items: center;
    gap: 12px;
    font: 700 12px/16px var(--font);
  }
  .links__item {
    padding: 5px 10px;
    border-radius: 8px;
  }
  .links__item:hover,
  .links__on {
    background: var(--glass);
  }
  .search {
    flex: 1;
    min-width: 0;
    height: 44px;
    display: flex;
    align-items: center;
    background: #fff;
    color: var(--text);
    border-radius: 40px;
    overflow: hidden;
  }
  .search__btn {
    width: 44px;
    height: 100%;
    flex: none;
    display: grid;
    place-items: center;
    background: var(--chip);
    color: var(--primary);
    cursor: pointer;
  }
  .search__input {
    flex: 1;
    min-width: 0;
    height: 100%;
    padding-inline: 12px;
    font: 400 14px/20px var(--font);
    background: transparent;
  }
  .search__input::placeholder {
    color: var(--muted);
  }
  .search__input:focus-visible {
    outline-offset: -3px;
  }
  .search__scope {
    height: 100%;
    padding-inline: 12px;
    border-inline-start: 1px solid var(--border);
    font: 600 14px/20px var(--font);
    background: transparent;
    cursor: pointer;
  }
  .ctrls {
    display: flex;
    align-items: center;
    gap: 8px;
    font: 700 12px/16px var(--font);
  }
  .ctrls__icon,
  .ctrls__link {
    display: inline-flex;
    align-items: center;
    min-height: 32px;
    padding: 4px 6px;
    border-radius: 8px;
    cursor: pointer;
  }
  .ctrls__icon:hover,
  .ctrls__link:hover {
    background: var(--glass);
  }
  .sep {
    width: 1px;
    height: 24px;
    background: var(--glass);
  }
  .sections {
    display: flex;
    flex-wrap: wrap;
    gap: 8px 24px;
    font: 700 12px/16px var(--font);
  }
  .sections a {
    padding-block: 4px;
    border-radius: 4px;
  }
  .sections a:hover {
    text-decoration: underline;
    text-underline-offset: 4px;
  }
  @media (max-width: 1024px) {
    .row {
      flex-wrap: wrap;
    }
    .links {
      display: none;
    }
    .search {
      order: 3;
      flex-basis: 100%;
    }
    .ctrls {
      margin-inline-start: auto;
    }
  }
  @media (max-width: 640px) {
    .row--between .btn {
      width: 100%;
    }
  }
</style>
