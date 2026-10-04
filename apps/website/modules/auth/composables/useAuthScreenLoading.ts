import { onBeforeUnmount, ref } from 'vue';
import type { AuthSkeletonScreen } from '~/modules/auth/components/skeleton/AuthScreenSkeleton.vue';

/** Route base name → auth screen. */
const SCREENS: Record<string, AuthSkeletonScreen> = {
  'auth-login': 'login',
  'auth-register': 'register',
  'auth-verify': 'verify',
  'auth-forgot-password': 'forgot-password',
};

/** Card shape per screen: register is wide without the top border, the rest narrow with it. */
export const AUTH_CARD_SHAPES: Record<AuthSkeletonScreen, { wide: boolean; accent: boolean }> = {
  login: { wide: false, accent: true },
  register: { wide: true, accent: false },
  verify: { wide: false, accent: true },
  'forgot-password': { wide: false, accent: true },
};

/** Fast navigations never show a skeleton, so it doesn't flash on every click. */
const SHOW_AFTER_MS = 150;
/** Safety net in case the page transition never reports its end. */
const MAX_AFTER_FINISH_MS = 600;

/**
 * Drives the layout's persistent card during client-side navigation between auth screens:
 *
 * - `loading`: the screen whose skeleton to show (null when none). Only when loading the
 *   next screen (its code over a slow network) takes longer than SHOW_AFTER_MS, and it stays
 *   until the previous screen has finished leaving, so the old form never flashes back.
 * - `cardScreen`: the screen whose card shape (width, top border) to use. It changes once
 *   the old content has left (or when the skeleton appears), so the old content is never
 *   squeezed into the new shape while it fades out.
 *
 * Server-rendered first loads never show a skeleton: the real form is already there.
 */
export function useAuthScreenLoading() {
  const router = useRouter();
  const route = useRoute();
  const nuxtApp = useNuxtApp();
  const getRouteBaseName = useRouteBaseName();
  const screenOf = (name: string | undefined) => SCREENS[name ?? ''];

  const loading = ref<AuthSkeletonScreen | null>(null);
  const cardScreen = ref<AuthSkeletonScreen>(screenOf(getRouteBaseName(route)) ?? 'login');
  let showTimer: ReturnType<typeof setTimeout> | undefined;
  let fallbackTimer: ReturnType<typeof setTimeout> | undefined;

  const done = () => {
    clearTimeout(showTimer);
    clearTimeout(fallbackTimer);
    loading.value = null;
    cardScreen.value = screenOf(getRouteBaseName(route)) ?? cardScreen.value;
  };

  const stops = [
    router.beforeEach((to, from) => {
      const name = getRouteBaseName(to);
      const target = screenOf(name);
      if (target && name !== getRouteBaseName(from)) {
        clearTimeout(showTimer);
        showTimer = setTimeout(() => {
          loading.value = target;
          cardScreen.value = target;
        }, SHOW_AFTER_MS);
      }
    }),
    // Cancelled or redirected (e.g. a guest-only page for a signed-in user)
    router.afterEach((_to, _from, failure) => {
      if (failure) {
        done();
      }
    }),
    router.onError(done),
    nuxtApp.hook('page:finish', () => {
      clearTimeout(showTimer);
      fallbackTimer = setTimeout(done, MAX_AFTER_FINISH_MS);
    }),
    nuxtApp.hook('page:transition:finish', done),
  ];

  onBeforeUnmount(() => {
    clearTimeout(showTimer);
    clearTimeout(fallbackTimer);
    stops.forEach((stop) => stop());
  });

  return { loading, cardScreen };
}
