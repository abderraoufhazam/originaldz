import Link from 'next/link';
import { requireAdmin } from '@/lib/admin';
import { getSupabase } from '@/lib/supabase';
import { STATUS_LABELS, STATUS_COLORS, RISK_LABELS, RISK_COLORS, fmtDZD } from '@/lib/admin-ui';

export const dynamic = 'force-dynamic';

export default async function OrdersPage({
  searchParams,
}: {
  searchParams: { status?: string };
}) {
  requireAdmin();
  const sb = getSupabase();
  const status = searchParams.status ?? 'all';

  let query = sb.from('orders').select('*').order('created_at', { ascending: false }).limit(200);
  if (status !== 'all') query = query.eq('status', status);
  const { data } = await query;
  const orders = (data ?? []) as any[];

  const tabs = ['all', 'new', 'confirmed', 'shipped', 'delivered', 'cancelled'];

  return (
    <div>
      <h1 className="text-2xl font-extrabold text-slate-900">الطلبيات</h1>

      <div className="mt-4 flex flex-wrap gap-2">
        {tabs.map((s) => (
          <a
            key={s}
            href={`/admin/orders?status=${s}`}
            className={`rounded-full px-4 py-1.5 text-sm font-semibold ${
              status === s ? 'bg-brand-800 text-white' : 'bg-white text-slate-700'
            }`}
          >
            {s === 'all' ? 'الكل' : STATUS_LABELS[s]}
          </a>
        ))}
      </div>

      {orders.length === 0 ? (
        <p className="mt-8 text-slate-500">لا توجد طلبيات بعد.</p>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-2xl border border-slate-200 bg-white">
          <table className="w-full min-w-[720px] text-sm">
            <thead className="border-b border-slate-200 bg-slate-50 text-start text-slate-500">
              <tr>
                <th className="px-4 py-3 text-start font-semibold">الطلب</th>
                <th className="px-4 py-3 text-start font-semibold">الزبون</th>
                <th className="px-4 py-3 text-start font-semibold">المنتج</th>
                <th className="px-4 py-3 text-start font-semibold">المجموع</th>
                <th className="px-4 py-3 text-start font-semibold">الحالة</th>
                <th className="px-4 py-3 text-start font-semibold">التنبيه</th>
                <th className="px-4 py-3 text-start font-semibold">التاريخ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {orders.map((o) => (
                <tr key={o.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3">
                    <Link href={`/admin/orders/${o.id}`} className="font-bold text-brand-700 hover:underline">
                      {o.order_number}
                    </Link>
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-semibold text-slate-900">
                      {o.first_name} {o.last_name}
                    </div>
                    <div className="text-xs text-slate-500" dir="ltr">
                      {o.phone}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-slate-700">
                    {o.product_title} × {o.quantity}
                  </td>
                  <td className="px-4 py-3 font-bold text-slate-900">{fmtDZD(o.total)}</td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${STATUS_COLORS[o.status]}`}>
                      {STATUS_LABELS[o.status]}
                    </span>
                  </td>
                  <td className={`px-4 py-3 ${RISK_COLORS[o.risk]}`}>{RISK_LABELS[o.risk]}</td>
                  <td className="px-4 py-3 text-slate-500">
                    {new Date(o.created_at).toLocaleDateString('ar-DZ', {
                      day: '2-digit',
                      month: '2-digit',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
