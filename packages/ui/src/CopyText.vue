<script setup lang="ts">
  import { ref } from 'vue';
  import Icon from '@workspace/ui/icon/Icon.vue';
  import { copyToClipboard } from '@workspace/core/utils/clipboard';

  const props = withDefaults(
    defineProps<{
      /** The text that will be copied to clipboard and displayed. */
      text: string;
      /** Extra classes applied to the root button element. */
      class?: string;
      testId?: string;
    }>(),
    { class: '', testId: 'ui-copy-text' }
  );

  const isCopied = ref(false);

  async function copy() {
    copyToClipboard(props.text);

    isCopied.value = true;
    setTimeout(() => {
      isCopied.value = false;
    }, 1500);
  }
</script>

<template>
  <button
    type="button"
    :data-testid="props.testId"
    :class="[
      'text-txt-default hover:text-primary group flex items-center gap-1.5 text-sm transition-colors',
      props.class,
    ]"
    @click="copy"
  >
    <span>{{ text }}</span>

    <Icon
      :icon="isCopied ? 'hugeicons--tick-01' : 'hugeicons--copy-01'"
      :class="
        isCopied
          ? 'text-success text-xs'
          : 'text-txt-caption group-hover:text-primary text-xs transition-colors'
      "
    />
  </button>
</template>
