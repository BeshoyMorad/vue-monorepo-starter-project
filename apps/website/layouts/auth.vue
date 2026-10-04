<script setup lang="ts">
  import { Icon } from '@workspace/ui';
  import AuthScreenSkeleton from '~/modules/auth/components/skeleton/AuthScreenSkeleton.vue';
  import AuthCard from '~/modules/auth/components/AuthCard.vue';
  import {
    AUTH_CARD_SHAPES,
    useAuthScreenLoading,
  } from '~/modules/auth/composables/useAuthScreenLoading';
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

  // Brand photo for the desktop panel. Phones never see the panel, so the photo is only
  // offered to wide screens (<source media>) and phones download nothing: the <img> itself
  // is a 1×1 inline placeholder. The preload carries the same media query.
  const HERO_MEDIA = '(min-width: 1024px)';
  const hero = useImage().getSizes('/images/auth/camel.jpg', {
    sizes: 'lg:46vw xl:46vw 2xl:46vw',
    // It sits under 40–88% dark overlays: q60 is visually identical there to q80, a third lighter
    modifiers: { format: 'webp', quality: 60 },
  });
  const BLANK_PIXEL =
    'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';

  const apiOrigin = new URL(useRuntimeConfig().public.apiBaseUrl).origin;
  useHead({
    // Toasts and anything else outside the auth container use the brand font too, so the
    // site's Google font (Exo 2) is never downloaded on auth pages
    bodyAttrs: { class: 'font-brand' },
    link: [
      // The forms post to the API: open that connection while the user is still typing
      { rel: 'preconnect', href: apiOrigin, crossorigin: '' },
      {
        rel: 'preload',
        as: 'font',
        type: 'font/woff2',
        href: '/fonts/expo-arabic.woff2',
        crossorigin: '',
      },
      {
        rel: 'preload',
        as: 'image',
        type: 'image/webp',
        imagesrcset: hero.srcset,
        imagesizes: hero.sizes,
        media: HERO_MEDIA,
        fetchpriority: 'high',
      },
    ],
  });
  const year = new Date().getFullYear();

  // One card for every auth screen: its content changes (screens, steps, or the skeleton of
  // the next screen while it loads) and its shape animates, instead of cards replacing
  // each other
  const { loading: loadingScreen, cardScreen } = useAuthScreenLoading();
  const cardShape = computed(() => AUTH_CARD_SHAPES[cardScreen.value]);
</script>

<template>
  <div class="auth-ui font-brand min-h-screen text-[oklch(0.2_0_0)] lg:grid lg:grid-cols-[46%_1fr]">
    <!-- First stop for keyboard users: jumps past the brand links straight to the form -->
    <a
      href="#auth-main"
      class="auth-skip-link bg-primary-500 sr-only z-50 rounded-lg text-sm font-semibold text-white focus:not-sr-only focus:fixed focus:start-4 focus:top-4 focus:px-4 focus:py-2.5"
    >
      {{ t('auth.a11y.skipToForm') }}
    </a>

    <!-- Brand panel (desktop) -->
    <aside
      class="auth-on-brand bg-primary-700 border-gold-500 sticky top-0 hidden h-screen flex-col justify-between overflow-hidden border-e-2 p-12 text-white lg:flex"
    >
      <picture class="absolute inset-0">
        <source :media="HERO_MEDIA" type="image/webp" :srcset="hero.srcset" :sizes="hero.sizes" />
        <img
          :src="BLANK_PIXEL"
          alt=""
          class="size-full object-cover"
          fetchpriority="high"
          decoding="async"
        />
      </picture>
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
          <!-- Server-rendered as usual; its JavaScript (the dropdown menu) loads once it is on
               screen, after the page itself. The hidden copy (the mobile header on desktop,
               the brand panel on phones) never loads. Not on-interaction: a quick hover then
               click lost the click while the menu was still loading. -->
          <LazyLocaleSwitcher hydrate-on-visible />
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
        <!-- A paragraph, not a heading: the form's h1 is the first heading of the page -->
        <p class="text-4xl leading-[45px] font-extrabold tracking-[-0.9px]">
          {{ t('auth.brand.title') }}
        </p>
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
      <header
        class="auth-on-brand bg-primary-500 flex items-center justify-between px-4 py-4 lg:hidden"
      >
        <NuxtLink :to="localePath(paths.home)" data-test-id="auth-logo-mobile">
          <img src="/images/brand/ibbil-logo.svg" :alt="t('auth.brand.logoAlt')" class="h-10" />
        </NuxtLink>
        <LazyLocaleSwitcher hydrate-on-visible />
      </header>

      <main
        id="auth-main"
        tabindex="-1"
        class="flex flex-1 items-center justify-center px-4 py-8 outline-none sm:px-8 lg:py-12"
      >
        <AuthCard :accent="cardShape.accent" :wide="cardShape.wide">
          <AuthScreenSkeleton v-if="loadingScreen" :screen="loadingScreen" />
          <div v-show="!loadingScreen">
            <slot />
          </div>
        </AuthCard>
      </main>

      <footer class="text-text-placeholder pb-6 text-center text-sm lg:hidden">
        {{ t('auth.brand.copyright', { year }) }}
      </footer>
    </div>
  </div>
</template>
