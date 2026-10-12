<script setup lang="ts" generic="T extends string">
  import Icon from '@workspace/ui/icon/Icon.vue';
  import { Button } from '@workspace/ui/ui/button';
  import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuTrigger,
  } from '@workspace/ui/ui/dropdown-menu';

  /**
   * A filter dropdown in the site's look (as the header's search scope menu): a pill button
   * showing the current choice, and a menu with the choices, the picked one ticked.
   * `label` names the filter for the menu heading and screen readers ("Status: Completed").
   *
   *   <FilterSelect v-model="status" :label="t('…status')" :options="[{ value: '', label: 'All' }, …]" test-id="…" />
   */
  const props = defineProps<{
    label: string;
    options: { value: T; label: string; icon?: string }[];
    testId: string;
  }>();
  const model = defineModel<T>({ required: true });
  const open = ref(false);
  const current = computed(
    () => props.options.find((option) => option.value === model.value) ?? props.options[0]
  );
</script>

<template>
  <DropdownMenu v-model:open="open">
    <DropdownMenuTrigger as-child>
      <Button
        type="button"
        class="trigger ui-bare"
        :test-id="testId"
        :aria-label="`${label}: ${current?.label}`"
      >
        <Icon v-if="current?.icon" :icon="current.icon" class="trigger__icon size-4" />
        <span class="trigger__text">{{ current?.label }}</span>
        <Icon
          icon="hugeicons--arrow-down-01"
          class="trigger__chevron size-4"
          :class="{ 'rotate-180': open }"
        />
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent
      align="start"
      :side-offset="8"
      class="font-brand max-h-80 min-w-[var(--reka-dropdown-menu-trigger-width)] overflow-y-auto rounded-xl border border-black/5 bg-white p-1.5 shadow-lg"
    >
      <DropdownMenuLabel
        class="px-2.5 pt-2 pb-1.5 text-xs font-semibold text-[var(--color-gold-800)]"
      >
        {{ label }}
      </DropdownMenuLabel>
      <DropdownMenuRadioGroup v-model="model">
        <!-- The kit's radio dot becomes a check at the inline end, shown only when picked -->
        <DropdownMenuRadioItem
          v-for="option in options"
          :key="option.value"
          :value="option.value"
          class="data-[state=checked]:bg-primary-50 data-[state=checked]:text-primary-500 gap-3 rounded-lg px-2.5 py-2 text-sm font-medium text-[oklch(0.2_0_0)] duration-150 data-highlighted:bg-[oklch(0.97_0_0)] [&>span:first-child]:order-last [&>span:first-child]:ms-auto [&>span:first-child]:size-4 [&>span:first-child]:border-0 [&>span:first-child]:p-0"
        >
          <Icon v-if="option.icon" :icon="option.icon" class="size-4 shrink-0" />
          {{ option.label }}
          <template #indicator>
            <Icon icon="hugeicons--tick-02" class="text-primary-500 size-4" />
          </template>
        </DropdownMenuRadioItem>
      </DropdownMenuRadioGroup>
    </DropdownMenuContent>
  </DropdownMenu>
</template>

<style scoped>
  .trigger {
    display: flex;
    align-items: center;
    gap: 8px;
    width: 100%;
    height: 44px;
    padding-inline: 16px 14px;
    border: 1px solid #e5e7eb;
    border-radius: 99px;
    background: #fafafa;
    color: var(--text);
    font: 500 14px/20px var(--font);
    text-align: start;
    cursor: pointer;
    transition:
      border-color 150ms,
      background-color 150ms;
  }
  .trigger:hover,
  .trigger[data-state='open'] {
    border-color: var(--color-primary-200);
    background: #fff;
  }
  .trigger:focus-visible {
    border-color: var(--color-primary-500);
    outline: none;
    box-shadow: 0 0 0 3px rgb(45 83 61 / 0.16);
  }
  .trigger__icon {
    flex: none;
    color: var(--color-primary-500);
  }
  .trigger__text {
    flex: 1;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .trigger__chevron {
    flex: none;
    color: var(--muted);
    transition: transform 200ms;
  }
  @media (prefers-reduced-motion: reduce) {
    .trigger,
    .trigger__chevron {
      transition: none;
    }
  }
</style>
