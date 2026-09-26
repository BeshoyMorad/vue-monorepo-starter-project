<script setup lang="ts">
  import type { ButtonHTMLAttributes } from 'vue';

  export interface ButtonProps {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
    disabled?: boolean;
    type?: ButtonHTMLAttributes['type'];
    ariaLabel?: string;
  }

  withDefaults(defineProps<ButtonProps>(), {
    variant: 'primary',
    size: 'md',
    disabled: false,
    type: 'button',
    ariaLabel: undefined,
  });

  const emit = defineEmits<{
    (e: 'click', event: MouseEvent): void;
  }>();

  const handleClick = (e: MouseEvent) => {
    emit('click', e);
  };
</script>

<template>
  <button
    :type="type"
    :disabled="disabled"
    :aria-label="ariaLabel"
    class="inline-flex cursor-pointer items-center justify-center rounded-lg font-medium shadow-sm transition-all duration-200 select-none focus:ring-2 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
    :class="[
      // Size variants
      size === 'sm' && 'gap-1.5 px-3 py-1.5 text-xs',
      size === 'md' && 'gap-2 px-4 py-2 text-sm',
      size === 'lg' && 'gap-2.5 px-5 py-2.5 text-base',

      // Theming variants using Tailwind classes mapped to CSS variables
      variant === 'primary' &&
        'bg-primary focus:ring-primary text-white hover:opacity-90 active:scale-[0.98]',
      variant === 'secondary' &&
        'bg-gray-100 text-gray-900 hover:bg-gray-200 active:scale-[0.98] dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700',
      variant === 'outline' &&
        'border-primary text-primary hover:bg-primary/10 focus:ring-primary border-2 active:scale-[0.98]',
      variant === 'ghost' &&
        'text-primary hover:bg-primary/10 focus:ring-primary shadow-none active:scale-[0.98]',
    ]"
    @click="handleClick"
  >
    <slot />
  </button>
</template>
