<script setup lang="ts">
  import { Avatar, AvatarImage, AvatarFallback } from '@workspace/ui/ui/avatar';

  const props = withDefaults(
    defineProps<{
      name: string;
      logo?: string | null;
      size?: 'sm' | 'md' | 'lg';
      testId?: string;
    }>(),
    { logo: null, size: 'md', testId: 'ui-entity-avatar' }
  );
</script>

<template>
  <div :data-testid="props.testId" class="flex items-center gap-2.5">
    <Avatar
      :class="{
        'size-6': size === 'sm',
        'size-8': size === 'md',
        'size-10': size === 'lg',
      }"
    >
      <AvatarImage v-if="logo" :src="logo" :alt="name" />

      <AvatarFallback
        class="bg-primary/10"
        :class="{
          'text-2xs': size === 'sm',
          'text-xs': size === 'md',
          'text-sm': size === 'lg',
        }"
      >
        <span class="text-foreground uppercase">
          {{ name.slice(0, 2) }}
        </span>
      </AvatarFallback>
    </Avatar>

    <span class="text-foreground truncate text-sm">{{ name }}</span>
  </div>
</template>
