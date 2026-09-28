<script setup lang="ts">
  import type { PaginationLastProps } from 'reka-ui';
  import type { HTMLAttributes } from 'vue';
  import type { ButtonVariants } from '@workspace/ui/ui/button';
  import { reactiveOmit } from '@vueuse/core';
  import { PaginationLast, useForwardProps } from 'reka-ui';
  import { cn } from '@workspace/core/utils';
  import { buttonVariants } from '@workspace/ui/ui/button';
  import { Icon } from '@workspace/ui';

  const props = withDefaults(
    defineProps<
      PaginationLastProps & {
        size?: ButtonVariants['size'];
        class?: HTMLAttributes['class'];
      }
    >(),
    {
      size: 'default',
      class: '',
    }
  );

  const delegatedProps = reactiveOmit(props, 'class', 'size');
  const forwarded = useForwardProps(delegatedProps);
</script>

<template>
  <PaginationLast
    data-slot="pagination-last"
    :class="cn(buttonVariants({ variant: 'ghost', size }), 'gap-1 px-2.5 sm:pr-2.5', props.class)"
    v-bind="forwarded"
  >
    <slot>
      <Icon icon="hugeicons--arrow-right-double" />
    </slot>
  </PaginationLast>
</template>
