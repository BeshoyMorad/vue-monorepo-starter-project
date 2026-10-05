<script setup lang="ts">
  import { Icon } from '@workspace/ui';
  import { features } from '~/modules/home/data';

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
            <span class="feat__icon"><Icon :icon="item.icon" class="size-6" /></span>
            <h3>{{ t(`home.about.features.${item.id}.title`) }}</h3>
            <p>{{ t(`home.about.features.${item.id}.text`) }}</p>
          </li>
        </ul>
        <div class="acts">
          <a class="btn btn--primary" href="#services">
            {{ t('home.about.services') }}
            <Icon icon="hugeicons--arrow-right-02" class="site-arrow rtl:rotate-180" />
          </a>
          <a class="btn btn--glass" href="#">
            {{ t('home.about.learnMore') }}
            <Icon icon="hugeicons--arrow-right-02" class="site-arrow rtl:rotate-180" />
          </a>
        </div>
      </div>
      <div class="frame">
        <div class="ph frame__img" role="img" :aria-label="t('home.about.imageAlt')" />
      </div>
    </div>
  </section>
</template>

<style scoped>
  .about {
    padding-block: 64px;
  }
  .about__row {
    display: flex;
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
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding: 20px;
    border: 0.5px solid var(--border);
    border-radius: var(--radius);
    background: linear-gradient(#fff, var(--modal2));
  }
  .feat__icon {
    width: 48px;
    height: 48px;
    display: grid;
    place-items: center;
    border-radius: 12px;
    background: var(--chip);
    color: var(--primary);
  }
  .feat h3 {
    color: var(--primary);
    font: 700 14px/20px var(--font);
  }
  .feat p {
    color: var(--caption);
    font-size: 14px;
    line-height: 20px;
  }
  .acts {
    display: flex;
    flex-wrap: wrap;
    gap: 16px;
  }
  .frame {
    flex: none;
    width: 476px;
    padding: 12px;
    border: 0.5px solid var(--secondary);
    border-radius: var(--radius);
  }
  .frame__img {
    aspect-ratio: 1;
    border-radius: 4px;
  }
  @media (max-width: 900px) {
    .about__row,
    .feats {
      flex-direction: column;
    }
    .about__row {
      align-items: stretch;
    }
    .frame {
      width: 100%;
      padding: 8px;
    }
    .frame__img {
      aspect-ratio: 16 / 10;
    }
    /* Feature cards become compact rows: icon beside the text */
    .feats {
      gap: 10px;
    }
    .feat {
      display: grid;
      grid-template-columns: 40px 1fr;
      gap: 2px 12px;
      align-items: center;
      padding: 12px 14px;
    }
    .feat__icon {
      grid-row: span 2;
      width: 40px;
      height: 40px;
      border-radius: 10px;
    }
  }
  /* Phone: tighter spacing and type */
  @media (max-width: 640px) {
    .about {
      padding-block: 48px;
    }
    .about__row {
      gap: 32px;
    }
    .about__copy {
      gap: 16px;
    }
    .lead {
      font-size: 18px;
      line-height: 28px;
    }
    .desc {
      font-size: 14px;
      line-height: 22px;
    }
    .acts .btn {
      flex: 1;
    }
  }
</style>
