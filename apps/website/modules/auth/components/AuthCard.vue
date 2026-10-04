<script setup lang="ts">
  /**
   * The white card the auth screens render into. It lives in layouts/auth.vue and stays in
   * place while its content changes (screens, steps, skeletons): its width and height
   * animate to fit the new content instead of a new card replacing the old one.
   *
   * `accent` shows the green-to-gold top border, `wide` the wider register layout.
   */
  withDefaults(defineProps<{ accent?: boolean; wide?: boolean }>(), {
    accent: false,
    wide: false,
  });

  // Height follows the content with a transition. Server-rendered and before mounting it
  // is `auto`; afterwards it tracks the content's measured height. An empty content box
  // (between the old screen leaving and the new one entering) is ignored, so the card
  // keeps its size instead of collapsing in between.
  const content = ref<HTMLElement | null>(null);
  const height = ref<string>();
  let observer: ResizeObserver | undefined;
  onMounted(() => {
    observer = new ResizeObserver(() => {
      const measured = content.value?.offsetHeight ?? 0;
      if (measured > 0) {
        height.value = `${measured}px`;
      }
    });
    if (content.value) {
      observer.observe(content.value);
    }
  });
  onBeforeUnmount(() => observer?.disconnect());
</script>

<template>
  <section
    class="border-primary-500/10 relative w-full overflow-hidden rounded-[21.6px] border bg-white shadow-[0_28px_80px_-32px_rgb(31_58_43/0.45)] transition-[max-width] duration-300 ease-out motion-reduce:transition-none"
    :class="wide ? 'max-w-3xl' : 'max-w-[424px]'"
  >
    <div
      class="from-primary-500 via-gold-500 to-gold-400 absolute inset-x-0 top-0 z-10 h-1 bg-linear-to-r transition-opacity duration-300"
      :class="accent ? 'opacity-100' : 'opacity-0'"
      aria-hidden="true"
    />
    <div
      class="transition-[height] duration-300 ease-out motion-reduce:transition-none"
      :style="{ height }"
    >
      <div ref="content">
        <slot />
      </div>
    </div>
  </section>
</template>
