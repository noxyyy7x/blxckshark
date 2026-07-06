// Server-side only Supabase client using the service role key.
// NEVER import this into a 'use client' component — it bypasses RLS entirely.
// Only used inside app/api/* route handlers (server-side).
import { createClient } from '@supabase/supabase-js'

export function getSupabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )
}
