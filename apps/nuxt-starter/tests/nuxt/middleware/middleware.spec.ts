import { beforeEach, describe, expect, it, vi } from 'vitest';
import { mockNuxtImport } from '@nuxt/test-utils/runtime';
import type { RouteLocationNormalized } from 'vue-router';
import authMiddleware from '@/middleware/auth.global';
import permissionMiddleware from '@/middleware/permission';
import { paths } from '@/constants/route-names';

const { navigateToMock, authState, canMock, saveRedirectUrlMock } = vi.hoisted(() => ({
  navigateToMock: vi.fn((to: unknown) => to),
  authState: { isAuthenticated: false },
  canMock: vi.fn(),
  saveRedirectUrlMock: vi.fn(),
}));

// The middleware relies on auto-imports, so these mocks replace them directly.
mockNuxtImport('navigateTo', () => navigateToMock);
mockNuxtImport('useAuthStore', () => () => authState);
mockNuxtImport('usePermissionStore', () => () => ({ can: canMock }));
mockNuxtImport('useAuthRedirect', () => () => ({ saveRedirectUrl: saveRedirectUrlMock }));

const route = (meta: RouteLocationNormalized['meta'] = {}, fullPath = '/components/button') =>
  ({ fullPath, meta }) as RouteLocationNormalized;

beforeEach(() => {
  vi.clearAllMocks();
  authState.isAuthenticated = false;
});

describe('auth.global middleware', () => {
  it('lets anyone open a page marked auth: false', () => {
    expect(authMiddleware(route({ auth: false }), route())).toBeUndefined();
    expect(navigateToMock).not.toHaveBeenCalled();
  });

  it('lets signed-in users through', () => {
    authState.isAuthenticated = true;
    expect(authMiddleware(route(), route())).toBeUndefined();
    expect(navigateToMock).not.toHaveBeenCalled();
  });

  it('sends guests to login and remembers where they were going', () => {
    authMiddleware(route({}, '/forms/select'), route());
    expect(saveRedirectUrlMock).toHaveBeenCalledWith('/forms/select');
    expect(navigateToMock).toHaveBeenCalledWith({ name: paths.auth.login });
  });
});

describe('permission middleware', () => {
  it('does nothing when the page lists no permissions', () => {
    expect(permissionMiddleware(route(), route())).toBeUndefined();
    expect(canMock).not.toHaveBeenCalled();
  });

  it('lets users with the permissions through', () => {
    canMock.mockReturnValue(true);
    const to = route({ permissions: ['admins.list', 'admins.create'], permissionsOperator: 'and' });
    expect(permissionMiddleware(to, route())).toBeUndefined();
    expect(canMock).toHaveBeenCalledWith(['admins.list', 'admins.create'], 'and');
  });

  it('sends users without the permissions to the access-denied page', () => {
    canMock.mockReturnValue(false);
    permissionMiddleware(route({ permissions: 'admins.delete' }), route());
    expect(navigateToMock).toHaveBeenCalledWith({ name: paths.errors.accessDenied });
  });
});
