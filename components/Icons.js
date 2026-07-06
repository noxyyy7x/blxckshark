// Shared icon set — feature icons, social icons, payment icons.
// All monochrome/currentColor so they adapt to the dark theme automatically.

export function QualityIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" {...props}>
      <path d="M12 2l2.6 5.6 6.1.6-4.6 4.2 1.3 6-5.4-3-5.4 3 1.3-6-4.6-4.2 6.1-.6z" strokeLinejoin="round" />
    </svg>
  )
}

export function PerformanceIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" {...props}>
      <path d="M4 12h2M18 12h2M6 8v8M18 8v8M8 12h8" strokeLinecap="round" />
    </svg>
  )
}

export function ShieldIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" {...props}>
      <path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6z" strokeLinejoin="round" />
      <path d="M9 12l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function GlobeIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3c2.5 2.5 4 6 4 9s-1.5 6.5-4 9c-2.5-2.5-4-6-4-9s1.5-6.5 4-9z" />
    </svg>
  )
}

// --- Socials ---

export function InstagramIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" {...props}>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  )
}

export function XIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M4 4l16 16M20 4L4 20" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" fill="none" />
    </svg>
  )
}

export function ThreadsIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" {...props}>
      <path d="M12 3c-4.5 0-7 2.7-7 7v4c0 4.3 2.5 7 7 7s7-2.7 7-6c0-2.5-1.5-4-4-4-2 0-3.2 1-3.2 2.5 0 1 .7 1.8 1.8 1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function TikTokIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M16.5 3c.3 1.9 1.6 3.4 3.5 3.7v2.6c-1.3 0-2.6-.4-3.5-1.1v6.3c0 3-2.4 5.5-5.5 5.5S5.5 17.5 5.5 14.5 7.9 9 11 9c.3 0 .6 0 .9.1v2.7c-.3-.1-.6-.1-.9-.1-1.6 0-2.9 1.3-2.9 2.9s1.3 2.9 2.9 2.9 2.9-1.3 2.9-2.9V3h2.6z" />
    </svg>
  )
}

// --- Payment icons (simplified, monochrome outline style) ---

export function VisaIcon(props) {
  return (
    <svg viewBox="0 0 38 24" fill="none" {...props}>
      <rect x="0.5" y="0.5" width="37" height="23" rx="3.5" stroke="currentColor" opacity="0.4" />
      <text x="19" y="16" textAnchor="middle" fontSize="9" fontWeight="700" fill="currentColor" fontFamily="Inter, sans-serif">VISA</text>
    </svg>
  )
}

export function MastercardIcon(props) {
  return (
    <svg viewBox="0 0 38 24" fill="none" {...props}>
      <rect x="0.5" y="0.5" width="37" height="23" rx="3.5" stroke="currentColor" opacity="0.4" />
      <circle cx="16" cy="12" r="6" fill="currentColor" opacity="0.7" />
      <circle cx="22" cy="12" r="6" fill="currentColor" opacity="0.4" />
    </svg>
  )
}

export function AmexIcon(props) {
  return (
    <svg viewBox="0 0 38 24" fill="none" {...props}>
      <rect x="0.5" y="0.5" width="37" height="23" rx="3.5" stroke="currentColor" opacity="0.4" />
      <text x="19" y="15" textAnchor="middle" fontSize="7" fontWeight="700" fill="currentColor" fontFamily="Inter, sans-serif">AMEX</text>
    </svg>
  )
}

export function ApplePayIcon(props) {
  return (
    <svg viewBox="0 0 38 24" fill="none" {...props}>
      <rect x="0.5" y="0.5" width="37" height="23" rx="3.5" stroke="currentColor" opacity="0.4" />
      <text x="19" y="15" textAnchor="middle" fontSize="6.5" fontWeight="600" fill="currentColor" fontFamily="Inter, sans-serif">Pay</text>
    </svg>
  )
}

export function GooglePayIcon(props) {
  return (
    <svg viewBox="0 0 38 24" fill="none" {...props}>
      <rect x="0.5" y="0.5" width="37" height="23" rx="3.5" stroke="currentColor" opacity="0.4" />
      <text x="19" y="15" textAnchor="middle" fontSize="6" fontWeight="600" fill="currentColor" fontFamily="Inter, sans-serif">GPay</text>
    </svg>
  )
}
