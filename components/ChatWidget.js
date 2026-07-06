'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '@/context/AuthContext'
import { supabase } from '@/lib/supabaseClient'

export default function ChatWidget() {
  const { user } = useAuth()
  const [open, setOpen] = useState(false)
  const [chatId, setChatId] = useState(null)
  const [chatStatus, setChatStatus] = useState('open')
  const [rating, setRating] = useState(null)
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loadingChat, setLoadingChat] = useState(false)
  const scrollRef = useRef(null)

  // Find or create this user's chat when the widget is opened
  useEffect(() => {
    if (!open || !user || chatId) return

    async function initChat() {
      setLoadingChat(true)

      const { data: existing } = await supabase
        .from('chats')
        .select('id, status, rating')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle()

      let id

      if (existing && existing.status === 'open') {
        // Resume the existing open conversation
        id = existing.id
        setChatStatus('open')
        setRating(existing.rating)
      } else {
        // No chat yet, or the last one is closed — start a fresh conversation
        const { data: created } = await supabase
          .from('chats')
          .insert({ user_id: user.id })
          .select('id, status, rating')
          .single()
        id = created?.id
        setChatStatus('open')
        setRating(null)
      }

      setChatId(id)
      setLoadingChat(false)
    }

    initChat()
  }, [open, user, chatId])

  // Load message history + subscribe to realtime updates
  useEffect(() => {
    if (!chatId) return

    supabase
      .from('chat_messages')
      .select('*')
      .eq('chat_id', chatId)
      .order('created_at', { ascending: true })
      .then(({ data }) => setMessages(data || []))

    const channel = supabase
      .channel(`chat-${chatId}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'chat_messages', filter: `chat_id=eq.${chatId}` },
        (payload) => setMessages((prev) => [...prev, payload.new])
      )
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'chats', filter: `id=eq.${chatId}` },
        (payload) => {
          setChatStatus(payload.new.status)
          setRating(payload.new.rating)
        }
      )
      .subscribe()

    return () => supabase.removeChannel(channel)
  }, [chatId])

  // Auto-scroll to latest message
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages])

  async function handleSend(e) {
    e.preventDefault()
    if (!input.trim() || !chatId) return

    const content = input.trim()
    setInput('')

    await supabase.from('chat_messages').insert({
      chat_id: chatId,
      sender_role: 'customer',
      content,
    })
  }

  async function handleRate(value) {
    setRating(value) // optimistic
    await supabase
      .from('chats')
      .update({ rating: value, rated_at: new Date().toISOString() })
      .eq('id', chatId)
  }

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label="Open chat"
        className="fixed bottom-5 right-5 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-white text-black shadow-lg transition-transform hover:scale-105"
      >
        {open ? '✕' : <ChatIcon />}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.96 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-24 right-5 z-40 flex h-[480px] w-[340px] max-w-[90vw] flex-col overflow-hidden rounded-xl border border-white/10 bg-[#0d0d0d] shadow-2xl"
          >
            <div className="border-b border-white/10 px-4 py-3">
              <p className="font-body text-sm font-semibold text-white">BLXCKSHARK Support</p>
              <p className="font-body text-xs text-white/40">We typically reply within a few hours</p>
            </div>

            {!user ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 text-center">
                <p className="font-body text-sm text-white/60">Sign in to start a chat with us.</p>
                <a
                  href="/login"
                  className="font-body rounded-md bg-white px-5 py-2 text-xs font-semibold text-black"
                >
                  Sign In
                </a>
              </div>
            ) : loadingChat ? (
              <div className="flex flex-1 items-center justify-center">
                <p className="font-body text-xs text-white/40">Loading...</p>
              </div>
            ) : (
              <>
                <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
                  {messages.length === 0 && (
                    <p className="font-body text-center text-xs text-white/30">
                      Send a message to start the conversation.
                    </p>
                  )}
                  {messages.map((m) => (
                    <div
                      key={m.id}
                      className={`flex ${m.sender_role === 'customer' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[75%] rounded-lg px-3 py-2 text-sm font-body ${
                          m.sender_role === 'customer'
                            ? 'bg-white text-black'
                            : 'bg-white/10 text-white'
                        }`}
                      >
                        {m.sender_role === 'staff' && (
                          <p className="mb-0.5 text-[10px] font-semibold text-white/50">
                            BLXCKSHARK Staff
                          </p>
                        )}
                        {m.content}
                      </div>
                    </div>
                  ))}
                </div>

                {chatStatus === 'closed' ? (
                  rating ? (
                    <div className="border-t border-white/10 p-4 text-center">
                      <p className="font-body text-xs text-white/50">
                        Thanks for your feedback! 🦈
                      </p>
                    </div>
                  ) : (
                    <div className="border-t border-white/10 p-4 text-center">
                      <p className="font-body mb-3 text-xs text-white/60">
                        This chat has ended. How was your experience?
                      </p>
                      <div className="flex justify-center gap-4">
                        <button
                          onClick={() => handleRate('up')}
                          aria-label="Thumbs up"
                          className="rounded-full border border-white/15 p-3 transition-colors hover:bg-white/10"
                        >
                          👍
                        </button>
                        <button
                          onClick={() => handleRate('down')}
                          aria-label="Thumbs down"
                          className="rounded-full border border-white/15 p-3 transition-colors hover:bg-white/10"
                        >
                          👎
                        </button>
                      </div>
                    </div>
                  )
                ) : (
                  <form onSubmit={handleSend} className="flex gap-2 border-t border-white/10 p-3">
                    <input
                      type="text"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder="Type a message..."
                      className="font-body flex-1 rounded-md border border-white/15 bg-white/5 px-3 py-2 text-xs outline-none placeholder:text-white/40"
                    />
                    <button
                      type="submit"
                      className="font-body rounded-md bg-white px-4 py-2 text-xs font-semibold text-black"
                    >
                      Send
                    </button>
                  </form>
                )}
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

function ChatIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M4 5h16v11H8l-4 4z" strokeLinejoin="round" />
    </svg>
  )
}
