<script setup lang="ts"></script>

<template>
  <div
    role="alert"
    class="border-bg-danger-default/30 bg-bg-danger-default/10 text-text-danger flex items-start gap-2 rounded-md border p-3 text-sm"
  >
    <Icon icon="hugeicons--alert-circle" class="mt-0.5 shrink-0" />
    <div class="min-w-0 flex-1 break-words">
      <slot />
    </div>
  </div>
</template>
