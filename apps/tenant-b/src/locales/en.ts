import { commonEn, mergeLocaleMessages } from '@workspace/locales';
import auth from '@/modules/auth/locales/en.json';
import button from '@/modules/doc/components/button/locales/en.json';
import { tooltip } from '@/modules/doc/components/tooltip/locales/en.json';
import { dialog } from '@/modules/doc/components/dialog/locales/en.json';
import { table } from '@/modules/doc/components/table/locales/en.json';

const appEn = {
  auth,
  button,
  tooltip,
  dialog,
  table,
};

const en = mergeLocaleMessages(commonEn, appEn);

export default en;
