// Branded HTML email templates. Uses table-based layout with inline styles
// throughout — this is required for consistent rendering across email
// clients (especially Outlook, which ignores most modern CSS).

const WORDMARK_URL = 'https://blxckshark.com/wordmark-email.png'
const BRAND_BLACK = '#0a0a0a'
const BRAND_SURFACE = '#141414'
const BRAND_BORDER = '#2a2a2a'

function baseWrapper(bodyContent, previewText = '') {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
</head>
<body style="margin:0; padding:0; background-color:${BRAND_BLACK}; font-family: Arial, Helvetica, sans-serif;">
  <div style="display:none; max-height:0; overflow:hidden;">${previewText}</div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:${BRAND_BLACK};">
    <tr>
      <td align="center" style="padding: 32px 16px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px; background-color:${BRAND_SURFACE}; border:1px solid ${BRAND_BORDER}; border-radius:12px; overflow:hidden;">

          <!-- Header -->
          <tr>
            <td align="center" style="padding: 32px 24px; border-bottom:1px solid ${BRAND_BORDER};">
              <img src="${WORDMARK_URL}" alt="BLXCKSHARK" width="180" style="display:block;" />
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding: 32px 24px; color:#ffffff;">
              ${bodyContent}
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td align="center" style="padding: 24px; border-top:1px solid ${BRAND_BORDER};">
              <p style="margin:0 0 8px; font-size:12px; color:#888888;">BLXCKSHARK / ANAYX Ltd</p>
              <p style="margin:0; font-size:12px; color:#666666;">
                <a href="https://blxckshark.com/contact" style="color:#888888; text-decoration:underline;">Support</a>
                &nbsp;&middot;&nbsp;
                <a href="https://blxckshark.com/track-order" style="color:#888888; text-decoration:underline;">Track Order</a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
}

function itemsTable(items) {
  const rows = items.map((item) => `
    <tr>
      <td style="padding: 12px 0; border-bottom:1px solid ${BRAND_BORDER};">
        <table role="presentation" cellpadding="0" cellspacing="0">
          <tr>
            <td style="padding-right:12px;">
              ${
                item.image
                  ? `<img src="${item.image}" width="56" height="56" style="border-radius:6px; object-fit:cover; display:block; background-color:#1a1a1a;" alt="" />`
                  : `<div style="width:56px; height:56px; border-radius:6px; background-color:#1a1a1a;"></div>`
              }
            </td>
            <td style="vertical-align:middle;">
              <p style="margin:0; font-size:14px; color:#ffffff;">${item.name}</p>
              <p style="margin:2px 0 0; font-size:12px; color:#888888;">
                ${[item.size, item.color].filter(Boolean).join(' · ')} &middot; Qty ${item.quantity}
              </p>
            </td>
          </tr>
        </table>
      </td>
      <td style="padding: 12px 0; border-bottom:1px solid ${BRAND_BORDER}; text-align:right; vertical-align:top;">
        <p style="margin:0; font-size:14px; color:#ffffff;">£${(item.price * item.quantity).toFixed(2)}</p>
      </td>
    </tr>`).join('')

  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0">${rows}</table>`
}

export function orderConfirmationEmail(order) {
  const body = `
    <h1 style="margin:0 0 8px; font-size:22px; font-weight:bold; text-transform:uppercase;">Order Confirmed</h1>
    <p style="margin:0 0 24px; font-size:14px; color:#aaaaaa;">
      Thanks for your order — here's a summary of what's on its way.
    </p>

    <p style="margin:0 0 4px; font-size:12px; color:#888888;">ORDER REFERENCE</p>
    <p style="margin:0 0 24px; font-size:16px; font-weight:bold;">${order.order_ref}</p>

    ${itemsTable(order.items)}

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:16px;">
      <tr>
        <td style="padding:4px 0; font-size:13px; color:#aaaaaa;">Subtotal</td>
        <td style="padding:4px 0; font-size:13px; color:#ffffff; text-align:right;">£${Number(order.subtotal).toFixed(2)}</td>
      </tr>
      ${order.discount_amount > 0 ? `
      <tr>
        <td style="padding:4px 0; font-size:13px; color:#aaaaaa;">Discount</td>
        <td style="padding:4px 0; font-size:13px; color:#ffffff; text-align:right;">−£${Number(order.discount_amount).toFixed(2)}</td>
      </tr>` : ''}
      <tr>
        <td style="padding:4px 0; font-size:13px; color:#aaaaaa;">Shipping</td>
        <td style="padding:4px 0; font-size:13px; color:#ffffff; text-align:right;">${Number(order.shipping_cost) === 0 ? 'FREE' : `£${Number(order.shipping_cost).toFixed(2)}`}</td>
      </tr>
      <tr>
        <td style="padding:12px 0 0; font-size:15px; font-weight:bold; border-top:1px solid ${BRAND_BORDER};">Total</td>
        <td style="padding:12px 0 0; font-size:15px; font-weight:bold; text-align:right; border-top:1px solid ${BRAND_BORDER};">£${Number(order.total).toFixed(2)}</td>
      </tr>
    </table>

    <p style="margin:24px 0 4px; font-size:12px; color:#888888;">SHIPPING TO</p>
    <p style="margin:0; font-size:14px; color:#ffffff; line-height:1.5;">
      ${order.shipping_address.name}<br/>
      ${order.shipping_address.line1}<br/>
      ${order.shipping_address.city}, ${order.shipping_address.postcode}
    </p>

    <table role="presentation" cellpadding="0" cellspacing="0" style="margin-top:28px;">
      <tr>
        <td style="border-radius:6px; background-color:#ffffff;">
          <a href="https://blxckshark.com/track-order" style="display:inline-block; padding:12px 24px; font-size:14px; font-weight:bold; color:#000000; text-decoration:none;">
            Track Your Order
          </a>
        </td>
      </tr>
    </table>
  `
  return baseWrapper(body, `Your BLXCKSHARK order ${order.order_ref} is confirmed`)
}

export function dispatchEmail(order) {
  const body = `
    <h1 style="margin:0 0 8px; font-size:22px; font-weight:bold; text-transform:uppercase;">On Its Way 🦈</h1>
    <p style="margin:0 0 24px; font-size:14px; color:#aaaaaa;">
      Your order has been dispatched and is heading your way.
    </p>

    <p style="margin:0 0 4px; font-size:12px; color:#888888;">ORDER REFERENCE</p>
    <p style="margin:0 0 20px; font-size:16px; font-weight:bold;">${order.order_ref}</p>

    ${order.tracking_number ? `
    <p style="margin:0 0 4px; font-size:12px; color:#888888;">TRACKING NUMBER (EVRI)</p>
    <p style="margin:0 0 24px; font-size:16px; font-weight:bold;">${order.tracking_number}</p>
    ` : `
    <p style="margin:0 0 24px; font-size:14px; color:#aaaaaa;">
      International orders ship untracked — it should arrive within the estimated delivery window.
    </p>
    `}

    ${itemsTable(order.items)}

    <table role="presentation" cellpadding="0" cellspacing="0" style="margin-top:28px;">
      <tr>
        <td style="border-radius:6px; background-color:#ffffff;">
          <a href="https://blxckshark.com/track-order" style="display:inline-block; padding:12px 24px; font-size:14px; font-weight:bold; color:#000000; text-decoration:none;">
            Track Your Order
          </a>
        </td>
      </tr>
    </table>
  `
  return baseWrapper(body, `Your BLXCKSHARK order ${order.order_ref} has shipped`)
}

export function staffNotificationEmail(order) {
  const body = `
    <h1 style="margin:0 0 8px; font-size:20px; font-weight:bold; text-transform:uppercase;">New Order Received</h1>
    <p style="margin:0 0 24px; font-size:14px; color:#aaaaaa;">
      ${order.order_ref} &middot; £${Number(order.total).toFixed(2)} &middot; ${order.region}
    </p>

    <p style="margin:0 0 4px; font-size:12px; color:#888888;">CUSTOMER</p>
    <p style="margin:0 0 20px; font-size:14px; color:#ffffff;">${order.email}</p>

    ${itemsTable(order.items)}

    <p style="margin:24px 0 4px; font-size:12px; color:#888888;">SHIPPING TO</p>
    <p style="margin:0 0 24px; font-size:14px; color:#ffffff; line-height:1.5;">
      ${order.shipping_address.name}<br/>
      ${order.shipping_address.line1}<br/>
      ${order.shipping_address.city}, ${order.shipping_address.postcode}
    </p>

    <table role="presentation" cellpadding="0" cellspacing="0">
      <tr>
        <td style="border-radius:6px; background-color:#ffffff;">
          <a href="https://blxckshark.com/admin/orders" style="display:inline-block; padding:12px 24px; font-size:14px; font-weight:bold; color:#000000; text-decoration:none;">
            View in Admin Panel
          </a>
        </td>
      </tr>
    </table>
  `
  return baseWrapper(body, `New order ${order.order_ref} — £${Number(order.total).toFixed(2)}`)
}
