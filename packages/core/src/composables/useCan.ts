import { usePermissionStore } from '@workspace/core/stores/permissions';

export const useCan = () => {
  const store = usePermissionStore();
  return {
    can: store.can,
  };
};
