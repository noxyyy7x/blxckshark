// Server-side only — creates orders via Revolut's Merchant API.
// Never import this into a 'use client' component.

const API_BASE = process.env.REVOLUT_API_BASE || 'https://merchant.revolut.com/api'
const API_VERSION = '2024-09-01'

export async function createRevolutOrder({ amount, currency, merchantOrderRef, email }) {
  const res = await fetch(`${API_BASE}/orders`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.REVOLUT_SECRET_KEY}`,
      'Content-Type': 'application/json',
      'Revolut-Api-Version': API_VERSION,
    },
    body: JSON.stringify({
      amount: Math.round(amount * 100), // Revolut expects minor units (pence/cents)
      currency,
      customer_email: email,
      capture_mode: 'automatic', // ensures ORDER_COMPLETED fires right after payment, not just ORDER_AUTHORISED
      // Not functionally used by our embedded checkout flow, but needed so
      // ANAYX and Vexer's shared-account webhook filters (which key off
      // redirect_url) can correctly identify and skip BLXCKSHARK orders.
      redirect_url: 'https://blxckshark.com/order-confirmation',
      merchant_order_data: {
        reference: merchantOrderRef,
      },
    }),
  })

  if (!res.ok) {
    const errText = await res.text()
    throw new Error(`Revolut order creation failed (${res.status}): ${errText}`)
  }

  return res.json() // { id, token, state, ... } — token is what the widget needs
}
