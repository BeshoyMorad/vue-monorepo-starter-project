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
  import { paths } from '~/router/paths';
  import { useAuthStore } from '~/stores/auth';

  /**
   * Header menu of a signed-in customer: who is signed in, "My account" and "Sign out".
   * While signing out it stays on screen as "Signing out…" (see useSigningOut).
   */
  const { t } = useI18n();
  const localePath = useLocalePath();
  const authStore = useAuthStore();
  const logout = useLogout();
  const signingOut = useSigningOut();
  const open = ref(false);

  const firstName = computed(() => authStore.user?.fullName?.trim().split(/\s+/)[0] ?? '');
  const label = computed(() =>
    signingOut.value ? t('home.header.loggingOut') : firstName.value || t('account.menu.account')
  );
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
        <Icon icon="site--user-square" class="size-6" />
        <span class="trigger__label">
          <span class="sr-only">{{ t('account.menu.label') }}: </span><bdi>{{ label }}</bdi>
        </span>
        <Icon
          icon="hugeicons--arrow-down-01"
          class="trigger__caret size-4 transition-transform"
          :class="{ 'rotate-180': open }"
        />
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
        <NuxtLink :to="localePath(paths.account)">
          <Icon icon="hugeicons--user-circle" class="text-primary-500 size-5" />
          {{ t('account.menu.account') }}
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
</template>

<style scoped>
  /* Same look as the header's other controls (AppHeader .ctrls__item) */
  .trigger {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    min-height: 32px;
    padding: 4px;
    border-radius: 8px;
    font: 700 12px/16px var(--font);
    white-space: nowrap;
    cursor: pointer;
  }
  .trigger:hover,
  .trigger[data-state='open'] {
    background: var(--glass);
  }
  .trigger__label {
    max-width: 120px;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  /* Phone: icon only; the name stays the accessible name */
  @media (max-width: 640px) {
    .trigger {
      min-width: 40px;
      min-height: 40px;
      justify-content: center;
    }
    .trigger__label {
      position: absolute;
      width: 1px;
      height: 1px;
      overflow: hidden;
      clip-path: inset(50%);
      white-space: nowrap;
    }
    .trigger__caret {
      display: none;
    }
  }
</style>
