export const useStarterStore = defineStore('starter', () => {
  const isFilterActive = ref<boolean>(false);

  const toggleFilter = () => {
    isFilterActive.value = !isFilterActive.value;
  };

  return {
    isFilterActive,
    toggleFilter,
  };
});
