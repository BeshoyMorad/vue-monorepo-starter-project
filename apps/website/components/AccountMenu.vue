<script setup lang="ts">
  import Icon from '@workspace/ui/icon/Icon.vue';
  import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from '@workspace/ui/ui/dropdown-menu';
  import ProfileAvatar from '~/modules/account/components/ProfileAvatar.vue';
  import { paths } from '~/router/paths';
  import { useAuthStore } from '~/stores/auth';

  /**
   * Header controls of a signed-in customer (as on ibbil.com): "Welcome back, <name>" with the
   * avatar opens the menu (My profile, Account settings, Sign out); then Favorites.
   * While signing out it stays on screen as "Signing out…" (see useSigningOut).
   */
  const { t } = useI18n();
  const localePath = useLocalePath();
  const authStore = useAuthStore();
  const logout = useLogout();
  const signingOut = useSigningOut();
  const open = ref(false);

  const name = computed(() => authStore.user?.fullName?.trim() ?? '');
</script>

<template>
  <DropdownMenu v-model:open="open">
    <DropdownMenuTrigger as-child>
      <button
        type="button"
        class="trigger"
        data-test-id="header-account"
        :aria-disabled="signingOut || undefined"
      >
        <ProfileAvatar :name="name" :src="authStore.user?.avatar" :size="36" />
        <span class="trigger__label">
          <span class="sr-only">{{ t('account.menu.label') }}: </span>
          <template v-if="signingOut">{{ t('home.header.loggingOut') }}</template>
          <template v-else
            >{{ t('account.menu.welcome') }} <bdi class="trigger__name">{{ name }}</bdi></template
          >
        </span>
      </button>
    </DropdownMenuTrigger>
    <DropdownMenuContent
      align="end"
      :side-offset="10"
      class="font-brand w-64 rounded-xl border border-black/5 bg-white p-1.5 shadow-lg"
    >
      <DropdownMenuLabel class="flex flex-col gap-0.5 px-2.5 pt-2 pb-2">
        <span class="text-xs font-medium text-[oklch(0.45_0_0)]">
          {{ t('account.menu.signedInAs') }}
        </span>
        <bdi class="text-primary-500 truncate text-sm font-bold">{{
          authStore.user?.fullName
        }}</bdi>
        <bdi dir="ltr" class="text-start text-xs text-[oklch(0.45_0_0)]">
          {{ authStore.user?.phone }}
        </bdi>
      </DropdownMenuLabel>
      <DropdownMenuSeparator class="my-1 bg-black/5" />
      <DropdownMenuItem
        as-child
        test-id="header-account-link"
        class="gap-3 rounded-lg px-2.5 py-2.5 text-sm font-medium data-highlighted:bg-[oklch(0.97_0_0)]"
      >
        <NuxtLink :to="localePath(paths.profile.overview)">
          <Icon icon="hugeicons--user-circle" class="text-primary-500 size-5" />
          {{ t('account.menu.account') }}
        </NuxtLink>
      </DropdownMenuItem>
      <DropdownMenuItem
        as-child
        test-id="header-settings-link"
        class="gap-3 rounded-lg px-2.5 py-2.5 text-sm font-medium data-highlighted:bg-[oklch(0.97_0_0)]"
      >
        <NuxtLink :to="localePath(paths.profile.settings)">
          <Icon icon="hugeicons--user-account" class="text-primary-500 size-5" />
          {{ t('account.menu.settings') }}
        </NuxtLink>
      </DropdownMenuItem>
      <DropdownMenuItem
        test-id="header-logout"
        class="gap-3 rounded-lg px-2.5 py-2.5 text-sm font-medium data-highlighted:bg-[oklch(0.97_0_0)]"
        @select="logout"
      >
        <Icon icon="hugeicons--logout-01" class="text-primary-500 size-5 rtl:-scale-x-100" />
        {{ t('home.header.logout') }}
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
  <!-- TODO: favorites page -->
  <a href="#" class="fav" :aria-label="t('account.menu.favorites')">
    <Icon icon="hugeicons--favourite" class="size-5" />
  </a>
</template>

<style scoped>
  .trigger {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    min-height: 40px;
    padding: 2px 8px 2px 2px;
    border-radius: 99px;
    font: 500 13px/18px var(--font);
    white-space: nowrap;
    cursor: pointer;
  }
  [dir='rtl'] .trigger {
    padding: 2px 2px 2px 8px;
  }
  .trigger:hover,
  .trigger[data-state='open'] {
    background: var(--glass);
  }
  .trigger__label {
    max-width: 240px;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  /* Gold-300: the gold that keeps 4.5:1 on the green bar */
  .trigger__name {
    color: var(--secondary-on-dark);
    font-weight: 700;
  }
  .fav {
    width: 36px;
    height: 36px;
    display: grid;
    place-items: center;
    border-radius: 8px;
  }
  .fav:hover {
    background: var(--glass);
  }
  @media (max-width: 1280px) {
    .trigger__label {
      max-width: 150px;
    }
  }
  /* Tablet and phone: the avatar only; the welcome text stays the accessible name */
  @media (max-width: 1024px) {
    .trigger,
    [dir='rtl'] .trigger {
      padding: 2px;
    }
    .trigger__label {
      position: absolute;
      width: 1px;
      height: 1px;
      overflow: hidden;
      clip-path: inset(50%);
      white-space: nowrap;
    }
    .fav {
      display: none;
    }
  }
</style>
