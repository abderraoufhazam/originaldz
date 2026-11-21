import type { Locale, Product } from './types';

export function productTitle(p: Product, locale: Locale): string {
  if (locale === 'ar') return p.title_ar || p.title_en || p.title_fr;
  if (locale === 'fr') return p.title_fr || p.title_en || p.title_ar;
  return p.title_en || p.title_fr || p.title_ar;
}

export function productDescription(p: Product, locale: Locale): string {
  if (locale === 'ar') return p.description_ar || p.description_en || p.description_fr;
  if (locale === 'fr') return p.description_fr || p.description_en || p.description_ar;
  return p.description_en || p.description_fr || p.description_ar;
}

export function firstImage(p: Product): string {
  return p.images && p.images.length > 0 ? p.images[0] : '/placeholder.svg';
}
