import { NextResponse } from 'next/server';
import { sendTelegram } from '@/lib/telegram';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const name = String(body.name ?? '').trim();
  const phone = String(body.phone ?? '').trim();
  const message = String(body.message ?? '').trim();

  if (!name || !phone || !message) {
    return NextResponse.json({ error: 'missing' }, { status: 400 });
  }

  await sendTelegram(`📩 <b>رسالة تواصل جديدة</b>\n\n👤 ${name}\n📞 ${phone}\n\n💬 ${message}`);

  return NextResponse.json({ ok: true });
}
