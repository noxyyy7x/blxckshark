import { NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabaseAdmin'
import { sendEmail } from '@/lib/resend'
import { dispatchEmail } from '@/lib/emailTemplates'

export async function POST(request) {
  try {
    const { orderRef } = await request.json()
    const supabase = getSupabaseAdmin()

    const { data: order } = await supabase
      .from('orders')
      .select('*')
      .eq('order_ref', orderRef)
      .maybeSingle()

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    await sendEmail({
      to: order.email,
      subject: `Your Order Has Shipped — ${order.order_ref}`,
      html: dispatchEmail(order),
    })

    return NextResponse.json({ success: true })
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
