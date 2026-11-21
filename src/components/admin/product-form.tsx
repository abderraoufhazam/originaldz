import { saveProduct } from '@/app/admin/actions';
import type { Product } from '@/lib/types';

const inputCls =
  'mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 outline-none focus:border-brand-600';
const labelCls = 'mt-4 block text-sm font-semibold text-slate-700';

export default function ProductForm({ product }: { product?: Product | null }) {
  const p = product ?? null;
  const isEdit = Boolean(p);

  return (
    <form action={saveProduct} className="rounded-2xl border border-slate-200 bg-white p-6">
      {isEdit ? <input type="hidden" name="id" value={p!.id} /> : null}
      {p ? <input type="hidden" name="existing" value={(p.images ?? []).join('\n')} /> : null}

      <h2 className="text-lg font-extrabold text-slate-900">
        {isEdit ? 'تعديل المنتج' : 'منتج جديد'}
      </h2>

      <label className={labelCls}>الرابط المميز (slug)</label>
      <input name="slug" defaultValue={p?.slug ?? ''} className={inputCls} placeholder="product-name" required />

      <div className="grid gap-4 md:grid-cols-3">
        <div>
          <label className={labelCls}>الاسم (عربي)</label>
          <input name="title_ar" defaultValue={p?.title_ar ?? ''} className={inputCls} />
        </div>
        <div>
          <label className={labelCls}>الاسم (إنجليزي)</label>
          <input name="title_en" defaultValue={p?.title_en ?? ''} className={inputCls} />
        </div>
        <div>
          <label className={labelCls}>الاسم (فرنسي)</label>
          <input name="title_fr" defaultValue={p?.title_fr ?? ''} className={inputCls} />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div>
          <label className={labelCls}>الوصف (عربي)</label>
          <textarea name="description_ar" defaultValue={p?.description_ar ?? ''} rows={4} className={inputCls} />
        </div>
        <div>
          <label className={labelCls}>الوصف (إنجليزي)</label>
          <textarea name="description_en" defaultValue={p?.description_en ?? ''} rows={4} className={inputCls} />
        </div>
        <div>
          <label className={labelCls}>الوصف (فرنسي)</label>
          <textarea name="description_fr" defaultValue={p?.description_fr ?? ''} rows={4} className={inputCls} />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <div>
          <label className={labelCls}>السعر (دج)</label>
          <input name="price" type="number" defaultValue={p?.price ?? 0} className={inputCls} required />
        </div>
        <div>
          <label className={labelCls}>السعر القديم (اختياري)</label>
          <input name="compare_at_price" type="number" defaultValue={p?.compare_at_price ?? ''} className={inputCls} />
        </div>
        <div>
          <label className={labelCls}>المخزون</label>
          <input name="stock" type="number" defaultValue={p?.stock ?? 0} className={inputCls} />
        </div>
        <div>
          <label className={labelCls}>الوزن (غ)</label>
          <input name="weight_grams" type="number" defaultValue={p?.weight_grams ?? 500} className={inputCls} />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div>
          <label className={labelCls}>التصنيف</label>
          <input name="category" defaultValue={p?.category ?? ''} className={inputCls} />
        </div>
        <div>
          <label className={labelCls}>الحد الأدنى للعرض (حزمة)</label>
          <input name="bundle_min" type="number" defaultValue={p?.bundle_min ?? 0} className={inputCls} />
        </div>
        <div>
          <label className={labelCls}>نسبة خصم الحزمة (%)</label>
          <input name="bundle_discount" type="number" defaultValue={p?.bundle_discount ?? 0} className={inputCls} />
        </div>
      </div>

      <label className={labelCls}>صور المنتج (اختر ملفات)</label>
      <input name="images" type="file" multiple accept="image/*" className={inputCls} />

      <label className={labelCls}>أو ألصق روابط صور (رابط في كل سطر)</label>
      <textarea name="manual_urls" rows={3} className={inputCls} placeholder="https://…" />

      {p && (p.images?.length ?? 0) > 0 ? (
        <div className="mt-4 flex flex-wrap gap-2">
          {p.images.map((img, i) => (
            <img key={i} src={img} alt="" className="h-16 w-16 rounded-lg object-cover" />
          ))}
        </div>
      ) : null}

      <div className="mt-4 flex flex-wrap gap-6">
        <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
          <input type="checkbox" name="active" defaultChecked={p ? p.active : true} />
          مفعّل
        </label>
        <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
          <input type="checkbox" name="featured" defaultChecked={p?.featured ?? false} />
          مميّز
        </label>
      </div>

      <button
        type="submit"
        className="mt-6 rounded-xl bg-brand-800 px-8 py-2.5 font-bold text-white hover:bg-brand-900"
      >
        حفظ المنتج
      </button>
    </form>
  );
}
