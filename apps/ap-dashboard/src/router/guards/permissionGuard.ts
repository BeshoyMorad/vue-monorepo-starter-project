import { createPermissionGuard } from '@workspace/core/router/guards';
import { usePermissionStore } from '@/stores/permissions';

export const permissionGuard = createPermissionGuard(() => usePermissionStore().permissions);
