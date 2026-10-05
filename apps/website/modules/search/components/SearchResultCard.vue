<script setup lang="ts">
  import Icon from '@workspace/ui/icon/Icon.vue';
  import { entityIcons } from '~/modules/search/data';
  import type { SearchHit } from '~/modules/search/types';

  /** One search hit. The whole card is one link, named by its heading. */
  const props = defineProps<{ hit: SearchHit }>();
  const { t } = useI18n();

  // Remote logos can be missing or broken: fall back to the entity type's icon
  const logoFailed = ref(false);
  const showLogo = computed(() => Boolean(props.hit.logoUrl) && !logoFailed.value);
</script>

<template>
  <article class="hit">
    <!-- TODO: link to the entity page (store, product, doctor…) once those pages exist -->
    <a href="#" class="hit__link">
      <!-- The type icon shows until the logo has loaded, and stays if it fails -->
      <span class="hit__media">
        <Icon :icon="entityIcons[hit.entityType]" class="size-8" />
        <NuxtImg
          v-if="showLogo"
          :src="hit.logoUrl"
          alt=""
          width="72"
          height="72"
          fit="cover"
          densities="x1 x2"
          loading="lazy"
          class="hit__logo"
          @error="logoFailed = true"
        />
      </span>
      <span class="hit__body">
        <span class="hit__type">{{ t(`search.entityTypes.${hit.entityType}`) }}</span>
        <h2 class="hit__name">
          <bdi>{{ hit.name }}</bdi>
        </h2>
        <span v-if="hit.description" class="hit__desc"
          ><bdi>{{ hit.description }}</bdi></span
        >
        <span v-if="hit.highlights?.length" class="hit__tags">
          <span v-for="tag in hit.highlights.slice(0, 3)" :key="tag" class="hit__tag">
            <bdi>{{ tag }}</bdi>
          </span>
        </span>
      </span>
      <Icon icon="hugeicons--arrow-right-01" class="hit__chev size-5 rtl:rotate-180" />
    </a>
  </article>
</template>

<style scoped>
  .hit {
    height: 100%;
  }
  .hit__link {
    height: 100%;
    display: flex;
    align-items: flex-start;
    gap: 16px;
    padding: 16px;
    border: 0.5px solid var(--border);
    border-radius: var(--radius);
    background: #fff;
    transition:
      border-color 0.15s,
      box-shadow 0.15s;
  }
  .hit__link:hover {
    border-color: rgb(45 83 61 / 0.35);
    box-shadow: 0 6px 16px -6px rgb(45 83 61 / 0.18);
  }
  .hit__media {
    position: relative;
    flex: none;
    width: 72px;
    height: 72px;
    display: grid;
    place-items: center;
    overflow: hidden;
    border-radius: 12px;
    background: var(--chip);
    color: var(--primary);
  }
  .hit__logo {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  .hit__body {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
  }
  .hit__type {
    padding: 2px 8px;
    border-radius: 99px;
    background: var(--color-gold-50);
    color: var(--secondary-text);
    font: 600 11px/16px var(--font);
  }
  .hit__name {
    max-width: 100%;
    overflow: hidden;
    color: var(--primary);
    font: 700 16px/24px var(--font);
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .hit__desc {
    display: -webkit-box;
    overflow: hidden;
    color: var(--caption);
    font-size: 13px;
    line-height: 20px;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }
  .hit__tags {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    margin-top: 4px;
  }
  .hit__tag {
    padding: 2px 8px;
    border-radius: 6px;
    background: var(--modal2);
    color: var(--caption);
    font-size: 12px;
    line-height: 18px;
  }
  .hit__chev {
    flex: none;
    align-self: center;
    color: var(--muted);
  }
</style>
