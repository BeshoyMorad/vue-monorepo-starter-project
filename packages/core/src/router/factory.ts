import {
  createRouter,
  createWebHistory,
  type Router,
  type RouterHistory,
  type RouteRecordRaw,
  type RouteLocationNormalized,
  type NavigationGuardReturn,
} from 'vue-router';
import { basePaths } from './paths';

export interface AppRouterOptions {
  history?: RouterHistory;
  baseRoutes?: RouteRecordRaw[];
  domainRoutes: RouteRecordRaw[];
  defaultTitle?: string;
  onOffline?: (targetPath: string) => void;
  permissionGuard?: (to: RouteLocationNormalized) => NavigationGuardReturn;
}

let appRouterInstance: Router | null = null;

export const setAppRouter = (router: Router): void => {
  appRouterInstance = router;
};

export const getAppRouter = (): Router | null => {
  return appRouterInstance;
};

function handleChunkRetryError(error: Error, to: RouteLocationNormalized): void {
  if (typeof window === 'undefined' || typeof sessionStorage === 'undefined') {
    return;
  }

  if (
    error.message.includes('Failed to fetch dynamically imported module') ||
    error.message.includes('Importing a module script failed')
  ) {
    const key = `chunk-load-retry-${to.path}`;
    const retried = sessionStorage.getItem(key);
    if (!retried) {
      sessionStorage.setItem(key, 'true');
      // eslint-disable-next-line no-console
      console.warn('[Router]: Chunk fetch failed, reloading page to fetch latest build:', error);
      window.location.reload();
    } else {
      sessionStorage.removeItem(key);
      // eslint-disable-next-line no-console
      console.error('[Router]: Chunk fetch retry failed after page reload.', error);
    }
  }
}

export function createAppRouter(options: AppRouterOptions): Router {
  const routes: RouteRecordRaw[] = [...options.domainRoutes, ...(options.baseRoutes ?? [])];

  const router = createRouter({
    history:
      options.history ??
      createWebHistory(
        ((import.meta as unknown as { env: Record<string, string> }).env?.BASE_URL as string) || '/'
      ),
    routes,
  });

  setAppRouter(router);

  // 1. Dynamic import failure recovery (chunk retry)
  router.onError((error, to) => handleChunkRetryError(error, to));

  // 2. Permission and offline guards
  router.beforeEach((to) => {
    if (
      typeof navigator !== 'undefined' &&
      !navigator.onLine &&
      to.name !== basePaths.errors.noInternet
    ) {
      if (options.onOffline) {
        options.onOffline(to.fullPath);
      }
      return false;
    }

    if (to.meta?.permission && options.permissionGuard) {
      const guardResult = options.permissionGuard(to);
      if (guardResult !== true) {
        return guardResult;
      }
    }

    return true;
  });

  // 3. Document title updater
  router.afterEach((to) => {
    const pageTitle = to.meta?.title as string | undefined;
    if (typeof document !== 'undefined') {
      document.title = pageTitle ? `${pageTitle}` : (options.defaultTitle ?? 'Application');
    }
  });

  return router;
}
