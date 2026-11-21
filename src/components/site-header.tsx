import Link from 'next/link';
import { getDictionary, t } from '@/lib/i18n';
import { getSettings } from '@/lib/settings';
import type { Locale } from '@/lib/types';
import LanguageSwitcher from './language-switcher';

export default async function SiteHeader({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);
  let storeName = 'originaldz';
  let whatsapp = '';
  try {
    const s = await getSettings();
    storeName = s.store_name || storeName;
    whatsapp = s.whatsapp;
  } catch {
    /* ignore */
  }

  const nav = [
    { href: '/', label: t(dict, 'nav.home') },
    { href: '/products', label: t(dict, 'nav.products') },
    { href: '/about', label: t(dict, 'nav.about') },
    { href: '/faq', label: t(dict, 'nav.faq') },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4">
        <Link href="/" className="flex items-center gap-2">
          <img src="/logo.svg" alt={storeName} className="h-9 w-9 rounded-xl" />
          <span className="text-lg font-extrabold text-brand-800">{storeName}</span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-lg px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          {whatsapp ? (
            <a
              href={`https://wa.me/${whatsapp.replace(/\D/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden rounded-full bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700 sm:block"
            >
              WhatsApp
            </a>
          ) : null}
          <LanguageSwitcher locale={locale} />
        </div>
      </div>
    </header>
  );
}
