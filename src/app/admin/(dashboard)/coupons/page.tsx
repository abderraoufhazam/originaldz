import { requireAdmin } from '@/lib/admin';
import { getSupabase } from '@/lib/supabase';
import { addCoupon, removeCoupon } from '@/app/admin/actions';
import type { Coupon } from '@/lib/types';

export const dynamic = 'force-dynamic';

export default async function CouponsPage() {
  requireAdmin();
  const sb = getSupabase();
  const { data } = await sb.from('coupons').select('*').order('created_at', { ascending: false });
  const list = (data as Coupon[]) ?? [];

  const inputCls = 'mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 outline-none focus:border-brand-600';

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="lg:col-span-2">
        <h1 className="text-2xl font-extrabold text-slate-900">كوبونات الخصم</h1>
        <p className="mt-1 text-sm text-slate-500">أنشئ كود خصم (مثل ODZ10) يفعّله الزبون في نموذج الطلب.</p>

        {list.length === 0 ? (
          <p className="mt-6 text-slate-500">لا توجد كوبونات.</p>
        ) : (
          <ul className="mt-6 space-y-2">
            {list.map((c) => (
              <li key={c.id} className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-4">
                <div className="flex items-center gap-3">
                  <span className="rounded-lg bg-slate-100 px-3 py-1 font-mono text-lg font-bold text-slate-800" dir="ltr">
                    {c.code}
                  </span>
                  <span className="text-sm font-bold text-brand-700">−{c.discount_percent}%</span>
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${c.active ? 'bg-green-100 text-green-700' : 'bg-slate-200 text-slate-600'}`}>
                    {c.active ? 'مفعّل' : 'معطّل'}
                  </span>
                </div>
                <form action={removeCoupon.bind(null, c.id)}>
                  <button type="submit" className="text-sm font-bold text-red-600 hover:underline">حذف</button>
                </form>
              </li>
            ))}
          </ul>
        )}
      </div>

      <form action={addCoupon} className="h-fit rounded-2xl border border-slate-200 bg-white p-6">
        <h2 className="text-lg font-extrabold text-slate-900">كوبون جديد</h2>
        <label className="mt-4 block text-sm font-semibold text-slate-700">الكود</label>
        <input name="code" dir="ltr" placeholder="ODZ10" className={inputCls} required />
        <label className="mt-4 block text-sm font-semibold text-slate-700">نسبة الخصم (%)</label>
        <input name="discount_percent" type="number" min="1" max="100" defaultValue="10" className={inputCls} required />
        <label className="mt-4 flex items-center gap-2 text-sm font-semibold text-slate-700">
          <input type="checkbox" name="active" defaultChecked /> مفعّل
        </label>
        <button type="submit" className="mt-4 w-full rounded-xl bg-brand-800 py-2.5 font-bold text-white hover:bg-brand-900">
          إضافة
        </button>
      </form>
    </div>
  );
}
