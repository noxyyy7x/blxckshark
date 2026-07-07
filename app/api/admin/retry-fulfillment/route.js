import { NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabaseAdmin'
import { fulfillOrder } from '@/lib/orderFulfillment'

// Manual safety-net: lets staff re-trigger fulfillment for an order stuck
// on pending_payment (e.g. if a webhook was ever missed or delayed).
// Requires the caller's own session token so we can verify they're staff.
export async function POST(request) {
  try {
    const { orderRef, accessToken } = await request.json()
    if (!orderRef || !accessToken) {
      return NextResponse.json({ error: 'Missing orderRef or accessToken' }, { status: 400 })
    }

    const supabase = getSupabaseAdmin()

    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken)
    if (authError || !user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const { data: staff } = await supabase
      .from('staff_users')
      .select('id')
      .eq('auth_id', user.id)
      .maybeSingle()
    if (!staff) {
      return NextResponse.json({ error: 'Not authorised' }, { status: 403 })
    }

    const { data: order } = await supabase
      .from('orders')
      .select('*')
      .eq('order_ref', orderRef)
      .maybeSingle()

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }
    if (order.status !== 'pending_payment') {
      return NextResponse.json({ error: 'Order is not pending — nothing to retry' }, { status: 400 })
    }

    await supabase.from('orders').update({ status: 'processing' }).eq('id', order.id)
    await fulfillOrder(supabase, order)

    return NextResponse.json({ success: true })
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
