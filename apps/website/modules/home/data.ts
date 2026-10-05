/**
 * Homepage structure: which items each section shows, their icons and links.
 * Text lives in modules/home/locales (en/ar), keyed by the ids below.
 * Links are '#' until the pages they point to exist.
 * Icons are full class names so Tailwind's icon plugin finds them when scanning sources.
 */

/** Gold navigation bar under the header */
export const topNav = [
  { id: 'feed', to: '#' },
  { id: 'supplies', to: '#' },
  { id: 'veterinary', to: '#' },
  { id: 'insurance', to: '#' },
  { id: 'transport', to: '#' },
  { id: 'permits', to: '#' },
  { id: 'trading', to: '#' },
  { id: 'media', to: '#media' },
] as const;

export const slides = ['marketplace', 'services', 'trading'] as const;

/** "About" feature tiles */
export const features = [
  { id: 'trusted', icon: 'hugeicons--checkmark-badge-01' },
  { id: 'payments', icon: 'hugeicons--shield-user' },
  { id: 'support', icon: 'hugeicons--call' },
] as const;

export const services = [
  { id: 'insurance', icon: 'hugeicons--shield-01' },
  { id: 'transport', icon: 'hugeicons--delivery-truck-01' },
  { id: 'permits', icon: 'hugeicons--legal-document-01' },
  { id: 'veterinary', icon: 'hugeicons--stethoscope' },
  { id: 'trading', icon: 'hugeicons--money-exchange-01' },
  { id: 'rental', icon: 'hugeicons--camel' },
] as const;

export const categories = [
  { id: 'feed', icon: 'hugeicons--plant-02' },
  { id: 'supplies', icon: 'hugeicons--store-01' },
  { id: 'medicine', icon: 'hugeicons--medicine-02' },
  { id: 'camels', icon: 'hugeicons--camel' },
] as const;

/** Values are display strings so each locale can format them */
export const stats = [
  'merchants',
  'providers',
  'products',
  'orders',
  'customers',
  'cities',
] as const;

export const mediaTabs = ['news', 'photos', 'videos', 'events'] as const;
export type MediaTab = (typeof mediaTabs)[number];

/** Latest stories, filtered by the media tab. `views` is a number formatted per locale */
export const stories: { id: string; type: MediaTab; views: number; date: string }[] = [
  { id: 'launch', type: 'news', views: 1240, date: '2026-09-21' },
  { id: 'festival', type: 'news', views: 860, date: '2026-09-14' },
  { id: 'insurance', type: 'news', views: 530, date: '2026-09-02' },
  { id: 'gallery', type: 'photos', views: 410, date: '2026-08-28' },
  { id: 'tour', type: 'videos', views: 2210, date: '2026-08-19' },
  { id: 'expo', type: 'events', views: 690, date: '2026-10-12' },
];

export const footerColumns = [
  { id: 'platform', links: ['about', 'contact', 'join', 'faq'] },
  { id: 'services', links: ['insurance', 'transport', 'permits', 'veterinary'] },
  { id: 'policies', links: ['terms', 'privacy', 'returns'] },
] as const;

export const socials = [
  { id: 'x', icon: 'hugeicons--new-twitter', href: '#' },
  { id: 'instagram', icon: 'hugeicons--instagram', href: '#' },
  { id: 'snapchat', icon: 'hugeicons--snapchat', href: '#' },
  { id: 'youtube', icon: 'hugeicons--youtube', href: '#' },
  { id: 'tiktok', icon: 'hugeicons--tiktok', href: '#' },
] as const;
