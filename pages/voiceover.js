import Head from 'next/head'
import Link from 'next/link'
import { useState, useEffect, useRef } from 'react'
import { stripTags, AUTO_TAGS } from '../lib/tags'

import { VOICE_CATEGORIES, VOICES } from '../lib/voices'

const DEMO_VOICES = [
  { voice_id: 'FszY75334ExxVmg7yl0U', name: 'Dhurundhar', desc: 'Deep & Commanding', color: '#1A3A5C' },
  { voice_id: '1zUSi8LeHs9M2mV8X6YS', name: 'Priyanka', desc: 'Romantic & Elegant', color: '#FF6B8A' },
  { voice_id: 'WdZjiN0nNcik2LBjOHiv', name: 'Bishnu', desc: 'Wise Documentary', color: '#4E342E' },
  { voice_id: 'TX3LPaxmHKxFdv7VOQHJ', name: 'Arjun', desc: 'Energetic Reels', color: '#F57C00' },
]

const DEMO_CHAR_LIMIT = 100
const PACKS = [
  {
    key: 'starter',
    name: 'Starter Pack',
    npr: 499,
    usd: 4.99,
    credits: '8,000',
    popular: false,
    features: ['8,000 Swor Credits', '~26-32 voiceovers (30 sec each)', 'All 30 voices', 'Credits never expire'],
    color: '#1976D2',
  },
  {
    key: 'creator',
    name: 'Creator Pack',
    npr: 999,
    usd: 8.99,
    credits: '20,000',
    popular: true,
    features: ['20,000 Swor Credits', '~66-80 voiceovers (30 sec each)', 'All 30 voices', 'Credits never expire'],
    color: '#DC143C',
  },
  {
    key: 'founders',
    name: 'Founders Lifetime',
    npr: 2500,
    usd: 19.99,
    credits: '50,000',
    popular: false,
    features: ['50,000 Swor Credits (Lifetime)', '5 AI Music Tracks', 'All 30 voices', 'Credits never expire', 'Founders status forever'],
    color: '#C9940A',
  },
]

function DemoBoxInline() {
  const [demoText, setDemoText] = useState('')
  const [demoVoice, setDemoVoice] = useState(DEMO_VOICES[0])
  const [demoLoading, setDemoLoading] = useState(false)
  const [demoError, setDemoError] = useState(null)
  const [demoPlaying, setDemoPlaying] = useState(false)
  const demoAudioRef = useRef(null)

  async function handleDemo() {
    if (!demoText.trim() || demoLoading) return
    setDemoLoading(true)
    setDemoError(null)
    setDemoPlaying(false)
    try {
      const res = await fetch('/api/demo-voice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: demoText, voiceId: demoVoice.voice_id }),
      })
      if (!res.ok) { const e = await res.json(); throw new Error(e.error) }
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      if (demoAudioRef.current) demoAudioRef.current.pause()
      const audio = new Audio(url)
      demoAudioRef.current = audio
      audio.play()
      setDemoPlaying(true)
      audio.onended = () => setDemoPlaying(false)
    } catch (e) { setDemoError(e.message) }
    setDemoLoading(false)
  }

  return (
    <div style={{background:'#E8F4FD',borderRadius:12,padding:16,border:'1.5px solid #90CAF9',marginBottom:12}}>
  <div style={{fontSize:11,fontWeight:700,color:'#1976D2',letterSpacing:'0.08em',textTransform:'uppercase',marginBottom:10}}>
    🎙️ Try a Sample First
  </div>
      <div style={{display:'flex',gap:6,marginBottom:10,flexWrap:'wrap'}}>
        {DEMO_VOICES.map(v => (
          <button key={v.voice_id} onClick={() => setDemoVoice(v)}
            style={{
              padding:'4px 10px',borderRadius:8,border:'1.5px solid',
              borderColor: demoVoice.voice_id === v.voice_id ? v.color : '#e8e8ed',
              background: demoVoice.voice_id === v.voice_id ? `${v.color}15` : '#fff',
              cursor:'pointer',fontSize:11,fontWeight:600,
              color: demoVoice.voice_id === v.voice_id ? v.color : '#555',
            }}>
            {v.name}
          </button>
        ))}
      </div>
      <textarea
        value={demoText}
        onChange={e => setDemoText(e.target.value.slice(0, DEMO_CHAR_LIMIT))}
        placeholder="नमस्ते! यहाँ नेपाली टाइप गर्नुस्..."
        style={{
          width:'100%',height:70,padding:'10px 12px',
          fontSize:13,lineHeight:1.7,border:'1.5px solid #e8e8ed',
          borderRadius:8,background:'#fff',color:'#1d1d1f',
          fontFamily:'Noto Sans Devanagari, Manrope, sans-serif',
          resize:'none',outline:'none',marginBottom:6
        }}
      />
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:8}}>
        <span style={{fontSize:10,color:'#DC143C',fontWeight:600}}>⚠️ Devanagari only</span>
        <span style={{fontSize:10,fontWeight:600,color: demoText.length >= DEMO_CHAR_LIMIT ? '#DC143C' : '#888'}}>
          {demoText.length}/{DEMO_CHAR_LIMIT}
        </span>
      </div>
      {demoError && (
        <div style={{fontSize:11,color:'#CC3333',marginBottom:8}}>❌ {demoError}</div>
      )}
      <button onClick={handleDemo} disabled={!demoText.trim() || demoLoading}
        style={{
          width:'100%',padding:'9px',borderRadius:8,border:'none',
          background: demoText.trim() && !demoLoading ? '#1976D2' : '#ccc',
          color:'#fff',fontSize:12,fontWeight:700,
          cursor: demoText.trim() && !demoLoading ? 'pointer' : 'not-allowed',
        }}>
        {demoLoading ? '⏳ Generating...' : demoPlaying ? '🔊 Playing...' : '▶ Hear Sample (Free)'}
      </button>
    </div>
  )
}

// ── Small help building blocks (native <details>: keyboard and screen-reader friendly) ──
function Help({ label, children }) {
  return (
    <details className="vo-help">
      <summary>
        <span className="vo-help-q" aria-hidden="true">?</span>
        <span>{label}</span>
      </summary>
      <div className="vo-help-body">{children}</div>
    </details>
  )
}

// Nepali first, English underneath.
function Bi({ ne, en }) {
  return (
    <div className="vo-bi">
      <p className="vo-ne">{ne}</p>
      <p className="vo-en">{en}</p>
    </div>
  )
}

const PRESETS = [
  { label: '📺 News Anchor', tags: '[calm] [serious] ', ne: 'समाचार र सूचना', en: 'News and announcements' },
  { label: '🎯 Aggressive Ad', tags: '[aggressive] [urgent] ', ne: 'जोसिलो, प्रभावशाली विज्ञापन', en: 'Powerful advertising' },
  { label: '😌 Calm & Meditative', tags: '[calm] [slowly] ', ne: 'शान्त, आरामदायी वर्णन', en: 'Relaxing narration' },
  { label: '⚡ Energetic Reels', tags: '[excited] [energetic] ', ne: 'छोटा सोसल मिडिया भिडियो', en: 'Short-form social media videos' },
  { label: '🎭 Dramatic Story', tags: '[sorrowful] [whispers] ', ne: 'भावुक कथा', en: 'Emotional storytelling' },
  { label: '💼 Corporate Pro', tags: '[confident] ', ne: 'व्यावसायिक सामग्री', en: 'Professional business content' },
]

const EMOTION_TAGS = ['[excited]','[calm]','[serious]','[sad]','[angry]','[nervous]','[curious]','[sarcastic]','[mischievously]','[happy]','[tired]','[frustrated]','[sorrowful]','[deadpan]','[whispers]','[shouts]','[slowly]','[quietly]']
const REACTION_TAGS = ['[laughs]','[starts laughing]','[laughs harder]','[wheezing]','[snorts]','[sighs]','[exhales]','[gasps]','[crying]','[hesitates]','[stammers]','[gulps]','[swallows]']
const SFX_TAGS = ['[applause]','[clapping]','[explosion]','[gunshot]','[woo]']
const ACCENT_TAGS = ['[strong Nepali accent]','[strong Indian accent]','[strong British accent]','[sings]']
const PAUSE_TAGS = ['[pause]','[long pause]']

const EXAMPLES = [
  { title: '🎬 REELS / TIKTOK', color: '#DC143C', text: '[applause] बधाई छ साथीहरू! [excited] नेपालमै पहिलो पटक यस्तो कमालको AI टुल आएको छ। [laughs] अब भिडियो बनाउन माइक किन्नै पर्दैन! [mischievously] अरूले थाहै पाउँदैनन् कि यो असली मान्छे हो कि AI।' },
  { title: '🎙️ DOCUMENTARY / SUSPENSE', color: '#4E342E', text: '[whispers] मध्यरातको ठीक दुई बजे, त्यो पुरानो ढोका बिस्तारै खुल्यो। [gulps] कोठाभित्र कसैको पाइलाको आवाज आयो। [explosion] अनि अचानक एउटा ठूलो आवाजले पूरै सन्नाटा तोडिदियो! [serious] के त्यो कुनै षड्यन्त्र थियो, या केवल संयोग?' },
  { title: '🛒 BUSINESS / AD', color: '#26A69A', text: '[curious] के तपाईँ पनि आफ्नो व्यापार बढाउन नयाँ तरिका खोज्दै हुनुहुन्छ? [excited] Swor AI ले तपाईँको विज्ञापनलाई दिन्छ एकदमै प्रोफेसनल स्टुडियो आवाज। [clapping] आजै साइन अप गर्नुहोस् र आफ्नो पहिलो अफर क्लेम गर्नुहोस्!' },
  { title: '🎧 ASMR & MEDITATION', color: '#26A69A', text: '[whispers] बिस्तारै आँखा बन्द गर्नुहोस्... [sighs] अब दिनभरिको थकान बिर्सिएर मीठो निद्रामा हराउने समय भयो।' },
]

const CHAR_LIMIT = 3500

export default function Voiceover() {
  const [isMobile, setIsMobile] = useState(false)
  const [session, setSession] = useState(null)
  const [text, setText] = useState('')
  const [tagging, setTagging] = useState(false)
  const [tagMsg, setTagMsg] = useState(null)   // { ok: bool, text: string }
  const [preTagText, setPreTagText] = useState(null)
  const [tipMsg, setTipMsg] = useState(null)
  const [presetMsg, setPresetMsg] = useState(null)
  const genLock = useRef(false)   // blocks a second tap on Generate before the first has finished
  const textareaRef = useRef(null)
  const [selectedVoice, setSelectedVoice] = useState(VOICES.find(v => v.voice_id === 'FszY75334ExxVmg7yl0U') || VOICES[0])
  const [showVoicePanel, setShowVoicePanel] = useState(false)
  const [loading, setLoading] = useState(false)
  const [previewing, setPreviewing] = useState(false)
  const [showRewardPopup, setShowRewardPopup] = useState(false)
const [rewardTimeLeft, setRewardTimeLeft] = useState(900)
  const [scriptPrompt, setScriptPrompt] = useState('')
const [scriptDuration, setScriptDuration] = useState('30')
const [generatingScript, setGeneratingScript] = useState(false)
const [scriptError, setScriptError] = useState(null)
const [previewUrl, setPreviewUrl] = useState(null)
const [previewError, setPreviewError] = useState(null)
const previewAudioRef = useRef(null)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)
  const [playingPreview, setPlayingPreview] = useState(null)
  const [showSignup, setShowSignup] = useState(false)
  const [signupEmail, setSignupEmail] = useState('')
  const [signupStatus, setSignupStatus] = useState('idle')
  // OTP state
  const [loginMode, setLoginMode] = useState('link')   // 'link' | 'otp'
  const [otpStatus, setOtpStatus] = useState('idle')   // 'idle'|'sending'|'sent'|'verifying'|'error'|'exhausted'|'expired'|'ratelimit'|'service'
  const [otpCode, setOtpCode] = useState('')
  const [otpError, setOtpError] = useState(null)
  const [otpAttemptsLeft, setOtpAttemptsLeft] = useState(null)
  const [history, setHistory] = useState([])
  const [historyLoading, setHistoryLoading] = useState(false)
  const [loggingOut, setLoggingOut] = useState(false)
  const audioRef = useRef(null)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  useEffect(() => {
    fetch('/api/auth/session').then(r => r.json()).then(d => {
      setSession(d.loggedIn ? d : false)
      if (d.loggedIn) fetchHistory()
    }).catch(() => setSession(false))
  }, [])

  async function fetchHistory() {
    setHistoryLoading(true)
    try {
      const res = await fetch('/api/history')
      const d = await res.json()
      if (d.success) setHistory(d.history || [])
    } catch {}
    setHistoryLoading(false)
  }

  async function handleLogout() {
    if (loggingOut) return
    setLoggingOut(true)
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
    } catch {}
    setSession(false)
    setHistory([])
    setLoggingOut(false)
  }

  function playPreview(voiceId) {
    if (playingPreview === voiceId) {
      audioRef.current?.pause(); audioRef.current = null; setPlayingPreview(null); return
    }
    audioRef.current?.pause()
    const a = new Audio(`/previews/${voiceId}.mp3`)
    audioRef.current = a; a.play(); setPlayingPreview(voiceId)
    a.onended = () => setPlayingPreview(null)
  }

  async function sendMagicLink(e) {
    e.preventDefault(); setSignupStatus('loading')
    try {
      const res = await fetch('/api/auth/send-link', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: signupEmail }) })
      const d = await res.json(); setSignupStatus(d.success ? 'sent' : 'error')
    } catch { setSignupStatus('error') }
  }

  async function sendOtp(e) {
    e.preventDefault()
    setOtpStatus('sending'); setOtpError(null); setOtpAttemptsLeft(null)
    try {
      const res = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: signupEmail }),
      })
      if (res.status === 429) {
        setOtpStatus('ratelimit'); return
      }
      if (res.status === 503) {
        setOtpStatus('service'); return
      }
      const d = await res.json()
      setOtpStatus(d.success ? 'sent' : 'error')
      if (!d.success) setOtpError(d.error || 'Something went wrong.')
    } catch {
      setOtpStatus('error'); setOtpError('Could not send code. Please try again.')
    }
  }

  async function verifyOtp(e) {
    e.preventDefault()
    setOtpStatus('verifying'); setOtpError(null)
    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: signupEmail, code: otpCode }),
      })
      const d = await res.json()
      if (res.status === 200 && d.success) {
        // Session cookie set server-side; reload session
        const sess = await fetch('/api/auth/session').then(r => r.json())
        setSession(sess.loggedIn ? sess : false)
        setShowSignup(false)
        setOtpStatus('idle'); setOtpCode('')
        return
      }
      if (res.status === 429) {
        setOtpStatus('exhausted')
        setOtpError(d.error || 'Too many incorrect attempts. Request a new code.')
        return
      }
      if (res.status === 401) {
        if (d.error && d.error.includes('expired')) {
          setOtpStatus('expired')
          setOtpError('Code has expired. Request a new one.')
        } else {
          setOtpStatus('sent')  // stay on entry screen
          setOtpAttemptsLeft(d.attemptsRemaining ?? null)
          setOtpError(d.error || 'Incorrect code.')
        }
        return
      }
      if (res.status === 503) {
        setOtpStatus('service')
        setOtpError('Service temporarily unavailable. Please try again.')
        return
      }
      setOtpStatus('error')
      setOtpError(d.error || 'Something went wrong.')
    } catch {
      setOtpStatus('error')
      setOtpError('Could not verify code. Please try again.')
    }
  }

  function resetOtp() {
    setOtpStatus('idle'); setOtpCode(''); setOtpError(null); setOtpAttemptsLeft(null)
  }

  function switchLoginMode(mode) {
    setLoginMode(mode); resetOtp(); setSignupStatus('idle')
  }
  async function handleGenerateScript() {
  if (!scriptPrompt.trim()) return
  setGeneratingScript(true)
  setScriptError(null)
  try {
    const res = await fetch('/api/generate-script', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        prompt: scriptPrompt,
        duration: scriptDuration,
        style: 'professional voiceover'
      })
    })
    if (!res.ok) {
      const e = await res.json()
      throw new Error(e.error)
    }
    const data = await res.json()
    setText(data.script)
    setScriptPrompt('')
  } catch (e) {
    setScriptError(e.message)
  }
  setGeneratingScript(false)
}
  useEffect(() => {
  if (!showRewardPopup) return
  if (rewardTimeLeft <= 0) return
  const timer = setInterval(() => {
    setRewardTimeLeft(t => {
      if (t <= 1) { clearInterval(timer); return 0 }
      return t - 1
    })
  }, 1000)
  return () => clearInterval(timer)
}, [showRewardPopup])

function formatRewardTime(secs) {
  const m = Math.floor(secs / 60).toString().padStart(2, '0')
  const s = (secs % 60).toString().padStart(2, '0')
  return `${m}:${s}`
}
async function handlePreview() {
  if (!text.trim() || !selectedVoice) return
  setPreviewing(true)
  setPreviewError(null)
  setPreviewUrl(null)
  try {
    const res = await fetch('/api/voiceover-preview', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
  text: text.slice(0, 200),
  voiceId: selectedVoice.voice_id
})
    })
    if (!res.ok) {
      const e = await res.json()
      throw new Error(e.error)
    }
    const blob = await res.blob()
    const url = URL.createObjectURL(blob)
    setPreviewUrl(url)
  if (previewAudioRef.current) {
  previewAudioRef.current.src = url
  previewAudioRef.current.play()
  previewAudioRef.current.onended = () => {
    if (!session) setShowRewardPopup(true)
  }
}
setTimeout(() => {
  if (!session) setShowRewardPopup(true)
}, 3000)
  } catch (e) {
    setPreviewError(e.message)
  }
  setPreviewing(false)
}
  async function handleGenerate() {
    if (!text.trim()) return
    const isAnon = session === false
    if (isAnon) { setShowSignup(true); return }
    if (genLock.current) return
    genLock.current = true
    setLoading(true); setResult(null); setError(null)
    const idempotencyKey = crypto.randomUUID()
    try {
      const res = await fetch('/api/voiceover', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, voiceId: selectedVoice.voice_id, voiceName: selectedVoice.name, idempotencyKey }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Generation failed. Please try again.')
      const url = data.url
      if (!url) throw new Error('No audio URL returned. Please try again.')
      // B1 fix: credits returned from server — no separate use-credit call needed
      if (data.credits !== undefined) {
        setSession(prev => ({ ...prev, credits: data.credits }))
      }
      setResult({ url, filename: `swor_${selectedVoice.name.toLowerCase()}_${Date.now()}.mp3` })
      setTimeout(() => fetchHistory(), 2000)
    } catch (e) { setError(e.message) }
    genLock.current = false
    setLoading(false)
  }

  // Put a tag into the script at the cursor (used by the Pro Tips chips).
  function insertTag(tag) {
    const ta = textareaRef.current
    const start = ta ? ta.selectionStart : text.length
    const end = ta ? ta.selectionEnd : text.length
    const ins = tag + ' '
    const next = (text.slice(0, start) + ins + text.slice(end)).slice(0, 3500)
    setText(next)
    const pos = Math.min(start + ins.length, next.length)
    requestAnimationFrame(() => {
      const t = textareaRef.current
      if (t) { try { t.setSelectionRange(pos, pos) } catch {} }
    })
    setTipMsg(`✓ ${tag} स्क्रिप्टमा थपियो · added to your script`)
    setTimeout(() => setTipMsg(null), 2500)
  }

  function applyPreset(p) {
    if (!text.trim()) {
      setPresetMsg('पहिले आफ्नो स्क्रिप्ट लेख्नुहोस्, अनि शैली छान्नुहोस्। · Write your script first, then pick a style.')
      setTimeout(() => setPresetMsg(null), 4000)
      return
    }
    setPresetMsg(null)
    const cleaned = text.trim().replace(/^(?:\[[^\]]+\]\s*)+/, '')
    setText(p.tags + cleaned)
  }

const handleAutoTag = async () => {
    if (tagging || !text.trim()) return
    if (!session) { if (session === false) setShowSignup(true); return }   // signed out: ask to sign in first
    setTagging(true); setTagMsg(null)
    try {
      const r = await fetch('/api/auto-tag', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ text }) })
      const d = await r.json().catch(() => ({}))
      if (!r.ok || !d.text) {
        setTagMsg({ ok: false, text: d.error || 'Auto tag failed. Please try again.' })
      } else {
        setPreTagText(text)
        setText(d.text.slice(0, 3500))
        setTagMsg({ ok: true, text: `Tags added. You can edit them. ${d.remaining} of ${d.limit} tries left today.` })
      }
    } catch (e) {
      setTagMsg({ ok: false, text: 'Network error. Please try again.' })
    }
    setTagging(false)
  }

const billableLength = stripTags(text).trim().length  // matches server-side billing; [tags] are free
const canGenerate = billableLength > 0 && !loading && session !== null && session !== false && !session.isPendingPayment && (
  session.isLegacy
    ? (session.credits || 0) >= 25 && billableLength <= 500
    : (session.credits || 0) >= billableLength
)
  const credits = session ? session.credits || 0 : null
  const isAnon = session === false
  const hasNoCredits = session === false || (session && credits === 0)

  function formatDate(iso) {
    const d = new Date(iso)
    return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })
  }

  return (
    <>
      <Head>
    <link rel="canonical" href="https://meroadai.com/voiceover" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <title>Nepali AI Voiceover Generator — Swor AI</title>
        <meta name="description" content="Generate professional Nepali AI voiceovers in seconds using 30 natural voices. Add emotion tags like [excited] or [calm], use AI script generator, and download MP3 instantly. Credits never expire. Pay with eSewa or Khalti." />
        <link href="https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800&family=Manrope:wght@400;500;600;700&family=Noto+Sans+Devanagari:wght@400;500&display=swap" rel="stylesheet" />
      </Head>

      <style>{`
        *{box-sizing:border-box;margin:0;padding:0}
        body{font-family:'Manrope',sans-serif;background:#FAFAFA;color:#1d1d1f;-webkit-font-smoothing:antialiased}
        textarea{resize:none;font-family:'Noto Sans Devanagari','Manrope',sans-serif}
        textarea:focus{outline:none}
        .voice-chip{display:flex;align-items:center;gap:8px;padding:8px 12px;border-radius:10px;cursor:pointer;transition:all .15s;border:1.5px solid transparent}
        .voice-chip:hover{background:#f0f0f0}
        .voice-chip.active{border-color:#1976D2;background:#E8F4FD}
        @keyframes fadeIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
        .fade-in{animation:fadeIn .2s ease}
        .overlay{position:fixed;inset:0;background:rgba(0,0,0,.4);z-index:200;display:flex;align-items:center;justify-content:center;backdrop-filter:blur(4px)}
        .modal{background:#fff;border-radius:20px;padding:32px;max-width:420px;width:90%;box-shadow:0 24px 60px rgba(0,0,0,.15)}
        .history-item{background:#f8f8f8;border-radius:10px;padding:10px 12px;border:1px solid #e8e8ed}
        .history-item:hover{border-color:#1976D2;background:#E8F4FD}

        /* ── Layout: desktop keeps two columns. Mobile becomes ONE ordered column. ── */
        .vo-main{max-width:1100px;margin:0 auto;padding:32px 24px;display:grid;grid-template-columns:1fr 320px;gap:20px}
        .vo-sr{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap}
        .vo-h{font-family:'Sora',sans-serif;font-size:15px;font-weight:800;color:#DC143C;margin-bottom:8px;line-height:1.4}
        .vo-h-dark{color:#1d1d1f}
        .vo-bi{margin-bottom:10px}
        .vo-ne{font-family:'Noto Sans Devanagari','Manrope',sans-serif;font-size:14px;line-height:1.8;color:#1d1d1f}
        .vo-en{font-size:13px;line-height:1.6;color:#6e6e73;margin-top:2px}
        .vo-help{margin-top:10px}
        .vo-help summary{list-style:none;cursor:pointer;display:inline-flex;align-items:center;gap:8px;min-height:36px;padding:4px 14px 4px 5px;border-radius:999px;background:#EEF4FF;color:#1565C0;font-weight:700;font-size:13px;font-family:'Noto Sans Devanagari','Manrope',sans-serif;user-select:none}
        .vo-help summary::-webkit-details-marker{display:none}
        .vo-help summary:focus-visible,.vo-btn:focus-visible,.vo-cat summary:focus-visible{outline:3px solid #1976D2;outline-offset:2px}
        .vo-help-q{width:26px;height:26px;border-radius:50%;background:#1976D2;color:#fff;display:inline-flex;align-items:center;justify-content:center;font-size:14px;font-weight:800;flex-shrink:0}
        .vo-help[open] summary{background:#1976D2;color:#fff}
        .vo-help[open] .vo-help-q{background:#fff;color:#1976D2}
        .vo-help-body{margin-top:10px;padding:12px 14px;background:#F8FAFF;border:1px solid #DCE8FB;border-radius:12px;font-size:14px;line-height:1.7;color:#333}
        .vo-help-body ol,.vo-help-body ul{margin:6px 0 8px 20px}
        .vo-help-body li{margin-bottom:6px}
        .vo-help-body li .vo-en{display:block;margin-top:0}
        .vo-help-body .vo-en{font-size:13px}
        .vo-example{background:#fff;border:1px dashed #90CAF9;border-radius:10px;padding:10px 12px;margin:8px 0;font-family:'Noto Sans Devanagari','Manrope',sans-serif;font-size:14px}
        .vo-btn{display:inline-flex;align-items:center;justify-content:center;gap:6px;font-family:inherit;cursor:pointer}
        .vo-chip{padding:7px 14px;border-radius:20px;border:1.5px solid #e8e8ed;background:#f5f5f7;color:#1d1d1f;font-size:12px;font-weight:600;transition:border-color .15s}
        .vo-chip:hover{border-color:#DC143C}
        .vo-tag{border:none;padding:3px 9px;border-radius:20px;font-size:12px;font-weight:600;font-family:'Manrope',sans-serif}
        .vo-cat{background:#fff;border:1px solid #DCE8FB;border-radius:12px;margin-bottom:8px;overflow:hidden}
        .vo-cat summary{list-style:none;cursor:pointer;display:flex;align-items:center;justify-content:space-between;gap:8px;padding:12px 14px;min-height:48px;font-weight:700;font-size:14px;color:#1d1d1f;font-family:'Noto Sans Devanagari','Manrope',sans-serif}
        .vo-cat summary::-webkit-details-marker{display:none}
        .vo-cat summary::after{content:'+';font-size:20px;font-weight:700;color:#1976D2;flex-shrink:0}
        .vo-cat[open] summary::after{content:'−'}
        .vo-cat-body{padding:2px 14px 14px}
        .vo-tags{display:flex;flex-wrap:wrap;gap:6px;margin:8px 0}
        .vo-voicegrid{display:grid;grid-template-columns:1fr 1fr;gap:6px}
        .vo-editor-title{display:block;margin:0 2px 8px;font-family:'Noto Sans Devanagari','Manrope',sans-serif;color:#1d1d1f;line-height:1.6}
        .vo-editor-box{background:#fff;border-radius:14px;border:2.5px solid #DC143C;overflow:hidden;box-shadow:0 0 0 4px rgba(220,20,60,.10);transition:box-shadow .15s}
        .vo-editor-box:focus-within{box-shadow:0 0 0 4px rgba(220,20,60,.28)}
        .vo-acc>summary,.vo-acc-in>summary{list-style:none;cursor:pointer}
        .vo-acc>summary::-webkit-details-marker,.vo-acc-in>summary::-webkit-details-marker{display:none}
        .vo-acc-sum{display:flex;align-items:center;gap:8px;flex-wrap:wrap;padding:12px 44px 12px 16px;min-height:52px;position:relative;font-family:'Sora','Noto Sans Devanagari',sans-serif;font-size:15px;font-weight:800;line-height:1.5}
        .vo-acc-sum::after{content:'';position:absolute;right:18px;top:50%;width:9px;height:9px;border-right:2.5px solid #6e6e73;border-bottom:2.5px solid #6e6e73;transform:translateY(-70%) rotate(45deg);transition:transform .15s}
        .vo-acc[open]>.vo-acc-sum::after,.vo-acc-in[open]>.vo-acc-sum::after{transform:translateY(-30%) rotate(225deg)}
        .vo-acc-sum:focus-visible{outline:3px solid #1976D2;outline-offset:-3px;border-radius:12px}
        .vo-acc-sum-in{padding-left:0}
        .vo-acc-body{padding:0 16px 16px}
        .vo-acc-body-in{padding:0 0 4px}
        .vo-opt{font-family:'Manrope',sans-serif;font-size:12px;font-weight:700;color:#6e6e73;background:#f0f0f3;border-radius:999px;padding:2px 10px;white-space:nowrap}
        .vo-h2{font-family:'Sora',sans-serif;font-size:15px;font-weight:800;color:#312E81;margin-bottom:6px;line-height:1.4}
        .vo-hr{border:none;border-top:1px solid #e8e8ed;margin:16px 0}
        .vo-flow{list-style:none;margin:0!important;padding:0;display:flex;flex-wrap:wrap;gap:6px;align-items:center}
        .vo-flow li{display:flex;align-items:center;gap:6px;background:#EEF2FF;border:1px solid #C7D2FE;border-radius:999px;padding:4px 12px 4px 5px;font-size:13px;line-height:1.4;font-family:'Noto Sans Devanagari','Manrope',sans-serif;color:#1d1d1f}
        .vo-flow li.vo-arrow{background:none;border:none;padding:0;color:#6366F1;font-weight:800}
        .vo-step-n{width:22px;height:22px;border-radius:50%;background:#4F46E5;color:#fff;font-size:12px;font-weight:800;display:inline-flex;align-items:center;justify-content:center;flex-shrink:0}
        .vo-autotag{flex:1 1 220px;min-height:52px;padding:12px 18px;border-radius:12px;border:none;background:#4F46E5;color:#fff;font-size:16px;font-weight:800;cursor:pointer;box-shadow:0 3px 0 #3730A3;font-family:'Noto Sans Devanagari','Manrope',sans-serif}
        .vo-autotag:hover:not(:disabled){background:#4338CA}
        .vo-autotag:disabled{background:#E5E7EB;color:#9CA3AF;box-shadow:none;cursor:not-allowed}
        .vo-autotag[aria-busy="true"]:disabled{background:#6366F1;color:#fff;cursor:progress}
        .vo-autotag.vo-autotag-done{background:#15803D;box-shadow:0 3px 0 #166534}
        .vo-undo{min-height:48px;padding:10px 16px;border-radius:12px;border:1.5px solid #d2d2d7;background:transparent;color:#444;font-size:14px;font-weight:600}
        .vo-presets{display:flex;gap:8px;flex-wrap:wrap}
        .vo-genwrap{margin-bottom:0}
        .vo-genhint{margin-top:8px;font-size:13px;line-height:1.6;text-align:center;color:#6e6e73;font-family:'Noto Sans Devanagari','Manrope',sans-serif}
        .vo-genhint:empty{display:none}
        .vo-signin-link{background:none;border:none;color:#1976D2;font-weight:800;text-decoration:underline;cursor:pointer;font-size:15px;font-family:inherit;min-height:44px;padding:8px 12px}
        .vo-sg{display:flex;gap:8px;margin-bottom:8px;flex-wrap:wrap}
        .vo-sg-input{flex:1 1 200px;min-width:0}

        @media (max-width:768px){
          .vo-main{display:flex;flex-direction:column;gap:12px;padding:16px 16px 28px}
          .vo-col,.vo-col-right{display:contents!important}
          .vo-main [class*="vo-o-"]{margin-bottom:0!important}
          .vo-o-10{order:10}.vo-o-20{order:20}.vo-o-21{order:21}.vo-o-30{order:30}.vo-o-40{order:40}.vo-o-50{order:50}
          .vo-o-55{order:55}.vo-o-60{order:60}.vo-o-70{order:70}.vo-o-58{order:58}.vo-o-80{order:80}.vo-o-82{order:82}.vo-o-88{order:88}.vo-o-85{order:85}.vo-o-86{order:86}
          .vo-o-90{order:90}.vo-o-95{order:95}.vo-o-96{order:96}.vo-o-97{order:97}.vo-o-100{order:100}.vo-o-105{order:105}
          .vo-o-110{order:110}.vo-o-120{order:120}.vo-o-130{order:130}.vo-o-140{order:140}
          /* Phones zoom the page when an input is smaller than 16px. */
          .vo-input{font-size:16px!important}
          /* Comfortable touch targets */
          .vo-btn{min-height:44px}
          .vo-chip{min-height:48px;padding:8px 16px;font-size:14px}
          .vo-flow li{font-size:14px}
          .vo-flow li.vo-arrow{display:none}
          .vo-tag{min-height:40px;padding:6px 14px;font-size:14px}
          .vo-help summary{min-height:44px;font-size:14px}
          .vo-ne{font-size:15px}
          .vo-en{font-size:14px}
          .vo-help-body{font-size:15px}
          .vo-sg-input{flex:1 1 100%}
          .vo-sg select{flex:1 1 38%;min-height:48px}
          .vo-sg button{flex:1 1 55%;min-height:48px}
          .vo-voice-chip-btn{width:40px!important;height:40px!important}
          .vo-generate{min-height:52px;font-size:16px!important}
        }
        @media (max-width:480px){
          .vo-voicegrid{grid-template-columns:1fr}
        }
      `}</style>

      {/* NAV */}
      <nav style={{padding:'0 24px',height:56,display:'flex',alignItems:'center',justifyContent:'space-between',borderBottom:'1px solid #e8e8ed',background:'#fff',position:'sticky',top:0,zIndex:100}}>
        <div style={{display:'flex',alignItems:'center',gap:16}}>
          <Link href="/" style={{display:'flex',alignItems:'center',gap:6,textDecoration:'none'}}>
            <div style={{width:26,height:26,borderRadius:6,background:'linear-gradient(135deg,#DC143C,#FF6B8A)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:11,color:'#fff',fontWeight:800}}>M</div>
            <span style={{fontSize:14,fontWeight:700,fontFamily:'Sora,sans-serif',color:'#1d1d1f'}}>Swor AI</span>
          </Link>
          <Link href="/tool" style={{fontSize:13,color:'#888',textDecoration:'none',display:'flex',alignItems:'center',gap:4}}>
            ← All Tools
          </Link>
          {!isMobile && (
            <Link href="/voice-changer" style={{fontSize:12,fontWeight:700,color:'#DC143C',background:'#FDECEF',padding:'4px 10px',borderRadius:20,textDecoration:'none',whiteSpace:'nowrap'}}>
              🔄 Voice Changer
            </Link>
          )}
        </div>
        <div style={{display:'flex',alignItems:'center',gap:10}}>
          {session && <div style={{fontSize:13,fontWeight:600,background:'#E8F4FD',color:'#1976D2',padding:'5px 12px',borderRadius:20}}>{credits} credits</div>}
          {session && (
            <button
              onClick={handleLogout}
              disabled={loggingOut}
              style={{background:'none',border:'1px solid #e0e0e0',color:'#888',padding:'5px 12px',borderRadius:20,fontSize:13,fontWeight:600,cursor:loggingOut?'not-allowed':'pointer',opacity:loggingOut?0.6:1}}
            >
              {loggingOut ? 'Signing out…' : 'Sign out'}
            </button>
          )}
          {!session && <button onClick={() => setShowSignup(true)} style={{background:'#1976D2',color:'#fff',border:'none',padding:'7px 16px',borderRadius:10,fontSize:13,fontWeight:700,cursor:'pointer'}}>Sign in</button>}
        </div>
      </nav>

      {/* PAGE TITLE */}
      <div style={{background:'#fff',borderBottom:'1px solid #e8e8ed',padding:'20px 24px'}}>
        <div style={{maxWidth:1100,margin:'0 auto',display:'flex',alignItems:'center',gap:12}}>
          <div style={{width:40,height:40,borderRadius:10,background:'#E8F4FD',display:'flex',alignItems:'center',justifyContent:'center',fontSize:20}}>🎙️</div>
          <div>
            <h1 style={{fontFamily:'Sora,sans-serif',fontSize:20,fontWeight:800,color:'#1d1d1f',letterSpacing:'-0.4px'}}>Nepali Voiceover</h1>
            <p style={{fontSize:14,color:'#444',marginTop:2,fontFamily:"'Noto Sans Devanagari','Manrope',sans-serif"}}>नेपाली लेख्नुहोस्, केही सेकेन्डमै प्रोफेसनल AI आवाज पाउनुहोस्।</p>
            <p style={{fontSize:13,color:'#888',marginTop:2}}>Type Nepali text and get a professional AI voiceover in seconds</p>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="vo-main">

        {/* LEFT — TEXT AREA */}
        <div className="vo-col">
          {session === false && (
            <div className="vo-o-10" style={{background:'#E8F4FD',border:'1.5px solid #90CAF9',borderRadius:12,padding:'12px 16px',marginBottom:12,display:'flex',alignItems:'center',justifyContent:'space-between'}}>
              <div>
                <div style={{fontSize:13,fontWeight:700,color:'#1976D2'}}>🎙️ Sign in to access Swor AI</div>
                <div style={{fontSize:11,color:'#888',marginTop:2}}>Credits required to generate. Purchase a pack to get started.</div>
              </div>
              <button onClick={() => setShowSignup(true)}
                style={{background:'#1976D2',color:'#fff',border:'none',padding:'7px 14px',borderRadius:8,fontSize:12,fontWeight:700,cursor:'pointer',flexShrink:0}}>
                Sign in →
              </button>
            </div>
          )}

          {/* Voice selector pill */}
          <div className="vo-o-20" role="button" tabIndex={0} aria-expanded={showVoicePanel} aria-label="Choose voice · आवाज छान्नुहोस्"
            style={{background:'#fff',borderRadius:14,border:'1.5px solid #e8e8ed',padding:'12px 16px',marginBottom:12,display:'flex',alignItems:'center',justifyContent:'space-between',cursor:'pointer',minHeight:56}}
            onClick={() => setShowVoicePanel(!showVoicePanel)}
            onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setShowVoicePanel(!showVoicePanel) } }}>
            <div style={{display:'flex',alignItems:'center',gap:10}}>
              <div style={{width:32,height:32,borderRadius:8,background:selectedVoice.color,display:'flex',alignItems:'center',justifyContent:'center',fontSize:13,fontWeight:700,color:'#fff'}}>
                {selectedVoice.name[0]}
              </div>
              <div>
                <div style={{fontSize:14,fontWeight:700,color:'#1d1d1f'}}>{selectedVoice.name}</div>
                <div style={{fontSize:11,color:'#888'}}>{selectedVoice.desc}</div>
              </div>
            </div>
            <div style={{display:'flex',alignItems:'center',gap:8}}>
              <div style={{fontSize:11,fontWeight:600,color:'#1976D2',background:'#E8F4FD',padding:'3px 8px',borderRadius:6}}>
                {selectedVoice.gender === 'F' ? 'Female' : 'Male'}
              </div>
              <span style={{color:'#888',fontSize:14}}>{showVoicePanel ? '▲' : '▼'}</span>
            </div>
          </div>

{/* Voice selection panel */}
{showVoicePanel && (
  <div className="fade-in vo-o-21" style={{background:'#fff',borderRadius:14,border:'1.5px solid #e8e8ed',padding:16,marginBottom:12}}>
    {VOICE_CATEGORIES.map(cat => (
      <div key={cat.category} style={{marginBottom:16}}>
        <div style={{fontSize:11,fontWeight:700,color:'#888',letterSpacing:'0.08em',textTransform:'uppercase',marginBottom:8,paddingBottom:6,borderBottom:'1px solid #f0f0f0'}}>
          {cat.category}
        </div>
        <div className="vo-voicegrid">
          {cat.voices.map(v => (
            <div key={v.voice_id} className={`voice-chip${selectedVoice.voice_id === v.voice_id ? ' active' : ''}`}
              onClick={() => { setSelectedVoice(v); setShowVoicePanel(false) }}>
              <div style={{width:28,height:28,borderRadius:7,background:v.color,display:'flex',alignItems:'center',justifyContent:'center',fontSize:12,fontWeight:700,color:'#fff',flexShrink:0}}>{v.name[0]}</div>
              <div style={{minWidth:0}}>
                <div style={{fontSize:12,fontWeight:700,color:'#1d1d1f'}}>{v.name}</div>
                <div style={{fontSize:10,color:'#888',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{v.desc}</div>
              </div>
              <button onClick={e => { e.stopPropagation(); playPreview(v.voice_id) }}
                className="vo-voice-chip-btn" aria-label={`Preview ${v.name}`} style={{marginLeft:'auto',width:24,height:24,borderRadius:'50%',border:'none',background:playingPreview===v.voice_id?'#DC143C':'#f0f0f0',color:playingPreview===v.voice_id?'#fff':'#555',fontSize:9,cursor:'pointer',flexShrink:0}}>
                {playingPreview === v.voice_id ? '■' : '▶'}
              </button>
            </div>
          ))}
        </div>
      </div>
    ))}
  </div>
)}
{/* AI Script Generator */}
<details className="vo-acc vo-o-30" style={{background:'linear-gradient(135deg,#fff5f7,#fff)',border:'1.5px solid rgba(220,20,60,.15)',borderRadius:14,padding:0,marginBottom:12}}>
  <summary className="vo-acc-sum"><span className="vo-acc-title" style={{color:'#DC143C'}}>✨ AI Script Generator | AI स्क्रिप्ट लेखक</span><span className="vo-opt">[optional]</span></summary>
  <div className="vo-acc-body">

  <Bi
    ne="भिडियो वा विज्ञापनको आइडिया छ तर स्क्रिप्ट छैन? आफ्नो विषय लेख्नुहोस्, AI ले तपाईंको लागि नेपाली स्क्रिप्ट तयार गरिदिन्छ।"
    en="Have an idea but no script? Describe your video or advertisement, and AI will write a Nepali voiceover script for you." />
  <div className="vo-sg">
    <label htmlFor="vo-script-idea" className="vo-sr">Describe your video · आफ्नो भिडियोको बारेमा लेख्नुहोस्</label>
    <input
      id="vo-script-idea"
      className="vo-input vo-sg-input"
      type="text"
      value={scriptPrompt}
      onChange={e => setScriptPrompt(e.target.value)}
      placeholder="जस्तै: काठमाडौँको कम्प्युटर इन्स्टिच्युटको ३० सेकेन्डको विज्ञापन"
      style={{padding:'10px 14px',borderRadius:10,border:'1.5px solid #e8e8ed',fontSize:13,outline:'none',fontFamily:"'Noto Sans Devanagari','Manrope',sans-serif"}}
    />
    <label htmlFor="vo-script-duration" className="vo-sr">Duration · अवधि</label>
    <select
      id="vo-script-duration"
      className="vo-input"
      value={scriptDuration}
      onChange={e => setScriptDuration(e.target.value)}
      style={{padding:'10px 12px',borderRadius:10,border:'1.5px solid #e8e8ed',fontSize:13,outline:'none',background:'#fff'}}>
      <option value="15">15 सेकेन्ड · 15 sec</option>
      <option value="30">30 सेकेन्ड · 30 sec</option>
      <option value="45">45 सेकेन्ड · 45 sec</option>
      <option value="60">60 सेकेन्ड · 60 sec</option>
      <option value="120">२ मिनेट · 2 min</option>
    </select>
    <button
      className="vo-btn"
      onClick={handleGenerateScript}
      disabled={generatingScript || !scriptPrompt.trim()}
      style={{
        padding:'10px 18px',borderRadius:10,border:'none',
        background: generatingScript || !scriptPrompt.trim() ? '#ccc' : '#DC143C',
        color:'#fff',fontSize:13,fontWeight:700,
        cursor: generatingScript || !scriptPrompt.trim() ? 'not-allowed' : 'pointer',
        whiteSpace:'nowrap'
      }}>
      {generatingScript ? '⏳ Generating...' : '✨ Generate Script'}
    </button>
  </div>
  {scriptError && (
    <div role="alert" style={{fontSize:13,color:'#DC143C',marginTop:4}}>{scriptError}</div>
  )}
  <Help label="कसरी प्रयोग गर्ने? | How to use">
    <ol>
      <li><span className="vo-ne">आफ्नो भिडियो वा विज्ञापन के बारे हो, लेख्नुहोस्।</span><span className="vo-en">Describe what your video or advertisement is about.</span></li>
      <li><span className="vo-ne">आवाजको अवधि (कति सेकेन्ड वा मिनेट) छान्नुहोस्।</span><span className="vo-en">Select the desired voiceover duration.</span></li>
      <li><span className="vo-ne">“Generate Script” थिच्नुहोस्।</span><span className="vo-en">Click Generate Script.</span></li>
      <li><span className="vo-ne">तयार भएको स्क्रिप्ट पढ्नुहोस् र चाहिए सम्पादन गर्नुहोस्।</span><span className="vo-en">Review and edit the generated script.</span></li>
    </ol>
    <div className="vo-ne" style={{fontWeight:700,marginTop:6}}>उदाहरण · Example</div>
    <div className="vo-example">
      काठमाडौँमा रहेको कम्प्युटर इन्स्टिच्युटको ३० सेकेन्डको विज्ञापन।
      <div style={{marginTop:8}}>
        <button type="button" className="vo-btn" onClick={() => setScriptPrompt('काठमाडौँमा रहेको कम्प्युटर इन्स्टिच्युटको ३० सेकेन्डको विज्ञापन।')}
          style={{background:'#1976D2',color:'#fff',border:'none',borderRadius:20,padding:'6px 14px',fontSize:13,fontWeight:700}}>
          यो उदाहरण प्रयोग गर्नुहोस् · Use this example
        </button>
      </div>
    </div>
    <p className="vo-ne">तपाईं आफ्नो आइडिया नेपाली वा अंग्रेजी, दुवैमा लेख्न सक्नुहुन्छ।</p>
    <p className="vo-en">You can describe your idea in Nepali or in English.</p>
  </Help>
  </div>
</details>

{/* Text area */}
<div className="vo-o-50" style={{marginBottom:12}}>
  <label htmlFor="vo-script" className="vo-editor-title">
    <span className="vo-ne" style={{fontWeight:800,fontSize:16}}>✍️ तपाईंको स्क्रिप्ट यहाँ लेख्नुहोस् वा पेस्ट गर्नुहोस्</span>
    <span className="vo-en" style={{display:'block'}}>Type or paste your script in the box below</span>
  </label>
  <div className="vo-editor-box">
  <textarea
    id="vo-script"
    ref={textareaRef}
    className="vo-input"
    value={text}
    onChange={e => setText(e.target.value.slice(0, 3500))}
    placeholder="नमस्ते! यहाँ आफ्नो नेपाली पाठ टाइप गर्नुस्... (Devanagari script only — देवनागरी मा लेख्नुस्)"
    style={{width:'100%',minHeight:isMobile?180:220,padding:'16px',fontSize:15,lineHeight:1.8,border:'none',background:'transparent',color:'#1d1d1f'}}
  />
  <div style={{padding:'8px 16px',borderTop:'1px solid #f0f0f0',display:'flex',justifyContent:'space-between',alignItems:'center',gap:8,flexWrap:'wrap',background:'#fafafa'}}>
    <span style={{fontSize:12,color:'#DC143C',fontWeight:600}}>⚠️ Devanagari script only — type in नेपाली not Roman</span>
    <span style={{fontSize:12,fontWeight:600,color:text.length > 3300 ? '#DC143C' : text.length > 2500 ? '#FF9500' : '#888'}}>
      {text.length} / 3,500 chars max
      {text.length > 2500 && text.length <= 3500 && (
        <span style={{display:'block',fontSize:11,color:'#FF9500',marginTop:2}}>
          ⚠️ Long script — may load slowly on mobile. Consider splitting into parts.
        </span>
      )}
    </span>
  </div>

  </div>
</div>

{/* Script Enhancement Tools: Auto Tag + Style Presets (act on the script above) */}
<div className="vo-o-58" style={{background:'#fff',borderRadius:14,border:'1.5px solid #e8e8ed',padding:16,marginBottom:12}}>
  <h2 className="vo-h vo-h-dark" style={{fontSize:16}}>🛠️ Script Enhancement Tools | स्क्रिप्टलाई अझ राम्रो बनाउनुहोस्</h2>

  {/* Auto Tag */}
  <section aria-labelledby="vo-at-h" style={{marginTop:10}}>
    <h3 id="vo-at-h" className="vo-h2">✨ Auto Tag | स्वतः भावना थप्नुहोस्</h3>
    <p className="vo-ne">नेपाली स्क्रिप्ट तयार छ? Auto Tag थिच्नुहोस्। AI ले स्क्रिप्ट बुझेर उपयुक्त ठाउँमा भावना र अभिव्यक्ति जनाउने ट्यागहरू आफैँ थपिदिन्छ।</p>
    <p className="vo-en" style={{marginBottom:10}}>Already have your script? Tap Auto Tag. AI will analyze your script and automatically add suitable emotion and expression tags where they belong.</p>
    <ol className="vo-flow" aria-label="Auto Tag steps · चरणहरू">
      <li><span className="vo-step-n" aria-hidden="true">१</span><span>स्क्रिप्ट राख्नुहोस्</span></li>
      <li className="vo-arrow" aria-hidden="true">→</li>
      <li><span className="vo-step-n" aria-hidden="true">२</span><span>Auto Tag थिच्नुहोस्</span></li>
      <li className="vo-arrow" aria-hidden="true">→</li>
      <li><span className="vo-step-n" aria-hidden="true">३</span><span>ट्यागहरू हेरेर Generate गर्नुहोस्</span></li>
    </ol>
    <p className="vo-en" style={{margin:'6px 0 10px'}}>1. Add your script. 2. Tap Auto Tag. 3. Review the tags and generate your voiceover.</p>
    <div style={{display:'flex',gap:8,flexWrap:'wrap',alignItems:'center'}}>
      <button type="button" className={`vo-btn vo-autotag${tagMsg?.ok && preTagText !== null && !tagging ? ' vo-autotag-done' : ''}`} onClick={handleAutoTag}
        disabled={tagging || !text.trim()} aria-busy={tagging}>
        {tagging ? '⏳ ट्याग थप्दै… · Adding tags…' : (tagMsg?.ok && preTagText !== null) ? '✓ ट्यागहरू थपिए · Tags added' : '✨ Auto Tag'}
      </button>
      {preTagText !== null && tagMsg?.ok && (
        <button type="button" className="vo-btn vo-undo" onClick={() => { setText(preTagText); setPreTagText(null); setTagMsg(null) }}>
          ↩ Undo · फिर्ता
        </button>
      )}
    </div>
    <div role="status" aria-live="polite" style={{fontSize:13,lineHeight:1.6,marginTop:8,color: tagMsg ? (tagMsg.ok ? '#166534' : '#CC3333') : '#555'}}>
      {tagMsg ? tagMsg.text : (<><span className="vo-ne" style={{fontSize:13}}>ब्र्याकेटभित्रका ट्यागहरूको क्रेडिट लाग्दैन।</span> <span className="vo-en" style={{display:'inline'}}>Emotion tags inside brackets are free.</span>{session === false ? <span className="vo-ne" style={{fontSize:13}}> (Auto Tag प्रयोग गर्न Sign in गर्नुहोस्।)</span> : null}</>)}
    </div>
    <Help label="Auto Tag कसरी काम गर्छ? | How does Auto Tag work?">
      <p className="vo-ne"><strong>चरणबद्ध रूपमा:</strong></p>
      <ol>
        <li><span className="vo-ne">AI ले तपाईंको स्क्रिप्टको अर्थ र सन्दर्भ पढ्छ।</span><span className="vo-en">AI reads and understands the context of your script.</span></li>
        <li><span className="vo-ne">कुन ठाउँमा कस्तो भाव वा अभिव्यक्ति राखे आवाज राम्रो हुन्छ, त्यो ठाउँ पहिचान गर्छ।</span><span className="vo-en">It finds places where a different emotion or expression would improve the voiceover.</span></li>
        <li><span className="vo-ne">त्यहाँ उपयुक्त ट्यागहरू थप्छ। यी ट्यागहरू प्रयोग हुन्छन्:</span><span className="vo-en">It adds suitable tags. The tags it can use are:</span></li>
      </ol>
      <div className="vo-tags" style={{marginLeft:20}}>
        {AUTO_TAGS.map(t => <span key={t} className="vo-tag" style={{background:'#E8EEFF',color:'#1565C0'}}>{`[${t}]`}</span>)}
      </div>
      <ol start={4}>
        <li><span className="vo-ne">तपाईंले ट्यागहरू हेरेर आफैँ सम्पादन गर्न सक्नुहुन्छ। मन परेन भने <strong>Undo</strong> थिच्नुहोस्।</span><span className="vo-en">You can review and edit the tags yourself before making audio. Press Undo if you do not like the result.</span></li>
        <li><span className="vo-ne">AI ले तपाईंका शब्द परिवर्तन गर्दैन, ट्याग (र विराम) मात्र थप्छ। शब्द फरक भएमा परिणाम स्वीकार गरिँदैन।</span><span className="vo-en">AI does not change your words. It only adds tags and pauses. If the words come back different, the result is rejected.</span></li>
        <li><span className="vo-ne">ब्र्याकेटभित्रका ट्यागहरू <code>[excited]</code>, <code>[pause]</code> आदिको क्रेडिट लाग्दैन। स्क्रिप्टका अक्षर, स्पेस र विराम चिह्नको क्रेडिट गणना हुन्छ।</span><span className="vo-en">Emotion tags inside brackets are free. Script characters, spaces, and punctuation are counted toward your credits.</span></li>
        <li><span className="vo-ne">एक दिनमा प्रयास गर्न मिल्ने संख्या: Starter ५, Creator २०, Founders ५०। असफल प्रयास गनिँदैन। Auto Tag प्रयोग गर्न Sign in आवश्यक छ।</span><span className="vo-en">Daily tries: Starter 5, Creator 20, Founders 50. A failed try is not counted. You need to be signed in.</span></li>
      </ol>
      <div style={{background:'#FFF8E1',border:'1px solid #FFE082',borderRadius:10,padding:'10px 12px',marginTop:8}}>
        <p className="vo-ne"><strong>Auto Tag र Style Preset फरक छन्।</strong> Style Preset ले पहिले नै तय गरिएका ट्यागहरू थप्छ। Auto Tag ले तपाईंको वास्तविक स्क्रिप्ट पढेर सान्दर्भिक ट्यागहरू राख्छ।</p>
        <p className="vo-en">Style Presets apply predefined tag combinations. Auto Tag analyzes your actual content and adds contextually relevant tags.</p>
      </div>
    </Help>
  </section>

  <hr className="vo-hr" />

  {/* Style Presets */}
  <details className="vo-acc-in">
    <summary className="vo-acc-sum vo-acc-sum-in" id="vo-sp-h"><span className="vo-acc-title vo-h2" style={{margin:0}}>🎨 Style Presets | बोल्ने शैली छान्नुहोस्</span><span className="vo-opt">[optional]</span></summary>
    <div className="vo-acc-body-in">
    <p className="vo-ne">तपाईंको कन्टेन्टअनुसार शैली छान्नुहोस्। एक क्लिकमै स्क्रिप्टमा मिल्ने भावना ट्यागहरू थप्नुहोस्।</p>
    <p className="vo-en" style={{marginBottom:10}}>Choose a style that matches your content. One click adds the corresponding emotion tags to your script.</p>
    <div className="vo-presets">
      {PRESETS.map(p => (
        <button key={p.label} type="button" className="vo-btn vo-chip" onClick={() => applyPreset(p)}>{p.label}</button>
      ))}
    </div>
    <div role="status" aria-live="polite" style={{fontSize:13,color:'#B45309',marginTop:8,fontFamily:"'Noto Sans Devanagari','Manrope',sans-serif"}}>{presetMsg}</div>
  <Help label="कसरी प्रयोग गर्ने? | How to use">
    <p className="vo-ne">पहिले माथि आफ्नो स्क्रिप्ट लेख्नुहोस् वा पेस्ट गर्नुहोस्, अनि एउटा शैली थिच्नुहोस्। ट्यागहरू स्क्रिप्टको सुरुमा थपिन्छन्।</p>
    <p className="vo-en">First enter your script above, then tap a style. The tags are added at the start of your script (any tags already at the very start are replaced).</p>
    <ul style={{marginTop:8}}>
      {PRESETS.map(p => (
        <li key={p.label}>
          <strong>{p.label}</strong> <span className="vo-ne" style={{display:'inline'}}>: {p.ne}</span>
          <span className="vo-en">{p.en} · adds <code>{p.tags.trim()}</code></span>
        </li>
      ))}
    </ul>
    <div style={{background:'#FFF8E1',border:'1px solid #FFE082',borderRadius:10,padding:'10px 12px',marginTop:8}}>
      <p className="vo-ne"><strong>Style Preset र Auto Tag फरक छन्।</strong> Style Preset ले पहिले नै तय गरिएका ट्यागहरू थप्छ। Auto Tag ले तपाईंको स्क्रिप्ट पढेर सान्दर्भिक ठाउँमा ट्यागहरू राख्छ।</p>
      <p className="vo-en">Style Presets apply a predefined combination of tags. Auto Tag analyzes your actual script and adds tags that fit its content.</p>
    </div>
  </Help>
  </div>
  </details>
</div>

          {/* Error */}
          {error && (
            <div className="vo-o-85" role="alert" style={{background:'#FFF0F0',border:'1px solid #FFB8B8',borderRadius:10,padding:'12px 16px',fontSize:13,color:'#CC3333',marginBottom:12}}>
              ❌ {error}
            </div>
          )}

          {/* Result */}
          {result && (
            <div className="fade-in vo-o-86" style={{background:'#E8F4FD',border:'1.5px solid #90CAF9',borderRadius:14,padding:16,marginBottom:12}}>
              <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:10}}>
                <div style={{fontSize:13,fontWeight:700,color:'#1976D2'}}>✓ Voiceover ready!</div>
             <button
  onClick={async () => {
    try {
      const response = await fetch(result.url)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = result.filename
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
    } catch (error) {
      window.open(result.url, '_blank')
    }
  }}
  style={{background:'#1976D2',color:'#fff',padding:'7px 16px',borderRadius:8,fontSize:12,fontWeight:700,border:'none',cursor:'pointer'}}>
  ⬇ Download MP3
</button>
              </div>
<audio 
  controls
  playsInline
  preload="metadata"
  crossOrigin="anonymous"
  src={result.url}
  style={{width:'100%',borderRadius:8}}
  onError={() => window.open(result.url, '_blank')}
/>
            </div>
          )}

{/* Emotion tags & Pro Tips */}
<details className="vo-acc vo-o-100" style={{background:'#F8F9FF',border:'1.5px solid #90CAF9',borderRadius:12,padding:0,marginBottom:12}}>
  <summary className="vo-acc-sum"><span className="vo-acc-title" style={{color:'#1976D2'}}>💡 Pro Tips | राम्रो आवाज बनाउन उपयोगी सुझावहरू</span></summary>
  <div className="vo-acc-body">

  <p className="vo-en" style={{marginBottom:6}}>v4 Powered</p>
  <Bi
    ne="ट्याग भनेको [ ] भित्र लेखिने सानो निर्देशन हो। यसले आवाजको भाव र शैली बदल्छ। तलका शीर्षक थिचेर खोल्नुहोस्। ट्याग थिच्दा त्यो तपाईंको स्क्रिप्टमा थपिन्छ।"
    en="A tag is a short instruction inside [ ] that changes the mood and style of the voice. Tap a heading below to open it. Tapping a tag adds it to your script." />
  <div role="status" aria-live="polite" style={{fontSize:13,fontWeight:600,color:'#166534',minHeight:20,marginBottom:6}}>{tipMsg}</div>

  <details className="vo-cat">
    <summary><span>🔤 भाषा र उच्चारण <span style={{color:'#6e6e73',fontWeight:500}}>| Language &amp; Pronunciation</span></span></summary>
    <div className="vo-cat-body">
      <p className="vo-ne">सधैं नेपाली देवनागरी (Unicode) मा लेख्नुहोस्। Roman अक्षरमा लेखे उच्चारण बिग्रन सक्छ।</p>
      <p className="vo-en">Always write Nepali in Devanagari. Roman letters can make the pronunciation wrong.</p>
      <div className="vo-example" style={{display:'flex',flexDirection:'column',gap:6}}>
        <div><span style={{color:'#34C759',fontWeight:700}}>✅ सही · Correct:</span> <span style={{fontWeight:600}}>नमस्ते! आज हामी नयाँ उत्पादन लिएर आएका छौं।</span></div>
        <div><span style={{color:'#DC143C',fontWeight:700}}>❌ गलत · Wrong:</span> <span style={{fontWeight:600}}>Namaste! Aaja hami naya utpadan liera aayeka chhau.</span></div>
      </div>
    </div>
  </details>

  <details className="vo-cat">
    <summary><span>🔥 भावना र अभिव्यक्ति <span style={{color:'#6e6e73',fontWeight:500}}>| Emotions &amp; Expressions</span></span></summary>
    <div className="vo-cat-body">
      <p className="vo-ne">जुन वाक्यमा भाव चाहिन्छ, त्यसको सुरुमा ट्याग राख्नुहोस्। एउटै वाक्यमा बढीमा २ ट्याग।</p>
      <p className="vo-en">Put the tag at the start of the sentence that needs the feeling. Use at most 2 tags in one sentence.</p>
      <div className="vo-example"><strong>[excited]</strong> नमस्ते साथीहरू! <strong>[serious]</strong> आजको मुख्य समाचार सुन्नुहोस्।</div>
      <div className="vo-tags">
        {EMOTION_TAGS.map(t => <button key={t} type="button" className="vo-btn vo-tag" onClick={() => insertTag(t)} style={{background:'#E8EEFF',color:'#1565C0'}}>{t}</button>)}
      </div>
      <p className="vo-ne" style={{marginTop:6}}>विराम (रोकिने ठाउँ):</p>
      <p className="vo-en">Pauses (a short or long silence):</p>
      <div className="vo-tags">
        {PAUSE_TAGS.map(t => <button key={t} type="button" className="vo-btn vo-tag" onClick={() => insertTag(t)} style={{background:'#E8EEFF',color:'#1565C0'}}>{t}</button>)}
      </div>
    </div>
  </details>

  <details className="vo-cat">
    <summary><span>😂 प्रतिक्रिया र ध्वनि प्रभाव <span style={{color:'#6e6e73',fontWeight:500}}>| Reactions &amp; Sound Effects</span></span></summary>
    <div className="vo-cat-body">
      <p className="vo-ne">हाँसो, सास फेर्ने जस्ता मानवीय प्रतिक्रिया र ताली जस्ता आवाज थप्न सकिन्छ। कथा, मजाक र विज्ञापनको बीचमा थोरै प्रयोग गर्नुहोस्।</p>
      <p className="vo-en">Add human reactions like laughing or sighing, and sounds like applause. Use them sparingly in stories, jokes and ads.</p>
      <ul>
        <li><span className="vo-ne"><strong>[laughs]</strong> मजाकपछि · <strong>[sighs]</strong> थकान वा दुःखमा · <strong>[gasps]</strong> आश्चर्यमा</span><span className="vo-en">[laughs] after a joke · [sighs] when tired or sad · [gasps] for surprise</span></li>
        <li><span className="vo-ne"><strong>[applause]</strong> / <strong>[clapping]</strong> बधाई वा घोषणामा · <strong>[explosion]</strong> / <strong>[gunshot]</strong> नाटकीय कथामा</span><span className="vo-en">[applause] / [clapping] for congratulations or announcements · [explosion] / [gunshot] for dramatic stories</span></li>
      </ul>
      <p className="vo-ne" style={{marginTop:4}}>प्रतिक्रिया</p>
      <div className="vo-tags">
        {REACTION_TAGS.map(t => <button key={t} type="button" className="vo-btn vo-tag" onClick={() => insertTag(t)} style={{background:'#FFF3E0',color:'#BF360C'}}>{t}</button>)}
      </div>
      <p className="vo-ne">ध्वनि प्रभाव (Sound Effects)</p>
      <div className="vo-tags">
        {SFX_TAGS.map(t => <button key={t} type="button" className="vo-btn vo-tag" onClick={() => insertTag(t)} style={{background:'#F3E5F5',color:'#6A1B9A'}}>{t}</button>)}
      </div>
      <p className="vo-en">Not every sound works the same in every voice. Press Preview first to hear it.</p>
    </div>
  </details>

  <details className="vo-cat">
    <summary><span>🎭 बोल्ने लवज <span style={{color:'#6e6e73',fontWeight:500}}>| Accents</span></span></summary>
    <div className="vo-cat-body">
      <p className="vo-ne">आवाजको लवज बदल्न: कडा नेपाली, भारतीय वा बेलायती (British)। <strong>[sings]</strong> ले गाएजस्तो शैली दिन्छ।</p>
      <p className="vo-en">Change how the voice sounds: strong Nepali, Indian or British accent. [sings] gives a singing style.</p>
      <div className="vo-tags">
        {ACCENT_TAGS.map(t => <button key={t} type="button" className="vo-btn vo-tag" onClick={() => insertTag(t)} style={{background:'#E8F5E9',color:'#1B5E20'}}>{t}</button>)}
      </div>
      <p className="vo-ne">नतिजा आवाजअनुसार फरक पर्न सक्छ। पहिले Preview सुन्नुहोस्।</p>
      <p className="vo-en">Results can differ from voice to voice. Press Preview first.</p>
    </div>
  </details>

  <details className="vo-cat">
    <summary><span>🎬 उदाहरण <span style={{color:'#6e6e73',fontWeight:500}}>| Examples</span></span></summary>
    <div className="vo-cat-body">
      <p className="vo-ne">‘प्रयोग गर्नुहोस्’ थिचेर नमुना स्क्रिप्ट आफ्नो बक्समा हाल्नुहोस् र सुनेर हेर्नुहोस्।</p>
      <p className="vo-en">Tap Use to put a sample script into your box and listen to it.</p>
      <div style={{display:'flex',flexDirection:'column',gap:8,marginTop:8}}>
        {EXAMPLES.map(ex => (
          <div key={ex.title} style={{background:'#fff',border:'1px solid #e8e8ed',borderRadius:10,padding:'10px 12px'}}>
            <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',gap:8,marginBottom:6}}>
              <div style={{fontSize:11,fontWeight:700,color:ex.color}}>{ex.title}</div>
              <button type="button" className="vo-btn" onClick={() => setText(ex.text)} style={{background:'#DC143C',color:'#fff',border:'none',padding:'6px 14px',borderRadius:20,fontSize:12,fontWeight:700}}>प्रयोग · Use →</button>
            </div>
            <div className="vo-ne" style={{fontSize:13}}>{ex.text}</div>
          </div>
        ))}
      </div>
    </div>
  </details>

  <div style={{background:'#FFFDE7',border:'1px solid rgba(255,193,7,.4)',borderRadius:10,padding:'12px 14px',marginTop:4}}>
    <div style={{fontWeight:800,color:'#F57F17',fontSize:13,marginBottom:4}}>💳 Credit कसरी गनिन्छ? | How credits are counted</div>
    <p className="vo-ne">१ अक्षर = १ Credit। ब्र्याकेटभित्रका ट्यागहरू <code>[excited]</code>, <code>[pause]</code> आदिको क्रेडिट लाग्दैन। स्क्रिप्टका अक्षर, स्पेस र विराम चिह्नको क्रेडिट गणना हुन्छ।</p>
    <p className="vo-en">1 character = 1 credit. Emotion tags inside brackets are free. Script characters, spaces, and punctuation are counted toward your credits.</p>
    <p className="vo-ne" style={{marginTop:4}}>Generate थिच्नुअघि बटनमै तपाईंको खर्च देखिन्छ।</p>
    <p className="vo-en">The cost is shown on the Generate button before you press it.</p>
  </div>
  </div>
</details>
      </div>

      {/* RIGHT PANEL */}
      <div className="vo-col vo-col-right" style={{display:'flex',flexDirection:'column',gap:12}}>

        {/* Roman text warning */}
        {text.length > 0 && /^[a-zA-Z\s.,!?]+$/.test(text) && (
          <div className="vo-o-55" style={{background:'#FFF8F0',border:'1px solid rgba(255,149,0,.3)',borderRadius:10,padding:'10px 14px',marginBottom:10,fontSize:13,color:'#B45309',fontWeight:500}}>
            ⚠️ Devanagari script मा लेख्नुस् — "namaste" होइन "नमस्ते"
            <div style={{display:'flex',flexDirection:'column',gap:5,marginTop:8}}>
              <div style={{display:'flex',alignItems:'center',gap:8,fontSize:12}}>
                <span style={{color:'#34C759',fontWeight:700,fontSize:14}}>✓</span>
                <span style={{fontFamily:'Noto Sans Devanagari,sans-serif',color:'#34C759',fontWeight:600}}>नमस्ते! आज हामी एउटा नयाँ उत्पादन लिएर आएका छौं।</span>
              </div>
              <div style={{display:'flex',alignItems:'center',gap:8,fontSize:12}}>
                <span style={{color:'#DC143C',fontWeight:700,fontSize:14}}>✗</span>
                <span style={{color:'#DC143C',fontWeight:600}}>Namaste! Aaja hami euta naya utpadan liera aayeka chhau.</span>
              </div>
            </div>
          </div>
        )}

{/* Preview button */}
{text.trim().length > 0 && (
  <div className="vo-o-60" style={{marginBottom:10}}>
    <button
      onClick={handlePreview}
      disabled={previewing || !selectedVoice}
      style={{
        width:'100%',padding:'11px',borderRadius:12,border:'1.5px solid #e8e8ed',
        background: previewing ? '#f5f5f7' : '#fff',
        color: previewing ? '#888' : '#1d1d1f',
        fontSize:14,fontWeight:700,cursor: previewing ? 'not-allowed' : 'pointer',
        fontFamily:'Sora,sans-serif',
        display:'flex',alignItems:'center',justifyContent:'center',gap:8
      }}>
      {previewing ? '⏳ Generating preview...' : '🔊 Preview Voice — Free (First 200 chars)'}
    </button>
    {previewError && (
      <div style={{fontSize:12,color:'#DC143C',marginTop:6,textAlign:'center'}}>
        {previewError}
      </div>
    )}
    {previewUrl && (
      <div style={{marginTop:8,background:'#f0f7ff',border:'1px solid #90CAF9',borderRadius:10,padding:'8px 12px'}}>
        <div style={{fontSize:11,color:'#1976D2',fontWeight:700,marginBottom:6}}>
          🔊 Preview (first 200 chars) — No credits used
        </div>
        <audio
          ref={previewAudioRef}
          controls
          src={previewUrl}
          style={{width:'100%',height:36,borderRadius:6}}
        />
      </div>
    )}
  </div>
)}
{/* Cost summary — shown to logged-in users when text is present */}
{session && session !== false && session !== null && text.trim().length > 0 && (
  <div className="vo-o-70" style={{
    background: session.isPendingPayment ? 'rgba(255,149,0,.05)' : canGenerate ? '#f0f7ff' : '#fff5f5',
    border: `1.5px solid ${session.isPendingPayment ? 'rgba(255,149,0,.4)' : canGenerate ? '#90CAF9' : '#FFAAAA'}`,
    borderRadius: 10,
    padding: '12px 14px',
    marginBottom: 8,
    fontSize: 12,
  }}>
    {session.isPendingPayment ? (
      <div style={{color:'#B45309',fontWeight:600,textAlign:'center'}}>
        ⏳ Payment pending — credits will be activated after WhatsApp confirmation
      </div>
    ) : session.isLegacy ? (
      <>
        <div style={{display:'flex',justifyContent:'space-between',marginBottom:4}}>
          <span style={{color:'#6e6e73'}}>Characters</span>
          <span style={{fontWeight:700,color:'#1d1d1f'}}>{billableLength.toLocaleString()}</span>
        </div>
        <div style={{display:'flex',justifyContent:'space-between',marginBottom:4}}>
          <span style={{color:'#6e6e73'}}>Estimated cost</span>
          <span style={{fontWeight:700,color:'#1976D2'}}>25 credits (Legacy flat rate)</span>
        </div>
        <div style={{display:'flex',justifyContent:'space-between'}}>
          <span style={{color:'#6e6e73'}}>Available balance</span>
          <span style={{fontWeight:700,color: canGenerate ? '#1d1d1f' : '#DC143C'}}>{credits.toLocaleString()} {credits === 1 ? 'credit' : 'credits'}</span>
        </div>
      </>
    ) : (
      <>
        <div style={{display:'flex',justifyContent:'space-between',marginBottom:4}}>
          <span style={{color:'#6e6e73'}}>Characters</span>
          <span style={{fontWeight:700,color:'#1d1d1f'}}>{billableLength.toLocaleString()}</span>
        </div>
        <div style={{display:'flex',justifyContent:'space-between',marginBottom:4}}>
          <span style={{color:'#6e6e73'}}>Estimated cost</span>
          <span style={{fontWeight:700,color: canGenerate ? '#1976D2' : '#DC143C'}}>{billableLength.toLocaleString()} {billableLength === 1 ? 'credit' : 'credits'}</span>
        </div>
        <div style={{display:'flex',justifyContent:'space-between',marginBottom:4}}>
          <span style={{color:'#6e6e73'}}>Available balance</span>
          <span style={{fontWeight:700,color:'#1d1d1f'}}>{credits.toLocaleString()} {credits === 1 ? 'credit' : 'credits'}</span>
        </div>
        <div style={{display:'flex',justifyContent:'space-between',paddingTop:6,borderTop:`1px solid ${canGenerate ? 'rgba(25,118,210,.12)' : 'rgba(220,20,60,.12)'}`}}>
          <span style={{color:'#6e6e73'}}>Balance after generation</span>
          <span style={{fontWeight:700,color: canGenerate ? '#34C759' : '#DC143C'}}>
            {canGenerate ? `${(credits - billableLength).toLocaleString()} ${credits - billableLength === 1 ? 'credit' : 'credits'}` : '—'}
          </span>
        </div>
        {!canGenerate && credits !== null && (
          <div style={{marginTop:8,paddingTop:8,borderTop:'1px solid rgba(220,20,60,.12)'}}>
            <div style={{color:'#DC143C',fontWeight:600,marginBottom:8}}>
              ⚠️ {(billableLength - credits).toLocaleString()} more {(billableLength - credits) === 1 ? 'credit' : 'credits'} needed
            </div>
            <a
              href={`https://wa.me/19255379425?text=Hi! I want to buy more Swor AI credits to generate my voiceover.`}
              target="_blank" rel="noreferrer"
              style={{display:'block',background:'#DC143C',color:'#fff',padding:'8px 12px',borderRadius:8,fontSize:12,fontWeight:700,textAlign:'center',textDecoration:'none'}}>
              💳 Get More Credits →
            </a>
          </div>
        )}
      </>
    )}
  </div>
)}

{/* Generate button */}
<div className="vo-o-80 vo-genwrap">
<button className="vo-generate vo-btn" onClick={handleGenerate} disabled={!canGenerate} aria-busy={loading}
  style={{width:'100%',padding:'14px',borderRadius:12,border:'none',
    background:canGenerate?'#DC143C':'#ccc',
    color:'#fff',fontSize:15,fontWeight:700,cursor:canGenerate?'pointer':'not-allowed',
    fontFamily:'Sora,sans-serif',transition:'all .15s',
    boxShadow:canGenerate?'0 4px 20px rgba(220,20,60,.35)':'none'}}>
  {loading
    ? '⏳ बनाउँदै… · Generating…'
    : text.trim().length > 0 && session && !session.isLegacy
      ? `🎙️ Generate Voiceover · ${billableLength.toLocaleString()} ${billableLength === 1 ? 'credit' : 'credits'}`
      : text.trim().length > 0 && session && session.isLegacy
        ? '🎙️ Generate Voiceover · 25 credits'
        : '🎙️ Generate Voiceover'}
</button>
<div role="status" aria-live="polite" className="vo-genhint">
{loading ? (
  <>अडियो बनाउँदै छ, कृपया पर्खनुहोस्। · Audio is being generated, please wait.</>
) : (!canGenerate && session !== null && !(session && session.isPendingPayment)) ? (
  session === false ? (
    <>Generate गर्न पहिले Sign in गर्नुहोस्। · Sign in to generate audio.<br />
      <button type="button" className="vo-signin-link" onClick={() => setShowSignup(true)}>Sign in · साइन इन</button></>
  ) : billableLength === 0 ? (
    <>पहिले आफ्नो नेपाली स्क्रिप्ट लेख्नुहोस्। · Enter a Nepali script first.</>
  ) : (
    <>तपाईंको Credit पुगेन। · Not enough credits.</>
  )
) : null}
</div>
</div>

          {/* Credits info */}
          <div className="vo-o-105" style={{background:'#fff',borderRadius:12,border:'1.5px solid #e8e8ed',padding:'14px 16px'}}>
            <div style={{fontSize:11,fontWeight:700,color:'#888',letterSpacing:'0.08em',textTransform:'uppercase',marginBottom:10}}>Balance</div>
            {session ? (
              <div>
                <div style={{fontSize:24,fontWeight:800,color:credits === 0 ? '#DC143C' : '#1976D2',fontFamily:'Sora,sans-serif'}}>{credits.toLocaleString()}</div>
                <div style={{fontSize:12,color:'#888',marginTop:2}}>Swor Credits remaining</div>
                <div style={{fontSize:11,color:'#888',marginTop:4}}>1 credit = 1 Nepali character</div>
              </div>
            ) : isAnon ? (
              <div>
                <div style={{fontSize:13,fontWeight:700,color:'#1976D2',marginBottom:8}}>Sign in to access your credits</div>
                <button onClick={() => setShowSignup(true)}
                  style={{width:'100%',background:'#1976D2',color:'#fff',border:'none',padding:'8px 12px',borderRadius:8,fontSize:12,fontWeight:700,cursor:'pointer'}}>
                  Sign in →
                </button>
              </div>
            ) : (
              <div style={{fontSize:13,color:'#888'}}>Loading...</div>
            )}
          </div>

          {/* ZERO CREDITS — Show Demo + Pricing */}
{session && session.isPendingPayment && (
  <div className="vo-o-95" style={{background:'rgba(255,149,0,.08)',border:'1.5px solid rgba(255,149,0,.3)',borderRadius:14,padding:20,marginBottom:16,textAlign:'center'}}>
    <div style={{fontSize:16,marginBottom:8}}>⏳</div>
    <div style={{fontFamily:'Sora,sans-serif',fontSize:14,fontWeight:700,color:'#FF9500',marginBottom:6}}>
      Payment Verification Pending
    </div>
    <div style={{fontSize:13,color:'#6e6e73',lineHeight:1.6}}>
      Your account is ready! Please complete your payment via eSewa or Khalti and send the confirmation to our WhatsApp. Your credits will be activated within 5 minutes.
    </div>
    <a href="https://wa.me/19255379425?text=Namaste%20Avash!%20I%20have%20completed%20my%20payment%20for%20Swor%20AI.%20Please%20activate%20my%20account."
      target="_blank" rel="noreferrer"
      style={{display:'inline-block',marginTop:12,background:'#25D366',color:'#fff',padding:'10px 20px',borderRadius:10,fontSize:13,fontWeight:700,textDecoration:'none'}}>
      💬 Confirm Payment on WhatsApp
    </a>
  </div>
)}
          {hasNoCredits && (
            <>
              {/* Demo Box */}
              <div className="vo-o-96"><DemoBoxInline /></div>

              {/* Pricing */}
              <div className="vo-o-97" style={{background:'#fff',borderRadius:12,border:'1.5px solid #e8e8ed',padding:'14px 16px'}}>
                <div style={{fontSize:11,fontWeight:700,color:'#888',letterSpacing:'0.08em',textTransform:'uppercase',marginBottom:12}}>
                  Get Full Access
                </div>
                             <div style={{display:'flex',flexDirection:'column',gap:10}}>
                  {PACKS.map(p => (
                    <div key={p.key} style={{
                      borderRadius:10,padding:'12px 14px',border:'1.5px solid',
                      borderColor: p.popular ? p.color : '#e8e8ed',
                      background: p.popular ? `${p.color}08` : '#fafafa',
                      position:'relative'
                    }}>
                      {p.popular && (
                        <div style={{position:'absolute',top:-8,right:10,background:p.color,color:'#fff',fontSize:9,fontWeight:700,padding:'2px 8px',borderRadius:10,letterSpacing:'0.06em'}}>
                          MOST POPULAR
                        </div>
                      )}
                      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:4}}>
                        <div style={{fontSize:13,fontWeight:700,color:'#1d1d1f'}}>{p.name}</div>
                        <div style={{fontSize:14,fontWeight:800,color:p.color}}>NPR {p.npr.toLocaleString()}</div>
                      </div>
                      <div style={{fontSize:11,color:'#888',marginBottom:8}}>{p.credits} Swor Credits</div>
                      <a href={`https://wa.me/19255379425?text=Hi! I want to buy the Swor AI ${p.name} (NPR ${p.npr}). Please confirm.`}
                        target="_blank" rel="noreferrer"
                        style={{display:'block',background:p.color,color:'#fff',padding:'7px 12px',borderRadius:8,fontSize:12,fontWeight:700,textAlign:'center',textDecoration:'none'}}>
                        💬 Buy via WhatsApp
                      </a>
                    </div>
                  ))}
                </div>
<div style={{background:'linear-gradient(135deg,rgba(220,20,60,.08),rgba(255,149,0,.08))',border:'1.5px solid rgba(220,20,60,.25)',borderRadius:12,padding:'10px 14px',marginTop:12,marginBottom:0,textAlign:'center',fontSize:12,lineHeight:1.5,color:'#1d1d1f'}}>
  🎉 <strong>Dashain-Tihar offer:</strong> send code <strong style={{color:'#DC143C'}}>DASHAIN-TIHAR-2026</strong> on WhatsApp for <strong>+2,000 / +5,000 / +8,000 bonus credits</strong> on Starter / Creator / Founders. Limited time.
</div>
              </div>
                  </>
          )}

          {/* Voice info card — only show when user has credits */}
          {!hasNoCredits && (
            <div className="vo-o-110" style={{background:'#fff',borderRadius:12,border:'1.5px solid #e8e8ed',padding:'14px 16px'}}>
              <div style={{fontSize:11,fontWeight:700,color:'#888',letterSpacing:'0.08em',textTransform:'uppercase',marginBottom:10}}>Selected Voice</div>
              <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:10}}>
                <div style={{width:40,height:40,borderRadius:10,background:selectedVoice.color,display:'flex',alignItems:'center',justifyContent:'center',fontSize:16,fontWeight:700,color:'#fff'}}>
                  {selectedVoice.name[0]}
                </div>
                <div>
                  <div style={{fontSize:14,fontWeight:700,color:'#1d1d1f'}}>{selectedVoice.name}</div>
                  <div style={{fontSize:12,color:'#888'}}>{selectedVoice.desc}</div>
                </div>
              </div>
              <button onClick={() => playPreview(selectedVoice.voice_id)}
                style={{width:'100%',padding:'8px',borderRadius:8,border:'1.5px solid #e8e8ed',background:'#fafafa',fontSize:12,fontWeight:600,cursor:'pointer',color:'#555'}}>
                {playingPreview === selectedVoice.voice_id ? '■ Stop preview' : '▶ Preview voice'}
              </button>
            </div>
          )}

          {/* VOICE CHANGER PROMO */}
          <div className="vo-o-120" style={{background:'linear-gradient(135deg,#FFF5F7 0%,#fff 100%)',borderRadius:12,border:'1.5px solid rgba(220,20,60,.25)',padding:'14px 16px',marginBottom:12}}>
            <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:8}}>
              <span style={{fontSize:10,fontWeight:800,color:'#fff',background:'#DC143C',padding:'2px 8px',borderRadius:20,letterSpacing:'0.06em'}}>NEW · नयाँ</span>
              <span style={{fontSize:14,fontWeight:800,color:'#1d1d1f',fontFamily:'Sora,sans-serif'}}>🔄 Voice Changer</span>
            </div>
            <div style={{fontSize:13,fontWeight:700,color:'#1d1d1f',marginBottom:4}}>भ्वाइस चेन्जर: आफ्नो आवाज, प्रोफेसनल आवाजमा</div>
            <p style={{fontSize:12,color:'#555',lineHeight:1.6,marginBottom:4}}>
              Don't want to type? Speak into your phone, upload the recording, and we turn it into a professional voice. Your words and your feeling stay the same. Only the voice changes.
            </p>
            <p style={{fontSize:12,color:'#555',lineHeight:1.6,marginBottom:10}}>
              टाइप गर्न मन छैन? फोनमा बोलेर रेकर्ड गर्नुहोस् र अपलोड गर्नुहोस्। हामी त्यसलाई प्रोफेसनल आवाजमा बदलिदिन्छौं। तपाईंका शब्द र भाव उस्तै रहन्छन्, आवाज मात्र फेरिन्छ।
            </p>
            <div style={{fontSize:12,color:'#444',lineHeight:1.7,marginBottom:10}}>
              <div>1️⃣ Record yourself (up to 1 minute) · रेकर्ड गर्नुहोस् (१ मिनेटसम्म)</div>
              <div>2️⃣ Upload it and pick a voice · अपलोड गरी आवाज छान्नुहोस्</div>
              <div>3️⃣ Download the new audio · नयाँ अडियो डाउनलोड गर्नुहोस्</div>
            </div>
            <div style={{fontSize:11,color:'#777',lineHeight:1.6,marginBottom:10}}>
              For Creator and Founders packs. No extra fee: it uses your normal credits (1 minute ≈ 1,000 credits).<br />
              क्रिएटर र फाउन्डर्स प्याकका लागि। अतिरिक्त शुल्क छैन: सामान्य क्रेडिट नै लाग्छ (१ मिनेट ≈ १,००० क्रेडिट)।
            </div>
            <Link href="/voice-changer" style={{display:'block',textAlign:'center',background:'#DC143C',color:'#fff',padding:'9px',borderRadius:8,fontSize:13,fontWeight:700,textDecoration:'none'}}>
              {session && session.canVoiceChange ? 'Open Voice Changer →' : 'See how it works · कसरी काम गर्छ →'}
            </Link>
          </div>

          {/* HISTORY PANEL */}
          {session && !hasNoCredits && (
            <div className="vo-o-88" style={{background:'#fff',borderRadius:12,border:'1.5px solid #e8e8ed',padding:'14px 16px'}}>
              <div style={{fontSize:11,fontWeight:700,color:'#888',letterSpacing:'0.08em',textTransform:'uppercase',marginBottom:10}}>
                Recent Generations
              </div>
              {historyLoading ? (
                <div style={{fontSize:12,color:'#888',textAlign:'center',padding:'10px 0'}}>Loading history...</div>
              ) : history.length === 0 ? (
                <div style={{fontSize:12,color:'#888',textAlign:'center',padding:'10px 0'}}>No generations yet</div>
              ) : (
                <div style={{display:'flex',flexDirection:'column',gap:8}}>
                  {history.map((item) => (
                    <div key={item.id} className="history-item">
                      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:4}}>
                        <div style={{fontSize:11,fontWeight:700,color:'#1976D2'}}>{item.voiceName}</div>
                        <div style={{fontSize:10,color:'#aaa'}}>{formatDate(item.createdAt)}</div>
                      </div>
                      <div style={{fontSize:11,color:'#555',marginBottom:6,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',fontFamily:'Noto Sans Devanagari,sans-serif'}}>
                        {item.text}
                      </div>
                     <button
  onClick={async () => {
    try {
      const response = await fetch(item.url)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `swor_${item.voiceName}_${item.id}.mp3`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
    } catch (error) {
      window.open(item.url, '_blank')
    }
  }}
  style={{display:'inline-flex',alignItems:'center',gap:4,background:'#1976D2',color:'#fff',padding:'4px 10px',borderRadius:6,fontSize:11,fontWeight:700,border:'none',cursor:'pointer'}}>
  ⬇ Download
</button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Other tools */}
          <div className="vo-o-140" style={{background:'#fff',borderRadius:12,border:'1.5px solid #e8e8ed',padding:'14px 16px'}}>
            <div style={{fontSize:11,fontWeight:700,color:'#888',letterSpacing:'0.08em',textTransform:'uppercase',marginBottom:10}}>Other Tools</div>
            <div style={{display:'flex',flexDirection:'column',gap:6}}>
              <Link href="/music" style={{display:'flex',alignItems:'center',gap:8,padding:'8px 10px',borderRadius:8,background:'#E8F5E9',textDecoration:'none',fontSize:13,fontWeight:600,color:'#2E7D32'}}>
                🎵 Create Music
              </Link>
              <Link href="/subtitles" style={{display:'flex',alignItems:'center',gap:8,padding:'8px 10px',borderRadius:8,background:'#FFFDE7',textDecoration:'none',fontSize:13,fontWeight:600,color:'#F57F17'}}>
                🎬 Nepali Subtitles
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* SIGNUP MODAL */}
      {showSignup && (
        <div className="overlay" onClick={e => { if (e.target === e.currentTarget) setShowSignup(false) }}>
          <div className="modal">
            <div style={{textAlign:'center',marginBottom:24}}>
              <div style={{fontSize:26,fontWeight:800,color:'#1976D2',fontFamily:'Sora,sans-serif',marginBottom:4}}>SWOR AI</div>
              <div style={{fontSize:14,fontWeight:700,marginBottom:6}}>Sign in or create an account</div>
              <p style={{fontSize:13,color:'#888',lineHeight:1.6}}>No password needed. A credit pack is required to generate voiceovers.</p>
            </div>

            {/* Mode tabs */}
            <div style={{fontSize:12,fontWeight:600,color:'#888',textAlign:'center',marginBottom:8}}>Choose either option below. You don't need to do both.</div>
            <div style={{display:'flex',gap:6,marginBottom:20,background:'#f5f5f7',borderRadius:10,padding:4}}>
              <button onClick={() => switchLoginMode('link')}
                style={{flex:1,padding:'8px',borderRadius:8,border:'none',
                  background:loginMode==='link'?'#fff':'transparent',
                  fontWeight:700,fontSize:13,cursor:'pointer',
                  color:loginMode==='link'?'#1d1d1f':'#888',
                  boxShadow:loginMode==='link'?'0 1px 4px rgba(0,0,0,.1)':undefined}}>
                Email me a magic link
              </button>
              <span style={{alignSelf:'center',fontSize:12,fontWeight:700,color:'#888',flexShrink:0}}>or</span>
              <button onClick={() => switchLoginMode('otp')}
                style={{flex:1,padding:'8px',borderRadius:8,border:'none',
                  background:loginMode==='otp'?'#fff':'transparent',
                  fontWeight:700,fontSize:13,cursor:'pointer',
                  color:loginMode==='otp'?'#1d1d1f':'#888',
                  boxShadow:loginMode==='otp'?'0 1px 4px rgba(0,0,0,.1)':undefined}}>
                Email me a 6-digit code
              </button>
            </div>

            {/* Hint for the active sign-in method */}
            {((loginMode === 'link' && signupStatus !== 'sent') || (loginMode === 'otp' && !['sent','verifying','exhausted','expired'].includes(otpStatus))) && (
              <p style={{fontSize:12,color:'#888',textAlign:'center',margin:'-8px 0 12px'}}>
                {loginMode === 'link' ? "We'll email you a link to sign in." : "We'll email you a 6-digit code to enter here."}
              </p>
            )}

            {/* ── MAGIC LINK MODE ── */}
            {loginMode === 'link' && (
              signupStatus === 'sent' ? (
                <div style={{textAlign:'center',padding:'20px 0'}}>
                  <div style={{fontSize:40,marginBottom:12}}>📧</div>
                  <div style={{fontSize:16,fontWeight:700,marginBottom:8}}>Check your inbox!</div>
                  <p style={{fontSize:13,color:'#888'}}>Magic link sent to <strong>{signupEmail}</strong></p>
                </div>
              ) : (
                <form onSubmit={sendMagicLink}>
                  <input type="email" placeholder="your@email.com" required value={signupEmail}
                    onChange={e => setSignupEmail(e.target.value)}
                    style={{width:'100%',padding:'13px 16px',borderRadius:10,border:'1.5px solid #e8e8ed',fontSize:14,outline:'none',marginBottom:10,fontFamily:'inherit'}} />
                  <button type="submit" disabled={signupStatus === 'loading'}
                    style={{width:'100%',padding:'13px',borderRadius:10,border:'none',background:'#1976D2',color:'#fff',fontSize:15,fontWeight:700,cursor:'pointer',opacity:signupStatus==='loading'?.7:1}}>
                    {signupStatus === 'loading' ? 'Sending...' : 'Send magic link →'}
                  </button>
                  {signupStatus === 'error' && <p style={{fontSize:12,color:'#CC3333',marginTop:8,textAlign:'center'}}>Something went wrong. Try again.</p>}
                </form>
              )
            )}

            {/* ── OTP MODE ── */}
            {loginMode === 'otp' && (() => {
              // Email entry screen
              if (otpStatus === 'idle' || otpStatus === 'sending' || otpStatus === 'error') {
                return (
                  <form onSubmit={sendOtp}>
                    <input type="email" placeholder="your@email.com" required value={signupEmail}
                      onChange={e => setSignupEmail(e.target.value)}
                      style={{width:'100%',padding:'13px 16px',borderRadius:10,border:'1.5px solid #e8e8ed',fontSize:14,outline:'none',marginBottom:10,fontFamily:'inherit'}} />
                    <button type="submit" disabled={otpStatus === 'sending'}
                      style={{width:'100%',padding:'13px',borderRadius:10,border:'none',background:'#1976D2',color:'#fff',fontSize:15,fontWeight:700,cursor:'pointer',opacity:otpStatus==='sending'?.7:1}}>
                      {otpStatus === 'sending' ? 'Sending code...' : 'Send 6-digit code →'}
                    </button>
                    {otpStatus === 'error' && <p style={{fontSize:12,color:'#CC3333',marginTop:8,textAlign:'center'}}>{otpError || 'Something went wrong. Try again.'}</p>}
                  </form>
                )
              }

              // Rate-limited on send
              if (otpStatus === 'ratelimit') {
                return (
                  <div style={{textAlign:'center',padding:'16px 0'}}>
                    <div style={{fontSize:32,marginBottom:10}}>⏳</div>
                    <div style={{fontSize:14,fontWeight:700,marginBottom:6}}>Too many requests</div>
                    <p style={{fontSize:13,color:'#888',lineHeight:1.6}}>You've requested several codes in a short time. Please wait a few minutes and try again.</p>
                    <button onClick={resetOtp} style={{marginTop:16,padding:'9px 20px',borderRadius:8,border:'1.5px solid #e8e8ed',background:'transparent',fontSize:13,cursor:'pointer'}}>Try again</button>
                  </div>
                )
              }

              // Service unavailable
              if (otpStatus === 'service') {
                return (
                  <div style={{textAlign:'center',padding:'16px 0'}}>
                    <div style={{fontSize:32,marginBottom:10}}>⚠️</div>
                    <div style={{fontSize:14,fontWeight:700,marginBottom:6}}>Temporarily unavailable</div>
                    <p style={{fontSize:13,color:'#888',lineHeight:1.6}}>We couldn't send the code right now. Please try again in a moment.</p>
                    <button onClick={resetOtp} style={{marginTop:16,padding:'9px 20px',borderRadius:8,border:'1.5px solid #e8e8ed',background:'transparent',fontSize:13,cursor:'pointer'}}>Try again</button>
                  </div>
                )
              }

              // Code entry screen (sent, verifying, expired, exhausted, error-after-sent)
              if (['sent','verifying','expired','exhausted'].includes(otpStatus)) {
                return (
                  <div>
                    {otpStatus !== 'expired' && otpStatus !== 'exhausted' && (
                      <div style={{textAlign:'center',marginBottom:16}}>
                        <div style={{fontSize:13,color:'#555'}}>Code sent to <strong>{signupEmail}</strong></div>
                        <div style={{fontSize:12,color:'#888',marginTop:2}}>Expires in 10 minutes</div>
                      </div>
                    )}

                    {otpStatus === 'expired' && (
                      <div style={{textAlign:'center',padding:'12px 0',marginBottom:12}}>
                        <div style={{fontSize:28,marginBottom:8}}>⌛</div>
                        <div style={{fontSize:14,fontWeight:700,marginBottom:4,color:'#CC3333'}}>Code expired</div>
                        <p style={{fontSize:13,color:'#888'}}>Request a new code below.</p>
                      </div>
                    )}

                    {otpStatus === 'exhausted' && (
                      <div style={{textAlign:'center',padding:'12px 0',marginBottom:12}}>
                        <div style={{fontSize:28,marginBottom:8}}>🔒</div>
                        <div style={{fontSize:14,fontWeight:700,marginBottom:4,color:'#CC3333'}}>Too many incorrect attempts</div>
                        <p style={{fontSize:13,color:'#888'}}>Request a new code to try again.</p>
                      </div>
                    )}

                    {otpStatus !== 'expired' && otpStatus !== 'exhausted' && (
                      <form onSubmit={verifyOtp}>
                        <input
                          type="text"
                          inputMode="numeric"
                          pattern="\d{6}"
                          maxLength={6}
                          placeholder="123456"
                          required
                          value={otpCode}
                          onChange={e => { setOtpCode(e.target.value.replace(/\D/g,'')); setOtpError(null) }}
                          style={{width:'100%',padding:'13px 16px',borderRadius:10,border:`1.5px solid ${otpError?'#CC3333':'#e8e8ed'}`,fontSize:22,fontFamily:'monospace',letterSpacing:'0.2em',textAlign:'center',outline:'none',marginBottom:10}}
                        />
                        {otpError && (
                          <p style={{fontSize:12,color:'#CC3333',marginTop:0,marginBottom:8,textAlign:'center'}}>
                            {otpError}
                            {otpAttemptsLeft != null && ` (${otpAttemptsLeft} attempt${otpAttemptsLeft===1?'':'s'} left)`}
                          </p>
                        )}
                        <button type="submit" disabled={otpStatus==='verifying'||otpCode.length!==6}
                          style={{width:'100%',padding:'13px',borderRadius:10,border:'none',background:'#1976D2',color:'#fff',fontSize:15,fontWeight:700,cursor:'pointer',opacity:(otpStatus==='verifying'||otpCode.length!==6)?.7:1}}>
                          {otpStatus === 'verifying' ? 'Verifying...' : 'Verify code →'}
                        </button>
                      </form>
                    )}

                    <button onClick={resetOtp}
                      style={{width:'100%',marginTop:10,padding:'9px',borderRadius:10,border:'1px solid #e8e8ed',background:'transparent',fontSize:13,color:'#888',cursor:'pointer'}}>
                      Send a new code
                    </button>
                  </div>
                )
              }

              return null
            })()}

            <button onClick={() => setShowSignup(false)}
              style={{width:'100%',marginTop:10,padding:'10px',borderRadius:10,border:'1px solid #e8e8ed',background:'transparent',fontSize:13,color:'#888',cursor:'pointer'}}>
              Maybe later
            </button>
          </div>
        </div>
      )}
        {/* REWARD POPUP — for free/logged out users only */}
{showRewardPopup && !session && (
  <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,.75)',zIndex:9999,display:'flex',alignItems:'center',justifyContent:'center',padding:16,backdropFilter:'blur(6px)',overflowY:'auto'}}>
    <div style={{background:'linear-gradient(135deg,#1d1d1f 0%,#2d1020 100%)',borderRadius:24,padding:isMobile?20:28,maxWidth:480,width:'100%',border:'1.5px solid rgba(220,20,60,.3)',boxShadow:'0 24px 60px rgba(0,0,0,.5)',position:'relative',margin:'auto'}}>

      <button onClick={() => setShowRewardPopup(false)}
        aria-label="Close" style={{position:'fixed',top:16,right:16,zIndex:10000,background:'rgba(255,255,255,.22)',border:'none',color:'#fff',width:40,height:40,borderRadius:'50%',cursor:'pointer',fontSize:18}}>
        ✕
      </button>

      <div style={{textAlign:'center',marginBottom:20}}>
        <div style={{fontSize:36,marginBottom:8}}>🎉</div>
        <div style={{fontFamily:'Sora,sans-serif',fontSize:20,fontWeight:800,color:'#fff',marginBottom:4}}>
          Voice Generated Successfully!
        </div>
        <div style={{fontFamily:'Noto Sans Devanagari,sans-serif',fontSize:14,color:'rgba(255,255,255,.6)'}}>
          आवाज सफलतापूर्वक तयार भयो!
        </div>
      </div>

      <div style={{background:'rgba(220,20,60,.1)',border:'1.5px solid rgba(220,20,60,.3)',borderRadius:16,padding:20,marginBottom:20,textAlign:'center'}}>
        <div style={{fontSize:13,fontWeight:700,color:'rgba(255,255,255,.7)',marginBottom:8}}>
          🎁 Dashain-Tihar Bonus Offer for You!
        </div>
        <div style={{fontFamily:'Noto Sans Devanagari,sans-serif',fontSize:12,color:'rgba(255,255,255,.5)',marginBottom:16}}>
          तपाईंका लागि विशेष बोनस अफर!
        </div>

        <div style={{background:'#1d1d1f',borderRadius:12,padding:'12px 20px',marginBottom:16,display:'flex',alignItems:'center',justifyContent:'space-between',gap:12}}>
          <div>
            <div style={{fontSize:11,color:'#888',marginBottom:4}}>Your exclusive code / तपाईंको विशेष कोड:</div>
            <div style={{fontFamily:'monospace',fontSize:20,fontWeight:800,color:'#DC143C',letterSpacing:'0.1em'}}>DASHAIN-TIHAR-2026</div>
          </div>
          <button
            onClick={() => {
              navigator.clipboard.writeText('DASHAIN-TIHAR-2026')
              alert('Code copied!')
            }}
            style={{background:'rgba(220,20,60,.2)',border:'1px solid rgba(220,20,60,.4)',color:'#DC143C',padding:'6px 12px',borderRadius:8,fontSize:11,fontWeight:700,cursor:'pointer',flexShrink:0}}>
            Copy
          </button>
        </div>

        <div style={{fontSize:13,color:'#fff',fontWeight:600,marginBottom:12}}>
          🎁 Buy any pack and send this code on WhatsApp to get bonus credits:
        </div>
        <div style={{display:'flex',flexDirection:'column',gap:8,marginBottom:12}}>
          {[
            {name:'Starter Pack',npr:'499',base:'8,000',extra:'2,000',bonus:'10,000'},
    {name:'Creator Pack',npr:'999',base:'20,000',extra:'5,000',bonus:'25,000'},
    {name:'Founders Lifetime',npr:'2,500',base:'50,000',extra:'8,000',bonus:'58,000'},
          ].map(p => (
            <div key={p.name} style={{background:'rgba(255,255,255,.05)',borderRadius:10,padding:'10px 14px',display:'flex',alignItems:'center',justifyContent:'space-between',gap:8}}>
              <div>
                <div style={{fontSize:12,fontWeight:700,color:'#fff'}}>{p.name} — NPR {p.npr}</div>
                <div style={{fontSize:11,color:'rgba(255,255,255,.55)'}}>{p.base} credits + {p.extra} bonus</div>
              </div>
              <div style={{textAlign:'right'}}>
                <div style={{fontSize:14,fontWeight:800,color:'#34C759'}}>{p.bonus} credits</div>
                <div style={{fontSize:10,color:'rgba(255,255,255,.4)'}}>total after purchase</div>
              </div>
            </div>
          ))}
        </div>
        <div style={{fontFamily:'Noto Sans Devanagari,sans-serif',fontSize:12,color:'rgba(255,255,255,.6)',lineHeight:1.6}}>
          प्याक खरिद गरेपछि मात्र बोनस क्रेडिट प्राप्त हुनेछ।
        </div>
      </div>

      <div style={{textAlign:'center',marginBottom:16}}>
        <div style={{fontSize:12,color:'rgba(255,255,255,.5)',marginBottom:4}}>
          ⏱️ Offer valid for / यो अफर मान्य छ:
        </div>
        <div style={{fontFamily:'Sora,sans-serif',fontSize:28,fontWeight:800,color:rewardTimeLeft < 60 ? '#DC143C' : '#FF9500'}}>
          {formatRewardTime(rewardTimeLeft)}
        </div>
        <div style={{fontSize:11,color:'rgba(255,255,255,.4)'}}>
          {rewardTimeLeft < 60 ? '⚠️ Expiring soon!' : 'minutes remaining'}
        </div>
      </div>

      <div style={{position:'sticky',bottom:-16,zIndex:2,background:'#2a0f1b',margin:'0 -4px',padding:'10px 4px 18px',borderTop:'1px solid rgba(220,20,60,.25)'}}>
      <a href="https://wa.me/19255379425?text=Namaste%20Avash!%20I%20just%20tried%20the%20free%20preview%20on%20Swor%20AI%20and%20unlocked%20code%20DASHAIN-TIHAR-2026.%20I%20want%20to%20claim%20my%20bonus%20credits!" target="_blank" rel="noreferrer" style={{display:'block',background:'#25D366',color:'#fff',padding:'14px',borderRadius:12,fontSize:15,fontWeight:700,textAlign:'center',textDecoration:'none',boxShadow:'0 4px 20px rgba(37,211,102,.3)',marginBottom:10}}>
        {'💬 Send Code & Buy on WhatsApp'}
      </a>
      <div style={{textAlign:'center',fontSize:11,color:'rgba(255,255,255,.3)'}}>
        {'या / or '}
        <span style={{cursor:'pointer',textDecoration:'underline'}} onClick={() => setShowRewardPopup(false)}>
          {'Continue exploring →'}
        </span>
      </div>
      </div>
    </div>
  </div>
)}
    </>
  )
}
