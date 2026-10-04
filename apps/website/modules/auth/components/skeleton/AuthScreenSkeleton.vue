<script setup lang="ts">
  import AuthSkeletonBlock from './AuthSkeletonBlock.vue';
  import AuthSkeletonField from './AuthSkeletonField.vue';
  import AuthSkeletonHeader from './AuthSkeletonHeader.vue';

  export type AuthSkeletonScreen = 'login' | 'register' | 'verify' | 'forgot-password';

  /**
   * Placeholder content for an auth screen while it loads, shown inside the layout's card
   * (see layouts/auth.vue) and laid out like the real screen so nothing jumps when it
   * arrives. Announced once as "Loading…".
   */
  defineProps<{ screen: AuthSkeletonScreen }>();

  const { t } = useI18n();
</script>

<template>
  <div role="status" aria-busy="true" data-test-id="auth-skeleton" :data-screen="screen">
    <span class="sr-only">{{ t('auth.a11y.loading') }}</span>

    <!-- Login: title, phone, password, remember / forgot row, button, prompt -->
    <div v-if="screen === 'login'" class="space-y-5 p-6 sm:p-8" aria-hidden="true">
      <AuthSkeletonBlock class="h-8 w-48 rounded-lg" />
      <AuthSkeletonField phone hint />
      <AuthSkeletonField />
      <div class="flex items-center justify-between">
        <AuthSkeletonBlock class="h-4 w-28" />
        <AuthSkeletonBlock class="h-4 w-32" />
      </div>
      <AuthSkeletonBlock class="h-12 rounded-lg" />
      <AuthSkeletonBlock class="h-12 rounded-2xl" />
    </div>

    <!-- Register: header, two sections of two-column fields, button, prompt -->
    <template v-else-if="screen === 'register'">
      <div class="border-border-disabled border-b p-6 sm:p-8" aria-hidden="true">
        <AuthSkeletonHeader :steps="2" />
      </div>
      <div class="space-y-6 p-6 sm:p-8" aria-hidden="true">
        <div class="space-y-4">
          <AuthSkeletonBlock class="h-7 w-44 rounded-lg" />
          <div class="grid gap-4 sm:grid-cols-2">
            <AuthSkeletonField />
            <AuthSkeletonField hint />
            <AuthSkeletonField phone hint />
            <AuthSkeletonField label="w-16" />
          </div>
        </div>
        <div class="border-border-disabled space-y-4 border-t pt-6">
          <AuthSkeletonBlock class="h-7 w-32 rounded-lg" />
          <div class="grid gap-4 sm:grid-cols-2">
            <AuthSkeletonField hint />
            <AuthSkeletonField label="w-36" />
          </div>
        </div>
        <AuthSkeletonBlock class="h-12 rounded-lg" />
        <AuthSkeletonBlock class="h-12 rounded-2xl" />
      </div>
    </template>

    <!-- Verify: header, six code boxes, button, resend line, back link -->
    <div v-else-if="screen === 'verify'" class="space-y-6 p-6 sm:p-8" aria-hidden="true">
      <AuthSkeletonHeader :steps="2" :subtitle-lines="2" />
      <div class="grid gap-1.5">
        <AuthSkeletonBlock class="h-4 w-32" />
        <div class="mx-auto flex w-full max-w-[348px] justify-center gap-[clamp(6px,2.5vw,12px)]">
          <AuthSkeletonBlock
            v-for="box in 6"
            :key="box"
            class="h-[52px] max-w-12 flex-1 rounded-[14px]"
          />
        </div>
      </div>
      <AuthSkeletonBlock class="h-12 rounded-lg" />
      <AuthSkeletonBlock class="mx-auto h-4 w-64 max-w-full" />
      <AuthSkeletonBlock class="mx-auto h-4 w-48" />
    </div>

    <!-- Forgot password (step 1): header, phone, notice, button, prompt -->
    <div v-else class="space-y-5 p-6 sm:p-8" aria-hidden="true">
      <AuthSkeletonHeader :steps="3" :subtitle-lines="0" />
      <AuthSkeletonField phone hint />
      <AuthSkeletonBlock class="h-4 w-full" />
      <AuthSkeletonBlock class="h-12 rounded-lg" />
      <AuthSkeletonBlock class="h-12 rounded-2xl" />
    </div>
  </div>
</template>
