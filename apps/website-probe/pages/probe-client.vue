<script setup lang="ts">
  const api = useApi();
  const result = ref('pending');
  onMounted(async () => {
    await api('/boom').catch((e) => (result.value = `boom:${e.status}`));
    await api('/boom', { silent: true }).catch(() => (result.value += ' silent-done'));
  });
</script>
<template>
  <div id="res">{{ result }}</div>
</template>
