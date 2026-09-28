<script setup lang="ts">
  import { definePageMeta } from '#imports';
  import { paths } from '@/constants/route-names';
  import RouteCards from '@/features/doc/shared/RouteCards.vue';

  import {
    COMPOSABLES_PAGE_TITLE,
    COMPOSABLES_PAGE_DESCRIPTION,
    COMPOSABLES_PAGE_FOOTER,
  } from '@/features/doc/composables/constants/constansts';
  import { composablesPaths } from '@/features/doc/composables/composables.paths';

  definePageMeta({
    name: paths.composablesPaths.overview,
  });
</script>

<template>
  <RouteCards
    :title="COMPOSABLES_PAGE_TITLE"
    :description="COMPOSABLES_PAGE_DESCRIPTION"
    :footer="COMPOSABLES_PAGE_FOOTER"
    :paths="composablesPaths"
  />
</template>
