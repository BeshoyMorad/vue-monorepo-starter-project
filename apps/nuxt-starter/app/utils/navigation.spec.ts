import { describe, it, expect } from 'vitest';
import { useRouter } from '#imports';
import { paths } from '@/constants/route-names';
import { getSidebarLinks, getSidebarSections } from './navigation';

describe('file-based routes', () => {
  it.each([
    [paths.dashboard.root, '/'],
    [paths.auth.login, '/auth/login'],
    [paths.documentationPaths.overview, '/documentation'],
    [paths.documentationPaths.envConfig, '/documentation/env-configuration'],
    [paths.documentationPaths.dataFetching, '/documentation/data-fetching'],
    [paths.componentsPaths.button, '/components/button'],
    [paths.componentsPaths.icon, '/components/icon'],
    [paths.formsPaths.otp, '/forms/otp-input'],
    [paths.formsPaths.ImageUpload, '/forms/image-upload'],
    [paths.composablesPaths.infiniteScroll, '/composables/use-infinite-scroll'],
    [paths.errors.accessDenied, '/access-denied'],
    [paths.errors.serverError, '/internal-server-error'],
    [paths.errors.noInternet, '/no-internet'],
  ])('resolves route name "%s" to %s', (name, path) => {
    expect(useRouter().resolve({ name }).path).toBe(path);
  });

  it('sends unknown URLs to the not-found page', () => {
    expect(useRouter().resolve('/does/not/exist').name).toBe(paths.errors.notFound);
  });
});

describe('sidebar navigation', () => {
  it('lists sections in the configured order', () => {
    const sections = getSidebarSections(useRouter().options.routes);
    expect(sections.map((section) => section.meta?.title)).toEqual([
      'Documentation',
      'Components',
      'Forms',
      'Composables',
    ]);
  });

  it('lists section links in the configured order and hides overview pages', () => {
    const forms = useRouter().options.routes.find((r) => r.name === paths.formsPaths.root);
    if (!forms) throw new Error('forms section route is missing');
    const titles = getSidebarLinks(forms).map((link) => link.meta?.title);
    expect(titles.slice(0, 3)).toEqual(['Text Input', 'Text Area', 'Password']);
    expect(titles).toHaveLength(16);
  });
});
