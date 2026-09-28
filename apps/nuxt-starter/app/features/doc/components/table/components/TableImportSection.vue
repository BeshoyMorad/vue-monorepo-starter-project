<script setup lang="ts">
  import { TABLE_IMPORT_CODE } from '@/features/doc/components/table/constants/constants';

  const { t } = useAppLocale();
</script>

<template>
  <ExampleCard
    :title="t('table.import.title')"
    :description="t('table.import.description')"
    :code="TABLE_IMPORT_CODE"
    header="Import"
    :show-preview="false"
  />
</template>
