import { getLocale } from '@/lib/locale';
import { getDictionary, t } from '@/lib/i18n';
import { getSupabase } from '@/lib/supabase';
import type { Product } from '@/lib/types';
import ProductCard from '@/components/product-card';

export const dynamic = 'force-dynamic';

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: { q?: string; category?: string };
}) {
  const locale = getLocale();
  const dict = getDictionary(locale);
  const q = (searchParams.q ?? '').trim();
  const category = (searchParams.category ?? '').trim();

  let products: Product[] = [];
  try {
    const sb = getSupabase();
    const { data } = await sb
      .from('products')
      .select('*')
      .eq('active', true)
      .order('created_at', { ascending: false });
    products = (data as Product[]) ?? [];
  } catch {
    products = [];
  }

  if (q) {
    const needle = q.toLowerCase();
    products = products.filter((p) =>
      [p.title_ar, p.title_en, p.title_fr, p.description_ar, p.description_en, p.description_fr]
        .join(' ')
        .toLowerCase()
        .includes(needle),
    );
  }
  if (category) {
    products = products.filter((p) => p.category === category);
  }

  const categories = Array.from(
    new Set(products.map((p) => p.category).filter((c): c is string => Boolean(c))),
  );

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-extrabold text-slate-900">{t(dict, 'catalog.title')}</h1>
        <form method="GET" className="flex w-full gap-2 sm:w-72">
          <input
            type="search"
            name="q"
            defaultValue={q}
            placeholder={t(dict, 'catalog.search')}
            className="w-full rounded-xl border border-slate-300 px-4 py-2 outline-none focus:border-brand-600"
          />
        </form>
      </div>

      {categories.length > 0 ? (
        <div className="mt-4 flex flex-wrap gap-2">
          <a
            href="/products"
            className={`rounded-full px-4 py-1.5 text-sm font-semibold ${
              !category ? 'bg-brand-800 text-white' : 'bg-slate-100 text-slate-700'
            }`}
          >
            {t(dict, 'home.all')}
          </a>
          {categories.map((c) => (
            <a
              key={c}
              href={`/products?category=${encodeURIComponent(c)}`}
              className={`rounded-full px-4 py-1.5 text-sm font-semibold ${
                category === c ? 'bg-brand-800 text-white' : 'bg-slate-100 text-slate-700'
              }`}
            >
              {c}
            </a>
          ))}
        </div>
      ) : null}

      {products.length === 0 ? (
        <p className="mt-10 text-slate-500">{t(dict, 'catalog.empty')}</p>
      ) : (
        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} locale={locale} />
          ))}
        </div>
      )}
    </div>
  );
}
