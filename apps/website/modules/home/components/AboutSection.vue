<script setup lang="ts">
  import { Button, Icon } from '@workspace/ui';
  import FeatureCard from '~/modules/home/components/FeatureCard.vue';
  import { features } from '~/modules/home/data';

  /**
   * "About us" (Figma: About section). Copy beside a framed photo with gold and green corner
   * brackets. In Arabic the photo sits on the right, in English it mirrors to the left.
   * Below 1025px the photo moves above the copy.
   */
  const { t } = useI18n();
</script>

<template>
  <section id="about" class="section about" aria-labelledby="about-title">
    <div class="about__row container">
      <div class="about__copy">
        <SectionHeading
          id="about-title"
          :eyebrow="t('home.about.eyebrow')"
          :title="t('home.about.title')"
          align="start"
        />
        <p class="lead">{{ t('home.about.lead') }}</p>
        <p class="desc">{{ t('home.about.text') }}</p>
        <ul class="feats">
          <li v-for="item in features" :key="item.id" class="feat">
            <FeatureCard
              :title="t(`home.about.features.${item.id}.title`)"
              :text="t(`home.about.features.${item.id}.text`)"
              :image="item.image"
            />
          </li>
        </ul>
        <div class="acts">
          <Button as="a" class="btn btn--primary" href="#services" test-id="about-services">
            {{ t('home.about.services') }}
            <Icon icon="hugeicons--arrow-right-02" class="site-arrow rtl:rotate-180" />
          </Button>
          <Button as="a" class="btn btn--tertiary acts__more" href="#" test-id="about-learn-more">
            {{ t('home.about.learnMore') }}
            <Icon icon="hugeicons--arrow-right-02" class="site-arrow rtl:rotate-180" />
          </Button>
        </div>
      </div>
      <div class="frame">
        <span class="frame__corner frame__corner--top" aria-hidden="true" />
        <NuxtImg
          src="/images/brand/camel_aboutus.jpg"
          :alt="t('home.about.imageAlt')"
          class="frame__img"
          width="452"
          height="452"
          densities="x1 x2"
          :quality="75"
          format="webp"
          loading="lazy"
        />
        <span class="frame__corner frame__corner--bottom" aria-hidden="true" />
      </div>
    </div>
  </section>
</template>

<style scoped>
  .about {
    padding-block: 40px;
  }
  /* Copy stays first in reading order; row-reverse puts the photo on the reading-start side */
  .about__row {
    display: flex;
    flex-direction: row-reverse;
    align-items: center;
    gap: 64px;
  }
  .about__copy {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 24px;
  }
  .lead {
    color: var(--primary);
    font: 500 20px/28px var(--font);
  }
  .desc {
    color: var(--caption);
  }
  .feats {
    display: flex;
    gap: 16px;
  }
  .feat {
    flex: 1;
    min-width: 0;
  }
  .acts {
    display: flex;
    flex-wrap: wrap;
    gap: 16px;
  }
  .acts .btn {
    font-size: 16px;
    line-height: 24px;
  }
  .acts__more {
    min-width: 120px;
  }

  /* Photo in a gold hairline frame */
  .frame {
    position: relative;
    flex: none;
    width: 476px;
    padding: 12px;
    border: 0.5px solid var(--secondary);
    border-radius: 8px;
  }
  .frame__img {
    display: block;
    width: 100%;
    height: auto;
    aspect-ratio: 1;
    object-fit: cover;
    border-radius: 4px;
  }
  /* Corner brackets: gold top-left, green bottom-right, as drawn in the design */
  .frame__corner {
    position: absolute;
    z-index: 1;
    width: 60px;
    height: 60px;
    pointer-events: none;
  }
  .frame__corner--top {
    top: 5.5px;
    left: 5.5px;
    border-top: 2px solid var(--secondary);
    border-left: 2px solid var(--secondary);
    border-top-left-radius: 8px;
  }
  .frame__corner--bottom {
    right: 5.5px;
    bottom: 5.5px;
    border-right: 2px solid var(--primary);
    border-bottom: 2px solid var(--primary);
    border-bottom-right-radius: 8px;
  }

  /* Tablet: photo above the copy */
  @media (max-width: 1024px) {
    .about__row {
      flex-direction: column-reverse;
      align-items: stretch;
      gap: 32px;
    }
    .frame {
      width: 100%;
      max-width: 476px;
      align-self: center;
    }
  }
  /* Phone: stacked feature cards, tighter spacing and type */
  @media (max-width: 640px) {
    .about__copy {
      gap: 16px;
    }
    .feats {
      flex-direction: column;
      gap: 12px;
    }
    .frame {
      padding: 8px;
    }
    .frame__corner {
      width: 44px;
      height: 44px;
    }
    .frame__corner--top {
      top: 3.5px;
      left: 3.5px;
    }
    .frame__corner--bottom {
      right: 3.5px;
      bottom: 3.5px;
    }
    .lead {
      font-size: 18px;
      line-height: 28px;
    }
    .desc {
      font-size: 14px;
      line-height: 22px;
    }
  }
</style>
