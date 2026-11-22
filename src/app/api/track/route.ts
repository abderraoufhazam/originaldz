import { NextResponse } from 'next/server';
import { getSupabase } from '@/lib/supabase';
import { normalizePhone } from '@/lib/format';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const orderNumber = String(body.order_number ?? '').trim().toUpperCase();
  const phone = normalizePhone(String(body.phone ?? ''));

  if (!orderNumber || !phone) {
    return NextResponse.json({ error: 'missing' }, { status: 400 });
  }

  const sb = getSupabase();
  const { data } = await sb
    .from('orders')
    .select('order_number, product_title, quantity, total, status, tracking_number, created_at, wilaya_name, delivery_type')
    .eq('order_number', orderNumber)
    .eq('phone', phone)
    .maybeSingle();

  if (!data) {
    return NextResponse.json({ error: 'not_found' }, { status: 404 });
  }
  return NextResponse.json(data);
}
