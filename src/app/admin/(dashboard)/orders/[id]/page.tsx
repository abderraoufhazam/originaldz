import Link from 'next/link';
import { notFound } from 'next/navigation';
import { requireAdmin } from '@/lib/admin';
import { getSupabase } from '@/lib/supabase';
import { updateOrder } from '@/app/admin/actions';
import { STATUS_LABELS, RISK_LABELS, fmtDZD } from '@/lib/admin-ui';

export const dynamic = 'force-dynamic';

export default async function OrderDetailPage({ params }: { params: { id: string } }) {
  requireAdmin();
  const sb = getSupabase();
  const { data } = await sb.from('orders').select('*').eq('id', params.id).single();
  if (!data) notFound();
  const o = data as any;

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="lg:col-span-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-extrabold text-slate-900">{o.order_number}</h1>
            <span className={`rounded-full px-3 py-1 text-xs font-bold ${RISK_LABELS[o.risk] === 'مشبوه' ? 'bg-red-100 text-red-700' : RISK_LABELS[o.risk] === 'تنبيه' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-500'}`}>
              {RISK_LABELS[o.risk]}
            </span>
          </div>

          <dl className="mt-4 grid grid-cols-2 gap-4 text-sm">
            <div>
              <dt className="text-slate-500">الزبون</dt>
              <dd className="font-bold text-slate-900">{o.first_name} {o.last_name}</dd>
            </div>
            <div>
              <dt className="text-slate-500">الهاتف</dt>
              <dd className="font-bold text-slate-900" dir="ltr">{o.phone}</dd>
            </div>
            <div>
              <dt className="text-slate-500">المنتج</dt>
              <dd className="font-semibold text-slate-800">{o.product_title}</dd>
            </div>
            <div>
              <dt className="text-slate-500">الكمية</dt>
              <dd className="font-semibold text-slate-800">{o.quantity}</dd>
            </div>
            <div>
              <dt className="text-slate-500">السعر الوحدة</dt>
              <dd className="font-semibold text-slate-800">{fmtDZD(o.unit_price)}</dd>
            </div>
            <div>
              <dt className="text-slate-500">المجموع</dt>
              <dd className="text-lg font-extrabold text-brand-800">{fmtDZD(o.total)}</dd>
            </div>
            {o.discount_percent > 0 ? (
              <div>
                <dt className="text-slate-500">الخصم المطبّق</dt>
                <dd className="font-semibold text-brand-700">-{o.discount_percent}%</dd>
              </div>
            ) : null}
          </dl>

          <div className="mt-4 rounded-xl bg-slate-50 p-4 text-sm">
            <p><span className="text-slate-500">التوصيل:</span> {o.delivery_type === 'office' ? 'مكتب' : 'منزل'}</p>
            <p><span className="text-slate-500">الولاية:</span> {o.wilaya_name}</p>
            {o.office_name ? <p><span className="text-slate-500">المكتب:</span> {o.office_name}</p> : null}
            {o.commune ? <p><span className="text-slate-500">البلدية:</span> {o.commune}</p> : null}
            {o.address ? <p><span className="text-slate-500">العنوان:</span> {o.address}</p> : null}
          </div>

          {(o.utm_source || o.utm_campaign) ? (
            <p className="mt-3 text-xs text-slate-500">
              المصدر: {[o.utm_source, o.utm_medium, o.utm_campaign, o.utm_content].filter(Boolean).join(' / ') || o.source}
            </p>
          ) : null}
        </div>
      </div>

      <form action={updateOrder} className="h-fit rounded-2xl border border-slate-200 bg-white p-6">
        <input type="hidden" name="id" value={o.id} />
        <h2 className="text-lg font-extrabold text-slate-900">إدارة الطلب</h2>
        <label className="mt-4 block text-sm font-semibold text-slate-700">الحالة</label>
        <select
          name="status"
          defaultValue={o.status}
          className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 outline-none focus:border-brand-600"
        >
          {Object.entries(STATUS_LABELS).map(([k, v]) => (
            <option key={k} value={k}>{v}</option>
          ))}
        </select>

        <label className="mt-4 block text-sm font-semibold text-slate-700">رقم التتبع</label>
        <input
          name="tracking_number"
          defaultValue={o.tracking_number}
          className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 outline-none focus:border-brand-600"
        />

        <label className="mt-4 block text-sm font-semibold text-slate-700">ملاحظات</label>
        <textarea
          name="notes"
          defaultValue={o.notes}
          rows={3}
          className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 outline-none focus:border-brand-600"
        />

        <button
          type="submit"
          className="mt-4 w-full rounded-xl bg-brand-800 py-2.5 font-bold text-white hover:bg-brand-900"
        >
          حفظ
        </button>
        <Link
          href="/admin/orders"
          className="mt-2 block text-center text-sm font-semibold text-slate-500 hover:text-slate-700"
        >
          رجوع
        </Link>
      </form>
    </div>
  );
}
