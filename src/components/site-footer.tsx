import Link from 'next/link';
import { getDictionary, t } from '@/lib/i18n';
import type { Locale } from '@/lib/types';

export default function SiteFooter({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);
  return (
    <footer className="bg-jewel-gradient text-white">
      <div className="jewel-facets-dark">
        <div className="mx-auto max-w-6xl px-4 py-12">
          <div className="flex flex-col items-center gap-6 text-center md:flex-row md:items-start md:justify-between md:text-start">
            <div className="flex flex-col items-center gap-3 md:items-start">
              <div className="flex items-center gap-2.5">
                <img src="/monogram.svg" alt="originaldz" className="h-10 w-10 rounded-xl" />
                <span className="font-display text-xl font-bold text-white">originaldz</span>
              </div>
              <p className="text-sm text-white/55">{t(dict, 'common.cod')} · {t(dict, 'common.freeDelivery')}</p>
            </div>
            <nav className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm text-white/80">
              <Link href="/about" className="transition hover:text-accent-300">{t(dict, 'footer.about')}</Link>
              <Link href="/returns" className="transition hover:text-accent-300">سياسة الاستبدال</Link>
              <Link href="/privacy" className="transition hover:text-accent-300">{t(dict, 'footer.privacy')}</Link>
              <Link href="/faq" className="transition hover:text-accent-300">{t(dict, 'footer.faq')}</Link>
              <Link href="/contact" className="transition hover:text-accent-300">{t(dict, 'nav.contact')}</Link>
            </nav>
          </div>
          <div className="mt-8 flex items-center justify-center gap-3 border-t border-white/10 pt-5">
            <span className="text-accent-400">◆</span>
            <p className="text-center text-xs text-white/40">
              © {new Date().getFullYear()} originaldz — {t(dict, 'footer.rights')}
            </p>
            <span className="text-accent-400">◆</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
