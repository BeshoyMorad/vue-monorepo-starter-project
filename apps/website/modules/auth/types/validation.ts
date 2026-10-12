/** vue-i18n `t`: a key plus optional named values, e.g. t(key, { count: 3 }). */
export type Translate = (key: string, named?: Record<string, unknown>) => string;
