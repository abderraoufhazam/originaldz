import { requireAdmin } from '@/lib/admin';
import { getSupabase } from '@/lib/supabase';
import { addTestimonial, removeTestimonial } from '@/app/admin/actions';
import type { Testimonial } from '@/lib/types';

export const dynamic = 'force-dynamic';

export default async function TestimonialsPage() {
  requireAdmin();
  const sb = getSupabase();
  const { data } = await sb.from('testimonials').select('*').order('created_at', { ascending: false });
  const list = (data as Testimonial[]) ?? [];

  const inputCls = 'mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 outline-none focus:border-brand-600';

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="lg:col-span-2">
        <h1 className="text-2xl font-extrabold text-slate-900">تقييمات الزبائن</h1>
        {list.length === 0 ? (
          <p className="mt-6 text-slate-500">لا توجد تقييمات بعد.</p>
        ) : (
          <ul className="mt-6 space-y-2">
            {list.map((r) => (
              <li key={r.id} className="flex items-start justify-between rounded-xl border border-slate-200 bg-white p-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900">{r.customer_name}</span>
                    <span className="text-amber-500">{'★'.repeat(r.rating)}</span>
                  </div>
                  <p className="mt-1 text-sm text-slate-600">{r.text_ar || r.text_en}</p>
                </div>
                <form action={removeTestimonial.bind(null, r.id)}>
                  <button type="submit" className="text-sm font-bold text-red-600 hover:underline">حذف</button>
                </form>
              </li>
            ))}
          </ul>
        )}
      </div>

      <form action={addTestimonial} className="h-fit rounded-2xl border border-slate-200 bg-white p-6">
        <h2 className="text-lg font-extrabold text-slate-900">إضافة تقييم</h2>
        <label className="mt-4 block text-sm font-semibold text-slate-700">اسم الزبون</label>
        <input name="customer_name" className={inputCls} required />
        <label className="mt-4 block text-sm font-semibold text-slate-700">النص (عربي)</label>
        <textarea name="text_ar" rows={2} className={inputCls} />
        <label className="mt-4 block text-sm font-semibold text-slate-700">النص (إنجليزي)</label>
        <textarea name="text_en" rows={2} className={inputCls} />
        <label className="mt-4 block text-sm font-semibold text-slate-700">النص (فرنسي)</label>
        <textarea name="text_fr" rows={2} className={inputCls} />
        <label className="mt-4 block text-sm font-semibold text-slate-700">التقييم</label>
        <select name="rating" defaultValue="5" className={inputCls}>
          {[5, 4, 3, 2, 1].map((n) => (
            <option key={n} value={n}>{'★'.repeat(n)}</option>
          ))}
        </select>
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
