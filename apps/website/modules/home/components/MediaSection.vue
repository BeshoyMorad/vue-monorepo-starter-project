<script setup lang="ts">
  import { useQuery } from '@tanstack/vue-query';
  import { Button, Icon } from '@workspace/ui';
  import { galleryListQueryOptions } from '~/modules/gallery/queries';
  import { useGalleryService } from '~/modules/gallery/services';
  import type { GalleryItem, GalleryMediaType } from '~/modules/gallery/types';
  import MediaCard from '~/modules/home/components/MediaCard.vue';
  import {
    featuredStory,
    mediaTabIcons,
    mediaTabs,
    stories,
    type MediaTab,
  } from '~/modules/home/data';

  /**
   * Media center (Figma: Media section): content-type filter, the featured story on the
   * reading-start side and the latest stories beside it. Stacks below 1025px.
   * News and events are sample stories; photos and videos come from the gallery API, in the
   * page's language, loaded when their tab is first opened.
   */
  const { t, locale } = useI18n();
  const active = ref<MediaTab>('news');
  const visible = computed(() => stories.filter((story) => story.type === active.value));

  const galleryTypes: Partial<Record<MediaTab, GalleryMediaType>> = {
    photos: 'IMAGE',
    videos: 'VIDEO',
  };
  const galleryType = computed(() => galleryTypes[active.value]);
  const gallery = useQuery(
    computed(() =>
      galleryListQueryOptions(
        useGalleryService(),
        {
          mediaType: galleryType.value ?? 'IMAGE',
          lang: locale.value === 'ar' ? 'AR' : 'EN',
          limit: 2,
          sortBy: 'createdAt',
          sortOrder: 'DESC',
        },
        !!galleryType.value
      )
    )
  );
  const galleryItems = computed(() => gallery.data.value?.items ?? []);

  // Videos without a poster keep the placeholder; photos are their own cover
  const cover = (item: GalleryItem) =>
    item.mediaType === 'IMAGE' ? item.mediaUrl : (item.thumbnailUrl ?? null);
  const duration = (seconds?: number | null) => {
    if (!seconds) return undefined;
    const text = `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`;
    return { text, label: t('home.media.duration', { t: text }) };
  };

  // Western digits in both languages, as in the design ("9 سبتمبر 2026")
  const number = (n: number) => new Intl.NumberFormat(`${locale.value}-u-nu-latn`).format(n);
  const date = (iso: string) =>
    new Intl.DateTimeFormat(`${locale.value}-u-nu-latn`, {
      dateStyle: 'long',
      timeZone: 'UTC',
    }).format(new Date(iso));
</script>

<template>
  <section id="media" class="section media-section" aria-labelledby="media-title">
    <SectionHeading
      id="media-title"
      :eyebrow="t('home.media.eyebrow')"
      :title="t('home.media.title')"
      :text="t('home.media.text')"
    />
    <div class="media container">
      <div class="tabs" role="group" :aria-label="t('home.media.filterLabel')">
        <Button
          v-for="tab in mediaTabs"
          :key="tab"
          type="button"
          :test-id="`media-tab-${tab}`"
          :aria-pressed="active === tab"
          :class="['ui-bare', 'tab', { 'tab--on': active === tab }]"
          @click="active = tab"
        >
          <Icon :icon="mediaTabIcons[tab]" class="size-4" />
          {{ t(`home.media.tabs.${tab}`) }}
        </Button>
      </div>
      <div class="layout">
        <article class="featured on-dark">
          <div class="featured__bg ph" />
          <div class="featured__shade" />
          <div class="featured__text">
            <p class="featured__meta">
              {{ t('home.media.featured.category') }}
              <span aria-hidden="true">&nbsp;•&nbsp;</span>
              <time :datetime="featuredStory.date">{{ date(featuredStory.date) }}</time>
            </p>
            <h3>{{ t('home.media.featured.title') }}</h3>
            <p>{{ t('home.media.featured.text') }}</p>
          </div>
          <Button as="a" class="btn featured__more" href="#" test-id="media-featured-more">
            {{ t('home.readMore') }}
            <span class="sr-only">: {{ t('home.media.featured.title') }}</span>
            <Icon icon="hugeicons--arrow-right-02" class="site-arrow rtl:rotate-180" />
          </Button>
        </article>
        <ul class="latest" aria-live="polite" :aria-busy="!!galleryType && gallery.isPending.value">
          <template v-if="galleryType">
            <template v-if="gallery.isPending.value">
              <li v-for="n in 2" :key="n" class="skeleton ph" />
            </template>
            <li v-else-if="gallery.isError.value" class="empty">
              {{ t('home.media.loadError') }}
            </li>
            <li v-else v-for="item in galleryItems" :key="item.id">
              <MediaCard
                :title="item.title"
                :date="item.createdAt"
                :date-text="date(item.createdAt)"
                :cover="cover(item)"
                :video="item.mediaType === 'VIDEO'"
                :duration="duration(item.durationSeconds)"
                :href="item.mediaUrl"
                :link-label="
                  item.mediaType === 'VIDEO' ? t('home.media.watch') : t('home.media.viewPhoto')
                "
                external
                test-id="media-gallery-open"
              />
            </li>
            <li v-if="gallery.isSuccess.value && !galleryItems.length" class="empty">
              {{ t('home.media.empty') }}
            </li>
          </template>
          <template v-else>
            <li v-for="story in visible" :key="story.id">
              <MediaCard
                :title="t(`home.media.stories.${story.id}`)"
                :date="story.date"
                :date-text="date(story.date)"
                :views="{
                  text: number(story.views),
                  label: t('home.media.views', { n: number(story.views) }),
                }"
                href="#"
                :link-label="t('home.readMore')"
                test-id="media-story-more"
              />
            </li>
            <li v-if="!visible.length" class="empty">{{ t('home.media.empty') }}</li>
          </template>
        </ul>
      </div>
    </div>
    <Button as="a" class="btn center-link" href="#" test-id="media-center">
      {{ t('home.media.center') }}
      <Icon icon="hugeicons--arrow-right-01" class="site-arrow rtl:rotate-180" />
    </Button>
  </section>
</template>

<style scoped>
  .media-section {
    padding-block: 40px;
  }
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
  .tab {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    min-height: 33px;
    padding: 6px 12px;
    border: 0.5px solid #d1d5db;
    border-radius: 8px;
    background: var(--modal2);
    color: var(--primary);
    font: 600 14px/20px var(--font);
    cursor: pointer;
    transition: border-color 0.15s;
  }
  .tab:hover,
  .tab--on {
    border-color: var(--primary);
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
  /* Loading stand-in, the height of one card */
  .skeleton {
    height: 176px;
    border-radius: 8px;
  }
  .empty {
    padding: 24px;
    border-radius: 8px;
    background: var(--modal2);
    color: var(--caption);
    text-align: center;
  }

  /* Featured story: photo under a green shade, text at the bottom */
  .featured {
    position: relative;
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    align-items: flex-start;
    gap: 12px;
    padding: 196px 24px 24px;
    overflow: hidden;
    border-radius: 8px;
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
      rgb(3 40 29 / 0.9) 8.5%,
      rgb(3 40 29 / 0.6) 57.8%,
      rgb(255 255 255 / 0.1)
    );
  }
  .featured__text,
  .featured__more {
    position: relative;
  }
  .featured__text {
    width: 100%;
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
    min-height: 36px;
    padding: 8px;
    background: var(--glass);
    color: var(--secondary-on-dark);
  }
  .featured__more:hover {
    background: rgb(255 255 255 / 0.25);
  }

  /* "Media center" link: white with a grey hairline, as the categories "view all" */
  .center-link {
    gap: 10px;
    padding: 8px 12px;
    border: 0.5px solid #9ca3af;
    background: #fff;
    color: var(--primary);
    font: 700 16px/24px var(--font);
  }
  .center-link:hover {
    border-color: var(--primary);
  }

  @media (max-width: 1024px) {
    .layout {
      flex-direction: column;
    }
    .latest {
      width: 100%;
    }
    .featured {
      min-height: 420px;
      padding-top: 160px;
    }
  }
  @media (max-width: 560px) {
    .latest {
      gap: 12px;
    }
    .skeleton {
      height: 120px;
    }
    .featured {
      min-height: 0;
      padding: 120px 16px 16px;
    }
    .featured h3 {
      font-size: 20px;
      line-height: 28px;
    }
  }
</style>
