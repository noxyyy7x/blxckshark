'use client'

import { useState, useEffect } from 'react'
import { GoogleAnalytics } from '@next/third-parties/google'

const STORAGE_KEY = 'blxckshark_cookie_consent'
const GA_ID = 'G-TDKK9DPYR8'

export default function AnalyticsGate() {
  const [consented, setConsented] = useState(false)

  useEffect(() => {
    function checkConsent() {
      setConsented(localStorage.getItem(STORAGE_KEY) === 'accepted')
    }
    checkConsent()
    window.addEventListener('cookieConsentChanged', checkConsent)
    return () => window.removeEventListener('cookieConsentChanged', checkConsent)
  }, [])

  if (!consented) return null
  return <GoogleAnalytics gaId={GA_ID} />
}
