import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRole = process.env.SUPABASE_SERVICE_ROLE_KEY;

let client: SupabaseClient | null = null;

/**
 * Server-side Supabase client using the service-role key.
 * Only used in Server Components and Route Handlers — never imported by client code.
 */
export function getSupabase(): SupabaseClient {
  if (!url || !serviceRole) {
    throw new Error('Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.');
  }
  if (!client) {
    client = createClient(url, serviceRole, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }
  return client;
}
