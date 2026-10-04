import { commonEn, mergeLocaleMessages } from '@workspace/locales';
import { authEn } from '~/modules/auth/locales/en';

export const websiteEn = {
  auth: authEn,
  errors: {
    title: 'Error',
    tooManyRequests: 'Too many requests. Please wait a moment and try again.',
  },
  errorPage: {
    backHome: 'Back to home',
    notFound: {
      title: 'Page not found',
      description: "The page you're looking for doesn't exist or has been moved.",
    },
    forbidden: {
      title: 'Access denied',
      description: "You don't have permission to view this page.",
    },
    serverError: {
      title: 'Something went wrong',
      description: 'An unexpected error occurred. Please try again later.',
    },
  },
  website: {
    hero: {
      badge: 'Nuxt 3 + TanStack Query + Tailwind v4',
      title: 'Universal Vue Monorepo Website',
      subtitle:
        'High-performance SSR, SSG, and ISR capabilities sharing core business logic, permissions, and UI components across apps.',
      ctaDocs: 'Explore Documentation',
      ctaDashboard: 'Interactive TanStack Query',
    },
    features: {
      title: 'Architecture Highlights',
      ssr: {
        title: 'Hybrid Rendering',
        description:
          'Support for dynamic SSR, build-time SSG prerendering, and ISR stale-while-revalidate caching.',
      },
      hydration: {
        title: 'Zero-Waterfall SSR Hydration',
        description:
          'TanStack Query prefetching on the server, seamless client dehydration/hydration with no duplicated requests.',
      },
      permissions: {
        title: 'Framework-Agnostic Guards',
        description:
          'Shared permission engine powering both Nuxt route middleware and Vue Router beforeEach guards.',
      },
    },
  },
  nav: {
    home: 'Home',
    tanstackQuery: 'TanStack Query SSR',
    ssgExample: 'SSG Prerender',
    isrExample: 'ISR Cache (60s)',
  },
};

export type WebsiteLocaleSchema = typeof websiteEn;

export default defineI18nLocale(async () => {
  return mergeLocaleMessages(commonEn, websiteEn);
});
