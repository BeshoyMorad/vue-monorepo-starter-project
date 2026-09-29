<script setup lang="ts">
  import { paths } from '@/constants/route-names';
  import logoUrl from '@/assets/images/logo2.png';

  const isSidebarOpen = ref(false);
  const { toggleDark } = useDarkTheme();

  const toggleSidebar = () => {
    isSidebarOpen.value = !isSidebarOpen.value;
  };

  const closeSidebar = () => {
    isSidebarOpen.value = false;
  };
</script>

<template>
  <div class="flex h-screen w-full overflow-hidden">
    <aside
      class="fixed inset-y-0 left-0 z-50 w-64 shrink-0 -translate-x-full transition-transform duration-300 lg:static lg:translate-x-0"
      :class="{ 'translate-x-0': isSidebarOpen }"
    >
      <Sidebar @close="closeSidebar" />
    </aside>

    <div class="flex min-h-0 min-w-0 flex-1 flex-col">
      <header
        class="bg-bg-surface border-primary-600/35 flex h-16 shrink-0 items-center justify-between px-4 backdrop-blur-sm sm:px-6"
      >
        <div class="flex min-w-0 items-center gap-4">
          <button
            type="button"
            class="text-text-primary flex size-9 shrink-0 items-center justify-center rounded-lg lg:hidden"
            @click="toggleSidebar"
          >
            ☰
          </button>

          <div class="flex h-16 shrink-0 items-center px-2 sm:px-5">
            <NuxtLink
              :to="{ name: paths.dashboard.root }"
              class="text-text-primary flex items-center gap-1.5 text-sm font-semibold"
            >
              <span
                class="flex size-8 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white"
              >
                <img :src="logoUrl" alt="" width="32" height="32" class="size-8 object-contain" />
              </span>

              <span class="hidden font-semibold lg:block"> Nuxt Starter </span>
            </NuxtLink>
          </div>
        </div>

        <Button test-id="" variant="ghost" size="icon" class="shrink-0" @click="toggleDark()">
          <Icon icon="hugeicons--dark-mode" class="size-7" />
        </Button>
      </header>

      <div
        v-if="isSidebarOpen"
        class="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm"
        @click="isSidebarOpen = false"
      />

      <main class="bg-bg-surface min-h-0 min-w-0 flex-1 overflow-auto">
        <div class="w-full px-4 py-6 sm:px-6 lg:px-8">
          <slot />
        </div>
      </main>
    </div>
  </div>
</template>
