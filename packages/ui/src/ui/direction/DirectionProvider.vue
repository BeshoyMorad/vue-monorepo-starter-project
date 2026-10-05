<script setup lang="ts">
  import { ConfigProvider } from 'reka-ui';

  /**
   * Tells every reka-ui component below it the reading direction. Menus, popovers and
   * dialogs render in a portal outside the page, and reka sets `dir="ltr"` on them unless
   * told otherwise, so Arabic menus would lay out left to right. Wrap the app once.
   */
  defineProps<{ dir: 'ltr' | 'rtl' }>();
</script>

<template>
  <ConfigProvider :dir="dir">
    <slot />
  </ConfigProvider>
</template>
