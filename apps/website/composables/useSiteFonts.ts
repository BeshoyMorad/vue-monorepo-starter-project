/**
 * Google Fonts used by the main site design (Inter, Plus Jakarta Sans, Cairo, Exo 2).
 * Loaded per layout instead of from main.css, so pages that don't use them (the auth
 * pages use the self-hosted brand font) don't pay for them. Preconnecting lets the font
 * files start downloading as soon as the stylesheet arrives.
 */
export function useSiteFonts() {
  useHead({
    link: [
      { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
      { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@600;700;800&family=Cairo:wght@200..1000&family=Exo+2:ital,wght@0,100..900;1,100..900&display=swap',
      },
    ],
  });
}
