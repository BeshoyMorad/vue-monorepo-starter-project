<script setup lang="ts">
  import type { PaginationListItemProps } from 'reka-ui';
  import type { HTMLAttributes } from 'vue';
  import type { ButtonVariants } from '@workspace/ui/ui/button';
  import { reactiveOmit } from '@vueuse/core';
  import { PaginationListItem } from 'reka-ui';
  import { cn } from '@workspace/core/utils';
  import { buttonVariants } from '@workspace/ui/ui/button';

  const props = withDefaults(
    defineProps<
      PaginationListItemProps & {
        size?: ButtonVariants['size'];
        class?: HTMLAttributes['class'];
        isActive?: boolean;
      }
    >(),
    {
      size: 'icon',
      class: '',
    }
  );

  const delegatedProps = reactiveOmit(props, 'class', 'size', 'isActive');
</script>

<template>
  <PaginationListItem
    data-slot="pagination-item"
    v-bind="delegatedProps"
    :class="
      cn(
        buttonVariants({
          variant: 'ghost',
          outline: isActive,
          size,
        }),
        props.class
      )
    "
  >
    <slot />
  </PaginationListItem>
</template>
