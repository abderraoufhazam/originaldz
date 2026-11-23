import { NextResponse } from 'next/server';
import { getSupabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

const STATUS_LABELS: Record<string, string> = {
  confirmed: '✅ مؤكد',
  shipped: '🚚 مشحون',
  delivered: '📦 تم التسليم',
  cancelled: '❌ ملغي',
};

export async function POST(req: Request) {
  const secret = req.headers.get('X-Telegram-Bot-Api-Secret-Token');
  if (!process.env.TELEGRAM_WEBHOOK_SECRET || secret !== process.env.TELEGRAM_WEBHOOK_SECRET) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) return NextResponse.json({ ok: true });

  const update = await req.json().catch(() => null);
  if (!update) return NextResponse.json({ ok: true });

  const cb = update.callback_query;
  if (!cb) return NextResponse.json({ ok: true });

  const parts = String(cb.data || '').split(':');
  const orderId = parts[1];
  const newStatus = parts[2];

  if (!orderId || !STATUS_LABELS[newStatus]) {
    return NextResponse.json({ ok: true });
  }

  const sb = getSupabase();
  await sb
    .from('orders')
    .update({ status: newStatus, updated_at: new Date().toISOString() })
    .eq('id', orderId);

  // Toast confirmation
  await fetch(`https://api.telegram.org/bot${token}/answerCallbackQuery`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ callback_query_id: cb.id, text: `تم: ${STATUS_LABELS[newStatus]}` }),
  });

  // Update the message: append the current status, keep the action buttons.
  const keyboard = [
    [
      { text: '✅ تأكيد', callback_data: `status:${orderId}:confirmed` },
      { text: '🚚 شحن', callback_data: `status:${orderId}:shipped` },
    ],
    [
      { text: '📦 تسليم', callback_data: `status:${orderId}:delivered` },
      { text: '❌ إلغاء', callback_data: `status:${orderId}:cancelled` },
    ],
  ];

  if (cb.message) {
    await fetch(`https://api.telegram.org/bot${token}/editMessageText`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        chat_id: cb.message.chat.id,
        message_id: cb.message.message_id,
        text: `${cb.message.text || ''}\n\n<b>الحالة الحالية: ${STATUS_LABELS[newStatus]}</b>`,
        parse_mode: 'HTML',
        reply_markup: { inline_keyboard: keyboard },
      }),
    });
  }

  return NextResponse.json({ ok: true });
}
