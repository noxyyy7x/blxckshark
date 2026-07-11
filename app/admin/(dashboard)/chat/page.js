'use client'

import { useState, useEffect, useRef } from 'react'
import { useAuth } from '@/context/AuthContext'
import { supabase } from '@/lib/supabaseClient'
import { getStaffProfile, logActivity } from '@/lib/staff'
import { motion, AnimatePresence } from 'framer-motion'

const CANNED_RESPONSES = [
  { label: 'Order status', text: 'Thanks for reaching out! Orders typically dispatch within 1-2 business days. You can track your order from your account page once shipped.' },
  { label: 'Returns', text: 'You can return UK orders within 14 days, and international orders are also accepted (customer covers return postage). Let us know if you need the returns address.' },
  { label: 'Size guide', text: "We're finalizing our size guide as products go live — I'll help you find the right fit in the meantime, just let me know what you're after." },
  { label: 'Thanks', text: 'Thanks for getting in touch — let us know if there is anything else we can help with!' },
]

function relativeTime(iso) {
  const diff = Date.now() - new Date(iso).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  if (days < 7) return `${days}d ago`
  return new Date(iso).toLocaleDateString('en-GB')
}

function initialsOf(name) {
  return (name || '?').charAt(0).toUpperCase()
}

export default function AdminChatPage() {
  const { user } = useAuth()
  const [staffId, setStaffId] = useState(null)
  const [chats, setChats] = useState([])
  const [activeChatId, setActiveChatId] = useState(null)
  const [messages, setMessages] = useState([])
  const [reply, setReply] = useState('')
  const scrollRef = useRef(null)

  useEffect(() => {
    if (user) getStaffProfile(user.id).then((s) => setStaffId(s?.id))
  }, [user])

  useEffect(() => {
    loadChats()

    const channel = supabase
      .channel('admin-chats')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'chats' }, loadChats)
      .subscribe()

    return () => supabase.removeChannel(channel)
  }, [])

  async function loadChats() {
    const { data } = await supabase
      .from('chats')
      .select('*, profiles(email, display_name)')
      .order('updated_at', { ascending: false })
    setChats(data || [])
  }

  useEffect(() => {
    if (!activeChatId) return

    supabase
      .from('chat_messages')
      .select('*')
      .eq('chat_id', activeChatId)
      .order('created_at', { ascending: true })
      .then(({ data }) => setMessages(data || []))

    const channel = supabase
      .channel(`admin-chat-${activeChatId}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'chat_messages', filter: `chat_id=eq.${activeChatId}` },
        (payload) => setMessages((prev) => [...prev, payload.new])
      )
      .subscribe()

    return () => supabase.removeChannel(channel)
  }, [activeChatId])

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages])

  async function handleClaim(chatId) {
    await supabase.from('chats').update({ claimed: true }).eq('id', chatId)
    await logActivity(staffId, 'chat_claimed', { chatId })
  }

  async function handleClose(chatId) {
    await supabase.from('chats').update({ status: 'closed' }).eq('id', chatId)
    await logActivity(staffId, 'chat_closed', { chatId })
  }

  async function sendReply(text) {
    if (!text.trim() || !activeChatId) return
    await supabase.from('chat_messages').insert({
      chat_id: activeChatId,
      sender_role: 'staff',
      content: text.trim(),
    })
    await supabase.from('chats').update({ claimed: true, updated_at: new Date().toISOString() }).eq('id', activeChatId)
    setReply('')
  }

  const activeChat = chats.find((c) => c.id === activeChatId)

  return (
    <div className="flex h-screen">
      {/* Chat list */}
      <div className="w-80 flex-shrink-0 overflow-y-auto border-r border-white/10 bg-white/[0.01]">
        <div className="border-b border-white/10 p-5">
          <h1 className="font-display text-lg font-bold uppercase tracking-tight">Live Chat</h1>
          <p className="font-body mt-0.5 text-xs text-white/40">
            {chats.filter((c) => c.status === 'open').length} active conversation{chats.filter((c) => c.status === 'open').length !== 1 ? 's' : ''}
          </p>
        </div>
        {chats.length === 0 ? (
          <div className="flex flex-col items-center py-16 text-center">
            <img src="/logo-icon.svg" alt="" className="mb-3 h-8 w-8 opacity-20" />
            <p className="font-body text-xs text-white/40">No chats yet.</p>
          </div>
        ) : (
          chats.map((chat) => {
            const name = chat.profiles?.display_name || chat.profiles?.email || 'Unknown'
            return (
              <button
                key={chat.id}
                onClick={() => setActiveChatId(chat.id)}
                className={`font-body flex w-full items-start gap-3 border-b border-white/5 px-4 py-3.5 text-left text-xs transition-colors ${
                  activeChatId === chat.id ? 'bg-white/10' : 'hover:bg-white/[0.04]'
                }`}
              >
                <div className="relative flex-shrink-0">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 font-display text-xs">
                    {initialsOf(name)}
                  </div>
                  <span className={`absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full ring-2 ring-[#0a0a0a] ${
                    chat.status === 'closed' ? 'bg-white/20' : chat.claimed ? 'bg-green-400' : 'bg-yellow-400'
                  }`} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="truncate font-semibold">{name}</span>
                    <span className="flex-shrink-0 text-white/30">{relativeTime(chat.updated_at)}</span>
                  </div>
                  <span className={
                    chat.status === 'closed' ? 'text-white/30' : chat.claimed ? 'text-green-400' : 'text-yellow-400'
                  }>
                    {chat.status === 'closed' ? 'Closed' : chat.claimed ? 'Claimed' : 'New — unclaimed'}
                  </span>
                </div>
              </button>
            )
          })
        )}
      </div>

      {/* Active conversation */}
      <div className="flex flex-1 flex-col bg-gradient-to-b from-transparent to-white/[0.01]">
        {!activeChat ? (
          <div className="flex flex-1 flex-col items-center justify-center text-center">
            <img src="/logo-icon.svg" alt="" className="mb-3 h-10 w-10 opacity-15" />
            <p className="font-body text-sm text-white/30">Select a chat to view</p>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between border-b border-white/10 bg-white/[0.02] px-5 py-3.5">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 font-display text-xs">
                  {initialsOf(activeChat.profiles?.display_name || activeChat.profiles?.email)}
                </div>
                <div>
                  <p className="font-body text-sm font-semibold">
                    {activeChat.profiles?.display_name || activeChat.profiles?.email}
                  </p>
                  <p className="font-body text-xs text-white/40">{activeChat.profiles?.email}</p>
                </div>
              </div>
              <div className="flex gap-2">
                {!activeChat.claimed && (
                  <button
                    onClick={() => handleClaim(activeChat.id)}
                    className="font-body rounded-md border border-white/20 px-3 py-1.5 text-xs transition-colors hover:bg-white/10"
                  >
                    Claim
                  </button>
                )}
                {activeChat.status !== 'closed' && (
                  <button
                    onClick={() => handleClose(activeChat.id)}
                    className="font-body rounded-md border border-white/20 px-3 py-1.5 text-xs transition-colors hover:bg-white/10"
                  >
                    Close Chat
                  </button>
                )}
              </div>
            </div>

            <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto px-5 py-4">
              <AnimatePresence initial={false}>
                {messages.map((m) => (
                  <motion.div
                    key={m.id}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                    className={`flex ${m.sender_role === 'staff' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[60%] px-3.5 py-2.5 text-sm font-body ${
                        m.sender_role === 'staff'
                          ? 'rounded-2xl rounded-br-sm bg-white text-black'
                          : 'rounded-2xl rounded-bl-sm bg-white/10 text-white'
                      }`}
                    >
                      {m.content}
                      <p className={`mt-1 text-[10px] ${m.sender_role === 'staff' ? 'text-black/40' : 'text-white/30'}`}>
                        {new Date(m.created_at).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            <div className="flex flex-wrap gap-2 border-t border-white/10 px-5 py-3">
              {CANNED_RESPONSES.map((c) => (
                <button
                  key={c.label}
                  onClick={() => sendReply(c.text)}
                  className="font-body rounded-full border border-white/15 px-3 py-1.5 text-xs text-white/60 transition-colors hover:border-white/30 hover:bg-white/5 hover:text-white"
                >
                  {c.label}
                </button>
              ))}
            </div>

            <form
              onSubmit={(e) => { e.preventDefault(); sendReply(reply) }}
              className="flex gap-2 border-t border-white/10 p-4"
            >
              <input
                type="text"
                value={reply}
                onChange={(e) => setReply(e.target.value)}
                placeholder="Type a reply..."
                className="font-body flex-1 rounded-full border border-white/15 bg-white/5 px-4 py-2.5 text-sm outline-none placeholder:text-white/40"
              />
              <button type="submit" className="font-body rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-black transition-transform hover:scale-105">
                Send
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  )
}
