/**
 * Fold Vietnamese text for searching: lower case, tone marks and vowel marks removed, đ → d.
 * "Tăng huyết áp" and "tang huyet ap" fold to the same string, so staff can type without Telex.
 */
export function foldVi(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim();
}

/** 2033 → "2.033" (Vietnamese grouping). */
export const formatViInteger = (n: number) => n.toLocaleString('vi-VN', { maximumFractionDigits: 0 });

/**
 * Read a number the way Vietnamese staff type it: "52,5" and "52.5" both mean 52.5.
 * Returns null for empty input and NaN for anything that is not a plain number.
 */
export function parseViNumber(text: string): number | null {
  const t = text.trim().replace(/\s/g, '');
  if (!t) return null;
  if (!/^-?\d+([.,]\d+)?$/.test(t)) return Number.NaN;
  return Number(t.replace(',', '.'));
}

/** 52.5 → "52,5"; keeps at most `decimals` digits after the comma. */
export function formatViNumber(n: number, decimals = 1): string {
  return n.toLocaleString('vi-VN', { maximumFractionDigits: decimals, useGrouping: false });
}

/** Age in whole years on `today` for a date written dd/mm/yyyy; null when the date cannot be read. */
export function ageFromViDate(date: string, today: Date = new Date()): number | null {
  const m = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/.exec(date.trim());
  if (!m) return null;
  const [d, mo, y] = [Number(m[1]), Number(m[2]), Number(m[3])];
  let age = today.getFullYear() - y;
  if (today.getMonth() + 1 < mo || (today.getMonth() + 1 === mo && today.getDate() < d)) age -= 1;
  return age >= 0 && age < 150 ? age : null;
}
