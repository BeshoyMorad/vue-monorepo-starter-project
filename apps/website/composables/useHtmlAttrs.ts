/** Keeps <html lang> and <html dir> (ltr/rtl) in sync with the active locale. */
export function useHtmlAttrs() {
  const i18nHead = useLocaleHead();
  useHead(() => ({
    htmlAttrs: {
      lang: i18nHead.value.htmlAttrs.lang,
      dir: i18nHead.value.htmlAttrs.dir as 'ltr' | 'rtl' | 'auto' | undefined,
    },
  }));
}
