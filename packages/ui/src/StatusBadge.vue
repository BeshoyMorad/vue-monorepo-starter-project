<script setup lang="ts">
  interface Props {
    variant: 'default' | 'success' | 'warning' | 'danger' | 'primary';
    color?: string;
    testId?: string;
  }

  const props = withDefaults(defineProps<Props>(), {
    color: undefined,
    testId: 'ui-status-badge',
  });
</script>

<template>
  <span
    :data-testid="props.testId"
    :class="[
      `rounded-full px-2 py-1 text-xs capitalize ${color}`,
      !Boolean(color) && {
        'bg-background text-foreground-caption': variant === 'default',
        'bg-success-invert text-foreground-success': variant === 'success',
        'bg-primary-invert text-foreground-primary': variant === 'primary',
        'bg-danger-invert text-foreground-danger': variant === 'danger',
        'bg-warning-invert text-foreground-warning': variant === 'warning',
      },
    ]"
  >
    <slot></slot>
  </span>
</template>
