/** Form value for a single image/file field. Created with `createMediaValue()`. */
export interface MediaValue {
  /** The local file selected by the user. */
  file: File | null;
  /** The local blob preview URL. */
  tempUrl: string;
  /** The uploaded media ID, cached after upload. */
  mediaId: string | null;
  /** The initial URL from the server, in edit mode. */
  initialUrl: string | null;
  /** Whether the user selected a new file or removed the existing one. */
  isChanged: boolean;
  /** Whether the initial URL was removed or replaced. */
  wasRemoved: boolean;
  /** Display name, used for non-image files and existing server files. */
  fileName?: string;
}

export interface MediaPayloadItem {
  id: string;
  key: string;
}

/** Media diff sent to the API when a form with media fields is submitted. */
export interface MediaPayload {
  mediaIdsToAdd: MediaPayloadItem[] | string[];
  mediaUrlsToRemove: string[];
}

export interface ExtractMediaPayloadOptions {
  /** Send `{ id, key }` items instead of bare IDs. */
  usePayloadItems?: boolean;
}

/** Storage bucket category accepted by the presigned-URL endpoint. */
export type StorageServiceType = 'PHOTO' | 'TOKENIZATION';

export interface UploadImagePayload {
  serviceType: StorageServiceType;
  files: File[];
}

export interface UploadImageResponse {
  mediaId: string;
  presignedUrls: string[];
}

/** Metadata read from an uploaded file's HEAD response. */
export interface UrlDetails {
  url: string;
  filename: string;
  extension: string;
  uploadedAt: string;
}

/** Image object as returned by the API. */
export interface ApiImage {
  url: string;
  extension: string;
  name: string;
  path: string;
}
