// Generates a branded, downloadable Instagram Story–sized (1080x1920) share
// card with the customer's referral code, entirely client-side via Canvas.
export function generateShareCard({ code, percent }) {
  const canvas = document.createElement('canvas')
  canvas.width = 1080
  canvas.height = 1920
  const ctx = canvas.getContext('2d')

  // Background
  ctx.fillStyle = '#0a0a0a'
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  // Subtle grid texture
  ctx.strokeStyle = 'rgba(255,255,255,0.04)'
  ctx.lineWidth = 1
  for (let x = 0; x < canvas.width; x += 60) {
    ctx.beginPath()
    ctx.moveTo(x, 0)
    ctx.lineTo(x, canvas.height)
    ctx.stroke()
  }
  for (let y = 0; y < canvas.height; y += 60) {
    ctx.beginPath()
    ctx.moveTo(0, y)
    ctx.lineTo(canvas.width, y)
    ctx.stroke()
  }

  // Soft glow behind the code
  const glow = ctx.createRadialGradient(540, 960, 50, 540, 960, 500)
  glow.addColorStop(0, 'rgba(255,255,255,0.08)')
  glow.addColorStop(1, 'rgba(255,255,255,0)')
  ctx.fillStyle = glow
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  ctx.textAlign = 'center'

  // Wordmark
  ctx.fillStyle = '#ffffff'
  ctx.font = 'italic 900 56px Arial'
  ctx.fillText('BLXCKSHARK', 540, 260)

  // Eyebrow label
  ctx.fillStyle = 'rgba(255,255,255,0.5)'
  ctx.font = '600 28px Arial'
  ctx.fillText('USE MY CODE', 540, 780)

  // The code itself, large
  ctx.fillStyle = '#ffffff'
  ctx.font = '900 130px Arial'
  ctx.fillText(code, 540, 940)

  // Underline accent
  const codeWidth = ctx.measureText(code).width
  ctx.fillRect(540 - codeWidth / 2, 980, codeWidth, 4)

  // Percent off callout
  ctx.fillStyle = 'rgba(255,255,255,0.7)'
  ctx.font = '700 48px Arial'
  ctx.fillText(`${percent}% OFF YOUR FIRST ORDER`, 540, 1090)

  // Footer URL
  ctx.fillStyle = 'rgba(255,255,255,0.4)'
  ctx.font = '500 34px Arial'
  ctx.fillText('blxckshark.com', 540, 1720)

  ctx.fillStyle = 'rgba(255,255,255,0.25)'
  ctx.font = '400 26px Arial'
  ctx.fillText('Built For More', 540, 1770)

  // Trigger download
  const link = document.createElement('a')
  link.download = `blxckshark-${code.toLowerCase()}.png`
  link.href = canvas.toDataURL('image/png')
  link.click()
}
