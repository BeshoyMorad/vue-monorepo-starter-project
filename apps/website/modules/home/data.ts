/**
 * Homepage structure: which items each section shows, their icons and links.
 * Text lives in modules/home/locales (en/ar), keyed by the ids below.
 * Links are '#' until the pages they point to exist.
 * Icons are full class names so Tailwind's icon plugin finds them when scanning sources.
 */

/** Gold navigation bar under the header, in reading order (Figma: Navigation Bar 11422:34002) */
export const topNav = [
  { id: 'stores', to: '#', icon: 'hugeicons--store-01' },
  { id: 'insurance', to: '#', icon: 'hugeicons--shield-01' },
  { id: 'transport', to: '#', icon: 'hugeicons--delivery-truck-01' },
  { id: 'veterinary', to: '#', icon: 'hugeicons--stethoscope' },
  { id: 'permits', to: '#', icon: 'hugeicons--legal-document-01' },
  { id: 'services', to: '#services', icon: 'hugeicons--customer-service-01' },
  { id: 'media', to: '#media', icon: 'hugeicons--news' },
] as const;

export const slides = ['marketplace', 'services', 'trading'] as const;

/**
 * Hero background per slide. The photos fade to brand green on their right edge, which is
 * where the text sits in Arabic; HeroBanner mirrors them in English so the green follows the text.
 */
export const slideImages: Record<(typeof slides)[number], string> = {
  marketplace: '/images/brand/ibbil-hero-01.png',
  services: '/images/brand/ibbil-hero-02.png',
  trading: '/images/brand/ibbil-hero-03.png',
};

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

/**
 * Store categories under the hero, in the design's order. Illustrations live in
 * public/images/market. `trips` reuses a camel-feeding scene until its own art is supplied.
 */
export const categories = [
  { id: 'trips', image: '/images/market/trips.jpg' },
  { id: 'chip', image: '/images/market/chip.jpg' },
  { id: 'supplies', image: '/images/market/camel-supplies.jpg' },
  { id: 'products', image: '/images/market/camel-products.jpg' },
  { id: 'camels', image: '/images/market/camels.jpg' },
  { id: 'accessories', image: '/images/market/accessories.jpg' },
  { id: 'feed', image: '/images/market/animal-feed.jpg' },
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
