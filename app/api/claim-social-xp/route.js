import { NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabaseAdmin'

const XP_PER_FOLLOW = 50
const VALID_COLUMNS = ['followed_instagram', 'followed_x', 'followed_tiktok', 'followed_threads']

export async function POST(request) {
  try {
    const { accessToken, column, label } = await request.json()

    if (!accessToken || !VALID_COLUMNS.includes(column)) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
    }

    const supabase = getSupabaseAdmin()

    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken)
    if (authError || !user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select(`xp, ${column}`)
      .eq('id', user.id)
      .single()

    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
    }
    if (profile[column]) {
      return NextResponse.json({ error: 'Already claimed' }, { status: 400 })
    }

    const newXp = profile.xp + XP_PER_FOLLOW

    await supabase
      .from('profiles')
      .update({ [column]: true, xp: newXp })
      .eq('id', user.id)

    await supabase.from('xp_transactions').insert({
      user_id: user.id,
      amount: XP_PER_FOLLOW,
      source: `Followed on ${label}`,
    })

    return NextResponse.json({ success: true, newXp })
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
