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

  return (
    <div>
      <section className="bg-gradient-to-br from-brand-800 to-brand-600 text-white">
        <div className="mx-auto max-w-6xl px-4 py-20 text-center">
          <h1 className="text-4xl font-extrabold md:text-5xl">originaldz</h1>
          <p className="mx-auto mt-4 max-w-xl text-lg text-white/90">{tagline}</p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/products"
              className="rounded-full bg-accent-500 px-8 py-3 font-bold text-white hover:bg-accent-600"
            >
              {t(dict, 'hero.cta')}
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12">
        <h2 className="text-2xl font-extrabold text-slate-900">{t(dict, 'home.featured')}</h2>
        {list.length === 0 ? (
          <p className="mt-6 text-slate-500">{t(dict, 'home.noProducts')}</p>
        ) : (
          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {list.map((p) => (
              <ProductCard key={p.id} product={p} locale={locale} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
