<script setup lang="ts">
  import type { RouteRecordRaw } from 'vue-router';
  import { Field } from '@/components/form';
  import { getSidebarLinks, getSidebarSections } from '@/utils/navigation';

  const router = useRouter();
  const emit = defineEmits<{ close: [] }>();
  const searchQuery = ref('');
  const openSections = ref<Record<string, boolean>>({});
  interface SidebarSection {
    route: RouteRecordRaw;
    links: RouteRecordRaw[];
  }

  const sidebarSections = computed<SidebarSection[]>(() =>
    getSidebarSections(router.options.routes).map((route) => ({
      route,
      links: getSidebarLinks(route),
    }))
  );

  const filteredSidebarSections = computed<SidebarSection[]>(() => {
    const query = searchQuery.value.trim().toLowerCase();
    if (!query) return sidebarSections.value;

    return sidebarSections.value
      .map((section) => ({
        ...section,
        links: section.links.filter((link) =>
          (link.meta?.title ?? '').toLowerCase().includes(query)
        ),
      }))
      .filter((section) => section.links.length > 0);
  });

  const isSectionOpen = (section: string) => {
    if (searchQuery.value.trim()) return true;

    return openSections.value[section] ?? true;
  };

  const toggleSection = (section: string) => {
    openSections.value[section] = !isSectionOpen(section);
  };
</script>

<template>
  <aside
    class="bg-bg-surface border-primary-600/35 relative flex h-screen w-64 shrink-0 flex-col border-r border-l"
  >
    <div class="px-4 pt-3">
      <Field.Text
        v-model="searchQuery"
        type="search"
        placeholder="Search..."
        icon="hugeicons--search-01"
        icon-position="left"
        test-id="sidebar-search"
      />
    </div>
    <nav
      class="[&::-webkit-scrollbar-thumb]:bg-primary-600/10 hover:[&::-webkit-scrollbar-thumb]:bg-primary-600/25 flex flex-1 flex-col gap-2 overflow-y-auto px-3 py-3 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-transparent"
    >
      <template v-for="{ route, links } in filteredSidebarSections" :key="route.path">
        <section class="mt-2 flex flex-col gap-1">
          <div class="flex h-9 items-center justify-between">
            <NuxtLink
              :to="{ name: route.name }"
              class="plain-font flex flex-1 items-center"
              active-class="text-primary-600 font-semibold"
            >
              <Icon :icon="route.meta?.icon ?? ''" class="text-primary-600 size-4" />

              <span
                class="text-text-tertiary px-3 text-[11px] font-semibold tracking-wider uppercase"
              >
                {{ route.meta?.title }}
              </span>
            </NuxtLink>

            <button
              type="button"
              class="text-text-tertiary hover:bg-surface-secondary hover:text-text-primary flex size-8 items-center justify-center rounded-md transition-colors"
              @click="toggleSection(route.path)"
            >
              <span
                class="text-sm transition-transform duration-200"
                :class="{ 'rotate-180': isSectionOpen(route.path) }"
              >
                <Icon icon="hugeicons--arrow-down-01" class="size-4" />
              </span>
            </button>
          </div>

          <div v-show="isSectionOpen(route.path)" class="mx-3 flex flex-col">
            <template v-for="child in links" :key="String(child.name)">
              <NuxtLink
                :to="{ name: child.name }"
                class="plain-font hover:text-text-primary font-inherit flex h-9 items-center rounded-lg px-3 text-sm font-medium transition-colors"
                active-class="bg-primary-600/15 text-primary-600 font-semibold"
                @click="emit('close')"
              >
                {{ child.meta?.title }}
              </NuxtLink>
            </template>
          </div>
        </section>
      </template>
    </nav>
  </aside>
</template>
