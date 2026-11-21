import { NextResponse } from 'next/server';
import { communesOf } from '@/lib/geo';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const code = Number(searchParams.get('code'));
  if (!Number.isInteger(code) || code < 1 || code > 58) {
    return NextResponse.json([]);
  }
  return NextResponse.json(communesOf(code));
}
