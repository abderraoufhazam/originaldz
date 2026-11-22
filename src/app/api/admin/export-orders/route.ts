import { NextResponse } from 'next/server';
import { getSupabase } from '@/lib/supabase';
import { isAdmin } from '@/lib/admin';

export const dynamic = 'force-dynamic';

export async function GET() {
  if (!isAdmin()) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  const sb = getSupabase();
  const { data } = await sb.from('orders').select('*').order('created_at', { ascending: false }).limit(5000);
  const rows = (data ?? []) as any[];

  const header = [
    'order_number', 'created_at', 'first_name', 'last_name', 'phone', 'product_title',
    'quantity', 'unit_price', 'discount_percent', 'total', 'delivery_type', 'wilaya_name',
    'office_name', 'commune', 'address', 'status', 'tracking_number', 'risk', 'utm_source', 'utm_campaign',
  ];

  const esc = (v: unknown) => {
    const s = String(v ?? '');
    return '"' + s.replace(/"/g, '""') + '"';
  };

  const lines = [header.map(esc).join(',')];
  for (const r of rows) {
    lines.push(header.map((h) => esc(r[h])).join(','));
  }

  const csv = '\uFEFF' + lines.join('\r\n');
  return new Response(csv, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': 'attachment; filename="originaldz-orders.csv"',
    },
  });
}
