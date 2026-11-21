import Link from 'next/link';
import { requireAdmin } from '@/lib/admin';
import { getSupabase } from '@/lib/supabase';
import { deleteProduct } from '@/app/admin/actions';
import { fmtDZD } from '@/lib/admin-ui';
import type { Product } from '@/lib/types';

export const dynamic = 'force-dynamic';

export default async function AdminProductsPage() {
  requireAdmin();
  const sb = getSupabase();
  const { data } = await sb.from('products').select('*').order('created_at', { ascending: false });
  const products = (data as Product[]) ?? [];

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-extrabold text-slate-900">المنتجات</h1>
        <Link
          href="/admin/products/new"
          className="rounded-xl bg-brand-800 px-5 py-2.5 font-bold text-white hover:bg-brand-900"
        >
          + منتج جديد
        </Link>
      </div>

      {products.length === 0 ? (
        <p className="mt-8 text-slate-500">لا توجد منتجات. أضف أول منتج الآن.</p>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-2xl border border-slate-200 bg-white">
          <table className="w-full min-w-[640px] text-sm">
            <thead className="border-b border-slate-200 bg-slate-50 text-slate-500">
              <tr>
                <th className="px-4 py-3 text-start font-semibold">المنتج</th>
                <th className="px-4 py-3 text-start font-semibold">السعر</th>
                <th className="px-4 py-3 text-start font-semibold">المخزون</th>
                <th className="px-4 py-3 text-start font-semibold">الحالة</th>
                <th className="px-4 py-3 text-start font-semibold">إجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {products.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={p.images?.[0] ?? '/placeholder.svg'}
                        alt=""
                        className="h-10 w-10 rounded-lg object-cover"
                      />
                      <div>
                        <div className="font-bold text-slate-900">{p.title_ar || p.title_en}</div>
                        <div className="text-xs text-slate-500" dir="ltr">{p.slug}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 font-bold text-slate-900">{fmtDZD(p.price)}</td>
                  <td className="px-4 py-3 text-slate-700">{p.stock}</td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${p.active ? 'bg-green-100 text-green-700' : 'bg-slate-200 text-slate-600'}`}>
                      {p.active ? 'مفعّل' : 'معطّل'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Link href={`/admin/products/${p.id}/edit`} className="text-sm font-bold text-brand-700 hover:underline">
                        تعديل
                      </Link>
                      <form action={deleteProduct.bind(null, p.id)}>
                        <button type="submit" className="text-sm font-bold text-red-600 hover:underline">
                          حذف
                        </button>
                      </form>
                    </div>
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
