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

export function HeartIconOutline({ filled, ...props }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill={filled ? 'currentColor' : 'none'}
      stroke="currentColor"
      strokeWidth="1.6"
      {...props}
    >
      <path d="M12 21s-7.5-4.6-10-9.3C.5 8.4 2.4 5 6 5c2 0 3.5 1 6 3.5C14.5 6 16 5 18 5c3.6 0 5.5 3.4 4 6.7C19.5 16.4 12 21 12 21Z" />
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
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  )
}

export function ThreadsIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M12.186 24h-.007c-3.581-.024-6.334-1.205-8.184-3.509C2.35 18.44 1.5 15.586 1.472 12.01v-.017c.03-3.579.879-6.43 2.525-8.482C5.845 1.205 8.6.024 12.18 0h.014c2.746.02 5.043.725 6.826 2.098 1.677 1.29 2.858 3.13 3.509 5.467l-2.04.569c-1.104-3.96-3.898-5.984-8.304-6.015-2.91.022-5.11.936-6.54 2.717-1.34 1.67-2.033 4.09-2.06 7.19.027 3.1.72 5.52 2.06 7.19 1.43 1.78 3.63 2.69 6.54 2.71 2.623-.02 4.358-.64 5.8-2.08 1.647-1.65 1.613-3.67 1.088-4.89-.31-.73-.877-1.34-1.638-1.79-.192 1.363-.622 2.45-1.284 3.24-.886 1.055-2.146 1.638-3.743 1.717-1.21.06-2.37-.226-3.286-.805-1.093-.688-1.73-1.706-1.79-2.87-.104-2.198 1.72-3.802 4.47-3.99.98-.067 1.906-.031 2.758.108-.114-.7-.36-1.24-.735-1.61-.505-.494-1.297-.75-2.353-.76-1.94.02-3.5.71-4.637 2.05l-1.7-1.28c1.5-1.79 3.61-2.79 6.29-2.83 3.02.037 4.99 1.68 5.34 4.61 1.34.596 2.32 1.53 2.87 2.75.79 1.72.85 4.5-1.4 6.72-1.87 1.87-4.13 2.65-7.24 2.68z" />
    </svg>
  )
}

export function TikTokIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M12.53.02C13.84 0 15.14.01 16.44 0c.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
    </svg>
  )
}

// --- Payment icons (brand-colored, recognizable at a glance) ---

export function VisaIcon(props) {
  return (
    <svg viewBox="0 0 38 24" fill="none" {...props}>
      <rect width="38" height="24" rx="4" fill="#1A1F71" />
      <text x="19" y="16" textAnchor="middle" fontSize="10" fontWeight="700" fontStyle="italic" fill="#ffffff" fontFamily="Arial, sans-serif">VISA</text>
    </svg>
  )
}

export function MastercardIcon(props) {
  return (
    <svg viewBox="0 0 38 24" fill="none" {...props}>
      <rect width="38" height="24" rx="4" fill="#16171A" />
      <circle cx="15.5" cy="12" r="7" fill="#EB001B" />
      <circle cx="22.5" cy="12" r="7" fill="#F79E1B" />
      <path d="M19 6.5a7 7 0 0 1 0 11 7 7 0 0 1 0-11z" fill="#FF5F00" />
    </svg>
  )
}

export function AmexIcon(props) {
  return (
    <svg viewBox="0 0 38 24" fill="none" {...props}>
      <rect width="38" height="24" rx="4" fill="#006FCF" />
      <text x="19" y="15" textAnchor="middle" fontSize="7.5" fontWeight="700" fill="#ffffff" fontFamily="Arial, sans-serif" letterSpacing="0.5">AMEX</text>
    </svg>
  )
}

export function ApplePayIcon(props) {
  return (
    <svg viewBox="0 0 38 24" fill="none" {...props}>
      <rect width="38" height="24" rx="4" fill="#000000" />
      <g transform="translate(6, 6.5) scale(0.5)">
        <path
          fill="#ffffff"
          d="M16.365 1.43c0 1.14-.493 2.27-1.177 3.08-.744.9-1.99 1.57-2.987 1.57-.12 0-.23-.02-.3-.03-.01-.06-.04-.22-.04-.39 0-1.15.572-2.27 1.206-2.98.804-.94 2.142-1.64 3.248-1.68.03.13.05.28.05.43zm4.565 15.71c-.03.07-.463 1.58-1.518 3.12-.945 1.34-1.94 2.71-3.43 2.71-1.517 0-1.9-.88-3.63-.88-1.698 0-2.302.91-3.67.91-1.377 0-2.332-1.26-3.428-2.8-1.287-1.82-2.323-4.63-2.323-7.28 0-4.28 2.797-6.55 5.552-6.55 1.448 0 2.633.95 3.5.95.83 0 2.09-1 3.639-1 .604 0 2.752.05 4.19 2.1-.111.07-2.28 1.34-2.28 4.05 0 3.4 2.99 4.61 3.398 4.67z"
        />
      </g>
      <text x="17" y="15.5" fontSize="7.5" fontWeight="600" fill="#ffffff" fontFamily="Arial, sans-serif">Pay</text>
    </svg>
  )
}

export function GooglePayIcon(props) {
  return (
    <svg viewBox="0 0 38 24" fill="none" {...props}>
      <rect width="38" height="24" rx="4" fill="#ffffff" />
      <text x="10" y="15.5" fontSize="9" fontWeight="600" fontFamily="Arial, sans-serif">
        <tspan fill="#4285F4">G</tspan>
      </text>
      <text x="16" y="15.5" fontSize="8.5" fontWeight="500" fill="#5F6368" fontFamily="Arial, sans-serif">Pay</text>
    </svg>
  )
}
