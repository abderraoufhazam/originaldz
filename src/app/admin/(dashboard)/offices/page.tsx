import { requireAdmin } from '@/lib/admin';
import { getSupabase } from '@/lib/supabase';
import { WILAYAS } from '@/lib/geo';
import { wilayaName } from '@/lib/geo';
import { addOffice, removeOffice } from '@/app/admin/actions';
import type { Office } from '@/lib/types';

export const dynamic = 'force-dynamic';

export default async function OfficesPage() {
  requireAdmin();
  const sb = getSupabase();
  const { data } = await sb.from('offices').select('*').order('wilaya_code');
  const offices = (data as Office[]) ?? [];

  const inputCls = 'mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 outline-none focus:border-brand-600';

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="lg:col-span-2">
        <h1 className="text-2xl font-extrabold text-slate-900">مكاتب التوصيل (World Express)</h1>
        <p className="mt-1 text-sm text-slate-500">
          تظهر هذه المكاتب للزبون عند اختيار «الاستلام من المكتب» في الولاية. أضف مكاتب ولايتك وعدّلها عند الحاجة.
        </p>

        {offices.length === 0 ? (
          <p className="mt-6 text-slate-500">لا توجد مكاتب. أضفها من النموذج.</p>
        ) : (
          <ul className="mt-6 space-y-2">
            {offices.map((o) => (
              <li key={o.id} className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-3">
                <div>
                  <div className="font-bold text-slate-900">
                    {o.name_ar} <span className="text-xs font-normal text-slate-400">({o.name_fr})</span>
                  </div>
                  <div className="text-xs text-slate-500">
                    ولاية {o.wilaya_code} {o.address ? `— ${o.address}` : ''}
                  </div>
                </div>
                <form action={removeOffice.bind(null, o.id)}>
                  <button type="submit" className="text-sm font-bold text-red-600 hover:underline">حذف</button>
                </form>
              </li>
            ))}
          </ul>
        )}
      </div>

      <form action={addOffice} className="h-fit rounded-2xl border border-slate-200 bg-white p-6">
        <h2 className="text-lg font-extrabold text-slate-900">إضافة مكتب</h2>
        <label className="mt-4 block text-sm font-semibold text-slate-700">الولاية</label>
        <select name="wilaya_code" className={inputCls}>
          {WILAYAS.map((w) => (
            <option key={w.code} value={w.code}>
              {String(w.code).padStart(2, '0')} — {wilayaName(w, 'ar')}
            </option>
          ))}
        </select>
        <label className="mt-4 block text-sm font-semibold text-slate-700">اسم المكتب (عربي)</label>
        <input name="name_ar" className={inputCls} required />
        <label className="mt-4 block text-sm font-semibold text-slate-700">اسم المكتب (فرنسي)</label>
        <input name="name_fr" className={inputCls} />
        <label className="mt-4 block text-sm font-semibold text-slate-700">العنوان</label>
        <input name="address" className={inputCls} />
        <label className="mt-4 block text-sm font-semibold text-slate-700">الهاتف</label>
        <input name="phone" className={inputCls} />
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
