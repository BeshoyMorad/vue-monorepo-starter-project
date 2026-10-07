import { commonEn, mergeLocaleMessages } from '@workspace/locales';

const appEn = {};

const en = mergeLocaleMessages(commonEn, appEn);

export default en;
