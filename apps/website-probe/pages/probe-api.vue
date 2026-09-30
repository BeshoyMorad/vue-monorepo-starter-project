<script setup lang="ts">
  import { useQuery } from '@tanstack/vue-query';
  const api = useApi();
  const route = useRoute();
  const path = String(route.query.p ?? '/echo');
  const { data, error } = useServerPrefetch(
    useQuery({ queryKey: ['probe', path], queryFn: ({ signal }) => api<unknown>(path, { signal }) })
  );
</script>
<template>
  <pre id="out">{{ JSON.stringify(data ?? { failed: (error as any)?.status }) }}</pre>
</template>
