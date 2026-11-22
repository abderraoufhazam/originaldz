import Link from 'next/link';
import { getDictionary, t } from '@/lib/i18n';
import { formatPrice } from '@/lib/format';
import { firstImage, productTitle } from '@/lib/product';
import type { Locale, Product } from '@/lib/types';

export default function ProductCard({ product, locale }: { product: Product; locale: Locale }) {
  const dict = getDictionary(locale);
  const title = productTitle(product, locale);
  const out = product.stock <= 0;
  const lowStock = !out && product.stock <= 5;
  const onSale = Boolean(product.compare_at_price && product.compare_at_price > product.price);

  return (
    <Link
      href={`/products/${product.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-soft transition duration-300 hover:-translate-y-1 hover:shadow-lift"
    >
      <div className="relative aspect-square overflow-hidden bg-slate-100">
        <img
          src={firstImage(product)}
          alt={title}
          loading="lazy"
          className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-x-0 top-0 flex items-start justify-between p-3">
          {out ? (
            <span className="rounded-full bg-slate-900/85 px-3 py-1 text-xs font-bold text-white">
              {t(dict, 'product.outOfStock')}
            </span>
          ) : lowStock ? (
            <span className="rounded-full bg-rose-500 px-3 py-1 text-xs font-bold text-white">
              {t(dict, 'product.stockLeft', { n: product.stock })}
            </span>
          ) : (
            <span className="rounded-full bg-emerald-500/90 px-3 py-1 text-xs font-bold text-white">
              {t(dict, 'common.cod')}
            </span>
          )}
          {onSale ? (
            <span className="rounded-full bg-amber-500 px-2.5 py-1 text-xs font-extrabold text-white">
              −{Math.round((1 - product.price / product.compare_at_price!) * 100)}%
            </span>
          ) : null}
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <h3 className="line-clamp-2 text-sm font-bold text-slate-900">{title}</h3>
        <div className="mt-auto flex items-baseline gap-2">
          <span className="text-lg font-extrabold text-brand-700">{formatPrice(product.price, locale)}</span>
          {onSale ? (
            <span className="text-xs text-slate-400 line-through">
              {formatPrice(product.compare_at_price!, locale)}
            </span>
          ) : null}
        </div>
        <span className="inline-flex w-fit items-center gap-1 rounded-full bg-brand-50 px-3 py-1 text-xs font-bold text-brand-700 transition group-hover:bg-brand-600 group-hover:text-white">
          {t(dict, 'common.orderNow')} →
        </span>
      </div>
    </Link>
  );
}
