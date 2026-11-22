'use client';

import { useState } from 'react';
import { formatPrice } from '@/lib/format';

const STATUS: Record<string, { label: string; color: string }> = {
  new: { label: 'جديد — بانتظار التأكيد', color: 'bg-blue-100 text-blue-700' },
  confirmed: { label: 'مؤكد — قيد التجهيز', color: 'bg-amber-100 text-amber-700' },
  shipped: { label: 'مشحون', color: 'bg-violet-100 text-violet-700' },
  delivered: { label: 'تم التسليم', color: 'bg-green-100 text-green-700' },
  cancelled: { label: 'ملغي', color: 'bg-slate-200 text-slate-600' },
};

export default function TrackPage() {
  const [orderNumber, setOrderNumber] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResult(null);
    const res = await fetch('/api/track', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ order_number: orderNumber, phone }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      setError(data.error === 'not_found' ? 'لم يتم العثور على طلب بهذه المعلومات.' : 'تحقق من المعلومات وحاول مجددًا.');
    } else {
      setResult(data);
    }
    setLoading(false);
  }

  const st = result ? STATUS[result.status] ?? STATUS.new : null;

  return (
    <div className="mx-auto max-w-xl px-4 py-14">
      <div className="rounded-3xl border border-slate-100 bg-white p-8 shadow-soft">
        <h1 className="text-2xl font-extrabold text-slate-900">تتبع طلبك</h1>
        <p className="mt-1 text-sm text-slate-500">أدخل رقم الطلب ورقم هاتفك لمعرفة حالة طلبك.</p>

        <form onSubmit={submit} className="mt-6 space-y-4">
          <input
            value={orderNumber}
            onChange={(e) => setOrderNumber(e.target.value)}
            placeholder="رقم الطلب (مثل ODZ-...)"
            className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-brand-600"
            dir="ltr"
            required
          />
          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="رقم الهاتف"
            className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-brand-600"
            inputMode="tel"
            dir="ltr"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-brand-600 py-3 font-bold text-white hover:bg-brand-700 disabled:opacity-50"
          >
            {loading ? 'جارٍ البحث…' : 'تتبع الطلب'}
          </button>
        </form>

        {error ? <p className="mt-4 rounded-xl bg-rose-50 p-3 text-sm font-semibold text-rose-600">{error}</p> : null}

        {result && st ? (
          <div className="mt-6 rounded-2xl border border-slate-100 bg-slate-50 p-5">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-900" dir="ltr">{result.order_number}</span>
              <span className={`rounded-full px-3 py-1 text-xs font-bold ${st.color}`}>{st.label}</span>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
              <div>
                <div className="text-slate-500">المنتج</div>
                <div className="font-semibold text-slate-800">{result.product_title} × {result.quantity}</div>
              </div>
              <div>
                <div className="text-slate-500">المجموع</div>
                <div className="font-semibold text-slate-800">{formatPrice(result.total, 'ar')}</div>
              </div>
              <div>
                <div className="text-slate-500">الولاية</div>
                <div className="font-semibold text-slate-800">{result.wilaya_name}</div>
              </div>
              <div>
                <div className="text-slate-500">التوصيل</div>
                <div className="font-semibold text-slate-800">{result.delivery_type === 'office' ? 'مكتب' : 'منزل'}</div>
              </div>
            </div>
            {result.tracking_number ? (
              <div className="mt-4 rounded-xl bg-brand-50 p-3 text-sm">
                <span className="text-slate-500">رقم التتبع: </span>
                <span className="font-bold text-brand-700" dir="ltr">{result.tracking_number}</span>
              </div>
            ) : null}
          </div>
        ) : null}
      </div>
    </div>
  );
}
