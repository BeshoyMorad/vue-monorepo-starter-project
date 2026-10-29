export type YupTranslator = (key: string, values?: Record<string, unknown>) => string;

let translator: YupTranslator | null = null;

export function setYupTranslator(t: YupTranslator): void {
  translator = t;
}

/** Resolves a message through the translator registered by `setupYupLocale`. */
export function yupT(key: string, values?: Record<string, unknown>): string {
  if (!translator) {
    throw new Error('[yup] Call setupYupLocale(t) before using localized Yup schemas.');
  }

  return translator(key, values);
}
