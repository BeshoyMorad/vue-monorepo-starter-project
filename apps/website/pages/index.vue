<script setup lang="ts">
  import AboutSection from '~/modules/home/components/AboutSection.vue';
  import CategoryGrid from '~/modules/home/components/CategoryGrid.vue';
  import HeroBanner from '~/modules/home/components/HeroBanner.vue';
  import MediaSection from '~/modules/home/components/MediaSection.vue';
  import ServicesSection from '~/modules/home/components/ServicesSection.vue';
  import StatsSection from '~/modules/home/components/StatsSection.vue';

  // Public homepage: guests see it too, the header links to sign-in
  definePageMeta({ layout: 'site' });

  const { t } = useI18n();
  useSeoMeta({
    title: () => t('home.seo.title'),
    description: () => t('home.seo.description'),
    ogTitle: () => t('home.seo.title'),
    ogDescription: () => t('home.seo.description'),
  });
</script>

<template>
  <div>
    <HeroBanner />
    <AboutSection />
    <ServicesSection />
    <CategoryGrid />
    <StatsSection />
    <MediaSection />
  </div>
</template>
