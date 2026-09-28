import { ref, onMounted, onUnmounted } from 'vue';
import { navigateTo, useRouter } from '#imports';
import type { RouteLocationRaw } from 'vue-router';
import { paths } from '@/constants/route-names';
import { warn } from '@/utils/toast';

const OFFLINE_REDIRECT_KEY = 'offline_redirect_url';

export const isOnline = ref(import.meta.client ? navigator.onLine : true);

const getRedirectPath = (): string | null => {
  const queryRedirect = useRouter().currentRoute.value.query.redirect;
  if (typeof queryRedirect === 'string' && queryRedirect) return queryRedirect;

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

/** Marks the app offline and returns the no-internet location that remembers `targetPath`. */
export const getOfflineLocation = (targetPath: string): RouteLocationRaw => {
  isOnline.value = false;
  saveRedirectPath(targetPath);
  return { name: paths.errors.noInternet, query: { redirect: targetPath } };
};

export const handleOffline = (redirectPath?: string | Event) => {
  const currentRoute = useRouter().currentRoute.value;
  if (currentRoute.name === paths.errors.noInternet) {
    isOnline.value = false;
    return;
  }
  const targetPath = typeof redirectPath === 'string' ? redirectPath : currentRoute.fullPath;
  void navigateTo(getOfflineLocation(targetPath));
};

export const handleOnline = () => {
  isOnline.value = true;
  if (useRouter().currentRoute.value.name === paths.errors.noInternet) {
    const redirect = getRedirectPath();
    void navigateTo(redirect || { name: paths.dashboard.root });
    clearRedirectPath();
  }
};

export const tryAgain = () => {
  if (navigator.onLine) {
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
