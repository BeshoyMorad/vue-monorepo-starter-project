/** "+966500450045" → "*********045": only the last 3 digits show */
export const maskPhone = (phone?: string | null) =>
  phone ? '*'.repeat(Math.max(phone.length - 3, 0)) + phone.slice(-3) : '';

/** "abdullah@gmail.com" → "ab******@gmail.com" */
export const maskEmail = (email?: string | null) => {
  if (!email) return '';
  const [name = '', domain = ''] = email.split('@');
  return `${name.slice(0, 2)}${'*'.repeat(Math.max(name.length - 2, 1))}@${domain}`;
};

/** "+966500450045" → { code: "+966", local: "50 045 0045" } (Saudi grouping 2-3-4) */
export const splitSaudiPhone = (phone?: string | null) => {
  const match = /^\+966(\d{2})(\d{3})(\d{4})$/.exec(phone ?? '');
  return match
    ? { code: '+966', local: `${match[1]} ${match[2]} ${match[3]}` }
    : { code: '', local: phone ?? '' };
};
