import { NextResponse } from 'next/server';
import { getSupabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const wilaya = Number(searchParams.get('wilaya'));
  if (!Number.isInteger(wilaya)) {
    return NextResponse.json([]);
  }
  try {
    const sb = getSupabase();
    const { data } = await sb
      .from('offices')
      .select('id, wilaya_code, name_ar, name_fr, address, phone')
      .eq('wilaya_code', wilaya)
      .eq('active', true)
      .order('name_fr');
    return NextResponse.json(data ?? []);
  } catch {
    return NextResponse.json([]);
  }
}
