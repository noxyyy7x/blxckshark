'use client'

import { usePathname } from 'next/navigation'
import ChatWidget from './ChatWidget'

// Hides the chat widget on the pre-launch Coming Soon page (root "/"),
// anywhere in the admin/staff panels, and on the private athlete signup
// subdomain — none of these are customer support contexts.
export default function ChatWidgetGate() {
  const pathname = usePathname()
  if (
    pathname === '/' ||
    pathname.startsWith('/admin') ||
    pathname.startsWith('/staff') ||
    pathname.startsWith('/athlete-signup')
  ) {
    return null
  }
  return <ChatWidget />
}
