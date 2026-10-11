import { queryOptions } from '@tanstack/vue-query';
import { queryKeys } from '~/api/query-keys';
import type { GalleryService } from './services';
import type { GalleryListParams } from './types';

/** A page of published gallery items */
export const galleryListQueryOptions = (
  service: GalleryService,
  params: GalleryListParams,
  enabled = true
) =>
  queryOptions({
    enabled,
    queryKey: queryKeys.gallery.list(params),
    queryFn: ({ signal }) => service.list(params, signal),
    staleTime: 5 * 60_000,
  });

/** One gallery item by id or slug */
export const galleryItemQueryOptions = (service: GalleryService, idOrSlug: string) =>
  queryOptions({
    queryKey: queryKeys.gallery.item(idOrSlug),
    queryFn: ({ signal }) => service.item(idOrSlug, signal),
    staleTime: 5 * 60_000,
  });
