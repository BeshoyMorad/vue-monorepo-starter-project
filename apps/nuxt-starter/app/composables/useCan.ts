export const useCan = () => {
  const store = usePermissionStore();
  return {
    can: store.can,
  };
};
