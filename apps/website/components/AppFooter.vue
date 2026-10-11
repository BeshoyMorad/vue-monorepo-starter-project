<script setup lang="ts">
  import { Icon } from '@workspace/ui';
  import { footerColumns, socials } from '~/modules/home/data';

  /**
   * Public site footer (Figma: Footer 11459:650). Brand block (logo, blurb, social links),
   * then stores, services and terms columns; DOM order is reading order, so Arabic shows the
   * brand on the right and English mirrors it. 4 columns, 2 on tablet, 1 on phone.
   */
  const { t } = useI18n();
  const year = new Date().getFullYear();
</script>

<template>
  <footer class="site-footer on-dark">
    <div class="cols container">
      <div class="col brand">
        <img
          src="/images/brand/ibbil-logo.svg"
          :alt="t('home.footer.logoAlt')"
          width="154"
          height="48"
          class="brand__logo"
        />
        <p>{{ t('home.footer.description') }}</p>
        <ul class="social" :aria-label="t('home.footer.social')">
          <li v-for="item in socials" :key="item.id">
            <a :href="item.href" :aria-label="t(`home.footer.socials.${item.id}`)">
              <Icon :icon="item.icon" class="size-4" />
            </a>
          </li>
        </ul>
      </div>
      <nav
        v-for="col in footerColumns"
        :key="col.id"
        class="col"
        :aria-labelledby="`footer-${col.id}`"
      >
        <h2 :id="`footer-${col.id}`" class="col__title">
          {{ t(`home.footer.columns.${col.id}`) }}
        </h2>
        <ul class="links">
          <li v-for="link in col.links" :key="link.id">
            <a :href="link.to">{{ t(link.label) }}</a>
          </li>
        </ul>
        <NuxtImg
          v-if="col.id === 'policies'"
          src="/images/brand/saudi-vision-2030.png"
          :alt="t('home.footer.vision')"
          class="vision"
          width="112"
          height="75"
          densities="x1 x2"
          format="webp"
          loading="lazy"
        />
      </nav>
    </div>
    <p class="copy">{{ t('home.footer.copyright', { year }) }}</p>
  </footer>
</template>

<style scoped>
  .site-footer {
    background: var(--primary);
    color: #fff;
    font-size: 14px;
    line-height: 20px;
  }
  .cols {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 40px;
    max-width: 1280px;
    padding-block: 48px;
  }
  .col {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
    min-width: 0;
  }
  .col__title {
    color: var(--secondary-on-dark);
    font: 700 14px/20px var(--font);
  }
  .links {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
  .links a:hover,
  .links a:focus-visible {
    text-decoration: underline;
    text-underline-offset: 4px;
  }
  .vision {
    width: 112px;
    height: 75px;
    object-fit: contain;
  }
  .brand__logo {
    width: 154px;
    height: auto;
  }
  .social {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }
  .social a {
    width: 36px;
    height: 36px;
    display: grid;
    place-items: center;
    border-radius: 99px;
    background: var(--glass);
    transition: background-color 0.15s;
  }
  .social a:hover,
  .social a:focus-visible {
    background: rgb(255 255 255 / 0.3);
  }
  .copy {
    padding: 16px;
    border-top: 0.5px solid #d1d5db;
    text-align: center;
    font-size: 12px;
    line-height: 16px;
  }
  @media (max-width: 1024px) {
    .cols {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }
  @media (max-width: 600px) {
    .cols {
      grid-template-columns: 1fr;
      padding-block: 40px;
    }
  }
</style>
