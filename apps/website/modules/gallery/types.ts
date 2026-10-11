/**
 * Gallery API types (GET /gallery-items, /gallery-items/{id}).
 * The API docs show `data` as a plain array; the dev API (checked 2026-10-11) answers with
 * { items, meta } like the other paginated endpoints, so that is what these types follow.
 */

export const GALLERY_MEDIA_TYPES = ['IMAGE', 'VIDEO'] as const;
export type GalleryMediaType = (typeof GALLERY_MEDIA_TYPES)[number];
export type GalleryLang = 'EN' | 'AR';

export interface GalleryListParams {
  page?: number;
  limit?: number;
  search?: string;
  sortOrder?: 'ASC' | 'DESC';
  sortBy?: 'createdAt' | 'title';
  /** Content language: items are written for one site language */
  lang?: GalleryLang;
  mediaType?: GalleryMediaType;
}

export interface GalleryItem {
  id: string;
  lang: GalleryLang;
  title: string;
  nameAr?: string | null;
  nameEn?: string | null;
  slug: string;
  /** Set when the item was requested by an old slug: the website should 301 to it */
  canonicalSlug?: string | null;
  description?: string | null;
  /** The image itself, or the video file */
  mediaUrl: string;
  /** Poster for videos; null when none was uploaded */
  thumbnailUrl?: string | null;
  mediaType: GalleryMediaType;
  /** Videos only */
  durationSeconds?: number | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface GalleryPageMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface GalleryPage {
  items: GalleryItem[];
  meta: GalleryPageMeta;
}
