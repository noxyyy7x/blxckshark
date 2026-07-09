// Server-side only. Runs once a payment is CONFIRMED (called from the
// Revolut webhook, never directly from the client) — awards XP, generates
// tier reward codes, credits referral commission, sends inbox messages,
// and marks any reward code used on the order as redeemed.
import { getTierForXp, TIERS } from './tiers'
import { sendEmail } from './resend'
import { orderConfirmationEmail, staffNotificationEmail } from './emailTemplates'

const WEEKEND_BOOST_PERCENT = { 1: 0, 2: 10, 3: 15, 4: 25, 5: 25 }
const REFERRAL_PERCENT = { customer: 15, athlete: 20 }

function isWeekendUK() {
  const now = new Date()
  const ukDay = new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/London', weekday: 'short' }).format(now)
  return ukDay === 'Sat' || ukDay === 'Sun'
}

export async function fulfillOrder(supabase, order) {
  // 1. Award purchase XP + generate tier rewards (logged-in buyers only)
  if (order.user_id) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('xp')
      .eq('id', order.user_id)
      .single()

    if (profile) {
      const orderValue = Math.max(0, Number(order.subtotal) - Number(order.discount_amount || 0))
      let xpAwarded = Math.round(orderValue * 10)

      const tierBefore = getTierForXp(profile.xp)
      const boostPercent = WEEKEND_BOOST_PERCENT[tierBefore.number] || 0
      if (isWeekendUK() && boostPercent > 0) {
        xpAwarded = Math.round(xpAwarded * (1 + boostPercent / 100))
      }

      // Guest-checkout account creation bonus — awarded once, alongside
      // the purchase XP, in the same profile update to avoid a race
      // between two separate writes.
      const signupBonus = order.guest_signup_bonus ? 150 : 0
      const newXp = profile.xp + xpAwarded + signupBonus

      await supabase.from('profiles').update({ xp: newXp }).eq('id', order.user_id)
      await supabase.from('xp_transactions').insert({
        user_id: order.user_id,
        amount: xpAwarded,
        source: `Order ${order.order_ref}`,
      })
      if (signupBonus > 0) {
        await supabase.from('xp_transactions').insert({
          user_id: order.user_id,
          amount: signupBonus,
          source: 'Account created at checkout',
        })
      }

      const tierAfter = getTierForXp(newXp)
      const newlyReached = TIERS.filter(
        (t) => t.number > tierBefore.number && t.number <= tierAfter.number && t.rewardAmount
      )

      for (const tier of newlyReached) {
        const rewardCode = `BS${tier.name.replace(/\s/g, '').toUpperCase().slice(0, 4)}${Math.floor(1000 + Math.random() * 9000)}`
        await supabase.from('user_rewards').insert({
          user_id: order.user_id,
          tier_number: tier.number,
          code: rewardCode,
          amount: tier.rewardAmount,
        })
        await supabase.from('messages').insert({
          user_id: order.user_id,
          title: `You've reached ${tier.name}! 🦈`,
          body: `Congratulations — you've unlocked a £${tier.rewardAmount} reward for reaching Tier ${tier.number}.`,
          code: rewardCode,
        })
      }
    }

    // Mark a used tier-reward code as redeemed
    if (order.discount_code) {
      await supabase
        .from('user_rewards')
        .update({ redeemed: true })
        .eq('user_id', order.user_id)
        .eq('code', order.discount_code.toUpperCase())
    }
  }

  // 2. Credit referral commission (if a referral/athlete code was used)
  if (order.referrer_id) {
    const { data: referrer } = await supabase
      .from('profiles')
      .select('role, referral_balance')
      .eq('id', order.referrer_id)
      .single()

    if (referrer) {
      const rate = REFERRAL_PERCENT[referrer.role] ?? REFERRAL_PERCENT.customer
      const commission = Math.round(Number(order.subtotal) * rate * 100) / 100

      await supabase
        .from('profiles')
        .update({ referral_balance: Number(referrer.referral_balance) + commission })
        .eq('id', order.referrer_id)

      await supabase.from('referral_uses').insert({
        referrer_id: order.referrer_id,
        referred_email: order.email,
        order_amount: order.subtotal,
        commission_earned: commission,
      })
    }
  }

  // 3. Send confirmation + internal notification emails (non-blocking —
  // don't let an email failure stop the rest of fulfillment)
  try {
    await sendEmail({
      to: order.email,
      subject: `Order Confirmed — ${order.order_ref}`,
      html: orderConfirmationEmail(order),
    })
    await sendEmail({
      to: 'support@blxckshark.com',
      subject: `New Order — ${order.order_ref} (£${Number(order.total).toFixed(2)})`,
      html: staffNotificationEmail(order),
    })
  } catch (err) {
    console.error('Email sending failed:', err.message)
  }
}
