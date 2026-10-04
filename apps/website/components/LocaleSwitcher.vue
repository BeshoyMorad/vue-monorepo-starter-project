<script setup lang="ts">
  import type { LocaleObject } from '@nuxtjs/i18n';
  import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
    Icon,
  } from '@workspace/ui';

  withDefaults(defineProps<{ tone?: 'light' | 'dark' }>(), { tone: 'light' });

  const FLAGS: Record<string, string> = { en: '🇺🇸', ar: '🇸🇦' };

  const { t, locale, locales } = useI18n();
  const switchLocalePath = useSwitchLocalePath();
  const open = ref(false);

  // Arabic first to match the design; nuxt.config keeps English first as the default locale
  const ORDER = ['ar', 'en'];
  const options = computed(() =>
    [...(locales.value as LocaleObject[])].sort(
      (a, b) => ORDER.indexOf(a.code) - ORDER.indexOf(b.code)
    )
  );
  const current = computed(() => options.value.find((item) => item.code === locale.value));

  /**
   * Region name in the option's own language ("United States", "المملكة العربية السعودية"),
   * derived from the BCP 47 tag in nuxt.config (en-US, ar-SA) so no extra strings are needed.
   */
  const regionName = (item: LocaleObject) => {
    const region = item.language?.split('-')[1];
    if (!region || !item.language) return '';
    return new Intl.DisplayNames([item.language], { type: 'region' }).of(region) ?? '';
  };

  const select = (code: string) => navigateTo(switchLocalePath(code as typeof locale.value));
</script>

<template>
  <DropdownMenu v-model:open="open">
    <DropdownMenuTrigger as-child>
      <button
        type="button"
        data-test-id="locale-switcher"
        class="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border px-3 py-[5px] text-[13px] font-medium transition-colors"
        :class="
          tone === 'light'
            ? 'border-white/30 bg-white/10 text-white/90 hover:bg-white/20 data-[state=open]:bg-white/20'
            : 'border-primary-100 bg-primary-50 text-primary-500 hover:bg-primary-100'
        "
      >
        <span class="text-sm leading-none">{{ FLAGS[locale] }}</span>
        <span class="icon-label">{{ current?.name }}</span>
        <Icon
          icon="hugeicons--arrow-down-01"
          class="size-4 opacity-80 transition-transform"
          :class="{ 'rotate-180': open }"
        />
      </button>
    </DropdownMenuTrigger>
    <DropdownMenuContent
      align="end"
      :side-offset="8"
      class="w-[min(18rem,calc(100vw-2rem))] rounded-xl bg-white p-1.5 shadow-lg"
    >
      <DropdownMenuLabel
        class="px-2.5 pt-2 pb-1.5 text-[11px] font-semibold tracking-wider text-[oklch(0.5_0_0)] uppercase"
      >
        {{ t('localeSwitcher.label') }}
      </DropdownMenuLabel>
      <DropdownMenuItem
        v-for="item in options"
        :key="item.code"
        :test-id="`locale-option-${item.code}`"
        :lang="item.language"
        class="gap-3 rounded-lg px-2.5 py-2.5 data-highlighted:bg-[oklch(0.97_0_0)]"
        :class="{ 'bg-primary-50 data-highlighted:bg-primary-50': item.code === locale }"
        @select="select(item.code)"
      >
        <span class="text-lg leading-none">{{ FLAGS[item.code] }}</span>
        <span class="flex min-w-0 flex-1 flex-col gap-0.5 text-start">
          <span class="text-sm font-semibold text-[oklch(0.2_0_0)]">{{ item.name }}</span>
          <span class="truncate text-xs text-[oklch(0.5_0_0)]">{{ regionName(item) }}</span>
        </span>
        <Icon
          v-if="item.code === locale"
          icon="hugeicons--tick-02"
          class="text-primary-500 size-4 shrink-0"
        />
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>
