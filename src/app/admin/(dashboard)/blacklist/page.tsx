import { requireAdmin } from '@/lib/admin';
import { getSupabase } from '@/lib/supabase';
import { addBlacklist, removeBlacklist } from '@/app/admin/actions';

export const dynamic = 'force-dynamic';

export default async function BlacklistPage() {
  requireAdmin();
  const sb = getSupabase();
  const { data } = await sb.from('blacklist').select('*').order('created_at', { ascending: false });
  const list = (data ?? []) as { phone: string; reason: string; created_at: string }[];

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="lg:col-span-2">
        <h1 className="text-2xl font-extrabold text-slate-900">القائمة السوداء</h1>
        <p className="mt-1 text-sm text-slate-500">
          تُرفض تلقائيًا أي طلبية قادمة من هذه الأرقام.
        </p>
        {list.length === 0 ? (
          <p className="mt-6 text-slate-500">القائمة فارغة.</p>
        ) : (
          <ul className="mt-6 space-y-2">
            {list.map((b) => (
              <li key={b.phone} className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-4">
                <div>
                  <div className="font-bold text-slate-900" dir="ltr">{b.phone}</div>
                  {b.reason ? <div className="text-xs text-slate-500">{b.reason}</div> : null}
                </div>
                <form action={removeBlacklist.bind(null, b.phone)}>
                  <button type="submit" className="text-sm font-bold text-red-600 hover:underline">إزالة</button>
                </form>
              </li>
            ))}
          </ul>
        )}
      </div>

      <form action={addBlacklist} className="h-fit rounded-2xl border border-slate-200 bg-white p-6">
        <h2 className="text-lg font-extrabold text-slate-900">حظر رقم</h2>
        <label className="mt-4 block text-sm font-semibold text-slate-700">رقم الهاتف</label>
        <input name="phone" dir="ltr" className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 outline-none focus:border-brand-600" required />
        <label className="mt-4 block text-sm font-semibold text-slate-700">السبب (اختياري)</label>
        <input name="reason" className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 outline-none focus:border-brand-600" />
        <button type="submit" className="mt-4 w-full rounded-xl bg-brand-800 py-2.5 font-bold text-white hover:bg-brand-900">
          حظر
        </button>
      </form>
    </div>
  );
}
