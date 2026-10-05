<script setup lang="ts">
  import { Icon } from '@workspace/ui';
  import { mediaTabs, stories, type MediaTab } from '~/modules/home/data';

  /** Latest stories filtered by content type, next to the featured story */
  const { t, locale } = useI18n();
  const active = ref<MediaTab>('news');
  const visible = computed(() => stories.filter((story) => story.type === active.value));

  const number = (n: number) => new Intl.NumberFormat(locale.value).format(n);
  const date = (iso: string) =>
    new Intl.DateTimeFormat(locale.value, { dateStyle: 'medium', timeZone: 'UTC' }).format(
      new Date(iso)
    );
</script>

<template>
  <section id="media" class="section" aria-labelledby="media-title">
    <SectionHeading
      id="media-title"
      :eyebrow="t('home.media.eyebrow')"
      :title="t('home.media.title')"
      :text="t('home.media.text')"
    />
    <div class="media container">
      <div class="tabs" role="group" :aria-label="t('home.media.filterLabel')">
        <button
          v-for="tab in mediaTabs"
          :key="tab"
          type="button"
          :aria-pressed="active === tab"
          :class="{ on: active === tab }"
          @click="active = tab"
        >
          {{ t(`home.media.tabs.${tab}`) }}
        </button>
      </div>
      <div class="layout">
        <ul class="latest" aria-live="polite">
          <li v-for="story in visible" :key="story.id">
            <article class="story">
              <div class="story__body">
                <h3>{{ t(`home.media.stories.${story.id}`) }}</h3>
                <div class="meta">
                  <span
                    ><Icon icon="hugeicons--view" class="size-4" />{{
                      t('home.media.views', { n: number(story.views) })
                    }}</span
                  >
                  <span
                    ><Icon icon="hugeicons--calendar-03" class="size-4" /><time
                      :datetime="story.date"
                      >{{ date(story.date) }}</time
                    ></span
                  >
                </div>
                <a class="btn btn--glass more" href="#">
                  {{ t('home.readMore') }}
                  <span class="sr-only">: {{ t(`home.media.stories.${story.id}`) }}</span>
                  <Icon icon="hugeicons--arrow-right-02" class="site-arrow rtl:rotate-180" />
                </a>
              </div>
              <div class="cover ph" />
            </article>
          </li>
          <li v-if="!visible.length" class="empty">{{ t('home.media.empty') }}</li>
        </ul>
        <article class="featured on-dark">
          <div class="featured__bg ph" />
          <div class="featured__shade" />
          <div class="featured__text">
            <p class="featured__meta">{{ t('home.media.featured.meta') }}</p>
            <h3>{{ t('home.media.featured.title') }}</h3>
            <p>{{ t('home.media.featured.text') }}</p>
          </div>
          <a class="btn featured__more" href="#">
            {{ t('home.readMore') }}
            <span class="sr-only">: {{ t('home.media.featured.title') }}</span>
            <Icon icon="hugeicons--arrow-right-02" class="site-arrow rtl:rotate-180" />
          </a>
        </article>
      </div>
    </div>
    <a class="btn btn--outline" href="#">
      {{ t('home.media.center') }}
      <Icon icon="hugeicons--arrow-right-02" class="site-arrow rtl:rotate-180" />
    </a>
  </section>
</template>

<style scoped>
  .media {
    display: flex;
    flex-direction: column;
    gap: 24px;
  }
  .tabs {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 10px;
  }
  .tabs button {
    min-height: 36px;
    padding: 6px 14px;
    border: 0.5px solid var(--border);
    border-radius: var(--radius);
    background: var(--modal2);
    color: var(--primary);
    font: 600 14px var(--font);
    cursor: pointer;
  }
  .tabs button.on {
    background: var(--primary);
    color: #fff;
  }
  .layout {
    display: flex;
    align-items: stretch;
    gap: 16px;
  }
  .latest {
    flex: none;
    width: 488px;
    display: flex;
    flex-direction: column;
    gap: 24px;
  }
  .story {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 16px;
    border-radius: var(--radius);
    background: var(--modal2);
  }
  .story__body {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
  .meta {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    color: var(--caption);
    font-size: 12px;
    line-height: 16px;
  }
  .meta span {
    display: inline-flex;
    align-items: center;
    gap: 4px;
  }
  h3 {
    color: var(--primary);
    font: 700 16px/24px var(--font);
  }
  .more {
    min-height: 32px;
    padding: 4px 10px;
  }
  .cover {
    flex: none;
    width: 144px;
    height: 144px;
    border-radius: var(--radius);
  }
  .empty {
    padding: 24px;
    border-radius: var(--radius);
    background: var(--modal2);
    color: var(--caption);
    text-align: center;
  }
  .featured {
    position: relative;
    flex: 1;
    min-height: 376px;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    gap: 12px;
    padding: 196px 24px 24px;
    overflow: hidden;
    border-radius: var(--radius);
    color: #fff;
  }
  .featured__bg,
  .featured__shade {
    position: absolute;
    inset: 0;
  }
  .featured__shade {
    background: linear-gradient(
      to top,
      rgb(3 40 29 / 0.92) 8.5%,
      rgb(3 40 29 / 0.7) 57.8%,
      rgb(3 40 29 / 0.15)
    );
  }
  .featured__text,
  .featured__more {
    position: relative;
  }
  .featured__text {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  .featured__meta {
    font: 500 12px/16px var(--font);
  }
  .featured h3 {
    color: #fff;
    font: 700 24px/32px var(--font);
  }
  .featured p {
    font-size: 14px;
    line-height: 20px;
  }
  .featured__more {
    align-self: flex-start;
    background: var(--glass);
    color: var(--secondary-on-dark);
  }
  .featured__more:hover {
    background: rgb(255 255 255 / 0.25);
  }
  @media (max-width: 900px) {
    .layout {
      flex-direction: column;
    }
    .latest {
      width: 100%;
    }
  }
  @media (max-width: 480px) {
    .cover {
      width: 96px;
      height: 96px;
    }
  }
</style>
