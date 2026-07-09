import { NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabaseAdmin'
import { createRevolutOrder } from '@/lib/revolut'

const CURRENCY_BY_REGION = { UK: 'GBP', US: 'USD', EU: 'EUR' }

export async function POST(request) {
  try {
    const {
      email, items, subtotal, discountAmount, shippingCost, total,
      discountCode, referrerId, region, shippingAddress, buyerId, guestSignupBonus,
    } = await request.json()

    if (!email || !items || items.length === 0 || !shippingAddress || !total) {
      return NextResponse.json({ error: 'Missing required order fields' }, { status: 400 })
    }

    const supabase = getSupabaseAdmin()
    const orderRef = `BS-${Date.now().toString().slice(-8)}`

    // Save the order as pending BEFORE payment — the webhook confirms it
    // once Revolut tells us the payment actually succeeded.
    const { error: orderError } = await supabase.from('orders').insert({
      order_ref: orderRef,
      user_id: buyerId || null,
      email,
      items,
      subtotal,
      discount_amount: discountAmount || 0,
      shipping_cost: shippingCost || 0,
      total,
      discount_code: discountCode || null,
      referrer_id: referrerId || null,
      region,
      shipping_address: shippingAddress,
      status: 'pending_payment',
      guest_signup_bonus: guestSignupBonus || false,
    })

    if (orderError) {
      return NextResponse.json({ error: orderError.message }, { status: 500 })
    }

    const currency = CURRENCY_BY_REGION[region] || 'GBP'
    const revolutOrder = await createRevolutOrder({
      amount: total,
      currency,
      merchantOrderRef: orderRef,
      email,
    })

    await supabase
      .from('orders')
      .update({ revolut_order_id: revolutOrder.id })
      .eq('order_ref', orderRef)

    return NextResponse.json({ token: revolutOrder.token, orderRef })
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
