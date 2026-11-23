import { NextResponse } from 'next/server';
import { getSupabase } from '@/lib/supabase';
import { sendTelegram } from '@/lib/telegram';
import { deliveryFee } from '@/lib/prices';

export const dynamic = 'force-dynamic';

export async function GET() {
  const sb = getSupabase();
  const today = new Date().toISOString().slice(0, 10);
  const start = `${today}T00:00:00`;

  const [{ data: orders }, { data: products }] = await Promise.all([
    sb.from('orders').select('*').gte('created_at', start),
    sb.from('products').select('*'),
  ]);

  const rows = (orders ?? []) as any[];
  const productMap: Record<string, any> = {};
  for (const p of (products ?? []) as any[]) productMap[p.id] = p;

  const confirmed = rows.filter((o) => o.status !== 'cancelled');
  const revenue = confirmed.reduce((s, o) => s + (o.total ?? 0), 0);
  const cancelled = rows.filter((o) => o.status === 'cancelled').length;

  let deliveryTotal = 0;
  let costTotal = 0;
  for (const o of confirmed) {
    deliveryTotal += deliveryFee(o.wilaya_code, o.delivery_type === 'office' ? 'office' : 'home');
    const p = productMap[o.product_id];
    if (p) costTotal += (p.cost ?? 0) * (o.quantity ?? 1);
  }
  const profit = revenue - deliveryTotal - costTotal;

  const lowStock = ((products ?? []) as any[]).filter((p) => p.stock <= 5);

  const text =
    `📊 <b>تقرير اليوم</b> — ${today}\n\n` +
    `🛒 الطلبات: ${rows.length}\n` +
    `💰 المبيعات: ${revenue} دج\n` +
    `📦 تكلفة التوصيل: ${deliveryTotal} دج\n` +
    `💵 الربح التقريبي: ${profit} دج\n` +
    `❌ ملغاة: ${cancelled}` +
    (lowStock.length
      ? `\n\n⚠️ <b>مخزون منخفض:</b>\n${lowStock.map((p) => `- ${p.title_ar || p.title_en}: ${p.stock} قطعة`).join('\n')}`
      : '');

  await sendTelegram(text);

  return NextResponse.json({ ok: true, orders: rows.length, revenue, profit, lowStock: lowStock.length });
}
