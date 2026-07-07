'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

// This page has been superseded by /admin/chat, which uses the proper
// staff permissions system instead of a hardcoded owner email check.
export default function StaffChatRedirect() {
  const router = useRouter()
  useEffect(() => {
    router.replace('/admin/chat')
  }, [router])
  return null
}
