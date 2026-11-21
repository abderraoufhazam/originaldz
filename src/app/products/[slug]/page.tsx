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
import Gallery from '@/components/gallery';

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

function TrustBadge({ icon, children }: { icon: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
      <span className="text-lg leading-none">{icon}</span>
      <span className="text-xs font-semibold text-slate-700">{children}</span>
    </div>
  );
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
  const lowStock = !out && product.stock <= 5;
  const onSale = Boolean(product.compare_at_price && product.compare_at_price > product.price);
  const save = onSale ? product.compare_at_price! - product.price : 0;
  const avgRating = testimonials.length
    ? Math.round(testimonials.reduce((s, r) => s + r.rating, 0) / testimonials.length)
    : 0;

  return (
    <div className="bg-slate-50">
      <div className="mx-auto max-w-6xl px-4 py-8">
        {/* Breadcrumb */}
        <nav className="mb-6 text-sm text-slate-500">
          <a href="/" className="hover:text-brand-700">{t(dict, 'nav.home')}</a>
          <span className="mx-2">/</span>
          <a href="/products" className="hover:text-brand-700">{t(dict, 'nav.products')}</a>
          <span className="mx-2">/</span>
          <span className="text-slate-700">{title}</span>
        </nav>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Gallery column */}
          <div>
            <div className="lg:sticky lg:top-24">
              <Gallery images={images} alt={title} />
              <div className="mt-4 grid grid-cols-3 gap-2">
                <TrustBadge icon="💵">{t(dict, 'common.cod')}</TrustBadge>
                <TrustBadge icon="🚚">World Express</TrustBadge>
                <TrustBadge icon="↩️">{t(dict, 'form.weCall')}</TrustBadge>
              </div>
            </div>
          </div>

          {/* Info + order form column */}
          <div>
            {product.category ? (
              <span className="inline-block rounded-full bg-brand-100 px-3 py-1 text-xs font-bold text-brand-800">
                {product.category}
              </span>
            ) : null}

            <h1 className="mt-2 text-2xl font-extrabold text-slate-900 md:text-3xl">{title}</h1>

            <div className="mt-3 flex items-center gap-3">
              {avgRating > 0 ? (
                <span className="text-sm text-amber-500">
                  {'★'.repeat(avgRating)}
                  {'☆'.repeat(5 - avgRating)}
                </span>
              ) : null}
              {testimonials.length > 0 ? (
                <span className="text-sm text-slate-500">
                  {testimonials.length} {t(dict, 'product.reviews')}
                </span>
              ) : null}
            </div>

            {/* Price block */}
            <div className="mt-4 flex flex-wrap items-end gap-3">
              <span className="text-4xl font-extrabold text-brand-800">{formatPrice(product.price, locale)}</span>
              {onSale ? (
                <>
                  <span className="text-xl text-slate-400 line-through">
                    {formatPrice(product.compare_at_price!, locale)}
                  </span>
                  <span className="rounded-full bg-accent-500 px-3 py-1 text-sm font-extrabold text-white">
                    −{Math.round((save / product.compare_at_price!) * 100)}%
                  </span>
                </>
              ) : null}
            </div>
            {onSale ? (
              <p className="mt-1 text-sm font-semibold text-accent-600">
                {t(dict, 'product.youSave', { n: formatPrice(save, locale) })}
              </p>
            ) : null}

            {/* Stock */}
            <div className="mt-4">
              {out ? (
                <span className="inline-block rounded-xl bg-slate-200 px-4 py-2 font-bold text-slate-700">
                  {t(dict, 'product.outOfStock')}
                </span>
              ) : lowStock ? (
                <span className="inline-block rounded-xl bg-red-50 px-4 py-2 text-sm font-bold text-red-600">
                  🔥 {t(dict, 'product.stockLeft', { n: product.stock })}
                </span>
              ) : (
                <span className="inline-flex items-center gap-2 text-sm font-semibold text-green-700">
                  <span className="h-2 w-2 rounded-full bg-green-500" />
                  {t(dict, 'common.cod')}
                </span>
              )}
            </div>

            {/* Bundle */}
            {product.bundle_min > 0 && product.bundle_discount > 0 ? (
              <div className="mt-4 rounded-2xl border border-brand-200 bg-brand-50 px-4 py-3 text-sm font-semibold text-brand-800">
                🎉 {t(dict, 'product.bundleNote', { p: product.bundle_discount, n: product.bundle_min })}
              </div>
            ) : null}

            {/* Description */}
            {desc ? (
              <div className="mt-5">
                <h2 className="text-lg font-bold text-slate-900">{t(dict, 'product.description')}</h2>
                <p className="mt-2 whitespace-pre-line leading-relaxed text-slate-600">{desc}</p>
              </div>
            ) : null}

            {/* Order form */}
            <div className="mt-6">
              {!out ? (
                <OrderForm product={product} wilayas={WILAYAS} locale={locale} />
              ) : (
                <div className="rounded-2xl border border-slate-200 p-6 text-center font-semibold text-slate-500">
                  {t(dict, 'product.outOfStock')}
                </div>
              )}
            </div>

            <div className="mt-4 flex items-center justify-between">
              <ShareButton locale={locale} title={title} />
              <span className="text-xs text-slate-400">originaldz</span>
            </div>
          </div>
        </div>

        {/* Reviews */}
        <section className="mt-12">
          <h2 className="text-xl font-extrabold text-slate-900">{t(dict, 'product.reviews')}</h2>
          {testimonials.length === 0 ? (
            <p className="mt-3 text-sm text-slate-500">{t(dict, 'home.noProducts')}</p>
          ) : (
            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {testimonials.map((r) => (
                <div key={r.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">{r.customer_name}</span>
                    <span className="text-sm text-amber-500">{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</span>
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">{ratingText(r, locale)}</p>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
