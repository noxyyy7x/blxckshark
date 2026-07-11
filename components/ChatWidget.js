'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '@/context/AuthContext'
import { supabase } from '@/lib/supabaseClient'

function formatTime(iso) {
  return new Date(iso).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
}

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

  // On open, only RESUME an existing open chat — never create one here.
  // A chat row is only ever created the moment the customer sends their
  // first message (see handleSend), so empty/unstarted chats never show
  // up in the staff inbox.
  useEffect(() => {
    if (!open || !user || chatId) return

    async function checkExisting() {
      setLoadingChat(true)

      const { data: existing } = await supabase
        .from('chats')
        .select('id, status, rating')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle()

      if (existing && existing.status === 'open') {
        setChatId(existing.id)
        setChatStatus('open')
        setRating(existing.rating)
      }

      setLoadingChat(false)
    }

    checkExisting()
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
    if (!input.trim() || !user) return

    const content = input.trim()
    setInput('')

    let activeChatId = chatId

    // First message ever in this conversation — create the chat row now,
    // right as it's actually being used, not before.
    if (!activeChatId) {
      const { data: created } = await supabase
        .from('chats')
        .insert({ user_id: user.id })
        .select('id')
        .single()
      activeChatId = created?.id
      setChatId(activeChatId)
      setChatStatus('open')
    }

    if (!activeChatId) return

    await supabase.from('chat_messages').insert({
      chat_id: activeChatId,
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
      <motion.button
        onClick={() => setOpen((v) => !v)}
        aria-label="Open chat"
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-5 right-5 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-white text-black shadow-[0_4px_20px_rgba(255,255,255,0.15)]"
      >
        {open ? '✕' : <ChatIcon />}
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.96 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-24 right-5 z-40 flex h-[500px] w-[350px] max-w-[90vw] flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#0d0d0d] shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center gap-3 border-b border-white/10 bg-gradient-to-r from-white/[0.04] to-transparent px-4 py-3.5">
              <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-white/10">
                <img src="/logo-icon.svg" alt="" className="h-5 w-5" />
              </div>
              <div>
                <p className="font-body text-sm font-semibold text-white">BLXCKSHARK Support</p>
                <p className="font-body flex items-center gap-1.5 text-xs text-white/40">
                  <span className="h-1.5 w-1.5 rounded-full bg-green-400" />
                  Live chat with the team
                </p>
              </div>
            </div>

            {!user ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 text-center">
                <img src="/logo-icon.svg" alt="" className="h-8 w-8 opacity-20" />
                <p className="font-body text-sm text-white/60">Sign in to start a chat with us.</p>
                <a
                  href="/login"
                  className="font-body rounded-md bg-white px-5 py-2 text-xs font-semibold text-black transition-transform hover:scale-105"
                >
                  Sign In
                </a>
              </div>
            ) : loadingChat ? (
              <div className="flex flex-1 items-center justify-center">
                <motion.img
                  src="/logo-icon.svg"
                  alt=""
                  className="h-6 w-6"
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 1.4, repeat: Infinity }}
                />
              </div>
            ) : (
              <>
                <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto bg-gradient-to-b from-transparent to-white/[0.015] px-4 py-4">
                  {messages.length === 0 && (
                    <div className="flex h-full flex-col items-center justify-center gap-2 text-center">
                      <img src="/logo-icon.svg" alt="" className="h-7 w-7 opacity-15" />
                      <p className="font-body text-xs text-white/30">
                        Send a message to start the conversation.
                      </p>
                    </div>
                  )}
                  <AnimatePresence initial={false}>
                    {messages.map((m) => (
                      <motion.div
                        key={m.id}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2 }}
                        className={`flex ${m.sender_role === 'customer' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[78%] px-3.5 py-2.5 text-sm font-body ${
                            m.sender_role === 'customer'
                              ? 'rounded-2xl rounded-br-sm bg-white text-black'
                              : 'rounded-2xl rounded-bl-sm bg-white/10 text-white'
                          }`}
                        >
                          {m.sender_role === 'staff' && (
                            <p className="mb-0.5 text-[10px] font-semibold text-white/50">
                              BLXCKSHARK Staff
                            </p>
                          )}
                          {m.content}
                          <p className={`mt-1 text-[10px] ${m.sender_role === 'customer' ? 'text-black/40' : 'text-white/30'}`}>
                            {formatTime(m.created_at)}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
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
                          className="rounded-full border border-white/15 p-3 transition-all hover:scale-110 hover:bg-white/10"
                        >
                          👍
                        </button>
                        <button
                          onClick={() => handleRate('down')}
                          aria-label="Thumbs down"
                          className="rounded-full border border-white/15 p-3 transition-all hover:scale-110 hover:bg-white/10"
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
                      className="font-body flex-1 rounded-full border border-white/15 bg-white/5 px-4 py-2.5 text-xs outline-none placeholder:text-white/40"
                    />
                    <button
                      type="submit"
                      className="font-body rounded-full bg-white px-4 py-2.5 text-xs font-semibold text-black transition-transform hover:scale-105"
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
