<script setup lang="ts">
  import { TABLE_EVENTS } from '@/features/doc/components/table/constants/constants';

  const { t } = useAppLocale();

  const eventsColumns = [
    {
      accessorKey: 'name',
      header: 'Name',
    },
    {
      accessorKey: 'payload',
      header: 'Payload',
    },
    {
      accessorKey: 'description',
      header: 'Description',
    },
  ];

  const eventsValue = TABLE_EVENTS.map((event) => ({
    name: `@${event.name}`,
    payload: event.payload,
    description: t(event.descriptionKey),
  }));
</script>

<template>
  <section class="space-y-4">
    <div>
      <h2 class="text-text-primary text-xl font-semibold">
        {{ t('table.events.title') }}
      </h2>

      <p class="text-text-secondary mt-1 text-sm">
        {{ t('table.events.description') }}
      </p>
    </div>

    <div>
      <div class="overflow-x-auto">
        <DataTable :columns="eventsColumns" :value="eventsValue" />
      </div>
    </div>
  </section>
</template>
