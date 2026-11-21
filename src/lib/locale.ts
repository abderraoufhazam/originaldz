import { cookies } from 'next/headers';
import { DEFAULT_LOCALE, LOCALES, type Locale } from './types';

export function getLocale(): Locale {
  const value = cookies().get('locale')?.value as Locale | undefined;
  return value && LOCALES.includes(value) ? value : DEFAULT_LOCALE;
}
