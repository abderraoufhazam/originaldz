import Link from 'next/link';
import { getLocale } from '@/lib/locale';
import { getDictionary, t } from '@/lib/i18n';
import { getSettings } from '@/lib/settings';
import { getSupabase } from '@/lib/supabase';
import type { Product } from '@/lib/types';
import ProductCard from '@/components/product-card';
import Reveal from '@/components/reveal';

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
  { title_ar: 'الدفع عند الاستلام', title_en: 'Cash on delivery', title_fr: 'Paiement à la livraison', icon: 'banknote' },
  { title_ar: 'توصيل سريع', title_en: 'Fast delivery', title_fr: 'Livraison rapide', icon: 'truck' },
  { title_ar: 'منتجات أصلية', title_en: 'Genuine products', title_fr: 'Produits authentiques', icon: 'gem' },
  { title_ar: 'دعم مباشر', title_en: 'Direct support', title_fr: 'Support direct', icon: 'chat' },
];

function FeatureIcon({ name }: { name: string }) {
  const common = { width: 26, height: 26, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.7, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };
  if (name === 'truck') {
    return (
      <svg {...common}>
        <path d="M1 8h13v8H1z" />
        <path d="M14 11h4l3 3v2h-7" />
        <circle cx="6" cy="18" r="1.6" />
        <circle cx="18" cy="18" r="1.6" />
      </svg>
    );
  }
  if (name === 'gem') {
    return (
      <svg {...common}>
        <path d="M6 3h12l4 6-10 12L2 9z" />
        <path d="M2 9h20M9 3l-3 6 6 12M15 3l3 6-6 12" />
      </svg>
    );
  }
  if (name === 'chat') {
    return (
      <svg {...common}>
        <path d="M21 12a8 8 0 0 1-8 8H4l2-3a8 8 0 1 1 15-5z" />
      </svg>
    );
  }
  return (
    <svg {...common}>
      <rect x="2" y="6" width="20" height="12" rx="2" />
      <circle cx="12" cy="12" r="2.6" />
      <path d="M6 12h.01M18 12h.01" />
    </svg>
  );
}

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
      <div className="bg-jewel-gradient py-2 text-center text-xs font-semibold text-accent-300">
        {t(dict, 'common.cod')} ✓ · {t(dict, 'common.freeDelivery')} ✓ · {t(dict, 'common.orderNow')}
      </div>

      {/* Hero */}
      <section className="jewel-facets-dark relative overflow-hidden bg-jewel-gradient text-white">
        <div className="pointer-events-none absolute -top-24 start-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-brand-500/25 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 -end-20 h-64 w-64 rounded-full bg-accent-500/20 blur-3xl" />
        <div className="mx-auto max-w-6xl px-4 py-24 text-center">
          <Reveal>
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 shadow-jewel backdrop-blur">
              <img src="/monogram.svg" alt="originaldz" className="h-14 w-14 rounded-2xl" />
            </div>
            <h1 className="font-display text-5xl font-extrabold leading-tight tracking-tight md:text-7xl">
              <span className="text-gradient">originaldz</span>
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-lg text-white/80 md:text-xl">{tagline}</p>
            <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/products"
                className="shimmer rounded-full bg-copper-gradient px-9 py-3.5 text-base font-extrabold text-white shadow-lift transition hover:brightness-110"
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
          </Reveal>
        </div>
      </section>

      {/* Features */}
      <section className="border-b border-brand-100">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-4 px-4 py-8 md:grid-cols-4">
          {FEATURES.map((f) => (
            <Reveal key={f.title_en} delay={80}>
              <div className="flex items-center gap-3 rounded-2xl border border-brand-100 bg-white/70 px-4 py-4 shadow-soft backdrop-blur">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
                  <FeatureIcon name={f.icon} />
                </span>
                <span className="text-sm font-bold text-ink-900">{featureTitle(f)}</span>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Featured products */}
      <section className="mx-auto max-w-6xl px-4 py-14">
        <Reveal>
          <div className="flex items-end justify-between">
            <div>
              <h2 className="font-display text-3xl font-extrabold text-ink-900 md:text-4xl">{t(dict, 'home.featured')}</h2>
              <div className="mt-2 flex items-center gap-1">
                <span className="h-1 w-14 rounded-full bg-copper-gradient" />
                <span className="h-1 w-3 rounded-full bg-brand-300" />
              </div>
            </div>
            <Link href="/products" className="text-sm font-bold text-brand-700 transition hover:text-accent-600">
              {t(dict, 'common.seeAll')} →
            </Link>
          </div>
        </Reveal>

        {list.length === 0 ? (
          <p className="mt-8 text-slate-500">{t(dict, 'home.noProducts')}</p>
        ) : (
          <div className="mt-8 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
            {list.map((p, i) => (
              <Reveal key={p.id} delay={(i % 4) * 70} className="h-full">
                <ProductCard product={p} locale={locale} />
              </Reveal>
            ))}
          </div>
        )}
      </section>

      {/* Why us */}
      <section className="jewel-facets-dark relative overflow-hidden bg-jewel-gradient py-16 text-white">
        <div className="mx-auto max-w-6xl px-4 text-center">
          <Reveal>
            <span className="inline-flex items-center gap-2 text-accent-400">
              <span className="h-px w-8 bg-accent-400/60" />◆<span className="h-px w-8 bg-accent-400/60" />
            </span>
            <h2 className="font-display mt-3 text-3xl font-extrabold md:text-4xl">{t(dict, 'about.title')}</h2>
            <p className="mx-auto mt-4 max-w-2xl text-white/70">{tagline}</p>
            <Link
              href="/products"
              className="mt-8 inline-block rounded-full bg-copper-gradient px-8 py-3 font-extrabold text-white shadow-lift transition hover:brightness-110"
            >
              {t(dict, 'hero.cta')}
            </Link>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
