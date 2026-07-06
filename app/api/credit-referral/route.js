import { NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabaseAdmin'

const COMMISSION_RATES = { customer: 0.15, athlete: 0.20 }

export async function POST(request) {
  try {
    const { referralCode, orderAmount, referredEmail, buyerId } = await request.json()

    if (!referralCode || !orderAmount) {
      return NextResponse.json({ error: 'Missing referralCode or orderAmount' }, { status: 400 })
    }

    const supabase = getSupabaseAdmin()

    // Find the referrer by code
    const { data: referrer, error: lookupError } = await supabase
      .from('profiles')
      .select('id, role, referral_balance')
      .eq('referral_code', referralCode.toUpperCase())
      .single()

    if (lookupError || !referrer) {
      return NextResponse.json({ error: 'Referral code not found' }, { status: 404 })
    }

    // Prevent self-referral
    if (buyerId && buyerId === referrer.id) {
      return NextResponse.json({ error: 'Cannot use your own referral code' }, { status: 400 })
    }

    const rate = COMMISSION_RATES[referrer.role] ?? COMMISSION_RATES.customer
    const commission = Math.round(orderAmount * rate * 100) / 100

    // Credit the referrer's balance
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ referral_balance: Number(referrer.referral_balance) + commission })
      .eq('id', referrer.id)

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 })
    }

    // Log it for history/auditing
    await supabase.from('referral_uses').insert({
      referrer_id: referrer.id,
      referred_email: referredEmail || null,
      order_amount: orderAmount,
      commission_earned: commission,
    })

    return NextResponse.json({ success: true, commission })
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
