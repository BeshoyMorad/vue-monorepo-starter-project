import type { ApiFetch } from '~/api/client';
import { apiRoute } from '~/api/endpoints';
import type { ApiEnvelope } from '~/types/api';
import type { GalleryItem, GalleryListParams, GalleryPage } from './types';

/**
 * Public gallery endpoints (photos and videos of the media center). The admin, archive,
 * create, update, delete and restore endpoints are for the dashboard, not the website.
 * Calls are `silent`: the sections that use them show their own empty and error states.
 */
export function createGalleryService(api: ApiFetch) {
  return {
    list: async (params: GalleryListParams, signal?: AbortSignal) =>
      (
        await api<ApiEnvelope<GalleryPage>>(apiRoute('gallery.items'), {
          query: params,
          signal,
          silent: true,
        })
      ).data,

    /** By id, slug or an old slug (then `canonicalSlug` names the current one) */
    item: async (idOrSlug: string, signal?: AbortSignal) =>
      (
        await api<ApiEnvelope<GalleryItem>>(apiRoute('gallery.item', { id: idOrSlug }), {
          signal,
          silent: true,
        })
      ).data,
  };
}

export type GalleryService = ReturnType<typeof createGalleryService>;

/** Gallery service bound to the app's fetch client. */
export const useGalleryService = (): GalleryService => createGalleryService(useApi());
