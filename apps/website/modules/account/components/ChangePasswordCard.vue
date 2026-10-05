<script setup lang="ts">
  import Icon from '@workspace/ui/icon/Icon.vue';
  import type { CustomerProfile } from '~/modules/account/types';
  import ChangePasswordDialog from './ChangePasswordDialog.vue';

  defineProps<{ profile?: CustomerProfile }>();
  const { t } = useI18n();
  const open = ref(false);
</script>

<template>
  <section class="pwd" aria-labelledby="account-password">
    <span class="pwd__icon"><Icon icon="hugeicons--square-lock-02" class="size-5" /></span>
    <h2 id="account-password" class="pwd__title">{{ t('account.password.title') }}</h2>
    <button
      type="button"
      class="btn btn--primary"
      data-test-id="password-change"
      @click="open = true"
    >
      <Icon icon="hugeicons--shield-key" class="size-4" />
      {{ t('account.password.button') }}
    </button>
    <ChangePasswordDialog v-model:open="open" :profile="profile" />
  </section>
</template>

<style scoped>
  .pwd {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 14px;
    padding: 20px 24px;
    border-radius: 20px;
    background: #fff;
    box-shadow: 0 1px 2px rgb(0 0 0 / 0.04);
  }
  .pwd__icon {
    width: 48px;
    height: 48px;
    display: grid;
    place-items: center;
    border-radius: 12px;
    background: #f3f4f6;
    color: var(--caption);
  }
  .pwd__title {
    flex: 1;
    color: var(--primary);
    font: 700 20px/28px var(--font);
  }
  .pwd .btn {
    min-height: 48px;
    padding-inline: 20px;
  }
</style>
