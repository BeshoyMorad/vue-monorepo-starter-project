<script setup lang="ts">
  import type { UnwrapNestedRefs } from 'vue';
  import Icon from '@workspace/ui/icon/Icon.vue';
  import type { SearchSuggest, SuggestKind } from '~/modules/search/composables/useSearchSuggest';

  /**
   * The listbox of the header search combobox (see useSearchSuggest). Options never take
   * focus: the field keeps it and points at the highlighted option (aria-activedescendant).
   * The × on recent searches is for the mouse; keyboard users press Delete.
   */
  const props = defineProps<{
    suggest: UnwrapNestedRefs<SearchSuggest>;
    /** popup: floats under the desktop bar. inline: part of the phone panel. */
    variant?: 'popup' | 'inline';
  }>();

  const { t } = useI18n();

  const ICONS: Record<SuggestKind, string> = {
    recent: 'hugeicons--clock-01',
    history: 'hugeicons--clock-01',
    popular: 'hugeicons--fire',
    suggestion: 'hugeicons--search-01',
  };

  /** Splits `text` around the first match of what was typed, to set that part in bold */
  const parts = (text: string) => {
    const typed = props.suggest.query.trim();
    const at = typed ? text.toLowerCase().indexOf(typed.toLowerCase()) : -1;
    if (at < 0) return [{ text, hit: false }];
    return [
      { text: text.slice(0, at), hit: false },
      { text: text.slice(at, at + typed.length), hit: true },
      { text: text.slice(at + typed.length), hit: false },
    ].filter((part) => part.text);
  };
</script>

<template>
  <div v-if="suggest.visible" class="suggest" :class="`suggest--${variant ?? 'popup'}`">
    <div :id="suggest.listboxId" role="listbox" :aria-label="t('search.suggest.label')">
      <div
        v-for="group in suggest.groups"
        :key="group.id"
        role="group"
        :aria-labelledby="`${suggest.listboxId}-${group.id}`"
      >
        <div :id="`${suggest.listboxId}-${group.id}`" role="presentation" class="suggest__title">
          {{ group.label }}
        </div>
        <!-- eslint-disable-next-line vuejs-accessibility/click-events-have-key-events -- keyboard goes through the field (useSearchSuggest.onKeydown) -->
        <div
          v-for="option in group.options"
          :id="suggest.optionId(option.index)"
          :key="option.key"
          role="option"
          :aria-selected="option.index === suggest.activeIndex"
          class="opt"
          :class="{ 'opt--active': option.index === suggest.activeIndex }"
          @mousedown.prevent
          @mousemove="suggest.setActive(option.index)"
          @click="suggest.pick(option.text)"
        >
          <Icon :icon="ICONS[option.kind]" class="opt__icon size-4" />
          <!-- <bdi>: an Arabic entry in the English list (or the reverse) keeps the list's alignment -->
          <span class="opt__text"
            ><bdi
              ><template v-for="(part, i) in parts(option.text)" :key="i"
                ><b v-if="part.hit">{{ part.text }}</b
                ><template v-else>{{ part.text }}</template></template
              ></bdi
            ></span
          >
          <!-- Mouse / touch only, so not a button (no control inside an option): the keyboard
               way is the Delete key, announced through the field's description -->
          <!-- eslint-disable-next-line vuejs-accessibility/click-events-have-key-events, vuejs-accessibility/no-static-element-interactions -->
          <span
            v-if="option.kind === 'recent'"
            class="opt__remove"
            aria-hidden="true"
            :title="t('search.suggest.removeEntry')"
            @click.stop="suggest.remove(option.entryIds)"
          >
            <Icon icon="hugeicons--cancel-01" class="size-4" />
          </span>
        </div>
      </div>
    </div>
    <button
      v-if="suggest.hasRecent"
      type="button"
      class="suggest__clear"
      @mousedown.prevent
      @click="suggest.clearAll()"
    >
      <Icon icon="hugeicons--delete-02" class="size-4" />
      {{ t('search.suggest.clearHistory') }}
    </button>
  </div>
  <span class="sr-only" role="status">{{ suggest.status }}</span>
</template>

<style scoped>
  .suggest {
    display: flex;
    flex-direction: column;
    gap: 4px;
    color: var(--text, #030712);
    font-family: var(--font);
  }
  .suggest--popup {
    position: absolute;
    top: calc(100% + 8px);
    inset-inline: 0;
    z-index: 50;
    max-height: min(420px, 70vh);
    overflow-y: auto;
    padding: 6px;
    border: 1px solid rgb(0 0 0 / 0.05);
    border-radius: 16px;
    background: #fff;
    box-shadow:
      0 10px 15px -3px rgb(0 0 0 / 0.1),
      0 4px 6px -4px rgb(0 0 0 / 0.1);
  }
  .suggest__title {
    padding: 8px 10px 4px;
    color: var(--color-gold-800);
    font: 600 12px/16px var(--font);
  }
  .opt {
    display: flex;
    align-items: center;
    gap: 10px;
    min-height: 40px;
    padding: 6px 10px;
    border-radius: 10px;
    font: 400 14px/20px var(--font);
    cursor: pointer;
  }
  .opt--active {
    background: oklch(0.97 0 0);
  }
  .opt__icon {
    flex: none;
    color: var(--color-primary-500);
  }
  .opt__text {
    flex: 1;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    text-align: start;
  }
  .opt__text b {
    font-weight: 600;
    color: var(--color-primary-500);
  }
  .opt__remove {
    flex: none;
    display: grid;
    place-items: center;
    width: 28px;
    height: 28px;
    border-radius: 8px;
    color: #6b7280;
    opacity: 0;
    cursor: pointer;
  }
  .opt--active .opt__remove,
  .opt:hover .opt__remove {
    opacity: 1;
  }
  .opt__remove:hover {
    background: #e5e7eb;
    color: #030712;
  }
  /* Touch screens have no hover: keep the × visible */
  @media (hover: none) {
    .opt__remove {
      opacity: 1;
    }
  }
  .suggest__clear {
    display: inline-flex;
    align-items: center;
    align-self: flex-start;
    gap: 6px;
    min-height: 32px;
    margin: 2px 4px 4px;
    padding-inline: 8px;
    border-radius: 8px;
    color: var(--color-primary-500);
    font: 600 13px/20px var(--font);
    cursor: pointer;
  }
  .suggest__clear:hover {
    background: var(--color-primary-50);
  }
</style>
