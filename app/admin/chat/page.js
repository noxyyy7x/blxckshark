'use client'

import { useState, useEffect, useRef } from 'react'
import { useAuth } from '@/context/AuthContext'
import { supabase } from '@/lib/supabaseClient'
import { getStaffProfile, logActivity } from '@/lib/staff'

const CANNED_RESPONSES = [
  { label: 'Order status', text: 'Thanks for reaching out! Orders typically dispatch within 1-2 business days. You can track your order from your account page once shipped.' },
  { label: 'Returns', text: 'You can return UK orders within 14 days, and international orders are also accepted (customer covers return postage). Let us know if you need the returns address.' },
  { label: 'Size guide', text: "We're finalizing our size guide as products go live — I'll help you find the right fit in the meantime, just let me know what you're after." },
  { label: 'Thanks', text: 'Thanks for getting in touch — let us know if there is anything else we can help with!' },
]

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
      <div className="w-72 flex-shrink-0 overflow-y-auto border-r border-white/10">
        <div className="border-b border-white/10 p-5">
          <h1 className="font-display text-lg font-bold uppercase tracking-tight">Live Chat</h1>
        </div>
        {chats.length === 0 ? (
          <p className="font-body p-4 text-xs text-white/40">No chats yet.</p>
        ) : (
          chats.map((chat) => (
            <button
              key={chat.id}
              onClick={() => setActiveChatId(chat.id)}
              className={`font-body flex w-full flex-col gap-1 border-b border-white/5 px-4 py-3 text-left text-xs ${
                activeChatId === chat.id ? 'bg-white/10' : 'hover:bg-white/5'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-semibold">
                  {chat.profiles?.display_name || chat.profiles?.email || 'Unknown'}
                </span>
                {chat.status === 'closed' ? (
                  <span className="text-white/30">Closed</span>
                ) : chat.claimed ? (
                  <span className="text-green-400">Claimed</span>
                ) : (
                  <span className="text-yellow-400">New</span>
                )}
              </div>
              <span className="text-white/40">
                {new Date(chat.updated_at).toLocaleString()}
              </span>
            </button>
          ))
        )}
      </div>

      {/* Active conversation */}
      <div className="flex flex-1 flex-col">
        {!activeChat ? (
          <div className="flex flex-1 items-center justify-center">
            <p className="font-body text-sm text-white/30">Select a chat to view</p>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between border-b border-white/10 px-5 py-3">
              <div>
                <p className="font-body text-sm font-semibold">
                  {activeChat.profiles?.display_name || activeChat.profiles?.email}
                </p>
                <p className="font-body text-xs text-white/40">{activeChat.profiles?.email}</p>
              </div>
              <div className="flex gap-2">
                {!activeChat.claimed && (
                  <button
                    onClick={() => handleClaim(activeChat.id)}
                    className="font-body rounded-md border border-white/20 px-3 py-1.5 text-xs"
                  >
                    Claim
                  </button>
                )}
                {activeChat.status !== 'closed' && (
                  <button
                    onClick={() => handleClose(activeChat.id)}
                    className="font-body rounded-md border border-white/20 px-3 py-1.5 text-xs"
                  >
                    Close Chat
                  </button>
                )}
              </div>
            </div>

            <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto px-5 py-4">
              {messages.map((m) => (
                <div key={m.id} className={`flex ${m.sender_role === 'staff' ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`max-w-[60%] rounded-lg px-3 py-2 text-sm font-body ${
                      m.sender_role === 'staff' ? 'bg-white text-black' : 'bg-white/10 text-white'
                    }`}
                  >
                    {m.content}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-2 border-t border-white/10 px-5 py-3">
              {CANNED_RESPONSES.map((c) => (
                <button
                  key={c.label}
                  onClick={() => sendReply(c.text)}
                  className="font-body rounded-full border border-white/15 px-3 py-1 text-xs text-white/60 hover:text-white"
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
                className="font-body flex-1 rounded-md border border-white/15 bg-white/5 px-4 py-2 text-sm outline-none placeholder:text-white/40"
              />
              <button type="submit" className="font-body rounded-md bg-white px-5 py-2 text-sm font-semibold text-black">
                Send
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  )
}
