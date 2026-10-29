import { mergeLocaleMessages, type CommonLocaleSchema, type LocaleCode } from '@workspace/locales';

/**
 * Typed English message tree: shared `common`, `errors`, `nav` and `yup` from `@workspace/locales`.
 * To add app namespaces, create `src/locales/{en,ar}/<namespace>.json`, import its type here
 * and turn this into an interface extending `CommonLocaleSchema`, e.g. `auth: typeof auth`.
 */
export type MessageSchema = CommonLocaleSchema;

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

  const [shared, ...appEntries] = await Promise.all([
    sharedLocaleLoaders[locale](),
    ...matched.map(
      async ([path, loader]) => [namespaceFromPath(path, locale), await loader()] as const
    ),
  ]);

  const appMessages = Object.fromEntries(appEntries as (readonly [string, LocaleJsonModule])[]);

  return mergeLocaleMessages(shared, appMessages) as unknown as MessageSchema;
}
