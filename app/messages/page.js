'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import NotificationBar from '@/components/NotificationBar'
import { useAuth } from '@/context/AuthContext'
import { supabase } from '@/lib/supabaseClient'
import BrandLoader from '@/components/BrandLoader'
import EmptyState from '@/components/EmptyState'

export default function MessagesPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [messages, setMessages] = useState([])
  const [pageLoading, setPageLoading] = useState(true)
  const [copiedCode, setCopiedCode] = useState(null)

  useEffect(() => {
    if (!loading && !user) return // handled below, not redirected — inbox shows sign-in prompt instead
  }, [loading, user])

  useEffect(() => {
    if (!user) return

    async function load() {
      const now = new Date().toISOString()
      const { data } = await supabase
        .from('messages')
        .select('*')
        .or(`user_id.eq.${user.id},user_id.is.null`)
        .or(`expires_at.is.null,expires_at.gt.${now}`)
        .order('created_at', { ascending: false })

      setMessages(data || [])
      setPageLoading(false)

      // Mark as seen
      await supabase.from('profiles').update({ last_seen_messages_at: now }).eq('id', user.id)
    }
    load()
  }, [user])

  function handleCopy(code) {
    navigator.clipboard.writeText(code)
    setCopiedCode(code)
    setTimeout(() => setCopiedCode(null), 2000)
  }

  return (
    <>
      <NotificationBar />
      <Header />

      <main className="min-h-screen bg-[#0a0a0a] text-white">
        <div className="mx-auto max-w-2xl px-6 py-12">
          <h1 className="font-display mb-8 text-2xl font-bold uppercase tracking-tight">Messages</h1>

          {!user ? (
            <div className="rounded-lg border border-white/10 bg-white/[0.03] p-6 text-center">
              <p className="font-body mb-4 text-sm text-white/60">Sign in to view your messages.</p>
              <a href="/login" className="font-body inline-block rounded-md bg-white px-6 py-2.5 text-sm font-semibold text-black">
                Sign In
              </a>
            </div>
          ) : pageLoading ? (
            <BrandLoader />
          ) : messages.length === 0 ? (
            <EmptyState
              title="No messages yet."
              subtitle="Updates, rewards, and offers will show up here."
            />
          ) : (
            <div className="flex flex-col gap-3">
              {messages.map((m) => (
                <div key={m.id} className="rounded-lg border border-white/10 bg-white/[0.03] p-4">
                  <div className="mb-1 flex items-center justify-between">
                    <p className="font-body text-sm font-semibold">{m.title}</p>
                    <p className="font-body text-xs text-white/30">
                      {new Date(m.created_at).toLocaleDateString('en-GB')}
                    </p>
                  </div>
                  <p className="font-body text-sm text-white/60">{m.body}</p>
                  {m.code && (
                    <button
                      onClick={() => handleCopy(m.code)}
                      className="font-body mt-3 rounded-md bg-white px-4 py-1.5 text-xs font-semibold text-black"
                    >
                      {copiedCode === m.code ? 'Copied ✓' : `Copy Code: ${m.code}`}
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </>
  )
}
