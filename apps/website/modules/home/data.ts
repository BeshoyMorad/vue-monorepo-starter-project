/**
 * Homepage structure: which items each section shows, their icons and links.
 * Text lives in modules/home/locales (en/ar), keyed by the ids below.
 * Links are '#' until the pages they point to exist.
 * Icons are full class names so Tailwind's icon plugin finds them when scanning sources.
 */

import type { PlatformStatKey } from './types';

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

/** "About" feature cards: illustration per card; text in home.about.features.<id> */
export const features = [
  { id: 'secure', image: '/images/brand/safety.png' },
  { id: 'services', image: '/images/brand/paper.png' },
  { id: 'market', image: '/images/brand/cart.png' },
] as const;

/** "Platform services" cards, in reading order (Figma: Services section) */
export const services = [
  { id: 'stores', to: '#', image: '/images/services/stores.png' },
  { id: 'insurance', to: '#', image: '/images/services/insurance.png' },
  { id: 'transport', to: '#', image: '/images/services/transport.png' },
  { id: 'veterinary', to: '#', image: '/images/services/vet.png' },
  { id: 'permits', to: '#', image: '/images/services/permits.png' },
  { id: 'media', to: '#media', image: '/images/services/media.png' },
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
/** Homepage statistics, in display order; each reads one count of GET /stats/platform */
export const stats = [
  { id: 'merchants', key: 'merchantsCount' },
  { id: 'products', key: 'productsCount' },
  { id: 'doctors', key: 'doctorsCount' },
  { id: 'purchases', key: 'purchaseOperationsCount' },
  { id: 'transports', key: 'transportOperationsCount' },
  { id: 'insurance', key: 'insurancePoliciesCount' },
] as const satisfies readonly { id: string; key: PlatformStatKey }[];

export const mediaTabs = ['news', 'photos', 'videos', 'events'] as const;
export type MediaTab = (typeof mediaTabs)[number];

/** Icon per media tab (Figma: news, image-03, play-list, calendar-03) */
export const mediaTabIcons: Record<MediaTab, string> = {
  news: 'hugeicons--news',
  photos: 'hugeicons--image-03',
  videos: 'hugeicons--play-list',
  events: 'hugeicons--calendar-03',
};

/** Large story beside the latest list; its text is in home.media.featured */
export const featuredStory = { date: '2026-09-09' };

/**
 * Sample news and events stories, filtered by the media tab. Photos and videos come from the
 * gallery API instead. `views` is a number formatted per locale.
 */
export const stories: { id: string; type: MediaTab; views: number; date: string }[] = [
  { id: 'gathering', type: 'news', views: 0, date: '2026-09-03' },
  { id: 'onePlace', type: 'news', views: 0, date: '2026-09-03' },
  { id: 'expo', type: 'events', views: 690, date: '2026-10-12' },
];

/**
 * Footer link columns (Figma: Footer 11459:650), in reading order after the brand block.
 * `label` is the full translation key, so the stores column reuses the category names.
 */
export const footerColumns = [
  {
    id: 'stores',
    links: (
      ['trips', 'products', 'supplies', 'chip', 'feed', 'accessories', 'camels'] as const
    ).map((id) => ({ id, label: `home.categories.items.${id}.title`, to: '#' })),
  },
  {
    id: 'services',
    links: (['permits', 'insurance', 'transport', 'veterinary'] as const).map((id) => ({
      id,
      label: `home.footer.links.${id}`,
      to: '#',
    })),
  },
  {
    id: 'policies',
    links: (['terms', 'privacy'] as const).map((id) => ({
      id,
      label: `home.footer.links.${id}`,
      to: '#',
    })),
  },
] as const;

/** Social accounts, in the design's order; icons are the Figma exports in assets/icons */
export const socials = [
  { id: 'whatsapp', icon: 'site--social-whatsapp', href: '#' },
  { id: 'facebook', icon: 'site--social-facebook', href: '#' },
  { id: 'instagram', icon: 'site--social-instagram', href: '#' },
  { id: 'linkedin', icon: 'site--social-linkedin', href: '#' },
  { id: 'x', icon: 'site--social-x', href: '#' },
] as const;
