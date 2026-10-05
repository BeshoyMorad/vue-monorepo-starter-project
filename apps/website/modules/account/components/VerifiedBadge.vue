<script setup lang="ts">
  import Icon from '@workspace/ui/icon/Icon.vue';

  defineProps<{ verified: boolean }>();
  const { t } = useI18n();
</script>

<template>
  <span class="badge" :class="verified ? 'badge--ok' : 'badge--no'">
    <Icon
      :icon="verified ? 'hugeicons--checkmark-badge-01' : 'hugeicons--alert-circle'"
      class="size-3.5"
    />
    {{ verified ? t('account.summary.verified') : t('account.summary.notVerified') }}
  </span>
</template>

<style scoped>
  .badge {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 2px 8px;
    border-radius: 99px;
    font: 600 11px/16px var(--font);
    white-space: nowrap;
  }
  .badge--ok {
    background: var(--color-primary-50);
    color: var(--color-primary-600);
  }
  .badge--no {
    background: var(--color-gold-50);
    color: var(--color-gold-800);
  }
</style>
