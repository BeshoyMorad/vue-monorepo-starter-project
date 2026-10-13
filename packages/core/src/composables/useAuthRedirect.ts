import { useSessionStorage } from '@vueuse/core';
import { useRouter } from 'vue-router';
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

  const handleRedirect = (fallback: string = '/') => {
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
      } else if (fallback.startsWith('/')) {
        void activeRouter.push(fallback);
      } else {
        void activeRouter.push({ name: fallback });
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
