import { NextResponse } from 'next/server';
import { createHash } from 'crypto';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  const password = process.env.ADMIN_PASSWORD;
  if (!password) {
    return NextResponse.json({ error: 'ADMIN_PASSWORD not set' }, { status: 500 });
  }
  const body = await req.json().catch(() => ({}));
  if (body.password !== password) {
    return NextResponse.json({ error: 'wrong password' }, { status: 401 });
  }
  const token = createHash('sha256').update(password).digest('hex');
  const res = NextResponse.json({ ok: true });
  res.cookies.set('odz_admin', token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  });
  return res;
}
