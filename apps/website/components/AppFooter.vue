<script setup lang="ts">
  import { Icon } from '@workspace/ui';
  import { footerColumns, socials } from '~/modules/home/data';

  /** Public site footer: link columns, brand blurb with social links, copyright */
  const { t } = useI18n();
  const year = new Date().getFullYear();
</script>

<template>
  <footer class="site-footer on-dark">
    <div class="cols container">
      <nav
        v-for="col in footerColumns"
        :key="col.id"
        class="col"
        :aria-labelledby="`footer-${col.id}`"
      >
        <h2 :id="`footer-${col.id}`" class="col__title">
          {{ t(`home.footer.columns.${col.id}`) }}
        </h2>
        <a v-for="link in col.links" :key="link" href="#">{{ t(`home.footer.links.${link}`) }}</a>
        <div
          v-if="col.id === 'policies'"
          class="vision ph"
          role="img"
          :aria-label="t('home.footer.vision')"
        />
      </nav>
      <div class="col brand">
        <img src="/images/brand/ibbil-logo.svg" alt="" class="brand__logo" />
        <p>{{ t('home.footer.description') }}</p>
        <ul class="social" :aria-label="t('home.footer.social')">
          <li v-for="item in socials" :key="item.id">
            <a :href="item.href" :aria-label="t(`home.footer.socials.${item.id}`)">
              <Icon :icon="item.icon" class="size-5" />
            </a>
          </li>
        </ul>
      </div>
    </div>
    <p class="copy">{{ t('home.footer.copyright', { year }) }}</p>
  </footer>
</template>

<style scoped>
  .site-footer {
    background: var(--primary);
    color: #fff;
  }
  .cols {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 40px;
    padding-block: 48px;
  }
  .col {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
    font-size: 14px;
    line-height: 20px;
  }
  .col a:hover {
    text-decoration: underline;
    text-underline-offset: 4px;
  }
  .col__title {
    margin-bottom: 4px;
    color: var(--secondary-on-dark);
    font: 700 14px/20px var(--font);
  }
  .vision {
    width: 112px;
    height: 75px;
    margin-top: 4px;
    border-radius: 4px;
  }
  .brand {
    gap: 16px;
  }
  .brand__logo {
    height: 44px;
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
  }
  .social a:hover {
    background: rgb(255 255 255 / 0.25);
  }
  .copy {
    padding: 16px;
    border-top: 0.5px solid var(--border-on-dark);
    text-align: center;
    font-size: 12px;
    line-height: 16px;
  }
  @media (max-width: 900px) {
    .cols {
      grid-template-columns: 1fr 1fr;
    }
  }
  /* Phone: link columns side by side, brand block across the full width */
  @media (max-width: 560px) {
    .cols {
      gap: 32px 16px;
      padding-block: 40px;
    }
    .brand {
      grid-column: 1 / -1;
      padding-top: 24px;
      border-top: 0.5px solid var(--border-on-dark);
    }
  }
</style>
