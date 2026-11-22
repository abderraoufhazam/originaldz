import Link from 'next/link';
import { getLocale } from '@/lib/locale';
import { getDictionary, t } from '@/lib/i18n';
import { getSettings } from '@/lib/settings';
import { getSupabase } from '@/lib/supabase';
import type { Product } from '@/lib/types';
import ProductCard from '@/components/product-card';

export const dynamic = 'force-dynamic';

async function getProducts(): Promise<Product[]> {
  try {
    const sb = getSupabase();
    const { data } = await sb
      .from('products')
      .select('*')
      .eq('active', true)
      .order('featured', { ascending: false })
      .order('created_at', { ascending: false });
    return (data as Product[]) ?? [];
  } catch {
    return [];
  }
}

const FEATURES = [
  { icon: '💵', title_ar: 'الدفع عند الاستلام', title_en: 'Cash on delivery', title_fr: 'Paiement à la livraison' },
  { icon: '🚚', title_ar: 'توصيل سريع', title_en: 'Fast delivery', title_fr: 'Livraison rapide' },
  { icon: '✅', title_ar: 'منتجات أصلية', title_en: 'Genuine products', title_fr: 'Produits authentiques' },
  { icon: '📞', title_ar: 'دعم مباشر', title_en: 'Direct support', title_fr: 'Support direct' },
];

export default async function HomePage() {
  const locale = getLocale();
  const dict = getDictionary(locale);
  const products = await getProducts();
  const featured = products.filter((p) => p.featured);
  const list = featured.length > 0 ? featured : products.slice(0, 8);

  let tagline = t(dict, 'hero.seeProducts');
  try {
    const s = await getSettings();
    tagline = locale === 'ar' ? s.tagline_ar : locale === 'fr' ? s.tagline_fr : s.tagline_en;
  } catch {
    /* ignore */
  }

  const featureTitle = (f: (typeof FEATURES)[number]) =>
    locale === 'ar' ? f.title_ar : locale === 'fr' ? f.title_fr : f.title_en;

  return (
    <div>
      {/* Announcement bar */}
      <div className="bg-ink-900 py-2 text-center text-xs font-semibold text-amber-400">
        {t(dict, 'common.cod')} ✓ · {t(dict, 'common.freeDelivery')} ✓ · {t(dict, 'common.orderNow')}
      </div>

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-ink-950 via-brand-950 to-brand-800 text-white">
        <div className="pointer-events-none absolute -top-24 start-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-brand-500/30 blur-3xl" />
        <div className="mx-auto max-w-6xl px-4 py-24 text-center">
          <h1 className="text-4xl font-extrabold leading-tight md:text-6xl">
            <span className="text-gradient">originaldz</span>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-slate-300 md:text-xl">{tagline}</p>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/products"
              className="rounded-full bg-gradient-to-r from-amber-500 to-amber-600 px-9 py-3.5 text-base font-extrabold text-white shadow-lift transition hover:brightness-110"
            >
              {t(dict, 'hero.cta')}
            </Link>
            <Link
              href="/products"
              className="rounded-full border border-white/25 px-7 py-3.5 text-base font-bold text-white transition hover:bg-white/10"
            >
              {t(dict, 'hero.seeProducts')}
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-b border-slate-100 bg-white">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-4 px-4 py-8 md:grid-cols-4">
          {FEATURES.map((f) => (
            <div key={f.title_en} className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50/60 px-4 py-4">
              <span className="text-2xl">{f.icon}</span>
              <span className="text-sm font-bold text-slate-700">{featureTitle(f)}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Featured products */}
      <section className="mx-auto max-w-6xl px-4 py-14">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-extrabold text-slate-900 md:text-3xl">{t(dict, 'home.featured')}</h2>
            <div className="mt-2 h-1 w-16 rounded-full bg-gradient-to-r from-brand-500 to-amber-500" />
          </div>
          <Link href="/products" className="text-sm font-bold text-brand-600 hover:text-brand-700">
            {t(dict, 'common.seeAll')} →
          </Link>
        </div>

        {list.length === 0 ? (
          <p className="mt-8 text-slate-500">{t(dict, 'home.noProducts')}</p>
        ) : (
          <div className="mt-8 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
            {list.map((p) => (
              <ProductCard key={p.id} product={p} locale={locale} />
            ))}
          </div>
        )}
      </section>

      {/* Why us */}
      <section className="bg-gradient-to-br from-brand-950 to-ink-950 py-16 text-white">
        <div className="mx-auto max-w-6xl px-4 text-center">
          <h2 className="text-2xl font-extrabold md:text-3xl">{t(dict, 'about.title')}</h2>
          <p className="mx-auto mt-4 max-w-2xl text-slate-300">{tagline}</p>
          <Link
            href="/products"
            className="mt-8 inline-block rounded-full bg-amber-500 px-8 py-3 font-extrabold text-ink-950 transition hover:bg-amber-400"
          >
            {t(dict, 'hero.cta')}
          </Link>
        </div>
      </section>
    </div>
  );
}
