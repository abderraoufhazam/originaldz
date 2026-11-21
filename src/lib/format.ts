import type { Locale } from './types';

export function formatPrice(dzd: number, locale: Locale): string {
  const unit = locale === 'ar' ? 'دج' : locale === 'fr' ? 'DA' : 'DZD';
  return `${Math.round(dzd)} ${unit}`;
}

/** Normalize an Algerian mobile number: strip non-digits, keep leading 0. */
export function normalizePhone(input: string): string {
  const digits = input.replace(/\D/g, '');
  // Accept 10 digits with leading 0, or 9 digits without it.
  if (digits.length === 10 && digits[0] === '0') return digits;
  if (digits.length === 9 && ['5', '6', '7'].includes(digits[0])) return `0${digits}`;
  if (digits.length === 12 && digits.startsWith('213')) return `0${digits.slice(3)}`;
  return '';
}

export function isValidAlgerianPhone(input: string): boolean {
  const p = normalizePhone(input);
  return p.length === 10 && ['05', '06', '07'].includes(p.slice(0, 2));
}
