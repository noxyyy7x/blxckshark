import { NextResponse } from 'next/server'
import crypto from 'crypto'
import { getSupabaseAdmin } from '@/lib/supabaseAdmin'
import { fulfillOrder } from '@/lib/orderFulfillment'

const TIMESTAMP_TOLERANCE_MS = 5 * 60 * 1000 // 5 minutes, per Revolut's docs

function verifySignature(rawBody, timestamp, signatureHeader) {
  const secret = process.env.REVOLUT_WEBHOOK_SECRET
  const payloadToSign = `v1.${timestamp}.${rawBody}`
  const expected = 'v1=' + crypto.createHmac('sha256', secret).update(payloadToSign).digest('hex')

  // Header can contain multiple comma-separated signatures during secret rotation
  const providedSignatures = signatureHeader.split(',').map((s) => s.trim())
  return providedSignatures.includes(expected)
}

export async function POST(request) {
  const rawBody = await request.text()
  const signatureHeader = request.headers.get('revolut-signature')
  const timestamp = request.headers.get('revolut-request-timestamp')

  if (!signatureHeader || !timestamp) {
    return NextResponse.json({ error: 'Missing signature headers' }, { status: 400 })
  }

  // Reject stale requests (replay attack protection, per Revolut's guidance)
  if (Math.abs(Date.now() - Number(timestamp)) > TIMESTAMP_TOLERANCE_MS) {
    return NextResponse.json({ error: 'Timestamp outside tolerance' }, { status: 400 })
  }

  if (!verifySignature(rawBody, timestamp, signatureHeader)) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
  }

  const event = JSON.parse(rawBody)
  console.log('Revolut webhook received:', event.event, event.merchant_order_ext_ref)

  if (event.event === 'ORDER_COMPLETED') {
    const supabase = getSupabaseAdmin()
    const orderRef = event.merchant_order_ext_ref

    console.log('Looking for order_ref:', JSON.stringify(orderRef), 'length:', orderRef?.length)

    const { data: order } = await supabase
      .from('orders')
      .select('*')
      .eq('order_ref', orderRef)
      .maybeSingle()

    console.log('Order lookup result:', order ? `found, status=${order.status}` : 'NOT FOUND')

    if (!order) {
      // Diagnostic: show recent orders so we can compare formats
      const { data: recent } = await supabase
        .from('orders')
        .select('order_ref, created_at')
        .order('created_at', { ascending: false })
        .limit(5)
      console.log('Recent orders in DB:', JSON.stringify(recent?.map((o) => o.order_ref)))
    }

    // Idempotency: only fulfill once, even if Revolut sends this event twice
    if (order && order.status === 'pending_payment') {
      await supabase.from('orders').update({ status: 'processing' }).eq('id', order.id)
      await fulfillOrder(supabase, order)
      console.log('Order fulfilled successfully:', orderRef)
    }
  }

  return NextResponse.json({ received: true })
}
