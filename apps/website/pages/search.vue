<script setup lang="ts">
  import { useQuery, useQueryClient } from '@tanstack/vue-query';
  import Icon from '@workspace/ui/icon/Icon.vue';
  import { Skeleton } from '@workspace/ui/ui/skeleton';
  import { queryKeys } from '~/api/query-keys';
  import SearchPager from '~/modules/search/components/SearchPager.vue';
  import SearchResultCard from '~/modules/search/components/SearchResultCard.vue';
  import { SEARCH_PAGE_SIZE, searchScopes } from '~/modules/search/data';
  import { searchResultsQueryOptions } from '~/modules/search/queries';
  import { useSearchService } from '~/modules/search/services';
  import { SEARCH_DOMAINS, type SearchDomain, type SearchParams } from '~/modules/search/types';
  import { paths } from '~/router/paths';
  import { useAuthStore } from '~/stores/auth';

  /**
   * Search results: /search?q=…&domain=…&page=… (all optional). Rendered on the server,
   * not indexed by search engines. The header search shows and edits the same query.
   */
  definePageMeta({ layout: 'site' });

  const { t, locale } = useI18n();
  const route = useRoute();
  const localePath = useLocalePath();
  const service = useSearchService();
  const authStore = useAuthStore();
  const queryClient = useQueryClient();

  const params = computed<SearchParams>(() => {
    const q = String(route.query.q ?? '')
      .trim()
      .slice(0, 100);
    const domain = String(route.query.domain ?? '') as SearchDomain;
    const page = Number.parseInt(String(route.query.page ?? '1'), 10);
    return {
      q: q || undefined,
      domain: SEARCH_DOMAINS.includes(domain) ? domain : undefined,
      page: Number.isFinite(page) && page > 1 ? page : 1,
      limit: SEARCH_PAGE_SIZE,
    };
  });

  // The header search shows what this page is showing
  const siteSearch = useSiteSearch();
  watch(
    params,
    (value) => {
      siteSearch.query.value = value.q ?? '';
      siteSearch.scope.value = value.domain ?? 'all';
    },
    { immediate: true }
  );

  const results = useServerPrefetch(
    useQuery(computed(() => searchResultsQueryOptions(service, params.value, locale.value)))
  );
  const items = computed(() => results.data.value?.items ?? []);
  const meta = computed(() => results.data.value?.meta);

  // A signed-in search is saved to the customer's history: show it in the suggestions
  watch(
    () => results.data.value,
    () => {
      if (import.meta.client && authStore.isAuthenticated && params.value.q) {
        queryClient.invalidateQueries({ queryKey: queryKeys.search.history() });
      }
    }
  );

  useSeoMeta({
    title: () =>
      params.value.q ? t('search.seo.titleFor', { q: params.value.q }) : t('search.seo.title'),
    robots: 'noindex, follow',
  });

  const linkTo = (domain?: string, page?: number) => ({
    path: localePath(paths.search),
    query: {
      q: params.value.q,
      domain: domain && domain !== 'all' ? domain : undefined,
      page: page && page > 1 ? page : undefined,
    },
  });
  const tabs = computed(() =>
    searchScopes.map((scope) => ({
      id: scope.id,
      icon: scope.icon,
      label: scope.navId ? t(`home.topNav.${scope.navId}`) : t('search.results.all'),
      to: linkTo(scope.id),
      active: (params.value.domain ?? 'all') === scope.id,
    }))
  );

  const heading = ref<HTMLElement>();
  const goToPage = async (page: number) => {
    await navigateTo(linkTo(params.value.domain, page));
    // Back to the top of the results, announced from the heading
    heading.value?.focus({ preventScroll: true });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
</script>

<template>
  <section class="section search" aria-labelledby="search-title">
    <div class="search__inner container">
      <header class="search__head">
        <h1 id="search-title" ref="heading" tabindex="-1" class="search__title">
          <!-- <bdi> keeps an English query in an Arabic sentence (and the reverse) in order -->
          <i18n-t v-if="params.q" keypath="search.results.titleFor" scope="global">
            <template #q
              ><bdi>{{ params.q }}</bdi></template
            >
          </i18n-t>
          <template v-else>{{ t('search.results.title') }}</template>
        </h1>
        <p class="search__count" role="status">
          <template v-if="meta">{{ t('search.results.count', meta.total) }}</template>
          <template v-else-if="results.isPending.value">{{ t('search.results.loading') }}</template>
        </p>
      </header>

      <nav class="tabs" :aria-label="t('search.results.filterLabel')">
        <NuxtLink
          v-for="tab in tabs"
          :key="tab.id"
          :to="tab.to"
          class="tabs__item"
          :class="{ 'tabs__item--on': tab.active }"
          :aria-current="tab.active ? 'page' : undefined"
        >
          <Icon :icon="tab.icon" class="size-4" />
          {{ tab.label }}
        </NuxtLink>
      </nav>

      <!-- First load -->
      <ul v-if="results.isPending.value" class="grid" aria-hidden="true">
        <li v-for="n in 6" :key="n" class="skel">
          <Skeleton class="size-[72px] shrink-0 rounded-xl" />
          <span class="skel__lines">
            <Skeleton class="h-4 w-20 rounded-full" />
            <Skeleton class="h-5 w-3/4" />
            <Skeleton class="h-4 w-full" />
          </span>
        </li>
      </ul>

      <!-- Error with nothing to show -->
      <div v-else-if="results.isError.value && !items.length" class="state">
        <span class="state__icon state__icon--error"
          ><Icon icon="hugeicons--alert-circle" class="size-7"
        /></span>
        <h2 class="state__title">{{ t('search.results.errorTitle') }}</h2>
        <p class="state__text">{{ t('search.results.errorText') }}</p>
        <button type="button" class="btn btn--primary" @click="results.refetch()">
          <Icon icon="hugeicons--refresh" class="size-4" />
          {{ t('search.results.retry') }}
        </button>
      </div>

      <!-- No results -->
      <div v-else-if="!items.length" class="state">
        <span class="state__icon"><Icon icon="hugeicons--search-remove" class="size-7" /></span>
        <h2 class="state__title">{{ t('search.results.emptyTitle') }}</h2>
        <i18n-t
          v-if="params.q"
          keypath="search.results.emptyFor"
          tag="p"
          class="state__text"
          scope="global"
        >
          <template #q
            ><bdi>{{ params.q }}</bdi></template
          >
        </i18n-t>
        <p class="state__text">{{ t('search.results.emptyText') }}</p>
        <NuxtLink v-if="params.domain" :to="linkTo()" class="btn btn--outline">
          {{ t('search.results.searchAll') }}
        </NuxtLink>
      </div>

      <template v-else>
        <ul
          class="grid"
          :aria-busy="results.isFetching.value"
          :class="{ 'grid--busy': results.isPlaceholderData.value }"
        >
          <li v-for="hit in items" :key="hit.id">
            <SearchResultCard :hit="hit" />
          </li>
        </ul>

        <SearchPager v-if="meta && meta.totalPages > 1" :meta="meta" @change="goToPage" />
      </template>
    </div>
  </section>
</template>

<style scoped>
  .search {
    align-items: stretch;
    background: var(--modal2);
    min-height: 60vh;
  }
  .search__inner {
    display: flex;
    flex-direction: column;
    gap: 24px;
  }
  .search__head {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }
  .search__title {
    color: var(--primary);
    font: 700 28px/36px var(--font);
    overflow-wrap: anywhere;
    outline: none;
  }
  .search__count {
    min-height: 20px;
    color: var(--caption);
    font-size: 14px;
    line-height: 20px;
  }
  .tabs {
    display: flex;
    gap: 8px;
    overflow-x: auto;
    scrollbar-width: none;
  }
  .tabs__item {
    flex: none;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    min-height: 36px;
    padding: 6px 14px;
    border: 0.5px solid var(--border);
    border-radius: 99px;
    background: #fff;
    color: var(--primary);
    font: 600 14px/20px var(--font);
    white-space: nowrap;
  }
  .tabs__item:hover {
    background: var(--chip);
  }
  .tabs__item--on,
  .tabs__item--on:hover {
    border-color: var(--primary);
    background: var(--primary);
    color: #fff;
  }
  .tabs__item:focus-visible {
    outline-offset: 2px;
  }
  .grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(min(100%, 340px), 1fr));
    gap: 16px;
    transition: opacity 0.15s;
  }
  .grid--busy {
    opacity: 0.6;
  }
  .skel {
    display: flex;
    gap: 16px;
    padding: 16px;
    border-radius: var(--radius);
    background: #fff;
  }
  .skel__lines {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  .state {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    padding: 48px 24px;
    border-radius: var(--radius);
    background: #fff;
    text-align: center;
  }
  .state__icon {
    width: 64px;
    height: 64px;
    display: grid;
    place-items: center;
    margin-bottom: 8px;
    border-radius: 50%;
    background: var(--chip);
    color: var(--primary);
  }
  .state__icon--error {
    background: oklch(0.96 0.03 25);
    color: oklch(0.5 0.18 25);
  }
  .state__title {
    color: var(--primary);
    font: 700 18px/28px var(--font);
  }
  .state__text {
    max-width: 440px;
    color: var(--caption);
    font-size: 14px;
    line-height: 22px;
  }
  .state .btn {
    margin-top: 8px;
  }
  @media (max-width: 640px) {
    .search__title {
      font-size: 22px;
      line-height: 30px;
    }
    .search__inner {
      gap: 20px;
    }
  }
</style>
