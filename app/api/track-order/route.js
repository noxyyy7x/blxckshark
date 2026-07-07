import { NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabaseAdmin'

// Looks up an order by reference + email together — both must match,
// so guests (and logged-in customers) can track an order without needing
// an account, while still keeping other people's orders private.
export async function POST(request) {
  try {
    const { orderRef, email } = await request.json()

    if (!orderRef || !email) {
      return NextResponse.json({ error: 'Order reference and email are required.' }, { status: 400 })
    }

    const supabase = getSupabaseAdmin()

    const { data, error } = await supabase
      .from('orders')
      .select('order_ref, status, tracking_number, region, total, created_at, items')
      .eq('order_ref', orderRef.trim().toUpperCase())
      .eq('email', email.trim().toLowerCase())
      .maybeSingle()

    if (error || !data) {
      return NextResponse.json({ error: 'No order found matching that reference and email.' }, { status: 404 })
    }

    return NextResponse.json({ order: data })
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
