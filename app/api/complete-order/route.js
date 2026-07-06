import { NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabaseAdmin'
import { getTierForXp } from '@/lib/tiers'

const WEEKEND_BOOST_PERCENT = { 1: 0, 2: 10, 3: 15, 4: 25, 5: 25 }

function isWeekendUK() {
  const now = new Date()
  // Approximate UK time via Europe/London formatting
  const ukDay = new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/London', weekday: 'short' }).format(now)
  return ukDay === 'Sat' || ukDay === 'Sun'
}

export async function POST(request) {
  try {
    const {
      email, items, subtotal, discountAmount, shippingCost, total,
      discountCode, region, shippingAddress, buyerId,
    } = await request.json()

    if (!email || !items || items.length === 0 || !shippingAddress) {
      return NextResponse.json({ error: 'Missing required order fields' }, { status: 400 })
    }

    const supabase = getSupabaseAdmin()
    const orderRef = `BS-${Date.now().toString().slice(-8)}`

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
      region,
      shipping_address: shippingAddress,
    })

    if (orderError) {
      return NextResponse.json({ error: orderError.message }, { status: 500 })
    }

    // Award purchase XP only for logged-in buyers (guests earn no XP, per spec)
    if (buyerId) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('xp')
        .eq('id', buyerId)
        .single()

      if (profile) {
        const orderValue = Math.max(0, subtotal - (discountAmount || 0))
        let xpAwarded = Math.round(orderValue * 10) // 10xp per £1

        const currentTier = getTierForXp(profile.xp)
        const boostPercent = WEEKEND_BOOST_PERCENT[currentTier.number] || 0
        if (isWeekendUK() && boostPercent > 0) {
          xpAwarded = Math.round(xpAwarded * (1 + boostPercent / 100))
        }

        await supabase
          .from('profiles')
          .update({ xp: profile.xp + xpAwarded })
          .eq('id', buyerId)

        await supabase.from('xp_transactions').insert({
          user_id: buyerId,
          amount: xpAwarded,
          source: `Order ${orderRef}`,
        })
      }
    }

    return NextResponse.json({ success: true, orderRef })
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
