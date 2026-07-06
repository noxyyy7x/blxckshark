'use client'

import { usePathname } from 'next/navigation'
import ChatWidget from './ChatWidget'

// Hides the chat widget on the pre-launch Coming Soon page (root "/"),
// since visitors there shouldn't have a way into live support/the main site
// before launch. Shows everywhere else.
export default function ChatWidgetGate() {
  const pathname = usePathname()
  if (pathname === '/') return null
  return <ChatWidget />
}
