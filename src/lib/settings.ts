import { getSupabase } from './supabase';
import type { Settings } from './types';

export const DEFAULT_SETTINGS: Settings = {
  store_name: 'originaldz',
  tagline_ar: 'تسوّق بثقة — الدفع عند الاستلام',
  tagline_en: 'Shop with confidence — cash on delivery',
  tagline_fr: 'Achetez en toute confiance — paiement à la livraison',
  whatsapp: '',
  phone: '',
  fb_pixel: '',
  tiktok_pixel: '',
  welcome_discount: 10,
  loyalty_discount: 5,
  delivery_fee_mode: 'per_wilaya',
};

let cache: { settings: Settings; at: number } | null = null;
const TTL = 60_000; // 1 minute

export async function getSettings(): Promise<Settings> {
  if (cache && Date.now() - cache.at < TTL) return cache.settings;
  const sb = getSupabase();
  const { data } = await sb.from('settings').select('key,value');
  const out: Record<string, unknown> = { ...DEFAULT_SETTINGS };
  for (const row of data ?? []) {
    if (row.value !== null && row.value !== undefined) out[row.key] = row.value;
  }
  const settings = out as unknown as Settings;
  cache = { settings, at: Date.now() };
  return settings;
}

export async function saveSettings(patch: Partial<Settings>): Promise<void> {
  const sb = getSupabase();
  const entries = Object.entries(patch).map(([key, value]) => ({ key, value }));
  if (entries.length === 0) return;
  await sb.from('settings').upsert(entries, { onConflict: 'key' });
  cache = null;
}
