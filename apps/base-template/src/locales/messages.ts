import { mergeLocaleMessages, type CommonLocaleSchema, type LocaleCode } from '@workspace/locales';

import type demo from './en/demo.json';
import type auth from './en/auth.json';
import type button from './en/button.json';
import type tooltip from './en/tooltip.json';
import type dialog from './en/dialog.json';
import type table from './en/table.json';

/**
 * Typed English message tree: shared `common`, `errors`, and `nav` from `@workspace/locales`,
 * plus the app namespaces in `src/locales/en/*.json`. Keep in sync with those files.
 */
export interface MessageSchema extends CommonLocaleSchema {
  demo: typeof demo;
  auth: typeof auth;
  button: typeof button;
  tooltip: typeof tooltip;
  dialog: typeof dialog;
  table: typeof table;
}

type LocaleJsonModule = Record<string, unknown>;

const localeFileLoaders = import.meta.glob<LocaleJsonModule>('./*/*.json', {
  import: 'default',
});

/** Shared messages live in `packages/locales`; each locale is fetched only when it is needed. */
const sharedLocaleLoaders: Record<LocaleCode, () => Promise<LocaleJsonModule>> = {
  en: () => import('@workspace/locales/common/en.json').then((module) => module.default),
  ar: () => import('@workspace/locales/common/ar.json').then((module) => module.default),
};

function namespaceFromPath(path: string, locale: LocaleCode): string {
  const prefix = `./${locale}/`;
  if (!path.startsWith(prefix) || !path.endsWith('.json')) {
    throw new Error(`[i18n] Unexpected locale file path: ${path}`);
  }

  return path.slice(prefix.length, -'.json'.length);
}

export async function loadLocaleFileMessages(locale: LocaleCode): Promise<MessageSchema> {
  const prefix = `./${locale}/`;
  const matched = Object.entries(localeFileLoaders).filter(([path]) => path.startsWith(prefix));

  if (matched.length === 0) {
    throw new Error(`[i18n] No message files found for locale "${locale}"`);
  }

  const [shared, ...appEntries] = await Promise.all([
    sharedLocaleLoaders[locale](),
    ...matched.map(
      async ([path, loader]) => [namespaceFromPath(path, locale), await loader()] as const
    ),
  ]);

  const appMessages = Object.fromEntries(appEntries as (readonly [string, LocaleJsonModule])[]);

  return mergeLocaleMessages(shared, appMessages) as unknown as MessageSchema;
}
