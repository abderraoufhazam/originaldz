import { NextResponse } from 'next/server';
import { getSupabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const sb = getSupabase();
    const { data } = await sb
      .from('delivery_prices')
      .select('wilaya_code, office_price, home_price, desks')
      .order('wilaya_code');
    return NextResponse.json(data ?? []);
  } catch {
    return NextResponse.json([]);
  }
}
