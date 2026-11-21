import { NextResponse } from 'next/server';
import { DELIVERY_PRICES } from '@/lib/prices';

export const dynamic = 'force-dynamic';

export async function GET() {
  return NextResponse.json(
    DELIVERY_PRICES.map((p) => ({
      wilaya_code: p.code,
      office_price: p.desk,
      home_price: p.home,
      desks: p.desks,
    })),
  );
}
