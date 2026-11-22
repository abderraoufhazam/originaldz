import { requireAdmin } from '@/lib/admin';
import { getSettings } from '@/lib/settings';
import { saveSettings } from '@/app/admin/actions';

export const dynamic = 'force-dynamic';

export default async function SettingsPage() {
  requireAdmin();
  const s = await getSettings();

  const inputCls = 'mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 outline-none focus:border-brand-600';

  return (
    <div>
      <h1 className="text-2xl font-extrabold text-slate-900">الإعدادات</h1>

      <form action={saveSettings} className="mt-6 max-w-2xl space-y-6">
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <h2 className="text-lg font-extrabold text-slate-900">هوية المتجر</h2>
          <label className="mt-4 block text-sm font-semibold text-slate-700">اسم المتجر</label>
          <input name="store_name" defaultValue={s.store_name} className={inputCls} />
          <label className="mt-4 block text-sm font-semibold text-slate-700">الشعار/العنوان (عربي)</label>
          <input name="tagline_ar" defaultValue={s.tagline_ar} className={inputCls} />
          <label className="mt-4 block text-sm font-semibold text-slate-700">العنوان (إنجليزي)</label>
          <input name="tagline_en" defaultValue={s.tagline_en} className={inputCls} />
          <label className="mt-4 block text-sm font-semibold text-slate-700">العنوان (فرنسي)</label>
          <input name="tagline_fr" defaultValue={s.tagline_fr} className={inputCls} />
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <h2 className="text-lg font-extrabold text-slate-900">التواصل</h2>
          <label className="mt-4 block text-sm font-semibold text-slate-700">رقم واتساب (للأزرار)</label>
          <input name="whatsapp" defaultValue={s.whatsapp} dir="ltr" className={inputCls} placeholder="2135…" />
          <label className="mt-4 block text-sm font-semibold text-slate-700">رقم الهاتف</label>
          <input name="phone" defaultValue={s.phone} dir="ltr" className={inputCls} />
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <h2 className="text-lg font-extrabold text-slate-900">الخصومات</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mt-4 block text-sm font-semibold text-slate-700">خصم أول طلب (%)</label>
              <input name="welcome_discount" type="number" defaultValue={s.welcome_discount} className={inputCls} />
            </div>
            <div>
              <label className="mt-4 block text-sm font-semibold text-slate-700">خصم الولاء (%)</label>
              <input name="loyalty_discount" type="number" defaultValue={s.loyalty_discount} className={inputCls} />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <h2 className="text-lg font-extrabold text-slate-900">قياس الإعلانات (البكسل)</h2>
          <label className="mt-4 block text-sm font-semibold text-slate-700">Facebook Pixel ID</label>
          <input name="fb_pixel" defaultValue={s.fb_pixel} dir="ltr" className={inputCls} placeholder="1234567890" />
          <label className="mt-4 block text-sm font-semibold text-slate-700">TikTok Pixel ID</label>
          <input name="tiktok_pixel" defaultValue={s.tiktok_pixel} dir="ltr" className={inputCls} placeholder="ABCDEF123" />
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <h2 className="text-lg font-extrabold text-slate-900">الصيانة</h2>
          <label className="mt-4 flex items-center gap-3 text-sm font-semibold text-slate-700">
            <input type="checkbox" name="maintenance_mode" defaultChecked={s.maintenance_mode} />
            تفعيل وضع الصيانة (إخفاء المتجر عن الزوار — أنت فقط تدخله)
          </label>
        </div>

        <button type="submit" className="rounded-xl bg-brand-800 px-8 py-3 font-bold text-white hover:bg-brand-900">
          حفظ الإعدادات
        </button>
      </form>
    </div>
  );
}
