import { basePaths } from '@workspace/core/router';
import { componentsPaths } from '@/modules/doc/components/components.paths';
import { formsPaths } from '@/modules/doc/forms/forms.paths';
import { composablesPaths } from '@/modules/doc/composables/composables.paths';
import { documentationPaths } from '@/modules/doc/documentation/doc.paths';

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
  componentsPaths,
  formsPaths,
  composablesPaths,
  documentationPaths,
  errors: basePaths.errors,
};
