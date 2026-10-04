import { componentsPaths } from '@/features/doc/components/components.paths';
import { formsPaths } from '@/features/doc/forms/forms.paths';
import { composablesPaths } from '@/features/doc/composables/composables.paths';
import { documentationPaths } from '@/features/doc/documentation/doc.paths';

export const paths = {
  auth: {
    login: 'login',
  },
  dashboard: {
    root: 'dashboard',
    starter: 'starter',
    multiStepForm: 'multi-step-form',
    virtualScrollExample: 'virtual-scroll-example',
    localizationExample: 'localization-example',
    demo: 'demo',
    assets: 'assets',
  },
  tokenization: {
    root: 'tokenization',
    create: 'tokenization-create',
  },
  vaults: {
    details: 'vault-details',
  },
  componentsPaths,
  formsPaths,
  composablesPaths,
  documentationPaths,
  errors: {
    notFound: 'not-found',
    accessDenied: 'access-denied',
    serverError: 'server-error',
    noInternet: 'no-internet',
  },
};
