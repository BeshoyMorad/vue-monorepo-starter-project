<script setup lang="ts">
  import Icon from '@workspace/ui/icon/Icon.vue';
  import { DialogClose, DialogContent, DialogTitle, DialogTrigger } from '@workspace/ui/ui/dialog';
  import DialogRoot from '@workspace/ui/ui/dialog/DialogRoot.vue';

  /**
   * Phone search: an icon in the header row opens a panel from the top with the query field
   * and the scope as chips. Shares its state with the desktop bar (useSiteSearch).
   * Built on the shared dialog: focus goes to the field, Escape closes, focus returns.
   */
  const { t } = useI18n();
  const { scope, query, scopes, scopeName, search } = useSiteSearch();
  const open = ref(false);
  const input = ref<HTMLInputElement>();

  const focusInput = (event: Event) => {
    event.preventDefault();
    input.value?.focus();
  };
  const clear = () => {
    query.value = '';
    input.value?.focus();
  };
  const submit = () => {
    search();
    open.value = false;
  };
</script>

<template>
  <DialogRoot v-model:open="open">
    <DialogTrigger as-child>
      <button
        type="button"
        class="trigger"
        :aria-label="t('home.header.search.label')"
        data-test-id="site-search-open"
      >
        <Icon icon="hugeicons--search-01" class="size-6 rtl:-scale-x-100" />
      </button>
    </DialogTrigger>
    <DialogContent
      :aria-describedby="undefined"
      class="site-ui data-[state=closed]:zoom-out-100 data-[state=open]:zoom-in-100 data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top top-0 right-0 left-0 w-full max-w-none translate-x-0 translate-y-0 gap-0 rounded-none rounded-b-2xl border-0 p-0 duration-300 motion-reduce:animate-none sm:max-w-none"
      @open-auto-focus="focusInput"
    >
      <DialogTitle class="sr-only">{{ t('home.header.search.label') }}</DialogTitle>
      <div class="panel">
        <div class="panel__row">
          <form role="search" class="field" @submit.prevent="submit">
            <input
              ref="input"
              v-model="query"
              type="search"
              enterkeyhint="search"
              class="field__input"
              :aria-label="t('home.header.search.label')"
              :placeholder="t('home.header.search.placeholder', { scope: scopeName })"
            />
            <button
              v-if="query"
              type="button"
              class="clear"
              :aria-label="t('home.header.search.clearLabel')"
              @click="clear"
            >
              {{ t('home.header.search.clear') }}
            </button>
            <button type="submit" class="field__btn" :aria-label="t('home.header.search.submit')">
              <Icon icon="hugeicons--search-01" class="size-4 rtl:-scale-x-100" />
            </button>
          </form>
          <DialogClose class="close" :aria-label="t('home.header.search.close')">
            <Icon icon="hugeicons--cancel-01" class="size-5" />
          </DialogClose>
        </div>

        <fieldset class="scopes">
          <legend class="scopes__legend">{{ t('home.header.search.scopeLabel') }}</legend>
          <div class="scopes__list">
            <label v-for="item in scopes" :key="item.id" class="chip">
              <input v-model="scope" type="radio" name="site-search-scope" :value="item.id" />
              {{ item.label }}
            </label>
          </div>
        </fieldset>
      </div>
    </DialogContent>
  </DialogRoot>
</template>

<style scoped>
  .trigger {
    display: grid;
    place-items: center;
    width: 40px;
    height: 40px;
    border-radius: 8px;
    cursor: pointer;
  }
  .trigger:hover {
    background: var(--glass);
  }
  /* min-width: 0 lets the panel shrink to the dialog's width (it's a grid item) */
  .panel {
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 14px;
    padding: 12px 16px 16px;
  }
  .panel__row {
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .field {
    flex: 1;
    min-width: 0;
    height: 44px;
    display: flex;
    align-items: center;
    padding: 1px;
    border: 1px solid #d1d5db;
    border-radius: 40px;
    overflow: hidden;
  }
  .field:focus-within {
    border-color: var(--primary);
    box-shadow: 0 0 0 3px rgb(45 83 61 / 0.16);
  }
  /* width: 0 drops the input's built-in width, so the row fits the narrowest phones */
  .field__input {
    flex: 1;
    width: 0;
    min-width: 0;
    height: 100%;
    padding-inline: 16px 8px;
    background: transparent;
    font: 400 16px/20px var(--font); /* 16px stops iOS zooming in on focus */
  }
  .field__input::placeholder {
    color: var(--muted);
  }
  .field__input:focus-visible {
    outline: none;
  }
  .field__btn {
    flex: none;
    width: 32px;
    height: 32px;
    margin-inline: 2px 5px;
    display: grid;
    place-items: center;
    background: var(--primary);
    color: #fff;
    border-radius: 40px;
    cursor: pointer;
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
  .close {
    flex: none;
    width: 40px;
    height: 40px;
    display: grid;
    place-items: center;
    border-radius: 8px;
    color: var(--primary);
    cursor: pointer;
  }
  .close:hover {
    background: var(--chip);
  }
  .scopes {
    min-width: 0;
  }
  .scopes__legend {
    margin-bottom: 8px;
    color: var(--secondary-text);
    font: 600 12px/16px var(--font);
  }
  .scopes__list {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }
  .chip {
    display: inline-flex;
    align-items: center;
    min-height: 36px;
    padding: 6px 14px;
    border: 0.5px solid var(--border);
    border-radius: 99px;
    background: var(--modal2);
    color: var(--primary);
    font: 600 13px/20px var(--font);
    cursor: pointer;
  }
  /* The radio stays in the accessibility tree; the chip shows its state and focus */
  .chip input {
    position: absolute;
    opacity: 0;
    pointer-events: none;
  }
  .chip:has(:checked) {
    border-color: var(--primary);
    background: var(--primary);
    color: #fff;
  }
  .chip:has(:focus-visible) {
    outline: 2px solid rgb(45 83 61 / 0.45);
    outline-offset: 3px;
  }
</style>
