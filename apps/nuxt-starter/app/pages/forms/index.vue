<script setup lang="ts">
  import { paths } from '@/constants/route-names';
  import { formsPaths } from '@/features/doc/forms/forms.paths.ts';
  import {
    FORMS_PAGE_DESCRIPTION,
    FORMS_PAGE_FOOTER,
    FORMS_PAGE_TITLE,
  } from '@/features/doc/forms/constants/constansts.ts';
  import FormsDoc from '@/features/doc/forms/form-doc/components/FormsDoc.vue';
  import RouteCards from '@/features/doc/shared/RouteCards.vue';

  definePageMeta({
    name: paths.formsPaths.overview,
  });
</script>

<template>
  <div class="flex flex-col space-y-8">
    <FormsDoc />
    <RouteCards
      :title="FORMS_PAGE_TITLE"
      :description="FORMS_PAGE_DESCRIPTION"
      :footer="FORMS_PAGE_FOOTER"
      :paths="formsPaths"
    />
  </div>

  <div></div>
</template>
