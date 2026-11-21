import Link from 'next/link';
import { getDictionary, t } from '@/lib/i18n';
import type { Locale } from '@/lib/types';

export default function SiteFooter({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);
  return (
    <footer className="border-t border-slate-200 bg-slate-50">
      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <div className="text-sm font-semibold text-slate-700">originaldz</div>
          <nav className="flex flex-wrap items-center justify-center gap-4 text-sm text-slate-600">
            <Link href="/about" className="hover:text-brand-700">{t(dict, 'footer.about')}</Link>
            <Link href="/privacy" className="hover:text-brand-700">{t(dict, 'footer.privacy')}</Link>
            <Link href="/faq" className="hover:text-brand-700">{t(dict, 'footer.faq')}</Link>
          </nav>
        </div>
        <p className="mt-4 text-center text-xs text-slate-400">
          © {new Date().getFullYear()} originaldz — {t(dict, 'footer.rights')}
        </p>
      </div>
    </footer>
  );
}
