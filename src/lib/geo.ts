import wilayas from '@data/wilayas.json';
import communes from '@data/communes.json';
import type { Commune, Locale, Wilaya } from './types';

export const WILAYAS: Wilaya[] = wilayas.map((w) => ({
  code: w.code,
  name: w.name,
  nameAr: w.nameAr,
}));

export const COMMUNES: Commune[] = communes.map((c) => ({
  wilayaCode: c.wilayaCode,
  name: c.name,
  nameAr: c.nameAr,
}));

export function wilayaName(w: Wilaya, locale: Locale): string {
  return locale === 'ar' ? w.nameAr : w.name;
}

export function communeName(c: Commune, locale: Locale): string {
  return locale === 'ar' ? c.nameAr : c.name;
}

export function getWilaya(code: number): Wilaya | undefined {
  return WILAYAS.find((w) => w.code === code);
}

export function communesOf(code: number): Commune[] {
  return COMMUNES.filter((c) => c.wilayaCode === code);
}
