<script setup lang="ts">
  import { computed } from 'vue';
  import Button from '@workspace/ui/ui/button/Button.vue';
  import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
  } from '@workspace/ui/ui/dropdown-menu';
  import {
    SUPPORTED_LOCALES,
    FALLBACK_LOCALE,
    type LocaleCode,
    type LocaleMeta,
  } from '@workspace/locales';

  export interface LanguageSwitcherProps {
    modelValue?: LocaleCode | string;
    locales?: LocaleMeta[];
    loading?: boolean;
    testId?: string;
  }

  const props = withDefaults(defineProps<LanguageSwitcherProps>(), {
    modelValue: FALLBACK_LOCALE,
    locales: () => Object.values(SUPPORTED_LOCALES),
    loading: false,
    testId: 'ui-language-switcher',
  });

  const emit = defineEmits<{
    (e: 'update:modelValue', locale: LocaleCode): void;
    (e: 'select', locale: LocaleCode): void;
  }>();

  const activeLocaleMeta = computed<LocaleMeta>(() => {
    return (
      props.locales.find((l) => l.code === props.modelValue) ||
      SUPPORTED_LOCALES[props.modelValue as LocaleCode] ||
      SUPPORTED_LOCALES[FALLBACK_LOCALE]
    );
  });

  const handleSelect = (code: LocaleCode) => {
    if (code === props.modelValue) return;
    emit('update:modelValue', code);
    emit('select', code);
  };
</script>

<template>
  <DropdownMenu :data-testid="props.testId">
    <DropdownMenuTrigger as-child>
      <Button outline size="sm" test-id="language-switcher-trigger" :loading="props.loading">
        <span class="text-base leading-none">{{ activeLocaleMeta.flag }}</span>
        <span>{{ activeLocaleMeta.nativeLabel }}</span>
        <span class="text-text-disabled text-xs uppercase">({{ activeLocaleMeta.direction }})</span>
      </Button>
    </DropdownMenuTrigger>

    <DropdownMenuContent align="end" class="min-w-44 p-1">
      <DropdownMenuItem
        v-for="locale in props.locales"
        :key="locale.code"
        :test-id="`locale-option-${locale.code}`"
        class="hover:bg-surface-secondary flex cursor-pointer items-center justify-between rounded-md px-3 py-2 text-sm transition-colors"
        :class="{ 'bg-surface-secondary/60 font-semibold': locale.code === activeLocaleMeta.code }"
        @click="handleSelect(locale.code)"
      >
        <div class="flex items-center gap-2.5">
          <span class="text-base leading-none">{{ locale.flag }}</span>
          <div class="flex flex-col">
            <span class="text-text-primary">{{ locale.nativeLabel }}</span>
            <span class="text-text-disabled text-xs">{{ locale.label }}</span>
          </div>
        </div>

        <span
          v-if="locale.code === activeLocaleMeta.code"
          class="bg-primary-600 size-2 rounded-full"
        />
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>
