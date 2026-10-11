<script setup lang="ts">
  /**
   * Gold hairline that separates two sections of the public site (Figma 11435:28477).
   * Fades out at both ends; sits inside the page container so it matches content width.
   * Drop it between sections: <CategoryGrid /> <SectionDivider /> <AboutSection />
   */
</script>

<template>
  <div class="container">
    <hr class="section-divider" />
  </div>
</template>

<style scoped>
  .section-divider {
    height: 1px;
    margin: 0;
    border: 0;
    background: linear-gradient(
      to right,
      transparent 0%,
      color-mix(in srgb, var(--color-gold-500) 40%, transparent) 50%,
      transparent 100%
    );
  }
</style>
