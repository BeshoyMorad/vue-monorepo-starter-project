<script setup lang="ts">
  import ProfileShell from '~/modules/account/components/ProfileShell.vue';
  import { useAccountProfile } from '~/modules/account/composables/useAccountProfile';
  import { PROFILE_TRANSITION } from '~/modules/account/constants';

  /**
   * Parent of the profile pages (/profile, /profile/user-settings, /profile/wallet): the
   * breadcrumb and the sidebar stay on screen while the page inside changes with a transition.
   */
  definePageMeta({ layout: 'site', requiresAuth: true });

  const route = useRoute();
  const getRouteBaseName = useRouteBaseName();
  const profile = useServerPrefetch(() => useAccountProfile());
  // The page under "My profile" that the breadcrumb names (none on the overview)
  const SECTIONS: Record<string, 'settings' | 'wallet'> = {
    'profile-user-settings': 'settings',
    'profile-wallet': 'wallet',
  };
  const section = computed(() => SECTIONS[getRouteBaseName(route) ?? '']);
</script>

<template>
  <ProfileShell :profile="profile.data.value ?? undefined" :section="section">
    <NuxtPage :transition="PROFILE_TRANSITION" />
  </ProfileShell>
</template>
