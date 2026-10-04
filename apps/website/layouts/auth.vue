<script setup lang="ts">
  import { Icon } from '@workspace/ui';
  import LocaleSwitcher from '~/components/LocaleSwitcher.vue';
  import { paths } from '~/router/paths';

  /**
   * Guest pages (login, register, verification, password reset).
   * Desktop: brand panel with photo on the start side, form on the other.
   * Mobile: green top bar, then the form.
   * Usage: definePageMeta({ layout: 'auth', guestOnly: true })
   */
  const { t } = useI18n();
  const localePath = useLocalePath();

  // Ibbil's design is light-only. The shared tokens use light-dark(), so without this a
  // browser in dark mode would render white labels on the white card. Set on <html> so
  // teleported popovers (e.g. the country picker) stay light too.
  useHead({ htmlAttrs: { style: 'color-scheme: light' } });
  const year = new Date().getFullYear();
</script>

<template>
  <div class="auth-ui font-brand min-h-screen text-[oklch(0.2_0_0)] lg:grid lg:grid-cols-[46%_1fr]">
    <!-- Brand panel (desktop) -->
    <aside
      class="border-gold-500 sticky top-0 hidden h-screen flex-col justify-between overflow-hidden border-e-2 p-12 text-white lg:flex"
    >
      <!-- Panel is 46% of the viewport from lg up and hidden below, so request ~half-width sources at each large breakpoint.
           `class` goes on the <picture> wrapper: it must be absolute too, or it becomes a flex item
           and justify-between pushes the header down. `img-attrs` goes on the inner <img>. -->
      <NuxtPicture
        src="/images/auth/camel.jpg"
        alt=""
        sizes="lg:50vw xl:50vw 2xl:50vw"
        class="absolute inset-0"
        :img-attrs="{
          class: 'size-full object-cover',
          fetchpriority: 'high',
        }"
        preload
      />
      <!-- Overlays measured on ibbil.com: dark green towards the outer edge + a gold glow -->
      <div
        class="absolute inset-0 bg-linear-to-l from-[rgb(31_58_43/0.4)] via-[rgb(31_58_43/0.68)] to-[rgb(31_58_43/0.88)] rtl:bg-linear-to-r"
      />
      <div
        class="absolute inset-0 bg-[radial-gradient(at_30%_20%,rgb(212_160_68/0.28),transparent_55%)]"
      />

      <header class="relative flex items-center justify-between gap-4">
        <NuxtLink :to="localePath(paths.home)" data-test-id="auth-logo">
          <img src="/images/brand/ibbil-logo.svg" :alt="t('auth.brand.logoAlt')" class="h-11" />
        </NuxtLink>
        <div class="flex items-center gap-2">
          <LocaleSwitcher />
          <NuxtLink
            :to="localePath(paths.home)"
            data-test-id="auth-home-link"
            class="inline-flex items-center gap-1.5 rounded-lg border border-white/30 bg-white/10 px-3 py-[5px] text-[13px] font-medium text-white/90 transition-colors hover:bg-white/20"
          >
            <Icon icon="hugeicons--arrow-left-02" class="size-4 rtl:rotate-180" />
            <span class="icon-label">{{ t('auth.brand.home') }}</span>
          </NuxtLink>
        </div>
      </header>

      <div class="relative max-w-[408px] space-y-4">
        <p class="text-gold-500 text-xs leading-4 font-semibold tracking-[2.64px] uppercase">
          {{ t('auth.brand.eyebrow') }}
        </p>
        <h2 class="text-4xl leading-[45px] font-extrabold tracking-[-0.9px]">
          {{ t('auth.brand.title') }}
        </h2>
        <p class="max-w-96 text-base leading-[26px] text-white/80">
          {{ t('auth.brand.subtitle') }}
        </p>
      </div>

      <p class="relative text-xs text-white/70">
        {{ t('auth.brand.copyright', { year }) }}
      </p>
    </aside>

    <!-- Form side -->
    <div
      class="flex min-h-screen flex-col bg-[#f4f1ea] bg-[radial-gradient(at_100%_0,rgb(212_160_68/0.14),transparent_52%),radial-gradient(at_0_100%,rgb(45_83_61/0.07),transparent_48%)]"
    >
      <header class="bg-primary-500 flex items-center justify-between px-4 py-4 lg:hidden">
        <NuxtLink :to="localePath(paths.home)" data-test-id="auth-logo-mobile">
          <img src="/images/brand/ibbil-logo.svg" :alt="t('auth.brand.logoAlt')" class="h-10" />
        </NuxtLink>
        <LocaleSwitcher />
      </header>

      <main class="flex flex-1 items-center justify-center px-4 py-8 sm:px-8 lg:py-12">
        <slot />
      </main>

      <p class="text-text-placeholder pb-6 text-center text-sm lg:hidden">
        {{ t('auth.brand.copyright', { year }) }}
      </p>
    </div>
  </div>
</template>
