import { useMutation } from '@tanstack/vue-query';
import { ofetch } from 'ofetch';
import { getApiClient } from '@workspace/core/lib/api/client';
import { error } from '@workspace/core/utils/toast';
import { isFetchError } from '@workspace/core/utils';

export type StorageServiceType = 'PHOTO';

export interface UploadImagePayload {
  serviceType: StorageServiceType;
  files: File[];
}

export interface UploadImageResponse {
  mediaId: string;
  presignedUrls: string[];
}

/**
 * Composable that exposes a TanStack Query mutation for uploading images/files.
 *
 * It requests presigned URLs from the backend and uploads the files directly to
 * the storage provider (e.g. S3) via PUT requests.
 *
 * @returns The mutation object. If successful, `mutateAsync` resolves to the `mediaId` string.
 */
export function useUploadImage(endpoint: string = '/media/upload') {
  return useMutation({
    mutationFn: async ({ serviceType, files }: UploadImagePayload) => {
      if (!files.length) {
        return '';
      }

      const client = getApiClient();
      const fileMetadata = files.map((file) => ({
        fileSize: file.size,
        contentType: file.type,
      }));

      // 1. Request presigned URLs from our backend
      const response = await client.post<ApiResponse<UploadImageResponse>>(endpoint, {
        serviceType,
        media: fileMetadata,
      });

      const { mediaId, presignedUrls } = response.data;

      if (!presignedUrls || presignedUrls.length !== files.length) {
        throw new Error('Failed to retrieve presigned URLs');
      }

      // 2. Upload files in parallel to the presigned URLs
      // Note: We use ofetch directly without global interceptors to upload to storage provider
      const uploadPromises = files.map((file, index) =>
        ofetch(presignedUrls[index], {
          method: 'PUT',
          body: file,
          headers: {
            'Content-Type': file.type,
          },
        })
      );

      await Promise.all(uploadPromises);

      return mediaId;
    },
    onError: (err: unknown) => {
      let message = 'Failed to upload files';
      if (isFetchError(err)) {
        message = (err.data as { message?: string })?.message || err.message || message;
      } else if (err instanceof Error) {
        message = err.message;
      }
      error(message);
    },
  });
}
