// Server-side only — sends emails via Resend's API.
const RESEND_API_URL = 'https://api.resend.com/emails'
const FROM_ADDRESS = 'BLXCKSHARK <orders@blxckshark.com>'

export async function sendEmail({ to, subject, html }) {
  const res = await fetch(RESEND_API_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: FROM_ADDRESS,
      to,
      subject,
      html,
    }),
  })

  if (!res.ok) {
    const errText = await res.text()
    console.error('Resend send failed:', errText)
  }

  return res.ok
}
