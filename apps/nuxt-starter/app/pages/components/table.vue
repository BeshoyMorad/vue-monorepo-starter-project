<script setup lang="ts">
  import { definePageMeta } from '#imports';
  import { paths } from '@/constants/route-names';
  import { useAppLocale } from '@/composables';

  import TableImportSection from '@/features/doc/components/table/components/TableImportSection.vue';
  import TableDefinitionSection from '@/features/doc/components/table/components/TableDefinitionSection.vue';
  import TableOffsitePaginationSection from '@/features/doc/components/table/components/TableOffsitePaginationSection.vue';
  import TableCursorPaginationSection from '@/features/doc/components/table/components/TableCursorPaginationSection.vue';
  import TablePropsSection from '@/features/doc/components/table/components/TablePropsSection.vue';
  import TableEventsSection from '@/features/doc/components/table/components/TableEventsSection.vue';
  import TableMetaStructure from '@/features/doc/components/table/components/TableMetaStructure.vue';

  definePageMeta({
    name: paths.componentsPaths.table,
    title: 'Table',
    sidebar: true,
    order: 5,
  });

  const { t } = useAppLocale();
</script>

<template>
  <div class="mx-auto w-full space-y-8 px-4 sm:px-6 lg:px-8">
    <!-- Header -->
    <section class="space-y-2">
      <h1 class="text-text-primary heading-font text-3xl font-bold tracking-tight">
        {{ t('table.title') }}
      </h1>

      <p class="text-text-secondary text-sm leading-6">
        {{ t('table.description') }}
      </p>
    </section>

    <TableImportSection />
    <TableDefinitionSection />
    <TableOffsitePaginationSection />
    <TableCursorPaginationSection />
    <TableMetaStructure />
    <TablePropsSection />
    <TableEventsSection />
  </div>
</template>
