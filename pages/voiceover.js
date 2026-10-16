import Head from 'next/head'
import Link from 'next/link'
import { useState, useEffect, useRef } from 'react'

const VOICE_CATEGORIES = [
  {
    category: '📺 News & Documentary',
    voices: [
      { voice_id: 'TmPeb2hSxdVrThJLywkg', name: 'Vanishree', desc: 'Professional News Anchor', gender: 'F', color: '#0077CC' },
      { voice_id: 'WdZjiN0nNcik2LBjOHiv', name: 'Bishnu', desc: 'Wise Documentary Narrator', gender: 'M', color: '#4E342E' },
      { voice_id: 'FszY75334ExxVmg7yl0U', name: 'Dhurundhar', desc: 'Deep & Commanding', gender: 'M', color: '#1A3A5C' },
      { voice_id: '2W8HrWcBFzCEf5cQQdIL', name: 'Karan', desc: 'Dark Documentary', gender: 'M', color: '#212121' },
      { voice_id: 'BtWabtumIemAotTjP5sk', name: 'Prakash', desc: 'Clear & Professional', gender: 'M', color: '#37474F' },
    ]
  },
  {
    category: '📱 Social Media & Reels',
    voices: [
      { voice_id: 'TX3LPaxmHKxFdv7VOQHJ', name: 'Arjun', desc: 'Energetic Reels', gender: 'M', color: '#F57C00' },
      { voice_id: 'ecp3DWciuUyW7BYM7II1', name: 'Anika', desc: 'Sweet & Lively', gender: 'F', color: '#7B2FBE' },
      { voice_id: 'CwhRBWXzGAHq8TQ4Fs17', name: 'Rohan', desc: 'Casual & Laid-Back', gender: 'M', color: '#546E7A' },
      { voice_id: '34lPwSZ54D8fWbX1aHzk', name: 'Suraj', desc: 'Upbeat TV Announcer', gender: 'M', color: '#FFA000' },
      { voice_id: 'gU0LNdkMOQCOrPrwtbee', name: 'Saurav', desc: 'Sports Commentator', gender: 'M', color: '#B71C1C' },
      { voice_id: '6fZce9LFNG3iEITDfqZZ', name: 'Chameli', desc: 'Gen Z & Modern Reels', gender: 'F', color: '#E91E63' },
      { voice_id: '7PoJrtDD6yvTa56HTDt1', name: 'Kritika', desc: 'UGC & Influencer Content', gender: 'F', color: '#FF4081' },
    ]
  },
  {
    category: '💕 Romantic & Storytelling',
    voices: [
      { voice_id: '1zUSi8LeHs9M2mV8X6YS', name: 'Priyanka', desc: 'Romantic & Elegant', gender: 'F', color: '#FF6B8A' },
      { voice_id: 'rHhok70RpCi5GgianXRA', name: 'Rudra', desc: 'Intense & Romantic', gender: 'M', color: '#880E4F' },
      { voice_id: 'LK1Sn9bmEczSFI65RF0v', name: 'Sunita', desc: 'Soft Spoken Aunty', gender: 'F', color: '#E91E8C' },
      { voice_id: '6qL48o1LBmtR94hIYAQh', name: 'Monika', desc: 'Suspense & Drama', gender: 'F', color: '#1C1C2E' },
      { voice_id: 'A6TsrDqI2qlO9AWAfZHY', name: 'Shreya', desc: 'Sultry Adult Narration', gender: 'F', color: '#AD1457' },
      { voice_id: 'YDCfZMLWcUmsGvqHq0rS', name: 'Reshma', desc: 'Femme Fatale', gender: 'F', color: '#6A1B9A' },
    ]
  },
  {
    category: '🏢 Business & Advertising',
    voices: [
      { voice_id: 'e6h2ged6ThVk1jTnIwnC', name: 'Ridhi', desc: 'Elegant Ad Narration', gender: 'F', color: '#00ACC1' },
      { voice_id: 'Pc57DSBXmCXyEAmow7lW', name: 'Shraddha', desc: 'Credible & Trustworthy', gender: 'F', color: '#5C6BC0' },
      { voice_id: 'g1FVKFidZjHPxXdfA89c', name: 'Vikram', desc: 'Confident & Warm', gender: 'M', color: '#2E7D32' },
      { voice_id: 'duDBJHU6G1oq7ZdK4Kxf', name: 'Anjali', desc: 'Motivational', gender: 'F', color: '#FF8C42' },
      { voice_id: 'nz8zH5px6I7CAT1IHAwU', name: 'Aryan', desc: 'Luxury Ads & Commercials', gender: 'M', color: '#1B5E20' },
      { voice_id: 'CXoGcuszI2UkuF6sqV8W', name: 'Nisha', desc: 'Premium Female Commercial', gender: 'F', color: '#F06292' },
    ]
  },
  {
    category: '🎭 Dark & Cinematic',
    voices: [
      { voice_id: 'wAGzRVkxKEs8La0lmdrE', name: 'Sanjay', desc: 'Mature Deep & Intriguing', gender: 'M', color: '#263238' },
      { voice_id: 'Df0A8fHl2LOO7kDNIlpg', name: 'Chandramukhi', desc: 'Mysterious & Powerful', gender: 'F', color: '#4A148C' },
    ]
  },
  {
    category: '🎧 ASMR & Meditation',
    voices: [
      { voice_id: 'zA6D7RyKdc2EClouEMkP', name: 'Sonia', desc: 'Tranquil ASMR & Meditation', gender: 'F', color: '#26A69A' },
      { voice_id: 'GL7nHO5mDrxcHlJPJK5T', name: 'Veronika', desc: 'Serene ASMR Whispering', gender: 'F', color: '#80CBC4' },
    ]
  },
  {
    category: '💬 Conversational',
    voices: [
      { voice_id: 'm3yAHyFEFKtbCIM5n7GF', name: 'Asha', desc: 'Conversational & Bright', gender: 'F', color: '#D81B60' },
      { voice_id: 'f0JpDwzbGK384Dd1WH2s', name: 'Mina', desc: 'Friendly & Polished', gender: 'F', color: '#00897B' },
    ]
  },
]
const VOICES = VOICE_CATEGORIES.flatMap(c => c.voices)

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
    features: ['3,500 Swor Credits', '~7 TikTok/Reels OR 3 YouTube Intros', 'All 30 voices', 'Credits never expire'],
    color: '#1976D2',
  },
  {
    key: 'creator',
    name: 'Creator Pack',
    npr: 999,
    usd: 12.99,
    credits: '20,000',
    popular: true,
    features: ['7,500 Swor Credits', '~15 TikTok/Reels OR 6 YouTube Intros', 'All 30 voices', 'Credits never expire'],
    color: '#DC143C',
  },
  {
    key: 'founders',
    name: 'Founders Lifetime',
    npr: 2500,
    usd: 19.99,
    credits: '50,000',
    popular: false,
    features: ['25,000 Swor Credits (Lifetime)', '5 AI Music Tracks', 'All 30 voices', 'Credits never expire', 'Founders status forever'],
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
  <div style={{fontSize:11,fontWeight:700,color:'#DC143C',letterSpacing:'0.08em',textTransform:'uppercase',marginBottom:10}}>
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
          background: demoText.trim() && !demoLoading ? '#DC143C' : '#ccc',
          color:'#fff',fontSize:12,fontWeight:700,
          cursor: demoText.trim() && !demoLoading ? 'pointer' : 'not-allowed',
        }}>
        {demoLoading ? '⏳ Generating...' : demoPlaying ? '🔊 Playing...' : '▶ Hear Sample (Free)'}
      </button>
    </div>
  )
}

const CHAR_LIMIT = 3500

export default function Voiceover() {
  const [isMobile, setIsMobile] = useState(false)
  const [session, setSession] = useState(null)
  const [text, setText] = useState('')
  const [proTipsOpen, setProTipsOpen] = useState(false)
  const [activeTagTab, setActiveTagTab] = useState('all')
  const [selectedVoice, setSelectedVoice] = useState(VOICES[0])
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
  // Collapsible panel state
  const [showAiGen, setShowAiGen] = useState(false)
  const [showStylePresets, setShowStylePresets] = useState(false)
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
    setLoading(false)
  }

  const billableLength = text.trim().length  // B3 fix: matches server-side billing
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
        .voice-chip:hover{background:#f5f5f7;border-color:rgba(220,20,60,.15)}
        .voice-chip.active{border-color:#DC143C;background:rgba(220,20,60,.06)}
        @keyframes fadeIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
        .fade-in{animation:fadeIn .2s ease}
        .overlay{position:fixed;inset:0;background:rgba(0,0,0,.4);z-index:200;display:flex;align-items:center;justify-content:center;backdrop-filter:blur(4px)}
        .modal{background:#fff;border-radius:20px;padding:32px;max-width:420px;width:90%;box-shadow:0 24px 60px rgba(0,0,0,.15)}
        .history-item{background:#f8f8f8;border-radius:10px;padding:10px 12px;border:1px solid #e8e8ed;transition:all .15s}
        .history-item:hover{border-color:rgba(220,20,60,.3);background:rgba(220,20,60,.03)}
        .collapsible-toggle{display:flex;align-items:center;justify-content:space-between;cursor:pointer;user-select:none;padding:10px 14px;border-radius:10px;transition:background .15s}
        .collapsible-toggle:hover{background:#f5f5f7}
        .section-label{font-size:11px;font-weight:700;color:#888;letter-spacing:0.08em;text-transform:uppercase}
        .tag-chip{padding:4px 10px;border-radius:20px;border:1.5px solid #e8e8ed;background:#fff;font-size:11px;font-weight:600;cursor:pointer;color:#555;transition:all .15s;font-family:'Manrope',sans-serif}
        .tag-chip:hover{border-color:rgba(220,20,60,.4);background:rgba(220,20,60,.05);color:#DC143C}
        .btn-primary{background:#DC143C;color:#fff;border:none;border-radius:12px;font-weight:700;cursor:pointer;font-family:'Sora',sans-serif;transition:all .15s;box-shadow:0 4px 18px rgba(220,20,60,.25)}
        .btn-primary:hover{background:#C41230;box-shadow:0 6px 24px rgba(220,20,60,.35)}
        .btn-primary:disabled{background:#ccc;box-shadow:none;cursor:not-allowed}
        .card{background:#fff;border-radius:14px;border:1.5px solid #e8e8ed;overflow:hidden}
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
        </div>
        <div style={{display:'flex',alignItems:'center',gap:10}}>
          {session && (
            <div style={{fontSize:13,fontWeight:700,background:'rgba(220,20,60,.08)',color:'#DC143C',padding:'5px 14px',borderRadius:20,border:'1px solid rgba(220,20,60,.2)'}}>
              {credits.toLocaleString()} credits
            </div>
          )}
          {session && (
            <button
              onClick={handleLogout}
              disabled={loggingOut}
              style={{background:'none',border:'1px solid #e0e0e0',color:'#888',padding:'5px 12px',borderRadius:20,fontSize:13,fontWeight:600,cursor:loggingOut?'not-allowed':'pointer',opacity:loggingOut?0.6:1}}
            >
              {loggingOut ? 'Signing out…' : 'Sign out'}
            </button>
          )}
          {!session && (
            <button onClick={() => setShowSignup(true)}
              style={{background:'#DC143C',color:'#fff',border:'none',padding:'7px 18px',borderRadius:10,fontSize:13,fontWeight:700,cursor:'pointer',boxShadow:'0 2px 10px rgba(220,20,60,.25)'}}>
              Sign in
            </button>
          )}
        </div>
      </nav>

      {/* PAGE HEADER */}
      <div style={{background:'#fff',borderBottom:'1px solid #e8e8ed',padding:'20px 24px'}}>
        <div style={{maxWidth:1100,margin:'0 auto',display:'flex',alignItems:'center',gap:14}}>
          <div style={{width:44,height:44,borderRadius:12,background:'linear-gradient(135deg,#DC143C,#FF6B8A)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:22,flexShrink:0}}>🎙️</div>
          <div>
            <h1 style={{fontFamily:'Sora,sans-serif',fontSize:20,fontWeight:800,color:'#1d1d1f',letterSpacing:'-0.4px',lineHeight:1.2}}>Nepali Voiceover</h1>
            <p style={{fontSize:13,color:'#888',marginTop:3}}>Type Nepali text · Choose a voice · Download your MP3</p>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div style={{maxWidth:1100,margin:'0 auto',padding:isMobile?'16px 12px':'28px 24px',display:'grid',gridTemplateColumns:isMobile?'1fr':'1fr 320px',gap:20,alignItems:'start'}}>

        {/* ───── LEFT PANEL ───── */}
        <div style={{display:'flex',flexDirection:'column',gap:16}}>

          {/* Logged-out banner */}
          {session === false && (
            <div style={{background:'rgba(220,20,60,.05)',border:'1.5px solid rgba(220,20,60,.2)',borderRadius:12,padding:'12px 16px',display:'flex',alignItems:'center',justifyContent:'space-between',flexWrap:'wrap',gap:10}}>
              <span style={{fontSize:13,color:'#DC143C',fontWeight:600}}>🔐 Sign in to generate full voiceovers</span>
              <button onClick={() => setShowSignup(true)}
                style={{background:'#DC143C',color:'#fff',border:'none',padding:'7px 16px',borderRadius:8,fontSize:13,fontWeight:700,cursor:'pointer'}}>
                Sign in free →
              </button>
            </div>
          )}

          {/* ── VOICE SELECTOR ── */}
          <div className="card">
            {/* Selected voice pill + toggle */}
            <div style={{padding:'12px 14px',borderBottom:'1px solid #f0f0f0',display:'flex',alignItems:'center',justifyContent:'space-between',gap:10}}>
              <div style={{display:'flex',alignItems:'center',gap:10}}>
                <div style={{width:34,height:34,borderRadius:9,background:selectedVoice.color,display:'flex',alignItems:'center',justifyContent:'center',fontSize:15,fontWeight:800,color:'#fff',flexShrink:0}}>
                  {selectedVoice.name[0]}
                </div>
                <div>
                  <div style={{fontSize:13,fontWeight:700,color:'#1d1d1f'}}>{selectedVoice.name}</div>
                  <div style={{fontSize:11,color:'#888'}}>{selectedVoice.desc}</div>
                </div>
              </div>
              <div style={{display:'flex',alignItems:'center',gap:8}}>
                <button onClick={() => playPreview(selectedVoice.voice_id)}
                  style={{padding:'5px 12px',borderRadius:8,border:'1.5px solid #e8e8ed',background:'#fafafa',fontSize:11,fontWeight:600,cursor:'pointer',color:'#555',whiteSpace:'nowrap'}}>
                  {playingPreview === selectedVoice.voice_id ? '■ Stop' : '▶ Preview'}
                </button>
                <button onClick={() => setShowVoicePanel(v => !v)}
                  style={{padding:'5px 14px',borderRadius:8,border:'1.5px solid rgba(220,20,60,.3)',background:showVoicePanel?'rgba(220,20,60,.06)':'#fff',fontSize:12,fontWeight:700,cursor:'pointer',color:'#DC143C',whiteSpace:'nowrap'}}>
                  {showVoicePanel ? '▲ Close' : '▼ Change voice'}
                </button>
              </div>
            </div>

            {/* Expandable voice grid */}
            {showVoicePanel && (
              <div className="fade-in" style={{padding:'12px 14px'}}>
                {VOICE_CATEGORIES.map(cat => (
                  <div key={cat.category} style={{marginBottom:14}}>
                    <div style={{fontSize:11,fontWeight:700,color:'#aaa',letterSpacing:'0.06em',textTransform:'uppercase',marginBottom:8}}>
                      {cat.category}
                    </div>
                    <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:6}}>
                      {cat.voices.map(v => (
                        <div key={v.voice_id}
                          className={`voice-chip${selectedVoice.voice_id === v.voice_id ? ' active' : ''}`}
                          onClick={() => { setSelectedVoice(v); setShowVoicePanel(false) }}
                          style={{borderLeft:`3px solid ${v.color}`}}>
                          <div style={{width:28,height:28,borderRadius:7,background:v.color,display:'flex',alignItems:'center',justifyContent:'center',fontSize:12,fontWeight:800,color:'#fff',flexShrink:0}}>
                            {v.name[0]}
                          </div>
                          <div style={{minWidth:0}}>
                            <div style={{fontSize:12,fontWeight:700,color:'#1d1d1f',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{v.name}</div>
                            <div style={{fontSize:10,color:'#888',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{v.desc}</div>
                          </div>
                          <button
                            onClick={e => { e.stopPropagation(); playPreview(v.voice_id) }}
                            style={{marginLeft:'auto',background:'none',border:'none',cursor:'pointer',fontSize:14,color:'#aaa',padding:'2px 4px',flexShrink:0,lineHeight:1}}>
                            {playingPreview === v.voice_id ? '■' : '▶'}
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ── AI SCRIPT GENERATOR (collapsible) ── */}
          <div className="card">
            <div className="collapsible-toggle" onClick={() => setShowAiGen(v => !v)}>
              <div style={{display:'flex',alignItems:'center',gap:8}}>
                <span style={{fontSize:16}}>✨</span>
                <span style={{fontFamily:'Sora,sans-serif',fontSize:13,fontWeight:700,color:'#1d1d1f'}}>AI Script Generator</span>
                <span style={{fontSize:11,color:'#888'}}>— write a script from a prompt</span>
              </div>
              <span style={{fontSize:18,color:'#aaa',fontWeight:300}}>{showAiGen ? '−' : '+'}</span>
            </div>

            {showAiGen && (
              <div className="fade-in" style={{padding:'0 14px 14px'}}>
                <div style={{borderTop:'1px solid #f0f0f0',paddingTop:12}}>
                  <div style={{marginBottom:10}}>
                    <label style={{fontSize:11,fontWeight:700,color:'#888',display:'block',marginBottom:6,letterSpacing:'0.06em',textTransform:'uppercase'}}>Describe your script</label>
                    <textarea
                      value={scriptPrompt}
                      onChange={e => setScriptPrompt(e.target.value)}
                      placeholder="e.g. A 30-second ad for a Nepali restaurant in Kathmandu..."
                      style={{width:'100%',height:70,padding:'10px 12px',fontSize:13,lineHeight:1.6,border:'1.5px solid #e8e8ed',borderRadius:10,background:'#fafafa',color:'#1d1d1f',fontFamily:'Manrope,sans-serif',outline:'none'}}
                    />
                  </div>
                  <div style={{display:'flex',gap:10,alignItems:'flex-end'}}>
                    <div style={{flex:1}}>
                      <label style={{fontSize:11,fontWeight:600,color:'#888',display:'block',marginBottom:6}}>Duration</label>
                      <select value={scriptDuration} onChange={e => setScriptDuration(e.target.value)}
                        style={{width:'100%',padding:'9px 10px',border:'1.5px solid #e8e8ed',borderRadius:8,fontSize:13,background:'#fff',color:'#1d1d1f',cursor:'pointer',outline:'none'}}>
                        <option value="15">15 sec</option>
                        <option value="30">30 sec</option>
                        <option value="60">60 sec</option>
                        <option value="90">90 sec</option>
                        <option value="120">2 min</option>
                      </select>
                    </div>
                    <button onClick={handleGenerateScript} disabled={generatingScript || !scriptPrompt.trim()}
                      className="btn-primary"
                      style={{padding:'9px 20px',fontSize:13,flex:'0 0 auto',opacity:generatingScript||!scriptPrompt.trim()?.5:1}}>
                      {generatingScript ? '⏳ Writing...' : '✨ Generate'}
                    </button>
                  </div>
                  {scriptError && <div style={{fontSize:11,color:'#CC3333',marginTop:8}}>❌ {scriptError}</div>}
                </div>
              </div>
            )}
          </div>

          {/* ── SCRIPT EDITOR ── */}
          <div className="card">
            <div style={{padding:'12px 14px',borderBottom:'1px solid #f0f0f0',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
              <span style={{fontFamily:'Sora,sans-serif',fontSize:13,fontWeight:700,color:'#1d1d1f'}}>📝 Your Script</span>
              <span style={{fontSize:11,fontWeight:600,color:text.trim().length > CHAR_LIMIT * 0.9 ? '#DC143C' : '#aaa'}}>
                {text.trim().length.toLocaleString()} / {CHAR_LIMIT.toLocaleString()} chars
              </span>
            </div>

            {/* Style Presets (collapsible) */}
            <div style={{borderBottom:'1px solid #f0f0f0'}}>
              <div className="collapsible-toggle" onClick={() => setShowStylePresets(v => !v)} style={{padding:'8px 14px'}}>
                <div style={{display:'flex',alignItems:'center',gap:6}}>
                  <span style={{fontSize:14}}>🎭</span>
                  <span style={{fontSize:12,fontWeight:700,color:'#555'}}>Style Presets</span>
                  <span style={{fontSize:11,color:'#aaa'}}>— one-click emotion starters</span>
                </div>
                <span style={{fontSize:16,color:'#ccc'}}>{showStylePresets ? '−' : '+'}</span>
              </div>

              {showStylePresets && (
                <div className="fade-in" style={{padding:'4px 14px 12px',display:'flex',flexWrap:'wrap',gap:6}}>
                  {[
                    { label: '😢 Emotional', tag: '[sad] [slow]' },
                    { label: '⚡ Energetic', tag: '[excited] [fast]' },
                    { label: '📺 News Anchor', tag: '[serious] [authoritative]' },
                    { label: '😄 Fun & Light', tag: '[cheerful] [laughs]' },
                    { label: '🌙 ASMR', tag: '[whispers] [calm] [slow]' },
                    { label: '🎬 Cinematic', tag: '[dramatic] [pause] [deep]' },
                  ].map(p => (
                    <button key={p.label}
                      onClick={() => {
                        const ta = document.querySelector('textarea#main-script')
                        if (ta) {
                          const start = ta.selectionStart ?? 0
                          const before = text.slice(0, start)
                          const after = text.slice(start)
                          setText((before + p.tag + ' ' + after).slice(0, CHAR_LIMIT))
                          setTimeout(() => { ta.focus(); ta.selectionStart = ta.selectionEnd = start + p.tag.length + 1 }, 0)
                        } else {
                          setText(prev => (p.tag + ' ' + prev).slice(0, CHAR_LIMIT))
                        }
                      }}
                      className="tag-chip">
                      {p.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Textarea */}
            <div style={{padding:'12px 14px'}}>
              {/[a-zA-Z]{5,}/.test(text) && (
                <div style={{background:'rgba(255,152,0,.08)',border:'1px solid rgba(255,152,0,.3)',borderRadius:8,padding:'8px 12px',marginBottom:10,fontSize:12,color:'#E65100'}}>
                  ⚠️ Roman text detected — results may be poor. Use Devanagari (नेपाली) for best quality.
                </div>
              )}

              <textarea
                id="main-script"
                value={text}
                onChange={e => setText(e.target.value.slice(0, CHAR_LIMIT))}
                placeholder="यहाँ नेपाली टाइप गर्नुस् वा भोइसओभर स्क्रिप्ट लेख्नुस्...&#10;&#10;Tip: [excited] वा [calm] जस्ता emotion tags थप्न सकिन्छ"
                style={{width:'100%',height:isMobile?160:220,padding:'12px 14px',fontSize:14,lineHeight:1.8,border:'1.5px solid #e8e8ed',borderRadius:10,background:'#fff',color:'#1d1d1f',fontFamily:'Noto Sans Devanagari, Manrope, sans-serif'}}
              />

              {/* Result audio player */}
              {result && (
                <div style={{marginTop:12,background:'rgba(220,20,60,.04)',border:'1.5px solid rgba(220,20,60,.2)',borderRadius:10,padding:'12px 14px'}}>
                  <div style={{fontSize:11,fontWeight:700,color:'#DC143C',marginBottom:8,letterSpacing:'0.06em',textTransform:'uppercase'}}>✅ Voiceover Ready</div>
                  <audio controls src={result.url} style={{width:'100%',height:36}} />
                  <a href={result.url} download={result.filename}
                    style={{display:'inline-flex',alignItems:'center',gap:6,marginTop:8,background:'#DC143C',color:'#fff',padding:'7px 16px',borderRadius:8,fontSize:12,fontWeight:700,textDecoration:'none'}}>
                    ⬇ Download MP3
                  </a>
                </div>
              )}

              {error && (
                <div style={{marginTop:10,background:'#FFF5F5',border:'1px solid #FFCCCC',borderRadius:8,padding:'10px 12px',fontSize:12,color:'#CC3333'}}>
                  ❌ {error}
                </div>
              )}
            </div>
          </div>

          {/* ── PRO TIPS (collapsible) ── */}
          <div className="card">
            <div className="collapsible-toggle" onClick={() => setProTipsOpen(v => !v)} style={{padding:'12px 14px'}}>
              <div style={{display:'flex',alignItems:'center',gap:8}}>
                <span style={{fontSize:16}}>💡</span>
                <span style={{fontFamily:'Sora,sans-serif',fontSize:13,fontWeight:700,color:'#1d1d1f'}}>Pro Tips & Emotion Tags</span>
                <span style={{fontSize:11,color:'#aaa'}}>— {proTipsOpen ? 'click to collapse' : 'click to expand'}</span>
              </div>
              <span style={{fontSize:18,color:'#aaa',fontWeight:300}}>{proTipsOpen ? '−' : '+'}</span>
            </div>

            {proTipsOpen && (
              <div className="fade-in" style={{borderTop:'1px solid #f0f0f0'}}>
                {/* Tag tabs */}
                <div style={{padding:'10px 14px 0',display:'flex',gap:6,overflowX:'auto'}}>
                  {['all','emotions','reactions','sfx','accents'].map(tab => (
                    <button key={tab} onClick={() => setActiveTagTab(tab)}
                      style={{padding:'5px 14px',borderRadius:20,border:'1.5px solid',borderColor:activeTagTab===tab?'#DC143C':'#e8e8ed',background:activeTagTab===tab?'rgba(220,20,60,.06)':'#fff',fontSize:11,fontWeight:700,cursor:'pointer',color:activeTagTab===tab?'#DC143C':'#666',whiteSpace:'nowrap',transition:'all .15s'}}>
                      {tab.charAt(0).toUpperCase()+tab.slice(1)}
                    </button>
                  ))}
                </div>

                {/* Tag chips */}
                <div style={{padding:'10px 14px',display:'flex',flexWrap:'wrap',gap:5}}>
                  {[
                    ...(activeTagTab==='all'||activeTagTab==='emotions'?[
                      '[excited]','[sad]','[angry]','[calm]','[scared]','[surprised]','[happy]','[serious]','[cheerful]','[whispers]','[dramatic]','[romantic]','[authoritative]','[playful]','[mysterious]',
                    ]:[]),
                    ...(activeTagTab==='all'||activeTagTab==='reactions'?[
                      '[laughs]','[sighs]','[gasps]','[cries]','[gulps]','[clears throat]','[pause]','[long pause]',
                    ]:[]),
                    ...(activeTagTab==='all'||activeTagTab==='sfx'?[
                      '[explosion]','[gunshot]','[rain]','[thunder]','[wind]','[crowd cheering]','[clapping]','[bell]','[alarm]',
                    ]:[]),
                    ...(activeTagTab==='all'||activeTagTab==='accents'?[
                      '[fast]','[slow]','[deep]','[high pitch]','[low pitch]','[echo]',
                    ]:[]),
                  ].map(tag => (
                    <button key={tag} className="tag-chip"
                      onClick={() => {
                        const ta = document.querySelector('textarea#main-script')
                        if (ta) {
                          const start = ta.selectionStart ?? text.length
                          const before = text.slice(0, start)
                          const after = text.slice(start)
                          const inserted = before + tag + ' ' + after
                          setText(inserted.slice(0, CHAR_LIMIT))
                          setTimeout(() => { ta.focus(); ta.selectionStart = ta.selectionEnd = start + tag.length + 1 }, 0)
                        } else {
                          setText(prev => (prev + ' ' + tag).slice(0, CHAR_LIMIT))
                        }
                      }}>
                      {tag}
                    </button>
                  ))}
                </div>

                {/* Example scripts */}
                <div style={{padding:'0 14px 14px'}}>
                  <div style={{fontSize:11,fontWeight:700,color:'#aaa',letterSpacing:'0.06em',textTransform:'uppercase',marginBottom:8}}>Example Scripts</div>
                  <div style={{display:'flex',flexDirection:'column',gap:8}}>
                    {[
                      { label: '🎬 Drama', text: '[serious] एउटा रात जसले सबै बदल्यो। [pause] के तपाईं तयार हुनुहुन्छ?' },
                      { label: '📱 Reel', text: '[excited] साथीहरू! यो ट्रिक थाहा छ? [laughs] एकपटक गरेर हेर्नुस् त!' },
                      { label: '🧘 Meditation', text: '[whispers] [slow] श्वास लिनुस्... [pause] र बिस्तारै छाड्नुस्। मन शान्त छ।' },
                    ].map(ex => (
                      <div key={ex.label} style={{background:'#fafafa',border:'1px solid #e8e8ed',borderRadius:8,padding:'8px 12px',display:'flex',alignItems:'center',justifyContent:'space-between',gap:12}}>
                        <div>
                          <div style={{fontSize:11,fontWeight:700,color:'#555',marginBottom:2}}>{ex.label}</div>
                          <div style={{fontSize:11,color:'#888',fontFamily:'Noto Sans Devanagari,sans-serif'}}>{ex.text.length > 60 ? ex.text.slice(0,60)+'…' : ex.text}</div>
                        </div>
                        <button onClick={() => setText(ex.text)}
                          style={{padding:'5px 12px',borderRadius:7,border:'1.5px solid rgba(220,20,60,.3)',background:'rgba(220,20,60,.05)',color:'#DC143C',fontSize:11,fontWeight:700,cursor:'pointer',whiteSpace:'nowrap'}}>
                          Use →
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Quick notes */}
                  <div style={{marginTop:12,background:'#f8f8f8',borderRadius:8,padding:'10px 12px'}}>
                    <div style={{fontSize:11,fontWeight:700,color:'#555',marginBottom:6}}>📌 Quick Notes</div>
                    <ul style={{paddingLeft:14,display:'flex',flexDirection:'column',gap:3}}>
                      {[
                        'Use Devanagari (नेपाली) for best results',
                        'Combine tags: [excited] [fast] for high energy',
                        'Add [pause] between sentences for dramatic effect',
                        '1 credit = 1 character · credits never expire',
                      ].map((note,i) => (
                        <li key={i} style={{fontSize:11,color:'#666',lineHeight:1.5}}>{note}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>

        </div>

        {/* ───── RIGHT PANEL ───── */}
        <div style={{display:'flex',flexDirection:'column',gap:14}}>

          {/* ── GENERATE CARD ── */}
          <div className="card" style={{padding:'16px'}}>
            <div style={{fontSize:11,fontWeight:700,color:'#888',letterSpacing:'0.08em',textTransform:'uppercase',marginBottom:12}}>Generate</div>

            {/* Preview section */}
            {session !== false && (
              <div style={{marginBottom:12}}>
                <button onClick={handlePreview} disabled={!text.trim() || previewing}
                  style={{width:'100%',padding:'10px',borderRadius:10,border:'1.5px solid #e8e8ed',background:text.trim()&&!previewing?'#fafafa':'#f5f5f7',fontSize:13,fontWeight:600,cursor:text.trim()&&!previewing?'pointer':'not-allowed',color:'#555',display:'flex',alignItems:'center',justifyContent:'center',gap:6}}>
                  {previewing ? '⏳ Generating preview...' : '▶ Preview (first 200 chars, free)'}
                </button>
                {previewUrl && (
                  <div style={{marginTop:8}}>
                    <audio ref={previewAudioRef} controls src={previewUrl} style={{width:'100%',height:32}} />
                  </div>
                )}
                {previewError && <div style={{fontSize:11,color:'#CC3333',marginTop:6}}>❌ {previewError}</div>}
              </div>
            )}

            {/* Cost summary */}
            {session && session.isPendingPayment ? (
              <div style={{background:'rgba(255,152,0,.08)',border:'1px solid rgba(255,152,0,.3)',borderRadius:10,padding:'12px',marginBottom:12,textAlign:'center'}}>
                <div style={{fontSize:13,fontWeight:700,color:'#E65100',marginBottom:4}}>⏳ Payment being confirmed</div>
                <p style={{fontSize:12,color:'#888',lineHeight:1.5}}>Your credits will be activated shortly. Message us on WhatsApp if it takes more than 10 minutes.</p>
              </div>
            ) : session && session.isLegacy ? (
              <div style={{background:'#f8f8f8',borderRadius:10,padding:'10px 12px',marginBottom:12}}>
                <div style={{display:'flex',justifyContent:'space-between',fontSize:12,fontWeight:600,color:'#555'}}>
                  <span>Legacy plan</span>
                  <span style={{color:credits >= 25 ? '#2E7D32' : '#DC143C'}}>{credits} credits</span>
                </div>
                <div style={{fontSize:11,color:'#888',marginTop:4}}>Max 500 chars · 25 credits flat per generation</div>
              </div>
            ) : session && credits > 0 && billableLength > 0 ? (
              <div style={{background:'#f8f8f8',borderRadius:10,padding:'10px 12px',marginBottom:12}}>
                <div style={{display:'flex',justifyContent:'space-between',fontSize:12,fontWeight:600,color:'#555',marginBottom:4}}>
                  <span>This generation</span>
                  <span style={{color:'#DC143C',fontWeight:700}}>{billableLength.toLocaleString()} credits</span>
                </div>
                <div style={{display:'flex',justifyContent:'space-between',fontSize:11,color:'#888'}}>
                  <span>Your balance</span>
                  <span style={{color:(credits - billableLength) < 0 ? '#DC143C' : '#2E7D32', fontWeight:600}}>
                    {credits.toLocaleString()} → {Math.max(0, credits - billableLength).toLocaleString()}
                  </span>
                </div>
              </div>
            ) : null}

            {/* Generate button */}
            {!hasNoCredits ? (
              <button onClick={handleGenerate} disabled={!canGenerate}
                className="btn-primary"
                style={{width:'100%',padding:'13px',fontSize:15,opacity:canGenerate?1:0.5}}>
                {loading ? '⏳ Generating...' : session === null ? 'Loading...' : '🎙️ Generate Voiceover'}
              </button>
            ) : null}
          </div>

          {/* ── CREDIT BALANCE / NO CREDITS ── */}
          {session && credits > 0 && (
            <div className="card" style={{padding:'14px 16px'}}>
              <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:8}}>
                <div style={{fontSize:11,fontWeight:700,color:'#888',letterSpacing:'0.08em',textTransform:'uppercase'}}>Balance</div>
                <div style={{fontSize:18,fontWeight:800,color:'#DC143C',fontFamily:'Sora,sans-serif'}}>{credits.toLocaleString()}</div>
              </div>
              <div style={{height:6,borderRadius:4,background:'#f0f0f0',overflow:'hidden'}}>
                <div style={{height:'100%',borderRadius:4,background:'linear-gradient(90deg,#DC143C,#FF6B8A)',width:`${Math.min(100,(credits/50000)*100)}%`,transition:'width .5s'}} />
              </div>
              <div style={{fontSize:10,color:'#aaa',marginTop:5}}>Credits never expire</div>
            </div>
          )}

          {/* NO CREDITS → demo box + packs */}
          {hasNoCredits && (
            <>
              <DemoBoxInline />
              <div className="card" style={{padding:'14px 16px'}}>
                <div style={{fontSize:11,fontWeight:700,color:'#888',letterSpacing:'0.08em',textTransform:'uppercase',marginBottom:12}}>Get Credits</div>
                <div style={{display:'flex',flexDirection:'column',gap:8}}>
                  {PACKS.map(p => (
                    <div key={p.key} style={{borderRadius:10,padding:'12px 14px',border:`1.5px solid ${p.popular ? p.color : '#e8e8ed'}`,background:p.popular ? `${p.color}06` : '#fafafa',position:'relative'}}>
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
              </div>
            </>
          )}

          {/* ── RECENT GENERATIONS ── */}
          {session && !hasNoCredits && (
            <div className="card" style={{padding:'14px 16px'}}>
              <div style={{fontSize:11,fontWeight:700,color:'#888',letterSpacing:'0.08em',textTransform:'uppercase',marginBottom:10}}>
                Recent Generations
              </div>
              {historyLoading ? (
                <div style={{fontSize:12,color:'#888',textAlign:'center',padding:'10px 0'}}>Loading…</div>
              ) : history.length === 0 ? (
                <div style={{fontSize:12,color:'#aaa',textAlign:'center',padding:'10px 0'}}>No generations yet</div>
              ) : (
                <div style={{display:'flex',flexDirection:'column',gap:8}}>
                  {history.map(item => (
                    <div key={item.id} className="history-item">
                      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:4}}>
                        <div style={{fontSize:11,fontWeight:700,color:'#DC143C'}}>{item.voiceName}</div>
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
                          } catch {
                            window.open(item.url, '_blank')
                          }
                        }}
                        style={{display:'inline-flex',alignItems:'center',gap:4,background:'#DC143C',color:'#fff',padding:'4px 10px',borderRadius:6,fontSize:11,fontWeight:700,border:'none',cursor:'pointer'}}>
                        ⬇ Download
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ── OTHER TOOLS ── */}
          <div className="card" style={{padding:'14px 16px'}}>
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

      {/* ── SIGNUP MODAL ── */}
      {showSignup && (
        <div className="overlay" onClick={e => { if (e.target === e.currentTarget) setShowSignup(false) }}>
          <div className="modal">
            <div style={{textAlign:'center',marginBottom:24}}>
              <div style={{fontSize:26,fontWeight:800,color:'#DC143C',fontFamily:'Sora,sans-serif',marginBottom:4}}>SWOR AI</div>
              <div style={{fontSize:14,fontWeight:700,marginBottom:6}}>Sign in to access Swor AI</div>
              <p style={{fontSize:13,color:'#888',lineHeight:1.6}}>No password needed. A credit pack is required to generate voiceovers.</p>
            </div>

            {/* Mode tabs */}
            <div style={{display:'flex',gap:6,marginBottom:20,background:'#f5f5f7',borderRadius:10,padding:4}}>
              <button onClick={() => switchLoginMode('link')}
                style={{flex:1,padding:'8px',borderRadius:8,border:'none',
                  background:loginMode==='link'?'#fff':'transparent',
                  fontWeight:700,fontSize:13,cursor:'pointer',
                  color:loginMode==='link'?'#1d1d1f':'#888',
                  boxShadow:loginMode==='link'?'0 1px 4px rgba(0,0,0,.1)':undefined}}>
                Magic link
              </button>
              <button onClick={() => switchLoginMode('otp')}
                style={{flex:1,padding:'8px',borderRadius:8,border:'none',
                  background:loginMode==='otp'?'#fff':'transparent',
                  fontWeight:700,fontSize:13,cursor:'pointer',
                  color:loginMode==='otp'?'#1d1d1f':'#888',
                  boxShadow:loginMode==='otp'?'0 1px 4px rgba(0,0,0,.1)':undefined}}>
                6-digit code
              </button>
            </div>

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
                    style={{width:'100%',padding:'13px',borderRadius:10,border:'none',background:'#DC143C',color:'#fff',fontSize:15,fontWeight:700,cursor:'pointer',opacity:signupStatus==='loading'?.7:1}}>
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
                      style={{width:'100%',padding:'13px',borderRadius:10,border:'none',background:'#DC143C',color:'#fff',fontSize:15,fontWeight:700,cursor:'pointer',opacity:otpStatus==='sending'?.7:1}}>
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
                          style={{width:'100%',padding:'13px',borderRadius:10,border:'none',background:'#DC143C',color:'#fff',fontSize:15,fontWeight:700,cursor:'pointer',opacity:(otpStatus==='verifying'||otpCode.length!==6)?.7:1}}>
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

      {/* ── REWARD POPUP — for free/logged out users only ── */}
      {showRewardPopup && !session && (
        <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,.75)',zIndex:9999,display:'flex',alignItems:'center',justifyContent:'center',padding:16,backdropFilter:'blur(6px)',overflowY:'auto'}}>
          <div style={{background:'linear-gradient(135deg,#1d1d1f 0%,#2d1020 100%)',borderRadius:24,padding:isMobile?20:36,maxWidth:480,width:'100%',border:'1.5px solid rgba(220,20,60,.3)',boxShadow:'0 24px 60px rgba(0,0,0,.5)',position:'relative',margin:'auto'}}>

            <button onClick={() => setShowRewardPopup(false)}
              style={{position:'absolute',top:16,right:16,background:'rgba(255,255,255,.1)',border:'none',color:'#fff',width:32,height:32,borderRadius:'50%',cursor:'pointer',fontSize:16}}>
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
                🎁 You unlocked an Exclusive Early Creator Reward!
              </div>
              <div style={{fontFamily:'Noto Sans Devanagari,sans-serif',fontSize:12,color:'rgba(255,255,255,.5)',marginBottom:16}}>
                तपाईंले एउटा विशेष Early Creator Reward अनलक गर्नुभयो!
              </div>

              <div style={{background:'#1d1d1f',borderRadius:12,padding:'12px 20px',marginBottom:16,display:'flex',alignItems:'center',justifyContent:'space-between',gap:12}}>
                <div>
                  <div style={{fontSize:11,color:'#888',marginBottom:4}}>Your exclusive code / तपाईंको विशेष कोड:</div>
                  <div style={{fontFamily:'monospace',fontSize:20,fontWeight:800,color:'#DC143C',letterSpacing:'0.1em'}}>SWOR-LAUNCH-10K</div>
                </div>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText('SWOR-LAUNCH-10K')
                    alert('Code copied!')
                  }}
                  style={{background:'rgba(220,20,60,.2)',border:'1px solid rgba(220,20,60,.4)',color:'#DC143C',padding:'6px 12px',borderRadius:8,fontSize:11,fontWeight:700,cursor:'pointer',flexShrink:0}}>
                  Copy
                </button>
              </div>

              <div style={{fontSize:13,color:'#fff',fontWeight:600,marginBottom:12}}>
                🎁 Send this code on WhatsApp to unlock:
              </div>
              <div style={{display:'flex',flexDirection:'column',gap:8,marginBottom:12}}>
                {[
                  {name:'Starter Pack',npr:'499',normal:'3,500',bonus:'8,000'},
                  {name:'Creator Pack',npr:'999',normal:'8,000',bonus:'20,000'},
                  {name:'Founders Lifetime',npr:'2,500',normal:'30,000',bonus:'50,000'},
                ].map(p => (
                  <div key={p.name} style={{background:'rgba(255,255,255,.05)',borderRadius:10,padding:'10px 14px',display:'flex',alignItems:'center',justifyContent:'space-between',gap:8}}>
                    <div>
                      <div style={{fontSize:12,fontWeight:700,color:'#fff'}}>{p.name} — NPR {p.npr}</div>
                      <div style={{fontSize:11,color:'rgba(255,255,255,.4)',textDecoration:'line-through'}}>{p.normal} credits</div>
                    </div>
                    <div style={{textAlign:'right'}}>
                      <div style={{fontSize:14,fontWeight:800,color:'#34C759'}}>{p.bonus} credits</div>
                      <div style={{fontSize:10,color:'rgba(255,255,255,.4)'}}>with code</div>
                    </div>
                  </div>
                ))}
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

            <a href="https://wa.me/19255379425?text=Namaste%20Avash!%20I%20just%20tried%20the%20free%20preview%20on%20Swor%20AI%20and%20unlocked%20code%20SWOR-LAUNCH-10K.%20I%20want%20to%20claim%20my%20bonus%20credits!" target="_blank" rel="noreferrer" style={{display:'block',background:'#25D366',color:'#fff',padding:'14px',borderRadius:12,fontSize:15,fontWeight:700,textAlign:'center',textDecoration:'none',boxShadow:'0 4px 20px rgba(37,211,102,.3)',marginBottom:10}}>
              {'💬 Claim Bonus Credits on WhatsApp'}
            </a>
            <div style={{textAlign:'center',fontSize:11,color:'rgba(255,255,255,.3)'}}>
              {'या / or '}
              <span style={{cursor:'pointer',textDecoration:'underline'}} onClick={() => setShowRewardPopup(false)}>
                {'Continue exploring →'}
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
