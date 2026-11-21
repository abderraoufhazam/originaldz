import { getLocale } from '@/lib/locale';
import { getDictionary, faqs, t } from '@/lib/i18n';

export const dynamic = 'force-dynamic';

export default function FaqPage() {
  const locale = getLocale();
  const dict = getDictionary(locale);
  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="text-3xl font-extrabold text-slate-900">{t(dict, 'faq.title')}</h1>
      <div className="mt-6 space-y-4">
        {faqs[locale].map((item, i) => (
          <details key={i} className="rounded-2xl border border-slate-200 bg-white p-4">
            <summary className="cursor-pointer font-bold text-slate-900">{item.q}</summary>
            <p className="mt-2 text-slate-600">{item.a}</p>
          </details>
        ))}
      </div>
    </div>
  );
}
