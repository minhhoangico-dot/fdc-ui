/** Href for a tap-to-call link; keeps digits and a leading +. */
export const telHref = (number: string) => `tel:${number.replace(/[^\d+]/g, '')}`;

/**
 * Normalize what people type into a Vietnamese phone number: accepts spaces,
 * dots, dashes, brackets and +84/84 prefixes. Returns digits starting with 0,
 * or null when it is not a 10-digit mobile or 10–11 digit landline.
 */
export function normalizeVnPhone(input: string): string | null {
  let digits = input.normalize('NFC').replace(/[\s.\-()]/g, '');
  if (digits.startsWith('+84')) digits = `0${digits.slice(3)}`;
  else if (digits.startsWith('84') && digits.length >= 11) digits = `0${digits.slice(2)}`;
  return /^0\d{9,10}$/.test(digits) ? digits : null;
}

/** Display form: 0912 345 678 for mobiles, 024 3543 0430 for 11-digit landlines. */
export function formatVnPhone(digits: string): string {
  if (digits.length === 10) return `${digits.slice(0, 4)} ${digits.slice(4, 7)} ${digits.slice(7)}`;
  if (digits.length === 11) return `${digits.slice(0, 3)} ${digits.slice(3, 7)} ${digits.slice(7)}`;
  return digits;
}
