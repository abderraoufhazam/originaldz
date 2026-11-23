'use client';

import { useEffect, useState } from 'react';
import { getDictionary, t } from '@/lib/i18n';
import { isValidAlgerianPhone, formatPrice } from '@/lib/format';
import type { Commune, Locale, Office, Product, Wilaya } from '@/lib/types';

const name = (o: { nameAr: string; name: string }, locale: Locale) =>
  locale === 'ar' ? o.nameAr : o.name;

interface Props {
  product: Product;
  wilayas: Wilaya[];
  locale: Locale;
}

interface Result {
  orderNumber: string;
  total: number;
}

export default function OrderForm({ product, wilayas, locale }: Props) {
  const dict = getDictionary(locale);

  const [qty, setQty] = useState(1);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [deliveryType, setDeliveryType] = useState<'office' | 'home'>('home');
  const [wilaya, setWilaya] = useState<number | ''>('');
  const [officeId, setOfficeId] = useState('');
  const [commune, setCommune] = useState('');
  const [address, setAddress] = useState('');

  const [offices, setOffices] = useState<Office[]>([]);
  const [communes, setCommunes] = useState<Commune[]>([]);
  const [loadingGeo, setLoadingGeo] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<Result | null>(null);
  const [coupon, setCoupon] = useState('');
  const [prices, setPrices] = useState<Record<number, { office: number | null; home: number | null }>>({});

  useEffect(() => {
    fetch('/api/prices')
      .then((r) => r.json())
      .then((list: { wilaya_code: number; office_price: number | null; home_price: number | null }[]) => {
        const map: Record<number, { office: number | null; home: number | null }> = {};
        for (const p of list ?? []) map[p.wilaya_code] = { office: p.office_price, home: p.home_price };
        setPrices(map);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem('odz_phone');
    if (saved) setPhone(saved);
  }, []);

  // Load offices + communes for the selected wilaya.
  useEffect(() => {
    if (!wilaya) {
      setOffices([]);
      setCommunes([]);
      return;
    }
    let cancelled = false;
    setLoadingGeo(true);
    setOfficeId('');
    setCommune('');
    Promise.all([
      fetch(`/api/offices?wilaya=${wilaya}`).then((r) => r.json()).catch(() => []),
      fetch(`/api/communes?code=${wilaya}`).then((r) => r.json()).catch(() => []),
    ]).then(([o, c]) => {
      if (cancelled) return;
      setOffices(o ?? []);
      setCommunes(c ?? []);
      setLoadingGeo(false);
    });
    return () => {
      cancelled = true;
    };
  }, [wilaya]);

  const bundleActive = product.bundle_min > 0 && qty >= product.bundle_min;
  const bundlePercent = bundleActive ? product.bundle_discount : 0;
  const subtotal = product.price * qty;
  const discounted = bundlePercent ? Math.round(subtotal * (1 - bundlePercent / 100)) : subtotal;

  const priceInfo = wilaya ? prices[wilaya] : undefined;
  const deliveryFee =
    deliveryType === 'office' ? Number(priceInfo?.office ?? 0) : Number(priceInfo?.home ?? 0);
  const hasDeliveryFee = deliveryFee > 0;
  const total = discounted + deliveryFee;

  // A wilaya with no World Express office (office price is null) is home-delivery only.
  const officeAvailable = !wilaya || !priceInfo || priceInfo.office != null;

  useEffect(() => {
    if (wilaya && priceInfo && priceInfo.office == null) {
      setDeliveryType('home');
    }
  }, [wilaya, priceInfo]);

  const noOffice = deliveryType === 'office' && !loadingGeo && wilaya !== '' && offices.length === 0;

  function submit() {
    setError('');
    if (!firstName.trim() || !lastName.trim()) {
      setError(t(dict, 'form.required'));
      return;
    }
    if (!isValidAlgerianPhone(phone)) {
      setError(t(dict, 'form.phoneInvalid'));
      return;
    }
    if (!wilaya) {
      setError(t(dict, 'form.required'));
      return;
    }
    if (deliveryType === 'office' && !officeId) {
      setError(t(dict, 'form.required'));
      return;
    }
    if (deliveryType === 'home' && (!commune || !address.trim())) {
      setError(t(dict, 'form.required'));
      return;
    }

    setSubmitting(true);
    fetch('/api/order', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        product_id: product.id,
        quantity: qty,
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        phone,
        delivery_type: deliveryType,
        wilaya_code: wilaya,
        office_id: deliveryType === 'office' ? officeId : null,
        commune: deliveryType === 'home' ? commune : '',
        address: deliveryType === 'home' ? address.trim() : '',
        source: document.referrer || '',
        utm_source: new URLSearchParams(window.location.search).get('utm_source') || '',
        utm_medium: new URLSearchParams(window.location.search).get('utm_medium') || '',
        utm_campaign: new URLSearchParams(window.location.search).get('utm_campaign') || '',
        utm_content: new URLSearchParams(window.location.search).get('utm_content') || '',
        coupon,
      }),
    })
      .then(async (r) => {
        const data = await r.json().catch(() => ({}));
        if (!r.ok) {
          setError(
            data.error === 'duplicate'
              ? 'تم استلام طلبك بالفعل مؤخرًا — سنتصل بك للتأكيد.'
              : data.error === 'limit'
                ? 'وصلت للحد الأقصى من الطلبات اليوم — تواصل معنا عبر واتساب.'
                : data.error || 'error',
          );
          return;
        }
        window.dispatchEvent(new CustomEvent('odz:order', { detail: { total: data.total } }));
        setResult({ orderNumber: data.order_number, total: data.total });
        window.scrollTo({ top: 0, behavior: 'smooth' });
      })
      .catch(() => setError('network error'))
      .finally(() => setSubmitting(false));
  }

  const inputCls =
    'w-full rounded-xl border border-slate-300 px-4 py-2.5 outline-none focus:border-brand-600';

  if (result) {
    return (
      <div className="rounded-2xl border border-brand-200 bg-brand-50 p-6 text-center">
        <div className="text-4xl">✅</div>
        <h3 className="mt-2 text-xl font-extrabold text-brand-800">{t(dict, 'form.successTitle')}</h3>
        <p className="mt-2 text-sm text-slate-600">
          {t(dict, 'form.orderNumber')}: <span className="font-bold">{result.orderNumber}</span>
        </p>
        <p className="mt-1 text-sm font-bold text-slate-900">
          {t(dict, 'form.total')}: {formatPrice(result.total, locale)}
        </p>
        <p className="mt-3 text-sm text-slate-600">{t(dict, 'form.weCall')}</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h3 className="text-lg font-extrabold text-slate-900">{t(dict, 'common.orderNow')}</h3>
      <div className="mt-1 flex items-center gap-2 text-sm text-brand-700">
        <span>✓</span>
        <span>{t(dict, 'common.cod')}</span>
        <span className="text-slate-300">•</span>
        <span>🚚 World Express</span>
      </div>

      <div className="mt-5 space-y-4">
        {/* Quantity */}
        <div>
          <label className="mb-1 block text-sm font-semibold text-slate-700">
            {t(dict, 'product.quantity')}
          </label>
          <div className="flex w-fit items-center rounded-xl border border-slate-300">
            <button
              type="button"
              onClick={() => setQty((q) => Math.max(1, q - 1))}
              className="px-4 py-2 text-lg font-bold text-slate-600 hover:bg-slate-50"
              aria-label="-"
            >
              −
            </button>
            <span className="w-10 text-center text-lg font-bold">{qty}</span>
            <button
              type="button"
              onClick={() => setQty((q) => q + 1)}
              className="px-4 py-2 text-lg font-bold text-slate-600 hover:bg-slate-50"
              aria-label="+"
            >
              +
            </button>
          </div>
        </div>

        {/* Name */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="mb-1 block text-sm font-semibold text-slate-700">{t(dict, 'form.firstName')} *</label>
            <input value={firstName} onChange={(e) => setFirstName(e.target.value)} className={inputCls} />
          </div>
          <div>
            <label className="mb-1 block text-sm font-semibold text-slate-700">{t(dict, 'form.lastName')} *</label>
            <input value={lastName} onChange={(e) => setLastName(e.target.value)} className={inputCls} />
          </div>
        </div>

        {/* Phone */}
        <div>
          <label className="mb-1 block text-sm font-semibold text-slate-700">{t(dict, 'form.phone')} *</label>
          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder={t(dict, 'form.phonePlaceholder')}
            className={inputCls}
            inputMode="tel"
            dir="ltr"
          />
        </div>

        {/* Delivery type */}
        <div>
          <label className="mb-1 block text-sm font-semibold text-slate-700">{t(dict, 'form.deliveryType')} *</label>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            <button
              type="button"
              onClick={() => setDeliveryType('home')}
              className={`rounded-xl border p-3 text-sm font-semibold ${
                deliveryType === 'home' ? 'border-brand-600 bg-brand-50 text-brand-800' : 'border-slate-300 text-slate-700'
              }`}
            >
              🏠 {t(dict, 'form.home')}
            </button>
            <button
              type="button"
              onClick={() => setDeliveryType('office')}
              disabled={!officeAvailable}
              className={`rounded-xl border p-3 text-sm font-semibold ${
                deliveryType === 'office'
                  ? 'border-brand-600 bg-brand-50 text-brand-800'
                  : 'border-slate-300 text-slate-700'
              } ${!officeAvailable ? 'cursor-not-allowed opacity-40' : ''}`}
            >
              📍 {t(dict, 'form.office')}
            </button>
          </div>
          {!officeAvailable && wilaya ? (
            <p className="mt-2 rounded-xl bg-amber-50 p-3 text-sm font-semibold text-amber-700">
              📦 {t(dict, 'form.homeOnly')}
            </p>
          ) : null}
        </div>

        {/* Wilaya */}
        <div>
          <label className="mb-1 block text-sm font-semibold text-slate-700">{t(dict, 'form.wilaya')} *</label>
          <select
            value={wilaya}
            onChange={(e) => setWilaya(e.target.value ? Number(e.target.value) : '')}
            className={inputCls}
          >
            <option value="">{t(dict, 'form.selectWilaya')}</option>
            {wilayas.map((w) => (
              <option key={w.code} value={w.code}>
                {String(w.code).padStart(2, '0')} — {name(w, locale)}
              </option>
            ))}
          </select>
        </div>

        {noOffice ? (
          <p className="rounded-xl bg-amber-50 p-3 text-sm font-semibold text-amber-700">
            ⚠️ {t(dict, 'form.noOffice')}
          </p>
        ) : null}

        {/* Office */}
        {deliveryType === 'office' && wilaya !== '' && offices.length > 0 ? (
          <div>
            <label className="mb-1 block text-sm font-semibold text-slate-700">{t(dict, 'form.officeLabel')} *</label>
            <select value={officeId} onChange={(e) => setOfficeId(e.target.value)} className={inputCls}>
              <option value="">{t(dict, 'form.selectOffice')}</option>
              {offices.map((o) => (
                <option key={o.id} value={o.id}>
                  {locale === 'ar' ? o.name_ar : o.name_fr}
                </option>
              ))}
            </select>
          </div>
        ) : null}

        {/* Home: commune + address */}
        {deliveryType === 'home' ? (
          <>
            <div>
              <label className="mb-1 block text-sm font-semibold text-slate-700">{t(dict, 'form.commune')} *</label>
              <select
                value={commune}
                onChange={(e) => setCommune(e.target.value)}
                className={inputCls}
                disabled={!wilaya || loadingGeo}
              >
                <option value="">{t(dict, 'form.selectCommune')}</option>
                {communes.map((c, i) => (
                  <option key={i} value={name(c, locale)}>
                    {name(c, locale)}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-semibold text-slate-700">{t(dict, 'form.address')} *</label>
              <textarea
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder={t(dict, 'form.addressPlaceholder')}
                rows={2}
                className={inputCls}
              />
            </div>
          </>
        ) : null}

        {/* Coupon */}
        <div>
          <label className="mb-1 block text-sm font-semibold text-slate-700">كوبون خصم (اختياري)</label>
          <input
            value={coupon}
            onChange={(e) => setCoupon(e.target.value.toUpperCase())}
            placeholder="ODZ10"
            className={inputCls}
            dir="ltr"
          />
        </div>

        {/* Total */}
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm">
          <div className="flex justify-between text-slate-600">
            <span>
              {t(dict, 'order.subtotal')} ({t(dict, 'form.quantityOf', { n: qty })})
            </span>
            <span>{formatPrice(subtotal, locale)}</span>
          </div>
          {bundlePercent ? (
            <div className="mt-1 flex justify-between font-semibold text-brand-700">
              <span>{t(dict, 'order.discount')} (−{bundlePercent}%)</span>
              <span>−{formatPrice(subtotal - discounted, locale)}</span>
            </div>
          ) : null}
          <div className="mt-1 flex justify-between text-slate-600">
            <span>{t(dict, 'order.deliveryFee')}</span>
            <span className={hasDeliveryFee ? 'font-semibold text-slate-900' : 'font-semibold text-brand-700'}>
              {hasDeliveryFee ? formatPrice(deliveryFee, locale) : t(dict, 'order.freeDelivery')}
            </span>
          </div>
          <div className="mt-2 flex justify-between border-t border-slate-200 pt-2 text-base font-extrabold text-slate-900">
            <span>{t(dict, 'order.total')}</span>
            <span>{formatPrice(total, locale)}</span>
          </div>
        </div>

        {error ? <p className="text-sm font-semibold text-red-600">{error}</p> : null}

        <button
          type="button"
          onClick={submit}
          disabled={submitting || noOffice}
          className="w-full rounded-xl bg-accent-500 py-3.5 text-lg font-extrabold text-white shadow hover:bg-accent-600 disabled:opacity-40"
        >
          {submitting ? t(dict, 'form.submitting') : t(dict, 'form.submit')}
        </button>
      </div>
    </div>
  );
}
