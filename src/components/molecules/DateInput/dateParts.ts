export type DateParts = { day: string; month: string; year: string };

/** A real calendar date from typed parts, or null. Accepts 1–2 digit day/month and a 4-digit year. */
export function partsToDate({ day, month, year }: DateParts): Date | null {
  if (!/^\d{1,2}$/.test(day) || !/^\d{1,2}$/.test(month) || !/^\d{4}$/.test(year)) return null;
  const d = Number(day);
  const m = Number(month);
  const y = Number(year);
  const date = new Date(y, m - 1, d);
  return date.getFullYear() === y && date.getMonth() === m - 1 && date.getDate() === d ? date : null;
}

/** ISO yyyy-mm-dd for APIs. */
export const partsToIso = (p: DateParts) => {
  const date = partsToDate(p);
  return date ? `${p.year}-${p.month.padStart(2, '0')}-${p.day.padStart(2, '0')}` : null;
};
