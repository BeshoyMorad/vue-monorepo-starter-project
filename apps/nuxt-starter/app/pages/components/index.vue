<script setup lang="ts">
  import { paths } from '@/constants/route-names';
  import RouteCards from '@/features/doc/shared/RouteCards.vue';
  import {
    COMPONENTS_PAGE_DESCRIPTION,
    COMPONENTS_PAGE_FOOTER,
    COMPONENTS_PAGE_TITLE,
  } from '@/features/doc/components/constants/constansts';
  import { componentsPaths } from '@/features/doc/components/components.paths';

  definePageMeta({
    name: paths.componentsPaths.overview,
  });
</script>

<template>
  <RouteCards
    :title="COMPONENTS_PAGE_TITLE"
    :description="COMPONENTS_PAGE_DESCRIPTION"
    :footer="COMPONENTS_PAGE_FOOTER"
    :paths="componentsPaths"
  />
</template>
