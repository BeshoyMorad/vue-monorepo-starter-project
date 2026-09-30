<script setup lang="ts">
  import { useQuery } from '@tanstack/vue-query';
  import { userQueryOptions } from '~/composables/useUserQuery';
  import { usePermissionStore } from '~/stores/permissions';
  import { useApi } from '~/composables/useApi';
  import { PageWrapper, StatusBadge, Button, Tabs } from '@workspace/ui';

  // Page-level metadata with permission configuration
  definePageMeta({
    permission: 'admin.list',
    middleware: ['permission'],
  });

  const api = useApi();
  const { $queryClient } = useNuxtApp();
  const permissionStore = usePermissionStore();

  // Demo ID for query options factory
  const activeUserId = ref<number | string>(1);

  // Construct shared query options from @workspace/core by passing the Axios client
  const currentQueryOptions = computed(() => userQueryOptions(api, activeUserId.value));

  // SSR Prefetching: Server loads data via Axios, dehydrates into HTML payload
  if (import.meta.server && $queryClient) {
    await $queryClient.prefetchQuery(userQueryOptions(api, activeUserId.value));
  }

  // Client Rehydration: Reuses dehydrated cache seamlessly with no initial network roundtrip
  const { data: user, isLoading, isFetching, refetch } = useQuery(currentQueryOptions);

  // Tabs demonstration using UI primitive
  const selectedTab = ref('overview');
  const dashboardTabs = [
    { name: 'User Profile', routeName: 'overview' },
    { name: 'Activity Log', routeName: 'activity' },
    { name: 'Permissions', routeName: 'permissions' },
  ];
</script>

<template>
  <div class="space-y-6">
    <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 class="text-text-default text-2xl font-bold">
          {{ $t('nav.tanstackQuery') }}
        </h1>
        <p class="text-text-caption text-sm">
          Demonstrating shared TanStack Query options with zero-waterfall SSR hydration.
        </p>
      </div>

      <div class="flex items-center gap-2">
        <StatusBadge :variant="isLoading ? 'warning' : 'success'" test-id="badge-query-status">
          {{ isFetching ? 'Refetching...' : isLoading ? 'Loading SSR' : 'Hydrated from SSR' }}
        </StatusBadge>
        <Button test-id="btn-refetch" size="sm" :loading="isFetching" @click="() => refetch()">
          Refetch Query
        </Button>
      </div>
    </div>

    <!-- UI Tabs component -->
    <Tabs
      v-model="selectedTab"
      :tabs="dashboardTabs"
      :can="(p) => permissionStore.can(p as CanPermission<Models>)"
      mode="state"
    />

    <!-- Tab Content 1: User Profile via TanStack Query -->
    <div v-if="selectedTab === 'overview'" class="grid gap-6 md:grid-cols-2">
      <PageWrapper title="SSR Hydrated TanStack Query Result">
        <div v-if="isLoading" class="text-text-caption p-6 text-center">
          Loading user details...
        </div>
        <div v-else class="space-y-4">
          <div class="border-border-base bg-background-surface-2 space-y-3 rounded-lg border p-4">
            <div class="flex items-center justify-between">
              <span class="text-text-disabled text-xs font-semibold uppercase">Field</span>
              <span class="text-text-disabled text-xs font-semibold uppercase">Value</span>
            </div>
            <div
              class="border-border-base/50 flex items-center justify-between border-t pt-2 text-sm"
            >
              <span class="text-text-caption">ID:</span>
              <span class="font-mono font-medium">{{ user?.id ?? '1' }}</span>
            </div>
            <div
              class="border-border-base/50 flex items-center justify-between border-t pt-2 text-sm"
            >
              <span class="text-text-caption">Name:</span>
              <span class="font-medium">{{ user?.name ?? 'Admin User' }}</span>
            </div>
            <div
              class="border-border-base/50 flex items-center justify-between border-t pt-2 text-sm"
            >
              <span class="text-text-caption">Email:</span>
              <span class="text-text-primary font-mono">{{
                user?.email ?? 'admin@workspace.local'
              }}</span>
            </div>
          </div>

          <div class="flex gap-2">
            <Button test-id="btn-user-1" outline size="sm" @click="activeUserId = 1"
              >User #1</Button
            >
            <Button test-id="btn-user-2" outline size="sm" @click="activeUserId = 2"
              >User #2</Button
            >
            <Button test-id="btn-user-3" outline size="sm" @click="activeUserId = 3"
              >User #3</Button
            >
          </div>
        </div>
      </PageWrapper>

      <!-- Architecture details card -->
      <PageWrapper title="How SSR Hydration Works Here">
        <div class="text-text-caption space-y-3 text-sm leading-relaxed">
          <p>
            1. <strong>Shared Factory:</strong> <code>userQueryOptions(id)</code> comes directly
            from <code>@workspace/core/composables</code>.
          </p>
          <p>
            2. <strong>Per-Request QueryClient:</strong>
            <code>plugins/vue-query.ts</code> initializes a separate instance on each incoming SSR
            request.
          </p>
          <p>
            3. <strong>Dehydration:</strong> In <code>app:rendered</code>, the client state is
            serialized to <code>useState('vue-query')</code>.
          </p>
          <p>
            4. <strong>Client Hydration:</strong> On page load, the browser immediately hydrates the
            state without duplicating the API request.
          </p>
        </div>
      </PageWrapper>
    </div>

    <!-- Tab Content 2: Activity Log -->
    <div v-else-if="selectedTab === 'activity'">
      <PageWrapper title="Recent Activity">
        <p class="text-text-caption text-sm">
          All workspace query keys and state machines are unified across Vite SPAs and Nuxt SSR.
        </p>
      </PageWrapper>
    </div>

    <!-- Tab Content 3: Permissions -->
    <div v-else-if="selectedTab === 'permissions'">
      <PageWrapper title="Active Permissions Engine">
        <div class="space-y-3 text-sm">
          <p class="text-text-caption">Current permissions in <code>usePermissionStore</code>:</p>
          <pre class="bg-background-surface-3 rounded p-3 font-mono text-xs">{{
            JSON.stringify(permissionStore.permissions, null, 2)
          }}</pre>
          <p class="text-text-caption">
            Route permission checked by <code>middleware/permission.ts</code>:
            <code class="text-text-primary font-bold">admin.list</code>
          </p>
        </div>
      </PageWrapper>
    </div>
  </div>
</template>
