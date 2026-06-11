import Head from 'next/head'
import Link from 'next/link'
import { useState, useEffect, useRef } from 'react'

const VOICES = [
  { voice_id: '1zUSi8LeHs9M2mV8X6YS', name: 'Priyanka', desc: 'Romantic & Elegant', gender: 'F', color: '#FF6B8A' },
  { voice_id: 'LK1Sn9bmEczSFI65RF0v', name: 'Sunita', desc: 'Soft Spoken Aunty', gender: 'F', color: '#E91E8C' },
  { voice_id: 'duDBJHU6G1oq7ZdK4Kxf', name: 'Anjali', desc: 'Motivational', gender: 'F', color: '#FF8C42' },
  { voice_id: 'TmPeb2hSxdVrThJLywkg', name: 'Vanishree', desc: 'Professional News', gender: 'F', color: '#0077CC' },
  { voice_id: 'ecp3DWciuUyW7BYM7II1', name: 'Anika', desc: 'Sweet & Lively', gender: 'F', color: '#7B2FBE' },
  { voice_id: 'f0JpDwzbGK384Dd1WH2s', name: 'Mina', desc: 'Friendly & Polished', gender: 'F', color: '#00897B' },
  { voice_id: 'Pc57DSBXmCXyEAmow7lW', name: 'Shraddha', desc: 'Credible & Trustworthy', gender: 'F', color: '#5C6BC0' },
  { voice_id: '6qL48o1LBmtR94hIYAQh', name: 'Monika', desc: 'Suspense & Drama', gender: 'F', color: '#1C1C2E' },
  { voice_id: 'FszY75334ExxVmg7yl0U', name: 'Dhurundhar', desc: 'Deep & Commanding', gender: 'M', color: '#1A3A5C' },
  { voice_id: 'WdZjiN0nNcik2LBjOHiv', name: 'Bishnu', desc: 'Wise Documentary', gender: 'M', color: '#4E342E' },
  { voice_id: 'CwhRBWXzGAHq8TQ4Fs17', name: 'Rohan', desc: 'Casual & Laid-Back', gender: 'M', color: '#546E7A' },
  { voice_id: 'TX3LPaxmHKxFdv7VOQHJ', name: 'Arjun', desc: 'Energetic Reels', gender: 'M', color: '#F57C00' },
  { voice_id: 'g1FVKFidZjHPxXdfA89c', name: 'Vikram', desc: 'Confident & Warm', gender: 'M', color: '#2E7D32' },
  { voice_id: '2W8HrWcBFzCEf5cQQdIL', name: 'Karan', desc: 'Dark Documentary', gender: 'M', color: '#212121' },
  { voice_id: 'rHhok70RpCi5GgianXRA', name: 'Rudra', desc: 'Intense & Romantic', gender: 'M', color: '#880E4F' },
]

const ANON_LIMIT = 2
const ANON_KEY = 'swor_anon_gens'
const CHAR_LIMIT = 500

export default function Voiceover() {
  const [isMobile, setIsMobile] = useState(false)
  const [session, setSession] = useState(null)
  const [anonGens, setAnonGens] = useState(0)
  const [text, setText] = useState('')
  const [selectedVoice, setSelectedVoice] = useState(VOICES[0])
  const [showVoicePanel, setShowVoicePanel] = useState(false)
  const [genderFilter, setGenderFilter] = useState('all')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)
  const [playingPreview, setPlayingPreview] = useState(null)
  const [showSignup, setShowSignup] = useState(false)
  const [signupEmail, setSignupEmail] = useState('')
  const [signupStatus, setSignupStatus] = useState('idle')
  const audioRef = useRef(null)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  useEffect(() => {
    setAnonGens(parseInt(localStorage.getItem(ANON_KEY) || '0'))
    fetch('/api/auth/session').then(r => r.json()).then(d => setSession(d.loggedIn ? d : false)).catch(() => setSession(false))
  }, [])

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

  async function handleGenerate() {
    if (!text.trim()) return
    const isAnon = session === false
    const isLocked = isAnon && anonGens >= ANON_LIMIT
    if (isLocked) { setShowSignup(true); return }
    setLoading(true); setResult(null); setError(null)
    try {
      if (session) {
        const cr = await fetch('/api/auth/use-credit', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ type: 'voiceover', charCount: text.length }) })
        const cd = await cr.json()
        if (!cr.ok) throw new Error(cd.error)
        setSession(prev => ({ ...prev, credits: cd.credits }))
      } else {
        const n = anonGens + 1; localStorage.setItem(ANON_KEY, String(n)); setAnonGens(n)
      }
      const res = await fetch('/api/voiceover', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ text, voiceId: selectedVoice.voice_id }) })
      if (!res.ok) { const e = await res.json(); throw new Error(e.error) }
      const blob = await res.blob()
      setResult({ url: URL.createObjectURL(blob), filename: `swor_${selectedVoice.name.toLowerCase()}_${Date.now()}.mp3` })
    } catch (e) { setError(e.message) }
    setLoading(false)
  }

  const canGenerate = text.trim().length > 0 && text.length <= CHAR_LIMIT && !loading
  const filteredVoices = VOICES.filter(v => genderFilter === 'all' || (genderFilter === 'female' ? v.gender === 'F' : v.gender === 'M'))
  const credits = session ? session.credits || 0 : null
  const isAnon = session === false
  const triesLeft = Math.max(0, ANON_LIMIT - anonGens)

  return (
    <>
      <Head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <title>Nepali AI Voiceover Generator — Swor AI</title>
        <meta name="description" content="Generate realistic Nepali AI voiceovers in seconds. 15 premium voices. Type text, download MP3." />
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
          {session && <div style={{fontSize:13,fontWeight:600,background:'#E8F4FD',color:'#1976D2',padding:'5px 12px',borderRadius:20}}>{credits} credits</div>}
          {isAnon && <div style={{fontSize:13,color:'#888',background:'#f5f5f7',padding:'5px 12px',borderRadius:20}}>{triesLeft} free tries left</div>}
          {!session && <button onClick={() => setShowSignup(true)} style={{background:'#1976D2',color:'#fff',border:'none',padding:'7px 16px',borderRadius:10,fontSize:13,fontWeight:700,cursor:'pointer'}}>Sign in</button>}
        </div>
      </nav>

      {/* PAGE TITLE */}
      <div style={{background:'#fff',borderBottom:'1px solid #e8e8ed',padding:'20px 24px'}}>
        <div style={{maxWidth:1100,margin:'0 auto',display:'flex',alignItems:'center',gap:12}}>
          <div style={{width:40,height:40,borderRadius:10,background:'#E8F4FD',display:'flex',alignItems:'center',justifyContent:'center',fontSize:20}}>🎙️</div>
          <div>
            <h1 style={{fontFamily:'Sora,sans-serif',fontSize:20,fontWeight:800,color:'#1d1d1f',letterSpacing:'-0.4px'}}>Nepali Voiceover</h1>
            <p style={{fontSize:13,color:'#888',marginTop:2}}>Type Nepali text and get a professional AI voiceover in seconds</p>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div style={{maxWidth:1100,margin:'0 auto',padding:isMobile?'20px 16px':'32px 24px',display:'grid',gridTemplateColumns:isMobile?'1fr':'1fr 320px',gap:20}}>

        {/* LEFT — TEXT AREA */}
        <div>
          {/* Voice selector pill */}
          <div style={{background:'#fff',borderRadius:14,border:'1.5px solid #e8e8ed',padding:'12px 16px',marginBottom:12,display:'flex',alignItems:'center',justifyContent:'space-between',cursor:'pointer'}}
            onClick={() => setShowVoicePanel(!showVoicePanel)}>
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
            <div className="fade-in" style={{background:'#fff',borderRadius:14,border:'1.5px solid #e8e8ed',padding:16,marginBottom:12}}>
              <div style={{display:'flex',gap:8,marginBottom:12}}>
                {['all','female','male'].map(f => (
                  <button key={f} onClick={() => setGenderFilter(f)}
                    style={{padding:'5px 14px',borderRadius:20,border:'1.5px solid',borderColor:genderFilter===f?'#1976D2':'#e8e8ed',background:genderFilter===f?'#E8F4FD':'#fff',color:genderFilter===f?'#1976D2':'#555',fontSize:12,fontWeight:600,cursor:'pointer',textTransform:'capitalize'}}>
                    {f === 'all' ? 'All' : f === 'female' ? 'Female' : 'Male'}
                  </button>
                ))}
              </div>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:6}}>
                {filteredVoices.map(v => (
                  <div key={v.voice_id} className={`voice-chip${selectedVoice.voice_id === v.voice_id ? ' active' : ''}`}
                    onClick={() => { setSelectedVoice(v); setShowVoicePanel(false) }}>
                    <div style={{width:28,height:28,borderRadius:7,background:v.color,display:'flex',alignItems:'center',justifyContent:'center',fontSize:12,fontWeight:700,color:'#fff',flexShrink:0}}>{v.name[0]}</div>
                    <div style={{minWidth:0}}>
                      <div style={{fontSize:12,fontWeight:700,color:'#1d1d1f'}}>{v.name}</div>
                      <div style={{fontSize:10,color:'#888',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{v.desc}</div>
                    </div>
                    <button onClick={e => { e.stopPropagation(); playPreview(v.voice_id) }}
                      style={{marginLeft:'auto',width:24,height:24,borderRadius:'50%',border:'none',background:playingPreview===v.voice_id?'#DC143C':'#f0f0f0',color:playingPreview===v.voice_id?'#fff':'#555',fontSize:9,cursor:'pointer',flexShrink:0}}>
                      {playingPreview === v.voice_id ? '■' : '▶'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Text area */}
          <div style={{background:'#fff',borderRadius:14,border:'1.5px solid #e8e8ed',overflow:'hidden',marginBottom:12}}>
            <textarea
              value={text}
              onChange={e => setText(e.target.value.slice(0, CHAR_LIMIT))}
              placeholder="नमस्ते! यहाँ आफ्नो नेपाली पाठ टाइप गर्नुस्..."
              style={{width:'100%',minHeight:isMobile?160:220,padding:'16px',fontSize:15,lineHeight:1.8,border:'none',background:'transparent',color:'#1d1d1f'}}
            />
            <div style={{padding:'8px 16px',borderTop:'1px solid #f0f0f0',display:'flex',justifyContent:'space-between',alignItems:'center',background:'#fafafa'}}>
              <span style={{fontSize:12,color:'#888'}}>Nepali (Devanagari) recommended</span>
              <span style={{fontSize:12,fontWeight:600,color:text.length > CHAR_LIMIT * 0.9 ? '#DC143C' : '#888'}}>{text.length} / {CHAR_LIMIT}</span>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div style={{background:'#FFF0F0',border:'1px solid #FFB8B8',borderRadius:10,padding:'12px 16px',fontSize:13,color:'#CC3333',marginBottom:12}}>
              ❌ {error}
            </div>
          )}

          {/* Result */}
          {result && (
            <div className="fade-in" style={{background:'#E8F4FD',border:'1.5px solid #90CAF9',borderRadius:14,padding:16,marginBottom:12}}>
              <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:10}}>
                <div style={{fontSize:13,fontWeight:700,color:'#1976D2'}}>✓ Voiceover ready!</div>
                <a href={result.url} download={result.filename}
                  style={{background:'#1976D2',color:'#fff',padding:'7px 16px',borderRadius:8,fontSize:12,fontWeight:700,textDecoration:'none'}}>
                  ⬇ Download MP3
                </a>
              </div>
              <audio controls src={result.url} style={{width:'100%',borderRadius:8}} />
            </div>
          )}
        </div>

        {/* RIGHT PANEL */}
        <div style={{display:'flex',flexDirection:'column',gap:12}}>

          {/* Generate button */}
          <button onClick={handleGenerate} disabled={!canGenerate}
            style={{width:'100%',padding:'14px',borderRadius:12,border:'none',
              background:canGenerate?'#1976D2':'#ccc',
              color:'#fff',fontSize:15,fontWeight:700,cursor:canGenerate?'pointer':'not-allowed',
              fontFamily:'Sora,sans-serif',transition:'all .15s',
              boxShadow:canGenerate?'0 4px 20px rgba(25,118,210,.3)':'none'}}>
            {loading ? '⏳ Generating...' : '🎙️ Generate Voiceover'}
          </button>

          {/* Credits / tries info */}
          <div style={{background:'#fff',borderRadius:12,border:'1.5px solid #e8e8ed',padding:'14px 16px'}}>
            <div style={{fontSize:11,fontWeight:700,color:'#888',letterSpacing:'0.08em',textTransform:'uppercase',marginBottom:10}}>Balance</div>
            {session ? (
              <div>
                <div style={{fontSize:24,fontWeight:800,color:'#1976D2',fontFamily:'Sora,sans-serif'}}>{credits}</div>
                <div style={{fontSize:12,color:'#888',marginTop:2}}>Swor Credits remaining</div>
                <div style={{fontSize:12,color:'#888',marginTop:6}}>25 credits per generation</div>
                {credits < 25 && (
                  <Link href="/#pricing" style={{display:'block',marginTop:10,background:'#DC143C',color:'#fff',padding:'8px 12px',borderRadius:8,fontSize:12,fontWeight:700,textAlign:'center',textDecoration:'none'}}>
                    Buy more credits →
                  </Link>
                )}
              </div>
            ) : isAnon ? (
              <div>
                <div style={{fontSize:24,fontWeight:800,color:'#555',fontFamily:'Sora,sans-serif'}}>{triesLeft}</div>
                <div style={{fontSize:12,color:'#888',marginTop:2}}>free tries remaining</div>
                {triesLeft === 0 && (
                  <button onClick={() => setShowSignup(true)}
                    style={{width:'100%',marginTop:10,background:'#1976D2',color:'#fff',border:'none',padding:'8px 12px',borderRadius:8,fontSize:12,fontWeight:700,cursor:'pointer'}}>
                    Sign up for more →
                  </button>
                )}
              </div>
            ) : (
              <div style={{fontSize:13,color:'#888'}}>Loading...</div>
            )}
          </div>

          {/* Voice info card */}
          <div style={{background:'#fff',borderRadius:12,border:'1.5px solid #e8e8ed',padding:'14px 16px'}}>
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

          {/* Model info */}
          <div style={{background:'#fff',borderRadius:12,border:'1.5px solid #e8e8ed',padding:'14px 16px'}}>
            <div style={{fontSize:11,fontWeight:700,color:'#888',letterSpacing:'0.08em',textTransform:'uppercase',marginBottom:10}}>Model</div>
            <div style={{display:'flex',alignItems:'center',gap:8}}>
              <div style={{width:28,height:28,borderRadius:6,background:'linear-gradient(135deg,#DC143C,#FF9500)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:10,fontWeight:800,color:'#fff'}}>v3</div>
              <div>
                <div style={{fontSize:13,fontWeight:700,color:'#1d1d1f'}}>Eleven v3</div>
                <div style={{fontSize:11,color:'#888'}}>Multilingual, highest quality</div>
              </div>
            </div>
          </div>

          {/* Other tools */}
          <div style={{background:'#fff',borderRadius:12,border:'1.5px solid #e8e8ed',padding:'14px 16px'}}>
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
              <div style={{fontSize:14,fontWeight:700,marginBottom:6}}>Sign up for free beta access</div>
              <p style={{fontSize:13,color:'#888',lineHeight:1.6}}>Magic link sent instantly. No password needed.</p>
            </div>
            {signupStatus === 'sent' ? (
              <div style={{textAlign:'center',padding:'20px 0'}}>
                <div style={{fontSize:40,marginBottom:12}}>📧</div>
                <div style={{fontSize:16,fontWeight:700,marginBottom:8}}>Check your inbox!</div>
                <p style={{fontSize:13,color:'#888'}}>Magic link sent to <strong>{signupEmail}</strong></p>
              </div>
            ) : (
              <form onSubmit={sendMagicLink}>
                <input type="email" placeholder="your@email.com" required value={signupEmail} onChange={e => setSignupEmail(e.target.value)}
                  style={{width:'100%',padding:'13px 16px',borderRadius:10,border:'1.5px solid #e8e8ed',fontSize:14,outline:'none',marginBottom:10,fontFamily:'inherit'}} />
                <button type="submit" disabled={signupStatus === 'loading'}
                  style={{width:'100%',padding:'13px',borderRadius:10,border:'none',background:'#1976D2',color:'#fff',fontSize:15,fontWeight:700,cursor:'pointer',opacity:signupStatus==='loading'?.7:1}}>
                  {signupStatus === 'loading' ? 'Sending...' : 'Send magic link →'}
                </button>
                {signupStatus === 'error' && <p style={{fontSize:12,color:'#CC3333',marginTop:8,textAlign:'center'}}>Something went wrong. Try again.</p>}
              </form>
            )}
            <button onClick={() => setShowSignup(false)}
              style={{width:'100%',marginTop:10,padding:'10px',borderRadius:10,border:'1px solid #e8e8ed',background:'transparent',fontSize:13,color:'#888',cursor:'pointer'}}>
              Maybe later
            </button>
          </div>
        </div>
      )}
    </>
  )
}
