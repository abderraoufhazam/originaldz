import { getSettings } from '@/lib/settings';

export default async function SettingsScript() {
  let payload: Record<string, unknown> = {};
  try {
    const s = await getSettings();
    payload = {
      fb_pixel: s.fb_pixel,
      tiktok_pixel: s.tiktok_pixel,
      whatsapp: s.whatsapp,
      welcome_discount: s.welcome_discount,
      ga_id: s.ga_id,
    };
  } catch {
    // Supabase not configured yet — the store still renders.
  }
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `window.__ODZ_SETTINGS__ = ${JSON.stringify(payload)};`,
      }}
    />
  );
}
