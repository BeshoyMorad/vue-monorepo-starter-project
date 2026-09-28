import { ref, onMounted, onUnmounted } from 'vue';
import { useRouter, type Router } from 'vue-router';
import { getAppRouter, setAppRouter } from '@workspace/core/router/factory';
import { basePaths } from '@workspace/core/router/paths';
import { warn } from '@workspace/core/utils/toast';

export const setNetworkRouter = setAppRouter;

const OFFLINE_REDIRECT_KEY = 'offline_redirect_url';

export const isOnline = ref(typeof navigator !== 'undefined' ? navigator.onLine : true);

const getRouter = (): Router | null => {
  let activeRouter = getAppRouter();
  if (!activeRouter) {
    try {
      activeRouter = useRouter() ?? null;
    } catch {
      // Not in setup context
    }
  }
  return activeRouter;
};

const getRedirectPath = (): string | null => {
  const router = getRouter();
  const route = router?.currentRoute.value;
  const queryRedirect = route?.query.redirect as string | undefined;
  if (queryRedirect) return queryRedirect;

  return sessionStorage.getItem(OFFLINE_REDIRECT_KEY);
};

const saveRedirectPath = (path: string) => {
  if (
    path &&
    !path.includes('/no-internet') &&
    !path.includes('/access-denied') &&
    !path.includes('/internal-server-error')
  ) {
    sessionStorage.setItem(OFFLINE_REDIRECT_KEY, path);
  }
};

const clearRedirectPath = () => {
  sessionStorage.removeItem(OFFLINE_REDIRECT_KEY);
};

export const handleOffline = (redirectPath?: string | Event) => {
  isOnline.value = false;
  const router = getRouter();
  if (!router) return;

  const currentRoute = router.currentRoute.value;
  if (currentRoute.name !== basePaths.errors.noInternet) {
    const targetPath = typeof redirectPath === 'string' ? redirectPath : currentRoute.fullPath;
    saveRedirectPath(targetPath);
    router.push({
      name: basePaths.errors.noInternet,
      query: { redirect: targetPath },
    });
  }
};

export const handleOnline = () => {
  isOnline.value = true;
  const router = getRouter();
  if (!router) return;

  const currentRoute = router.currentRoute.value;
  if (currentRoute.name === basePaths.errors.noInternet) {
    const redirect = getRedirectPath();
    router.push(redirect || { name: basePaths.system.dashboard });
    clearRedirectPath();
  }
};

export const tryAgain = () => {
  if (typeof navigator !== 'undefined' && navigator.onLine) {
    handleOnline();
  } else {
    warn('You are still offline. Please check your connection.');
  }
};

export const useNetwork = () => {
  const initListeners = () => {
    onMounted(() => {
      window.addEventListener('offline', handleOffline);
      window.addEventListener('online', handleOnline);

      if (!navigator.onLine) {
        handleOffline();
      }
    });

    onUnmounted(() => {
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('online', handleOnline);
    });
  };

  return {
    isOnline,
    handleOffline,
    handleOnline,
    tryAgain,
    initListeners,
  };
};
