import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/router'

const HIDE_ON = ['/admin-balance', '/verify']
const STORE_KEY = 'swor_chat_v1'
const MAX_INPUT = 500

const GREETING = {
  role: 'assistant',
  content:
    'Namaste! 🙏 I am the Swor AI help assistant (an AI, not a person). Ask me anything: what Swor AI does, how to start, prices, how to pay.\n\nनमस्ते! म Swor AI को सहायक हुँ (AI, मान्छे होइन)। Swor AI ले के गर्छ, कसरी सुरु गर्ने, मूल्य, भुक्तानी, जे पनि सोध्नुहोस्।',
}

const SUGGESTIONS = [
  { en: 'What is Swor AI?', ne: 'Swor AI के हो?' },
  { en: 'How much does it cost?', ne: 'कति पर्छ?' },
  { en: 'How do I start?', ne: 'कसरी सुरु गर्ने?' },
  { en: 'Can I use it on YouTube?', ne: 'YouTube मा चलाउन मिल्छ?' },
]

// Clean the reply and turn links into clickable links (no raw HTML is ever inserted).
// The AI sometimes writes markdown or puts "!" right after a link, so tidy both first.
const LINK_RE = /(https?:\/\/[^\s)]*[^\s).,!?:;]|meroadai\.com(?:\/[^\s)]*[^\s).,!?:;])?)/g

function renderText(text) {
  const clean = String(text)
    .replace(/\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/g, '$2')   // [label](url) -> url
    .replace(/\*\*/g, '')                                         // **bold** -> plain
  return clean.split(LINK_RE).map((part, i) => {
    if (/^https?:\/\//.test(part)) {
      return <a key={i} href={part} target="_blank" rel="noreferrer" style={{ color: '#1976D2', wordBreak: 'break-all' }}>{part}</a>
    }
    if (/^meroadai\.com/.test(part)) {
      return <a key={i} href={`https://${part}`} style={{ color: '#1976D2', wordBreak: 'break-all' }}>{part}</a>
    }
    return part
  })
}

export default function ChatWidget() {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([])   // visitor + assistant turns (greeting is added on display)
  const [input, setInput] = useState('')
  const [sending, setSending] = useState(false)
  const [whatsapp, setWhatsapp] = useState(null)
  const endRef = useRef(null)

  useEffect(() => {
    try {
      const saved = JSON.parse(sessionStorage.getItem(STORE_KEY) || '[]')
      if (Array.isArray(saved)) setMessages(saved.slice(-20))
    } catch {}
  }, [])

  useEffect(() => {
    try { sessionStorage.setItem(STORE_KEY, JSON.stringify(messages.slice(-20))) } catch {}
    endRef.current?.scrollIntoView({ block: 'end' })
  }, [messages, open, sending])

  if (HIDE_ON.includes(router.pathname)) return null

  function openChat() {
    setOpen(true)
    try { if (typeof window.gtag === 'function') window.gtag('event', 'chat_open', { page: router.pathname }) } catch {}
  }

  async function send(text) {
    const q = String(text || '').trim().slice(0, MAX_INPUT)
    if (!q || sending) return
    const next = [...messages, { role: 'user', content: q }]
    setMessages(next); setInput(''); setSending(true); setWhatsapp(null)
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: next.slice(-8), page: router.pathname }),
      })
      const d = await res.json().catch(() => ({}))
      if (res.ok && d.reply) {
        setMessages([...next, { role: 'assistant', content: d.reply }])
        if (d.whatsapp) setWhatsapp(d.whatsapp)
      } else {
        setMessages([...next, { role: 'assistant', content: d.error || 'Sorry, something went wrong. Please try again.' }])
        if (d.whatsapp) setWhatsapp(d.whatsapp)
      }
    } catch {
      setMessages([...next, { role: 'assistant', content: 'Sorry, I could not connect. Please check your internet and try again.' }])
    }
    setSending(false)
  }

  const shown = [GREETING, ...messages]

  return (
    <>
      {!open && (
        <button onClick={openChat} aria-label="Open help chat"
          style={{ position: 'fixed', right: 16, bottom: 16, zIndex: 9000, background: '#DC143C', color: '#fff', border: 'none',
            borderRadius: 999, padding: '12px 16px', fontSize: 14, fontWeight: 800, cursor: 'pointer',
            boxShadow: '0 6px 20px rgba(220,20,60,.4)', fontFamily: 'inherit' }}>
          💬 Help · मद्दत
        </button>
      )}

      {open && (
        <div role="dialog" aria-label="Swor AI help chat"
          style={{ position: 'fixed', right: 12, bottom: 12, zIndex: 9000, width: 'min(380px, calc(100vw - 24px))',
            height: 'min(560px, calc(100vh - 24px))', background: '#fff', borderRadius: 16, border: '1.5px solid #e8e8ed',
            boxShadow: '0 12px 40px rgba(0,0,0,.2)', display: 'flex', flexDirection: 'column', overflow: 'hidden', fontFamily: 'inherit' }}>
          <div style={{ background: '#DC143C', color: '#fff', padding: '12px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 800 }}>Swor AI Help · सहयोग</div>
              <div style={{ fontSize: 11, opacity: 0.9 }}>AI assistant · Replies in English or नेपाली</div>
            </div>
            <button onClick={() => setOpen(false)} aria-label="Close chat"
              style={{ background: 'rgba(255,255,255,.2)', border: 'none', color: '#fff', width: 30, height: 30, borderRadius: '50%', fontSize: 16, cursor: 'pointer' }}>✕</button>
          </div>

          <div style={{ flex: 1, overflowY: 'auto', padding: 12, background: '#f7f7f9' }}>
            {shown.map((m, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start', marginBottom: 8 }}>
                <div style={{ maxWidth: '86%', padding: '9px 12px', borderRadius: 12, fontSize: 13.5, lineHeight: 1.55, whiteSpace: 'pre-wrap',
                  background: m.role === 'user' ? '#1976D2' : '#fff', color: m.role === 'user' ? '#fff' : '#1d1d1f',
                  border: m.role === 'user' ? 'none' : '1px solid #ececf0' }}>
                  {m.role === 'user' ? m.content : renderText(m.content)}
                </div>
              </div>
            ))}

            {messages.length === 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 4 }}>
                {SUGGESTIONS.map(s => (
                  <button key={s.en} onClick={() => send(s.en)}
                    style={{ background: '#fff', border: '1.5px solid #DC143C', color: '#DC143C', borderRadius: 999, padding: '6px 10px', fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>
                    {s.en} · {s.ne}
                  </button>
                ))}
              </div>
            )}

            {sending && <div style={{ fontSize: 12, color: '#888', padding: '4px 4px' }}>Typing… · लेख्दै छु…</div>}

            {whatsapp && !sending && (
              <a href={whatsapp} target="_blank" rel="noreferrer"
                style={{ display: 'inline-block', marginTop: 4, background: '#25D366', color: '#fff', padding: '9px 14px', borderRadius: 10, fontSize: 13, fontWeight: 700, textDecoration: 'none' }}>
                💬 Chat with our team on WhatsApp
              </a>
            )}
            <div ref={endRef} />
          </div>

          <form onSubmit={e => { e.preventDefault(); send(input) }}
            style={{ display: 'flex', gap: 8, padding: 10, borderTop: '1px solid #ececf0', background: '#fff' }}>
            <input value={input} onChange={e => setInput(e.target.value)} maxLength={MAX_INPUT}
              placeholder="Type your question · प्रश्न लेख्नुहोस्" disabled={sending}
              style={{ flex: 1, padding: '10px 12px', fontSize: 14, borderRadius: 10, border: '1.5px solid #e0e0e0', outline: 'none', fontFamily: 'inherit', minWidth: 0 }} />
            <button type="submit" disabled={sending || !input.trim()}
              style={{ background: sending || !input.trim() ? '#ccc' : '#DC143C', color: '#fff', border: 'none', borderRadius: 10, padding: '0 14px', fontSize: 14, fontWeight: 800, cursor: sending || !input.trim() ? 'not-allowed' : 'pointer' }}>
              ➤
            </button>
          </form>
        </div>
      )}
    </>
  )
}
