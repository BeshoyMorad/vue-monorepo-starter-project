import commonEn from './common/en.json';
import commonAr from './common/ar.json';

export * from './config';
export * from './formats';
export * from './factory';
export { commonEn, commonAr };

export type LocaleDictionary = Record<string, unknown>;

/**
 * Deep merges shared locale dictionaries with app-specific dictionaries.
 * App-specific translations take precedence over shared common translations.
 */
export function mergeLocaleMessages<T extends LocaleDictionary>(
  sharedMessages: LocaleDictionary,
  appMessages: T
): LocaleDictionary & T {
  const result: LocaleDictionary = { ...sharedMessages };

  for (const key of Object.keys(appMessages)) {
    const sharedVal = result[key];
    const appVal = appMessages[key];

    if (
      sharedVal &&
      typeof sharedVal === 'object' &&
      !Array.isArray(sharedVal) &&
      appVal &&
      typeof appVal === 'object' &&
      !Array.isArray(appVal)
    ) {
      result[key] = mergeLocaleMessages(sharedVal as LocaleDictionary, appVal as LocaleDictionary);
    } else {
      result[key] = appVal;
    }
  }

  return result as LocaleDictionary & T;
}
