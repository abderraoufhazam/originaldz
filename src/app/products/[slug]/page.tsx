import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getLocale } from '@/lib/locale';
import { getDictionary, t } from '@/lib/i18n';
import { getSupabase } from '@/lib/supabase';
import { WILAYAS } from '@/lib/geo';
import { formatPrice } from '@/lib/format';
import { firstImage, productDescription, productTitle } from '@/lib/product';
import type { Product, Testimonial } from '@/lib/types';
import OrderForm from '@/components/order-form';
import ShareButton from '@/components/share-button';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  let title = 'originaldz';
  try {
    const sb = getSupabase();
    const { data } = await sb.from('products').select('*').eq('slug', params.slug).single();
    if (data) title = productTitle(data as Product, 'ar');
  } catch {
    /* ignore */
  }
  return { title, alternates: { canonical: `/products/${params.slug}` } };
}

function ratingText(p: Testimonial, locale: 'ar' | 'en' | 'fr') {
  return locale === 'ar' ? p.text_ar : locale === 'fr' ? p.text_fr : p.text_en;
}

export default async function ProductPage({ params }: { params: { slug: string } }) {
  const locale = getLocale();
  const dict = getDictionary(locale);

  let product: Product | null = null;
  let testimonials: Testimonial[] = [];
  try {
    const sb = getSupabase();
    const { data } = await sb.from('products').select('*').eq('slug', params.slug).eq('active', true).single();
    if (data) {
      product = data as Product;
      const rev = await sb
        .from('testimonials')
        .select('*')
        .eq('product_id', product.id)
        .eq('active', true)
        .order('created_at', { ascending: false });
      testimonials = (rev.data as Testimonial[]) ?? [];
    }
  } catch {
    product = null;
  }

  if (!product) notFound();

  const title = productTitle(product, locale);
  const desc = productDescription(product, locale);
  const images = product.images?.length ? product.images : ['/placeholder.svg'];
  const out = product.stock <= 0;

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="grid gap-8 lg:grid-cols-2">
        {/* Gallery */}
        <div>
          <div className="overflow-hidden rounded-2xl border border-slate-200">
            <img src={images[0]} alt={title} className="aspect-square w-full object-cover" />
          </div>
          {images.length > 1 ? (
            <div className="mt-3 grid grid-cols-4 gap-2">
              {images.map((img, i) => (
                <img key={i} src={img} alt="" className="aspect-square w-full rounded-xl object-cover" />
              ))}
            </div>
          ) : null}
        </div>

        {/* Info */}
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 md:text-3xl">{title}</h1>

          <div className="mt-4 flex flex-wrap items-center gap-3">
            <span className="text-3xl font-extrabold text-brand-800">{formatPrice(product.price, locale)}</span>
            {product.compare_at_price && product.compare_at_price > product.price ? (
              <>
                <span className="text-lg text-slate-400 line-through">
                  {formatPrice(product.compare_at_price, locale)}
                </span>
                <span className="rounded-full bg-accent-500 px-3 py-1 text-sm font-bold text-white">
                  {t(dict, 'product.youSave', {
                    n: formatPrice(product.compare_at_price - product.price, locale),
                  })}
                </span>
              </>
            ) : null}
          </div>

          {out ? (
            <p className="mt-3 rounded-xl bg-slate-100 px-4 py-3 font-bold text-slate-700">
              {t(dict, 'product.outOfStock')}
            </p>
          ) : product.stock <= 5 ? (
            <p className="mt-3 rounded-xl bg-red-50 px-4 py-3 text-sm font-bold text-red-600">
              {t(dict, 'product.stockLeft', { n: product.stock })}
            </p>
          ) : null}

          {product.bundle_min > 0 && product.bundle_discount > 0 ? (
            <p className="mt-3 rounded-xl bg-brand-50 px-4 py-3 text-sm font-semibold text-brand-800">
              🎉 {t(dict, 'product.bundleNote', { p: product.bundle_discount, n: product.bundle_min })}
            </p>
          ) : null}

          <div className="mt-4 flex items-center gap-2">
            <ShareButton locale={locale} title={title} />
          </div>

          {desc ? (
            <div className="mt-6">
              <h2 className="text-lg font-bold text-slate-900">{t(dict, 'product.description')}</h2>
              <p className="mt-2 whitespace-pre-line text-slate-600">{desc}</p>
            </div>
          ) : null}
        </div>
      </div>

      {/* Order form */}
      <div className="mt-10 grid gap-8 lg:grid-cols-2">
        {!out ? (
          <div className="lg:order-1">
            <OrderForm product={product} wilayas={WILAYAS} locale={locale} />
          </div>
        ) : (
          <div className="lg:order-1 rounded-2xl border border-slate-200 p-6 text-center text-slate-500">
            {t(dict, 'product.outOfStock')}
          </div>
        )}

        {/* Reviews */}
        <div className="lg:order-2">
          <h2 className="text-lg font-bold text-slate-900">{t(dict, 'product.reviews')}</h2>
          {testimonials.length === 0 ? (
            <p className="mt-2 text-sm text-slate-500">{t(dict, 'home.noProducts')}</p>
          ) : (
            <ul className="mt-4 space-y-3">
              {testimonials.map((r) => (
                <li key={r.id} className="rounded-2xl border border-slate-200 p-4">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">{r.customer_name}</span>
                    <span className="text-sm text-amber-500">{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</span>
                  </div>
                  <p className="mt-1 text-sm text-slate-600">{ratingText(r, locale)}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
