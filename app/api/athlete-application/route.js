import { NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabaseAdmin'

// Checks if a code is free (used for both live-typing checks and the
// final submit) — checked against both referral codes and discount codes.
export async function GET(request) {
  const code = new URL(request.url).searchParams.get('code')?.trim().toUpperCase()
  if (!code || code.length < 3) {
    return NextResponse.json({ available: false })
  }

  const supabase = getSupabaseAdmin()
  const [{ data: existingProfile }, { data: existingDiscount }] = await Promise.all([
    supabase.from('profiles').select('id').eq('referral_code', code).maybeSingle(),
    supabase.from('discount_codes').select('id').eq('code', code).maybeSingle(),
  ])

  return NextResponse.json({ available: !existingProfile && !existingDiscount })
}

// Saves the pending athlete application server-side (service role), so it
// works regardless of whether the new signup's session is confirmed yet.
export async function POST(request) {
  try {
    const { userId, code } = await request.json()
    if (!userId || !code) {
      return NextResponse.json({ error: 'Missing userId or code' }, { status: 400 })
    }

    const supabase = getSupabaseAdmin()
    const cleanCode = code.trim().toUpperCase()

    const { error } = await supabase
      .from('profiles')
      .update({ pending_athlete_code: cleanCode, athlete_application_status: 'pending' })
      .eq('id', userId)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
