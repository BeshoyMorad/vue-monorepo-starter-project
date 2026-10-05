<script setup lang="ts">
  import ProfileShell from '~/modules/account/components/ProfileShell.vue';
  import { useAccountProfile } from '~/modules/account/composables/useAccountProfile';
  import { PROFILE_TRANSITION } from '~/modules/account/constants';

  /**
   * Parent of the profile pages (/profile, /profile/user-settings): the breadcrumb and the
   * sidebar stay on screen while the page inside changes with a transition.
   */
  definePageMeta({ layout: 'site', requiresAuth: true });

  const route = useRoute();
  const getRouteBaseName = useRouteBaseName();
  const profile = useServerPrefetch(useAccountProfile());
  const settings = computed(() => getRouteBaseName(route) === 'profile-user-settings');
</script>

<template>
  <ProfileShell :profile="profile.data.value ?? undefined" :settings="settings">
    <NuxtPage :transition="PROFILE_TRANSITION" />
  </ProfileShell>
</template>
