import { NextResponse } from 'next/server';
import { getSupabase } from '@/lib/supabase';
import { isAdmin } from '@/lib/admin';

export const dynamic = 'force-dynamic';

export async function GET() {
  if (!isAdmin()) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  const sb = getSupabase();
  const [products, orders, offices, testimonials, coupons, settings] = await Promise.all([
    sb.from('products').select('*'),
    sb.from('orders').select('*').order('created_at', { ascending: false }).limit(5000),
    sb.from('offices').select('*'),
    sb.from('testimonials').select('*'),
    sb.from('coupons').select('*'),
    sb.from('settings').select('*'),
  ]);

  const dump = {
    exported_at: new Date().toISOString(),
    products: products.data ?? [],
    orders: orders.data ?? [],
    offices: offices.data ?? [],
    testimonials: testimonials.data ?? [],
    coupons: coupons.data ?? [],
    settings: settings.data ?? [],
  };

  return new Response(JSON.stringify(dump, null, 2), {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Content-Disposition': 'attachment; filename="originaldz-backup.json"',
    },
  });
}
