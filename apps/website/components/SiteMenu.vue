<script setup lang="ts">
  import type { LocaleObject } from '@nuxtjs/i18n';
  import Icon from '@workspace/ui/icon/Icon.vue';
  import { DialogClose, DialogContent, DialogTitle, DialogTrigger } from '@workspace/ui/ui/dialog';
  // The bare root: the package's `Dialog` is a complete dialog with its own header and body
  import DialogRoot from '@workspace/ui/ui/dialog/DialogRoot.vue';
  import { topNav } from '~/modules/home/data';
  import { paths } from '~/router/paths';

  /**
   * Mobile and tablet menu (the header hides its main links and language button below 1025px).
   * A side panel from the menu button's side, built on the shared dialog: focus is trapped,
   * Escape and the backdrop close it, and focus returns to the button.
   */
  const { t, locale, locales } = useI18n();
  const localePath = useLocalePath();
  const switchLocalePath = useSwitchLocalePath();
  const route = useRoute();
  const open = ref(false);

  // Any link inside (including same-page anchors) closes the panel
  watch(
    () => route.fullPath,
    () => (open.value = false)
  );
  const onClick = (event: MouseEvent) => {
    if ((event.target as HTMLElement).closest('a')) open.value = false;
  };

  // Arabic first, as in the header's language switcher
  const ORDER = ['ar', 'en'];
  const languages = computed(() =>
    [...(locales.value as LocaleObject[])].sort(
      (a, b) => ORDER.indexOf(a.code) - ORDER.indexOf(b.code)
    )
  );
</script>

<template>
  <DialogRoot v-model:open="open">
    <DialogTrigger as-child>
      <button
        type="button"
        class="menu-btn"
        :aria-label="t('home.header.openMenu')"
        data-test-id="site-menu-open"
      >
        <Icon icon="hugeicons--menu-01" class="size-6" />
      </button>
    </DialogTrigger>
    <DialogContent
      :aria-describedby="undefined"
      class="site-ui data-[state=closed]:zoom-out-100 data-[state=open]:zoom-in-100 data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right rtl:data-[state=closed]:slide-out-to-left rtl:data-[state=open]:slide-in-from-left top-0 right-0 left-auto h-dvh max-h-none w-[min(22rem,88vw)] max-w-none translate-x-0 translate-y-0 content-start gap-0 rounded-none border-0 p-0 duration-300 motion-reduce:animate-none sm:max-w-none rtl:right-auto rtl:left-0"
    >
      <div class="panel" @click="onClick">
        <div class="panel__head">
          <DialogTitle class="panel__title">{{ t('home.header.menu') }}</DialogTitle>
          <DialogClose class="panel__close" :aria-label="t('home.header.closeMenu')">
            <Icon icon="hugeicons--cancel-01" class="size-5" />
          </DialogClose>
        </div>

        <nav class="group" :aria-label="t('home.header.mainNav')">
          <NuxtLink :to="localePath(paths.home)" class="item" exact-active-class="item--on">
            <Icon icon="hugeicons--home-01" class="size-5" />{{ t('home.header.home') }}
          </NuxtLink>
          <a href="#about" class="item">
            <Icon icon="hugeicons--information-circle" class="size-5" />{{ t('home.header.about') }}
          </a>
          <a href="#" class="item">
            <Icon icon="hugeicons--call" class="size-5" />{{ t('home.header.contact') }}
          </a>
        </nav>

        <nav class="group" :aria-labelledby="'menu-sections'">
          <h2 id="menu-sections" class="group__title">{{ t('home.header.sectionsNav') }}</h2>
          <a v-for="item in topNav" :key="item.id" :href="item.to" class="item">
            <Icon :icon="item.icon" class="size-5" />{{ t(`home.topNav.${item.id}`) }}
          </a>
        </nav>

        <div class="group" role="group" aria-labelledby="menu-language">
          <h2 id="menu-language" class="group__title">{{ t('home.header.language') }}</h2>
          <div class="langs">
            <NuxtLink
              v-for="item in languages"
              :key="item.code"
              :to="switchLocalePath(item.code)"
              :lang="item.language"
              class="lang"
              :class="{ 'lang--on': item.code === locale }"
              :aria-current="item.code === locale ? 'true' : undefined"
            >
              {{ item.name }}
            </NuxtLink>
          </div>
        </div>

        <a class="btn btn--primary panel__join" href="#">{{ t('home.header.join') }}</a>
      </div>
    </DialogContent>
  </DialogRoot>
</template>

<style scoped>
  .menu-btn {
    display: grid;
    place-items: center;
    width: 40px;
    height: 40px;
    border-radius: 8px;
    cursor: pointer;
  }
  .menu-btn:hover {
    background: var(--glass);
  }
  .panel {
    display: flex;
    flex-direction: column;
    gap: 8px;
    min-height: 100%;
    padding: 12px 16px 24px;
    font: 600 14px/20px var(--font);
  }
  .panel__head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-block: 4px 8px;
    border-bottom: 1px solid var(--border);
  }
  .panel__title {
    color: var(--primary);
    font: 700 18px/28px var(--font);
  }
  .panel__close {
    display: grid;
    place-items: center;
    width: 40px;
    height: 40px;
    border-radius: 8px;
    color: var(--primary);
    cursor: pointer;
  }
  .panel__close:hover {
    background: var(--chip);
  }
  .group {
    display: flex;
    flex-direction: column;
    padding-block: 8px;
  }
  .group + .group {
    border-top: 1px solid var(--border);
  }
  .group__title {
    padding: 4px 12px 8px;
    color: var(--secondary-text);
    font: 600 12px/16px var(--font);
  }
  .item {
    display: flex;
    align-items: center;
    gap: 12px;
    min-height: 44px;
    padding-inline: 12px;
    border-radius: 10px;
    color: var(--text);
  }
  .item > :first-child {
    color: var(--primary);
  }
  .item:hover,
  .item--on {
    background: var(--chip);
  }
  .item--on {
    color: var(--primary);
  }
  .langs {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 8px;
    padding-inline: 12px;
  }
  .lang {
    display: grid;
    place-items: center;
    min-height: 40px;
    border: 1px solid var(--border);
    border-radius: 10px;
    color: var(--primary);
  }
  .lang--on {
    border-color: var(--primary);
    background: var(--chip);
  }
  .panel__join {
    margin-top: auto;
    white-space: normal;
    text-align: center;
  }
</style>
