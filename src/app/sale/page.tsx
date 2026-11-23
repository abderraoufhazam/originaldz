import { getLocale } from '@/lib/locale';
import { getSupabase } from '@/lib/supabase';
import type { Product } from '@/lib/types';
import ProductCard from '@/components/product-card';
import Countdown from '@/components/countdown';

export const dynamic = 'force-dynamic';

export default async function SalePage() {
  const locale = getLocale();
  const sb = getSupabase();
  const { data } = await sb.from('products').select('*').eq('active', true);
  const products = ((data ?? []) as Product[]).filter(
    (p) => p.compare_at_price && p.compare_at_price > p.price,
  );

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="text-center">
        <h1 className="text-3xl font-extrabold text-slate-900">🔥 العروض والتخفيضات</h1>
        <p className="mt-3 text-slate-500">
          ينتهي العرض خلال <Countdown />
        </p>
      </div>

      {products.length === 0 ? (
        <p className="mt-8 text-center text-slate-500">لا توجد عروض حالية.</p>
      ) : (
        <div className="mt-8 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} locale={locale} />
          ))}
        </div>
      )}
    </div>
  );
}
