<script setup lang="ts">
  import type { LocaleObject } from '@nuxtjs/i18n';
  import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    Icon,
  } from '@workspace/ui';

  /** Language menu: shows the current language and switches while keeping the current page. */
  withDefaults(defineProps<{ tone?: 'light' | 'dark' }>(), { tone: 'light' });

  const FLAGS: Record<string, string> = { en: '🇺🇸', ar: '🇸🇦' };

  const { locale, locales } = useI18n();
  const switchLocalePath = useSwitchLocalePath();

  const options = computed(() => locales.value as LocaleObject[]);
  const current = computed(() => options.value.find((item) => item.code === locale.value));

  const select = (code: string) => navigateTo(switchLocalePath(code as typeof locale.value));
</script>

<template>
  <DropdownMenu>
    <DropdownMenuTrigger as-child>
      <button
        type="button"
        data-test-id="locale-switcher"
        class="inline-flex cursor-pointer items-center gap-[6.4px] rounded-full px-[11.2px] py-[6.4px] text-[13px] leading-[13px] font-semibold transition-colors"
        :class="
          tone === 'light'
            ? 'bg-white/10 text-white/90 hover:bg-white/20'
            : 'bg-primary-50 text-primary-500 hover:bg-primary-100'
        "
      >
        <span class="text-sm leading-none">{{ FLAGS[locale] }}</span>
        {{ current?.name }}
        <Icon icon="hugeicons--arrow-down-01" class="size-3.5 opacity-80" />
      </button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end" class="min-w-40">
      <DropdownMenuItem
        v-for="item in options"
        :key="item.code"
        :test-id="`locale-option-${item.code}`"
        :lang="item.language"
        :class="item.code === locale ? 'text-primary-500 font-semibold' : ''"
        @select="select(item.code)"
      >
        <span class="text-base leading-none">{{ FLAGS[item.code] }}</span>
        {{ item.name }}
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>
