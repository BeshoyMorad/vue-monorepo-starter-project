<script setup lang="ts">
  import Icon from '@workspace/ui/icon/Icon.vue';
  import type { CustomerProfile } from '~/modules/account/types';

  /** Who is signed in: avatar (or initials), name, phone, last sign-in, sign out */
  const props = defineProps<{ profile?: CustomerProfile }>();
  const { t, locale } = useI18n();
  const logout = useLogout();
  const signingOut = useSigningOut();
  const avatarFailed = ref(false);

  const initials = computed(() =>
    (props.profile?.fullName ?? '')
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((word) => word[0])
      .join('')
  );
  const lastLogin = computed(() =>
    props.profile?.lastLoginAt
      ? new Intl.DateTimeFormat(locale.value, { dateStyle: 'medium', timeStyle: 'short' }).format(
          new Date(props.profile.lastLoginAt)
        )
      : ''
  );
</script>

<template>
  <aside class="summary">
    <span class="avatar" aria-hidden="true">
      <NuxtImg
        v-if="profile?.avatar && !avatarFailed"
        :src="profile.avatar"
        alt=""
        width="88"
        height="88"
        fit="cover"
        densities="x1 x2"
        class="avatar__img"
        @error="avatarFailed = true"
      />
      <template v-else>{{ initials }}</template>
    </span>
    <div class="summary__who">
      <p class="summary__name">
        <bdi>{{ profile?.fullName }}</bdi>
      </p>
      <p class="summary__phone">
        <bdi dir="ltr">{{ profile?.phone }}</bdi>
      </p>
      <p v-if="lastLogin" class="summary__meta">
        {{ t('account.summary.lastLogin', { date: lastLogin }) }}
      </p>
    </div>
    <button
      type="button"
      class="btn btn--glass summary__out"
      data-test-id="account-logout"
      :aria-disabled="signingOut || undefined"
      @click="logout"
    >
      <Icon icon="hugeicons--logout-01" class="size-5 rtl:-scale-x-100" />
      {{ signingOut ? t('home.header.loggingOut') : t('home.header.logout') }}
    </button>
  </aside>
</template>

<style scoped>
  .summary {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 14px;
    padding: 28px 20px;
    border: 0.5px solid var(--border);
    border-radius: var(--radius);
    background: #fff;
    text-align: center;
  }
  .avatar {
    width: 88px;
    height: 88px;
    display: grid;
    place-items: center;
    overflow: hidden;
    border: 3px solid var(--color-gold-200);
    border-radius: 50%;
    background: var(--primary);
    color: #fff;
    font: 700 30px/1 var(--font);
  }
  .avatar__img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  .summary__who {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }
  .summary__name {
    color: var(--primary);
    font: 700 18px/26px var(--font);
  }
  .summary__phone {
    color: var(--caption);
    font-size: 14px;
  }
  .summary__meta {
    margin-top: 6px;
    color: var(--muted);
    font-size: 12px;
  }
  .summary__out {
    width: 100%;
  }
</style>
