<script setup lang="ts">
  import { Button, Icon } from '@workspace/ui';
  import HeroControls from '~/modules/home/components/HeroControls.vue';
  import { useHeroDrag } from '~/modules/home/composables/useHeroDrag';
  import { slideImages, slides } from '~/modules/home/data';

  /**
   * Rotating hero. Autoplay every 5s, paused while hovered or focused, off when the user
   * prefers reduced motion. It stops for good once the user picks a slide or presses the
   * keyboard-revealed pause button in HeroControls (WCAG 2.2.2).
   * The photos can also be dragged or swiped (useHeroDrag), which counts as picking a slide.
   */
  const { t } = useI18n();
  const index = ref(0);
  const slide = computed(() => slides[index.value] ?? slides[0]);
  const playing = ref(true);
  const held = ref(false);
  let timer: ReturnType<typeof setInterval> | undefined;

  // Last change's direction (1 forward, -1 back). CSS --dir maps "forward" to the reading end.
  const step = ref<1 | -1>(1);
  const go = (n: number, towards: 1 | -1 = n > index.value ? 1 : -1) => {
    if (n === index.value) return;
    step.value = towards;
    index.value = n;
  };
  const next = () => go((index.value + 1) % slides.length, 1);
  const pick = (n: number) => {
    playing.value = false;
    go(n);
  };
  const motion = computed(() => (step.value === 1 ? 'hero-next' : 'hero-prev'));

  const root = ref<HTMLElement | null>(null);
  const drag = useHeroDrag(root, index, slides.length, (n, towards) => {
    playing.value = false;
    go(n, towards);
  });

  const stop = () => clearInterval(timer);
  const start = () => {
    stop();
    if (playing.value && !held.value && !drag.active.value) timer = setInterval(next, 5000);
  };
  watch([playing, held, drag.active], start);

  onMounted(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) playing.value = false;
    start();
  });
  onBeforeUnmount(stop);
</script>

<template>
  <section
    ref="root"
    class="hero on-dark"
    :class="{ 'hero--dragging': drag.active.value }"
    aria-roledescription="carousel"
    :aria-label="t('home.hero.label')"
    @mouseenter="held = true"
    @mouseleave="held = false"
    @focusin="held = true"
    @focusout="held = false"
    v-on="drag.listeners"
    @click.capture="drag.onClickCapture"
    @dragstart.prevent
  >
    <!-- All backgrounds stay mounted (v-show) so a slide change never waits on a download -->
    <!-- While dragging, the photos are moved by hand, so their slide transition is switched off -->
    <Transition v-for="(item, n) in slides" :key="item" :name="motion" :css="!drag.active.value">
      <div
        v-show="n === index || n === drag.peek.value"
        class="hero__frame"
        :style="drag.frameStyle(n)"
      >
        <NuxtImg
          :src="slideImages[item]"
          alt=""
          class="hero__bg"
          sizes="sm:100vw md:100vw lg:100vw xl:100vw 2xl:100vw"
          :quality="70"
          format="webp"
          :preload="n === 0"
          :fetchpriority="n === 0 ? 'high' : 'low'"
        />
      </div>
    </Transition>
    <div class="hero__shade" />
    <div class="hero__content container">
      <!-- Announces slide changes only when the user drives them, never during autoplay -->
      <div :aria-live="playing ? 'off' : 'polite'">
        <Transition :name="`${motion}-text`" mode="out-in">
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
              <Button
                as="a"
                class="btn btn--glass hero__ghost"
                href="#services"
                test-id="hero-services"
                >{{ t('home.hero.services') }}</Button
              >
              <Button as="a" class="btn btn--secondary" href="#" test-id="hero-cta">
                {{ t(`home.hero.slides.${slide}.cta`) }}
                <Icon icon="hugeicons--arrow-right-02" class="site-arrow rtl:rotate-180" />
              </Button>
            </div>
          </div>
        </Transition>
      </div>
    </div>

    <HeroControls
      :index="index"
      :total="slides.length"
      :playing="playing"
      @go="pick"
      @toggle="playing = !playing"
    />
  </section>
</template>

<style scoped>
  .hero {
    /* 1 in English, -1 in Arabic: multiplies every horizontal slide so "forward" follows the reading direction */
    --dir: 1;
    position: relative;
    min-height: 321px;
    overflow: hidden;
    background: var(--primary);
    color: #fff;
    /* Vertical swipes still scroll the page; horizontal ones drag the slides */
    touch-action: pan-y;
    cursor: grab;
  }
  .hero--dragging {
    cursor: grabbing;
    user-select: none;
  }
  [dir='rtl'] .hero {
    --dir: -1;
  }
  .hero__frame {
    position: absolute;
    inset: 0;
    transition: transform 0.7s cubic-bezier(0.65, 0, 0.35, 1);
  }
  .hero__bg {
    width: 100%;
    height: 100%;
    object-fit: cover;
    /* Keep the camels in view when narrow screens crop the wide photo */
    object-position: 25% center;
    /* The photos fade to green on the right; mirror them in English so it lands behind the text */
    transform: scaleX(-1);
  }
  [dir='rtl'] .hero__bg {
    transform: none;
  }
  /* Forward: the new photo slides in from the reading end while the old one leaves toward the start */
  .hero-next-enter-from,
  .hero-prev-leave-to {
    transform: translateX(calc(100% * var(--dir)));
  }
  .hero-next-leave-to,
  .hero-prev-enter-from {
    transform: translateX(calc(-100% * var(--dir)));
  }
  /*
   * The photos' own green only covers the outer edge, so a lighter shade still sits behind the
   * text column to keep its contrast, then clears to let the scene show.
   */
  .hero__shade {
    position: absolute;
    inset: 0;
    background: linear-gradient(
      to left,
      rgb(31 58 43 / 0),
      rgb(31 58 43 / 0.35) 40%,
      rgb(31 58 43 / 0.8) 75%,
      rgb(31 58 43 / 0.9)
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
  /* Text drifts a little the same way as the photo, then fades in */
  .hero-next-text-enter-active,
  .hero-next-text-leave-active,
  .hero-prev-text-enter-active,
  .hero-prev-text-leave-active {
    transition:
      opacity 0.3s,
      transform 0.3s ease-out;
  }
  .hero-next-text-enter-from,
  .hero-prev-text-leave-to {
    opacity: 0;
    transform: translateX(calc(24px * var(--dir)));
  }
  .hero-next-text-leave-to,
  .hero-prev-text-enter-from {
    opacity: 0;
    transform: translateX(calc(-24px * var(--dir)));
  }
  /* Reduced motion: every hero transition (photo and text) swaps instantly */
  @media (prefers-reduced-motion: reduce) {
    .hero__frame,
    [class*='hero-next-'],
    [class*='hero-prev-'] {
      transition: none;
    }
  }
  @media (max-width: 640px) {
    /* Text spans the full width on phones, so the shade has to as well */
    .hero__shade {
      background: rgb(31 58 43 / 0.72);
    }
    h1 {
      font-size: 28px;
      line-height: 36px;
    }
  }
</style>
