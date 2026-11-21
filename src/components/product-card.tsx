import Link from 'next/link';
import { getDictionary, t } from '@/lib/i18n';
import { formatPrice } from '@/lib/format';
import { firstImage, productTitle } from '@/lib/product';
import type { Locale, Product } from '@/lib/types';

export default function ProductCard({ product, locale }: { product: Product; locale: Locale }) {
  const dict = getDictionary(locale);
  const title = productTitle(product, locale);
  const out = product.stock <= 0;

  return (
    <Link
      href={`/products/${product.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white transition hover:-translate-y-0.5 hover:shadow-lg"
    >
      <div className="relative aspect-square overflow-hidden bg-slate-100">
        <img
          src={firstImage(product)}
          alt={title}
          loading="lazy"
          className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
        />
        {out ? (
          <span className="absolute top-3 start-3 rounded-full bg-slate-800 px-3 py-1 text-xs font-bold text-white">
            {t(dict, 'product.outOfStock')}
          </span>
        ) : product.stock <= 5 ? (
          <span className="absolute top-3 start-3 rounded-full bg-red-500 px-3 py-1 text-xs font-bold text-white">
            {t(dict, 'product.stockLeft', { n: product.stock })}
          </span>
        ) : null}
        {product.compare_at_price && product.compare_at_price > product.price ? (
          <span className="absolute top-3 end-3 rounded-full bg-accent-500 px-2 py-1 text-xs font-bold text-white">
            -{Math.round((1 - product.price / product.compare_at_price) * 100)}%
          </span>
        ) : null}
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <h3 className="line-clamp-2 text-sm font-bold text-slate-900">{title}</h3>
        <div className="mt-auto flex items-baseline gap-2">
          <span className="text-lg font-extrabold text-brand-800">{formatPrice(product.price, locale)}</span>
          {product.compare_at_price && product.compare_at_price > product.price ? (
            <span className="text-xs text-slate-400 line-through">
              {formatPrice(product.compare_at_price, locale)}
            </span>
          ) : null}
        </div>
        <span className="mt-1 inline-flex w-fit items-center gap-1 text-xs font-semibold text-brand-700">
          {t(dict, 'common.orderNow')} →
        </span>
      </div>
    </Link>
  );
}
