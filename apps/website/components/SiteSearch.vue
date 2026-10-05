<script setup lang="ts">
  import Icon from '@workspace/ui/icon/Icon.vue';
  import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuTrigger,
  } from '@workspace/ui/ui/dropdown-menu';
  import SearchSuggestList from '~/modules/search/components/SearchSuggestList.vue';
  import { useSearchSuggest } from '~/modules/search/composables/useSearchSuggest';

  /**
   * Header search bar (Figma: Navigation Bar 11422:34002), tablet and desktop.
   * Reading order: scope menu | divider | query ("Search in <scope>") | submit chip.
   * Phones use SiteSearchPanel; both share state through useSiteSearch.
   * The field is a combobox: suggestions while typing, recent / popular searches when empty.
   */
  const { t } = useI18n();
  const { scope, query, scopes, current, scopeName, search } = useSiteSearch();
  const form = ref<HTMLFormElement>();
  const input = ref<HTMLInputElement>();
  const open = ref(false);

  /** Suggestions list: shown while the field (or the list itself) has focus */
  const listOpen = ref(false);
  const submit = () => {
    listOpen.value = false;
    input.value?.blur();
    search();
  };
  const suggest = reactive(useSearchSuggest(query, listOpen, { onPick: submit }));
  const onFocusOut = (event: FocusEvent) => {
    if (!form.value?.contains(event.relatedTarget as Node | null)) listOpen.value = false;
  };

  const clear = () => {
    query.value = '';
    input.value?.focus();
  };

  // After picking a scope, continue in the query field instead of back on the menu button
  let picked = false;
  const onPick = () => (picked = true);
  const onCloseAutoFocus = (event: Event) => {
    if (!picked) return;
    picked = false;
    event.preventDefault();
    input.value?.focus();
  };
</script>

<template>
  <form ref="form" role="search" class="search" @submit.prevent="submit" @focusout="onFocusOut">
    <DropdownMenu v-model:open="open">
      <DropdownMenuTrigger as-child>
        <button
          type="button"
          class="scope"
          :aria-label="`${t('home.header.search.scopeLabel')}: ${current?.label}`"
          data-test-id="search-scope"
        >
          <span class="text-text-caption">{{ current?.label }}</span>
          <Icon
            icon="hugeicons--arrow-down-01"
            class="text-text-caption size-4 transition-transform"
            :class="{ 'rotate-180': open }"
          />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        :side-offset="10"
        class="font-brand w-64 rounded-xl border border-black/5 bg-white p-1.5 shadow-lg"
        @close-auto-focus="onCloseAutoFocus"
      >
        <DropdownMenuLabel
          class="px-2.5 pt-2 pb-1.5 text-xs font-semibold text-[var(--color-gold-800)]"
        >
          {{ t('home.header.search.scopeLabel') }}
        </DropdownMenuLabel>
        <DropdownMenuRadioGroup v-model="scope">
          <!-- The kit's radio dot becomes a check at the inline end, shown only when selected -->
          <DropdownMenuRadioItem
            v-for="item in scopes"
            :key="item.id"
            :value="item.id"
            class="data-[state=checked]:bg-primary-50 data-[state=checked]:text-primary-500 gap-3 rounded-lg px-2.5 py-2 text-sm font-medium text-[oklch(0.2_0_0)] duration-150 data-highlighted:bg-[oklch(0.97_0_0)] [&>span:first-child]:order-last [&>span:first-child]:ms-auto [&>span:first-child]:size-4 [&>span:first-child]:border-0 [&>span:first-child]:p-0"
            @select="onPick"
          >
            <span
              class="bg-primary-50 text-primary-500 grid size-8 shrink-0 place-items-center rounded-lg transition-colors group-data-[state=checked]:bg-white"
            >
              <Icon :icon="item.icon" class="size-4" />
            </span>
            {{ item.label }}
            <template #indicator>
              <Icon icon="hugeicons--tick-02" class="text-primary-500 size-4" />
            </template>
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>

    <span class="divider" aria-hidden="true" />

    <span class="field">
      <input
        ref="input"
        v-model="query"
        type="search"
        role="combobox"
        autocomplete="off"
        aria-autocomplete="list"
        class="field__input"
        :aria-label="t('home.header.search.label')"
        :aria-expanded="suggest.visible"
        :aria-controls="suggest.listboxId"
        :aria-activedescendant="suggest.activeDescendant"
        :aria-description="suggest.hasRecent ? t('search.suggest.deleteHint') : undefined"
        @focus="listOpen = true"
        @click="listOpen = true"
        @input="listOpen = true"
        @keydown="suggest.onKeydown"
      />
      <!-- Placeholder with the scope highlighted (a native placeholder can't style part of it) -->
      <i18n-t
        v-if="!query"
        keypath="home.header.search.placeholder"
        scope="global"
        tag="span"
        class="field__ph"
        aria-hidden="true"
      >
        <template #scope>
          <b>{{ scopeName }}</b>
        </template>
      </i18n-t>
    </span>

    <button
      v-if="query"
      type="button"
      class="clear"
      :aria-label="t('home.header.search.clearLabel')"
      @click="clear"
    >
      {{ t('home.header.search.clear') }}
    </button>
    <button type="submit" class="submit" :aria-label="t('home.header.search.submit')">
      <Icon icon="hugeicons--search-01" class="text-text-caption size-4 rtl:-scale-x-100" />
    </button>

    <SearchSuggestList :suggest="suggest" />
  </form>
</template>

<style scoped>
  /* Figma: 44px pill, 1px border, padding 1px (submit side) / 17px (scope side), 12px gaps */
  .search {
    position: relative;
    height: 44px;
    display: flex;
    align-items: center;
    gap: 12px;
    padding-block: 1px;
    padding-inline: 17px 1px;
    background: #fff;
    color: #030712;
    border: 1px solid #d1d5db;
    border-radius: 40px;
  }
  .search:focus-within {
    border-color: var(--color-primary-300);
  }
  .scope {
    flex: none;
    display: flex;
    align-items: center;
    gap: 4px;
    height: 32px;
    padding-inline: 4px;
    border-radius: 8px;
    font: 500 14px/20px var(--font);
    white-space: nowrap;
    cursor: pointer;
  }

  .divider {
    flex: none;
    align-self: stretch;
    width: 1px;
    margin-block: -1px;
    background: rgb(0 0 0 / 0.15);
  }
  .field {
    position: relative;
    flex: 1;
    min-width: 0;
    align-self: stretch;
    display: flex;
  }
  .field__input {
    width: 100%;
    background: transparent;
    font: 400 14px/20px var(--font);
  }
  .field__input:focus-visible {
    outline: none;
  }
  .field__ph {
    position: absolute;
    inset-inline: 0;
    top: 50%;
    translate: 0 -50%;
    overflow: hidden;
    color: #6b7280;
    font: 400 14px/20px var(--font);
    white-space: nowrap;
    text-overflow: ellipsis;
    pointer-events: none;
  }
  /* Figma's gold (#dea74a) is 2.2:1 on white; gold-800 keeps the hue at 6.8:1 */
  .field__ph b {
    font-weight: 400;
    color: var(--color-gold-800);
  }
  /* Text "Clear" replaces the browser's own (blue in Chrome) clear button */
  input[type='search']::-webkit-search-cancel-button {
    display: none;
  }
  .clear {
    flex: none;
    min-height: 32px;
    padding-inline: 8px;
    border-radius: 8px;
    color: var(--primary);
    font: 600 13px/20px var(--font);
    cursor: pointer;
  }
  .clear:hover {
    background: var(--chip);
  }
  /* Figma: 39px grey chip, rounded on the outer side only */
  .submit {
    flex: none;
    align-self: stretch;
    width: 39px;
    display: grid;
    place-items: center;

    border-start-end-radius: 20px;
    border-end-end-radius: 20px;
  }

  .search :is(.scope, .clear, .submit):focus-visible {
    outline-offset: -2px;
  }
</style>
