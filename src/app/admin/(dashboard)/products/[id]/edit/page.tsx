import { notFound } from 'next/navigation';
import { getSupabase } from '@/lib/supabase';
import type { Product } from '@/lib/types';
import ProductForm from '@/components/admin/product-form';

export const dynamic = 'force-dynamic';

export default async function EditProductPage({ params }: { params: { id: string } }) {
  const sb = getSupabase();
  const { data } = await sb.from('products').select('*').eq('id', params.id).single();
  if (!data) notFound();
  return (
    <div>
      <h1 className="mb-4 text-2xl font-extrabold text-slate-900">تعديل المنتج</h1>
      <ProductForm product={data as Product} />
    </div>
  );
}
