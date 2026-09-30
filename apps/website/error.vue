<script setup lang="ts">
  import type { NuxtError } from '#app';
  import { ExceptionState } from '@workspace/ui';
  import { paths } from '~/router/paths';

  const props = defineProps<{ error: NuxtError }>();

  useHtmlAttrs();

  const { t } = useI18n();
  const localePath = useLocalePath();

  const variant = computed(() => {
    switch (props.error.statusCode) {
      case 404:
        return { key: 'notFound', icon: 'hugeicons--search-remove' };
      case 403:
        return { key: 'forbidden', icon: 'hugeicons--square-lock-02' };
      default:
        return { key: 'serverError', icon: 'hugeicons--alert-02' };
    }
  });

  useSeoMeta({ title: () => t(`errorPage.${variant.value.key}.title`) });

  const goHome = () => clearError({ redirect: localePath(paths.home) });
</script>

<template>
  <ExceptionState
    :icon="variant.icon"
    :title="t(`errorPage.${variant.key}.title`)"
    :description="t(`errorPage.${variant.key}.description`)"
    :button-label="t('errorPage.backHome')"
    :button-action="goHome"
  />
</template>
