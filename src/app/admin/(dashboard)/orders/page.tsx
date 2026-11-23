import Link from 'next/link';
import { requireAdmin } from '@/lib/admin';
import { getSupabase } from '@/lib/supabase';
import { STATUS_LABELS, STATUS_COLORS, RISK_LABELS, RISK_COLORS, fmtDZD } from '@/lib/admin-ui';

export const dynamic = 'force-dynamic';

export default async function OrdersPage({
  searchParams,
}: {
  searchParams: { status?: string; q?: string };
}) {
  requireAdmin();
  const sb = getSupabase();
  const status = searchParams.status ?? 'all';
  const q = (searchParams.q ?? '').trim().toLowerCase();

  // Stats
  const [{ count: totalCount }, { count: newCount }, { count: cancelledCount }, { data: totals }] =
    await Promise.all([
      sb.from('orders').select('*', { count: 'exact', head: true }),
      sb.from('orders').select('*', { count: 'exact', head: true }).eq('status', 'new'),
      sb.from('orders').select('*', { count: 'exact', head: true }).eq('status', 'cancelled'),
      sb.from('orders').select('total').neq('status', 'cancelled'),
    ]);
  const revenue = (totals ?? []).reduce((s, r) => s + (r.total ?? 0), 0);

  let query = sb.from('orders').select('*').order('created_at', { ascending: false }).limit(300);
  if (status !== 'all') query = query.eq('status', status);
  const { data } = await query;
  let orders = (data ?? []) as any[];

  if (q) {
    orders = orders.filter((o) =>
      `${o.order_number} ${o.phone} ${o.first_name} ${o.last_name} ${o.product_title}`
        .toLowerCase()
        .includes(q),
    );
  }

  const tabs = ['all', 'new', 'confirmed', 'shipped', 'delivered', 'cancelled', 'returned'];

  // Last 7 days chart (from the recent orders already loaded)
  const dayLabels: string[] = [];
  const dayCounts: number[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    dayLabels.push(d.toLocaleDateString('ar-DZ', { weekday: 'short' }));
    dayCounts.push(orders.filter((o) => String(o.created_at ?? '').slice(0, 10) === key).length);
  }
  const maxDay = Math.max(1, ...dayCounts);

  const stats = [
    { label: 'إجمالي الطلبيات', value: String(totalCount ?? 0), icon: '🛒', color: 'text-slate-900' },
    { label: 'طلبيات جديدة', value: String(newCount ?? 0), icon: '🆕', color: 'text-blue-600' },
    { label: 'المبيعات (بدون الملغاة)', value: fmtDZD(revenue), icon: '💰', color: 'text-brand-700' },
    { label: 'طلبيات ملغاة', value: String(cancelledCount ?? 0), icon: '❌', color: 'text-red-600' },
  ];

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-extrabold text-slate-900">الطلبيات</h1>
        <div className="flex w-full flex-wrap items-center gap-2 sm:w-auto">
          <form method="GET" className="flex-1 sm:w-64">
            <input
              type="search"
              name="q"
              defaultValue={searchParams.q ?? ''}
              placeholder="ابحث بالاسم، الهاتف، رقم الطلب…"
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2 outline-none focus:border-brand-600"
            />
          </form>
          <a href="/api/admin/export-orders" className="rounded-xl bg-slate-800 px-4 py-2 text-sm font-bold text-white hover:bg-slate-900">
            ⬇️ تصدير Excel
          </a>
          <a href="/api/admin/backup" className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-bold text-slate-700 hover:bg-slate-50">
            💾 نسخة احتياطية
          </a>
        </div>
      </div>

      {/* Stats */}
      <div className="mt-5 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-2xl">{s.icon}</span>
              <span className={`text-xl font-extrabold ${s.color}`}>{s.value}</span>
            </div>
            <p className="mt-2 text-sm font-semibold text-slate-500">{s.label}</p>
          </div>
        ))}
      </div>

      {/* 7-day chart */}
      <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-sm font-bold text-slate-700">الطلبات — آخر 7 أيام</h2>
        <div className="mt-4 flex items-end gap-2">
          {dayCounts.map((c, i) => (
            <div key={i} className="flex flex-1 flex-col items-center gap-1">
              <span className="text-xs font-bold text-slate-600">{c}</span>
              <div
                className="w-full rounded-t-lg bg-gradient-to-t from-brand-600 to-brand-400"
                style={{ height: `${Math.max(4, Math.round((c / maxDay) * 80))}px` }}
              />
              <span className="text-xs text-slate-400">{dayLabels[i]}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="mt-6 flex flex-wrap gap-2">
        {tabs.map((s) => (
          <a
            key={s}
            href={`/admin/orders?status=${s}${q ? `&q=${encodeURIComponent(q)}` : ''}`}
            className={`rounded-full px-4 py-1.5 text-sm font-semibold ${
              status === s ? 'bg-brand-800 text-white' : 'bg-white text-slate-700'
            }`}
          >
            {s === 'all' ? 'الكل' : STATUS_LABELS[s]}
          </a>
        ))}
      </div>

      {orders.length === 0 ? (
        <p className="mt-8 text-slate-500">لا توجد طلبيات.</p>
      ) : (
        <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-sm">
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
        </div>
      )}
    </div>
  );
}
