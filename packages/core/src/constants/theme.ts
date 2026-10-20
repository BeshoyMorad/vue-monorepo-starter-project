export const THEMES: readonly Theme[] = ['light', 'dark'];

export const isTheme = (value: unknown): value is Theme => THEMES.includes(value as Theme);

export const THEME_STORAGE_KEY = 'vue-starter-theme';
export const THEME_COOKIE_MAX_AGE = 60 * 60 * 24 * 365;
