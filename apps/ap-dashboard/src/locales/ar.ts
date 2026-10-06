import { commonAr, mergeLocaleMessages } from '@workspace/locales';
import auth from '@/modules/auth/locales/ar.json';
import button from '@/modules/doc/components/button/locales/ar.json';
import { tooltip } from '@/modules/doc/components/tooltip/locales/ar.json';
import { dialog } from '@/modules/doc/components/dialog/locales/ar.json';
import { table } from '@/modules/doc/components/table/locales/ar.json';

const appAr = {
  auth,
  tooltip,
  button,
  dialog,
  table,
};

const ar = mergeLocaleMessages(commonAr, appAr);

export default ar;
