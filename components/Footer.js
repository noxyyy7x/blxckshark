'use client'

import { useState } from 'react'
import {
  InstagramIcon,
  XIcon,
  ThreadsIcon,
  TikTokIcon,
  VisaIcon,
  MastercardIcon,
  AmexIcon,
  ApplePayIcon,
  GooglePayIcon,
} from './Icons'

const columns = [
  {
    title: 'Shop',
    links: [
      { label: 'Men', href: '/shop/men' },
      { label: 'Women', href: '/shop/women' },
      { label: 'Accessories', href: '/shop/accessories' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About Us', href: '/about' },
      { label: 'Become an Athlete', href: '/athletes' },
    ],
  },
  {
    title: 'Support',
    links: [
      { label: 'Contact', href: '/contact' },
      { label: 'FAQs', href: '/faqs' },
      { label: 'Shipping Info', href: '/shipping' },
      { label: 'Returns & Exchanges', href: '/returns' },
      { label: 'Size Guide', href: '/size-guide' },
      { label: 'Track Order', href: '/track-order' },
    ],
  },
  {
    title: 'Account',
    links: [
      { label: 'My Account', href: '/account' },
      { label: 'Login / Sign Up', href: '/login' },
      { label: 'Refer a Friend', href: '/account/referral' },
    ],
  },
]

const socials = [
  { name: 'Instagram', href: 'https://instagram.com/blxckshark', Icon: InstagramIcon },
  { name: 'X', href: 'https://x.com/blxckshark', Icon: XIcon },
  { name: 'Threads', href: 'https://threads.net/@blxckshark', Icon: ThreadsIcon },
  { name: 'TikTok', href: 'https://tiktok.com/@blxckshark', Icon: TikTokIcon },
]

const paymentIcons = [VisaIcon, MastercardIcon, AmexIcon, ApplePayIcon, GooglePayIcon]

export default function Footer() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState('idle')

  async function handleSubmit(e) {
    e.preventDefault()
    if (!email.includes('@')) return
    setStatus('loading')
    try {
      const url = process.env.NEXT_PUBLIC_SHEET_SCRIPT_URL
      if (url) {
        await fetch(url, {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, date: new Date().toISOString(), source: 'footer-newsletter' }),
        })
      }
      setStatus('success')
      setEmail('')
    } catch {
      setStatus('error')
    }
  }

  return (
    <footer className="border-t border-white/10 bg-[#0a0a0a] font-body">
      <div className="mx-auto max-w-7xl px-6 py-14">
        {/* Newsletter */}
        <div className="mb-14 flex flex-col items-start gap-4 border-b border-white/10 pb-14 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="font-display text-xl font-bold">JOIN THE MOVEMENT</h3>
            <p className="mt-1 text-sm text-white/50">Be the first to know about drops, restocks and rewards.</p>
          </div>
          {status === 'success' ? (
            <p className="text-sm text-white/80">You&apos;re in. Welcome to the movement. 🦈</p>
          ) : (
            <form onSubmit={handleSubmit} className="flex w-full max-w-md gap-3 sm:w-auto">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="flex-1 rounded-md border border-white/15 bg-white/5 px-4 py-2.5 text-sm outline-none placeholder:text-white/40 focus:border-white/40"
              />
              <button
                type="submit"
                disabled={status === 'loading'}
                className="rounded-md bg-white px-5 py-2.5 text-sm font-semibold text-black transition-transform hover:scale-[1.02] active:scale-[0.98]"
              >
                Notify Me
              </button>
            </form>
          )}
        </div>

        {/* Link columns */}
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
          {columns.map((col) => (
            <div key={col.title}>
              <h4 className="mb-4 text-xs font-semibold tracking-widest text-white/40">
                {col.title.toUpperCase()}
              </h4>
              <ul className="flex flex-col gap-3">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <a href={link.href} className="text-sm text-white/70 transition-colors hover:text-white">
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-14 flex flex-col gap-6 border-t border-white/10 pt-8">
          <div className="flex gap-5">
            {socials.map((s) => (
              <a
                key={s.name}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.name}
                className="text-white/50 transition-colors hover:text-white"
              >
                <s.Icon className="h-5 w-5" />
              </a>
            ))}
          </div>

          <div className="flex flex-wrap gap-2 opacity-70">
            {paymentIcons.map((Icon, i) => (
              <Icon key={i} className="h-6 w-9 text-white/70" />
            ))}
          </div>

          <div className="flex flex-col gap-2 text-xs text-white/40 sm:flex-row sm:items-center sm:justify-between">
            <p>© BLXCKSHARK / ANAYX Ltd, {new Date().getFullYear()}</p>
            <div className="flex gap-4">
              <a href="/privacy" className="hover:text-white">Privacy Policy</a>
              <a href="/terms" className="hover:text-white">Terms & Conditions</a>
              <a href="/cookies" className="hover:text-white">Cookie Policy</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
