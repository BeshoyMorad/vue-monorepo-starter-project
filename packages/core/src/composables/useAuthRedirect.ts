import { useSessionStorage } from '@vueuse/core';
import { useRouter } from 'vue-router';
import { basePaths } from '@workspace/core/router/paths';
import { getAppRouter } from '@workspace/core/router/factory';

export const REDIRECT_URL_KEY = 'redirect_url';

export const useAuthRedirect = () => {
  const savedUrl = useSessionStorage<string | null>(REDIRECT_URL_KEY, null);

  const saveRedirectUrl = (url: string) => {
    if (url && !url.includes('/auth/')) {
      savedUrl.value = url;
    }
  };

  const getRedirectUrl = () => {
    return savedUrl.value;
  };

  const clearRedirectUrl = () => {
    savedUrl.value = null;
  };

  const handleRedirect = (routeName: string = basePaths.system.dashboard) => {
    let activeRouter = getAppRouter();
    if (!activeRouter) {
      try {
        activeRouter = useRouter();
      } catch {
        // Not in setup context
      }
    }

    const url = savedUrl.value;
    if (activeRouter) {
      if (url) {
        void activeRouter.push(url);
      } else {
        void activeRouter.push({ name: routeName });
      }
    }
    clearRedirectUrl();
  };

  return {
    savedUrl,
    saveRedirectUrl,
    getRedirectUrl,
    clearRedirectUrl,
    handleRedirect,
  };
};
