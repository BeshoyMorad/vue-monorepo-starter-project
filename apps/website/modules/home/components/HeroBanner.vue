<script setup lang="ts">
  import { Icon } from '@workspace/ui';
  import { slides } from '~/modules/home/data';

  /**
   * Rotating hero. Autoplay every 5s, paused while hovered or focused, off when the user
   * prefers reduced motion, and stoppable with the pause button (WCAG 2.2.2).
   */
  const { t } = useI18n();
  const index = ref(0);
  const slide = computed(() => slides[index.value] ?? slides[0]);
  const playing = ref(true);
  const held = ref(false);
  let timer: ReturnType<typeof setInterval> | undefined;

  const next = () => (index.value = (index.value + 1) % slides.length);
  const stop = () => clearInterval(timer);
  const start = () => {
    stop();
    if (playing.value && !held.value) timer = setInterval(next, 5000);
  };
  watch([playing, held], start);

  onMounted(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) playing.value = false;
    start();
  });
  onBeforeUnmount(stop);
</script>

<template>
  <section
    class="hero on-dark"
    aria-roledescription="carousel"
    :aria-label="t('home.hero.label')"
    @mouseenter="held = true"
    @mouseleave="held = false"
    @focusin="held = true"
    @focusout="held = false"
  >
    <NuxtImg
      src="/images/auth/camel.jpg"
      alt=""
      class="hero__bg"
      sizes="100vw"
      :modifiers="{ quality: 60 }"
      preload
      fetchpriority="high"
    />
    <div class="hero__shade" />
    <div class="hero__content container">
      <!-- Announces slide changes only when the user drives them, never during autoplay -->
      <div :aria-live="playing ? 'off' : 'polite'">
        <Transition name="fade" mode="out-in">
          <div
            :key="index"
            class="hero__slide"
            role="group"
            aria-roledescription="slide"
            :aria-label="t('home.hero.slideOf', { current: index + 1, total: slides.length })"
          >
            <p class="hero__eyebrow">{{ t(`home.hero.slides.${slide}.eyebrow`) }}</p>
            <h1>
              {{ t(`home.hero.slides.${slide}.pre`)
              }}<em>{{ t(`home.hero.slides.${slide}.hi`) }}</em
              >{{ t(`home.hero.slides.${slide}.post`) }}
            </h1>
            <p class="hero__text">{{ t('home.hero.text') }}</p>
            <div class="hero__actions">
              <a class="btn btn--glass hero__ghost" href="#services">{{
                t('home.hero.services')
              }}</a>
              <a class="btn btn--secondary" href="#">
                {{ t(`home.hero.slides.${slide}.cta`) }}
                <Icon icon="hugeicons--arrow-right-02" class="site-arrow rtl:rotate-180" />
              </a>
            </div>
          </div>
        </Transition>
      </div>
    </div>

    <div class="controls">
      <button
        type="button"
        class="controls__play"
        :aria-label="playing ? t('home.hero.pause') : t('home.hero.play')"
        @click="playing = !playing"
      >
        <Icon :icon="playing ? 'hugeicons--pause' : 'hugeicons--play'" class="size-4" />
      </button>
      <button
        v-for="(item, n) in slides"
        :key="item"
        type="button"
        class="dot"
        :class="{ on: n === index }"
        :aria-label="t('home.hero.goTo', { n: n + 1 })"
        :aria-current="n === index ? 'true' : undefined"
        @click="index = n"
      />
    </div>
  </section>
</template>

<style scoped>
  .hero {
    position: relative;
    min-height: 321px;
    overflow: hidden;
    background: var(--primary);
    color: #fff;
  }
  .hero__bg {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  /* Dark green over the photo so the text keeps its contrast whatever the image */
  .hero__shade {
    position: absolute;
    inset: 0;
    background: linear-gradient(
      to left,
      rgb(31 58 43 / 0.45),
      rgb(31 58 43 / 0.75) 50%,
      rgb(31 58 43 / 0.92)
    );
  }
  [dir='rtl'] .hero__shade {
    transform: scaleX(-1);
  }
  .hero__content {
    position: relative;
    min-height: 321px;
    display: flex;
    align-items: center;
    padding-block: 35px 48px;
  }
  .hero__slide {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
    max-width: 576px;
  }
  .hero__eyebrow {
    color: var(--secondary-on-dark);
    font: 600 14px/20px var(--font);
  }
  h1 {
    font: 700 36px/44px var(--font);
  }
  h1 em {
    color: var(--secondary);
    font-style: normal;
  }
  .hero__text {
    max-width: 404px;
    color: var(--chip);
  }
  .hero__actions {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }
  .hero__ghost {
    border-color: var(--border-on-dark);
    background: var(--glass);
    color: #fff;
    backdrop-filter: blur(2px);
  }
  .hero__ghost:hover {
    background: rgb(255 255 255 / 0.25);
  }
  .controls {
    position: absolute;
    inset-inline: 0;
    bottom: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
  }
  .controls__play {
    width: 24px;
    height: 24px;
    display: grid;
    place-items: center;
    border-radius: 99px;
    background: var(--glass);
    cursor: pointer;
  }
  /* 8px dot inside a 24px hit area (WCAG 2.5.8 target size) */
  .dot {
    position: relative;
    width: 24px;
    height: 24px;
    cursor: pointer;
  }
  .dot::before {
    content: '';
    position: absolute;
    top: 8px;
    inset-inline-start: 8px;
    width: 8px;
    height: 8px;
    border-radius: 99px;
    background: rgb(255 255 255 / 0.5);
  }
  .dot.on {
    width: 40px;
  }
  .dot.on::before {
    width: 24px;
    background: var(--secondary);
  }
  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.3s;
  }
  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
  }
  @media (prefers-reduced-motion: reduce) {
    .fade-enter-active,
    .fade-leave-active {
      transition: none;
    }
  }
  @media (max-width: 640px) {
    h1 {
      font-size: 28px;
      line-height: 36px;
    }
  }
</style>
