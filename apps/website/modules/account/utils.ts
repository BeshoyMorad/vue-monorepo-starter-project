/** First letters of the first two words, as on ibbil.com ("Abdullah Al-Shammari" → "AA") */
export const initials = (fullName?: string | null) =>
  (fullName ?? '')
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join('')
    .toUpperCase();

/** "2026/10/5", as on ibbil.com (same digits in both languages) */
export const activityDate = (iso?: string | null) => {
  if (!iso) return '';
  const date = new Date(iso);
  return Number.isNaN(date.getTime())
    ? ''
    : `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`;
};
