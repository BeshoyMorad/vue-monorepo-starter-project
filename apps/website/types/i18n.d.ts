import type { CommonLocaleSchema } from '@workspace/locales';
import type { WebsiteLocaleSchema } from '~/locales/en';

type MessageSchema = CommonLocaleSchema & WebsiteLocaleSchema;

declare module 'vue-i18n' {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  export interface DefineLocaleMessage extends MessageSchema {}
}
