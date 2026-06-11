import Head from 'next/head'
import Link from 'next/link'
import { useState, useEffect } from 'react'

const DURATIONS = [
  { label: '15s', seconds: 15, credits: 50 },
  { label: '30s', seconds: 30, credits: 100 },
  { label: '60s', seconds: 60, credits: 200 },
  { label: '2min', seconds: 120, credits: 400 },
]

const PROMPT_CHIPS = [
  'Upbeat Nepali folk with madal drums',
  'Romantic Nepali pop ballad',
  'Devotional bhajan style',
  'Wedding celebration music',
  'Cinematic background score',
  'Energetic TikTok beat',
  'Soft acoustic background',
  'Traditional Newari music',
]

export default function Music() {
  const [isMobile, setIsMobile] = useState(false)
  const [session, setSession] = useState(null)
  const [prompt, setPrompt] = useState('')
  const [duration, setDuration] = useState(30)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)
  const [showSignup, setShowSignup] = useState(false)
  const [signupEmail, setSignupEmail] = useState('')
  const [signupStatus, setSignupStatus] = useState('idle')

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  useEffect(() => {
    fetch('/api/auth/session').then(r => r.json()).then(d => setSession(d.loggedIn ? d : false)).catch(() => setSession(false))
  }, [])

  const selectedDuration = DURATIONS.find(d => d.seconds === duration) || DURATIONS[1]
  const credits = session ? session.credits || 0 : null
  const canUseFreeMusic = session && !session.musicFreeUsed && duration <= 15
  const hasEnoughCredits = session && (
    canUseFreeMusic ||
    (session.isFounder && session.founderMusicRemaining > 0) ||
    (session.credits || 0) >= selectedDuration.credits
  )
  const canGenerate = prompt.trim().length > 0 && !loading && session && hasEnoughCredits

  async function sendMagicLink(e) {
    e.preventDefault(); setSignupStatus('loading')
    try {
      const res = await fetch('/api/auth/send-link', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: signupEmail }) })
      const d = await res.json(); setSignupStatus(d.success ? 'sent' : 'error')
    } catch { setSignupStatus('error') }
  }

  async function handleGenerate() {
    if (!prompt.trim()) return
    if (!session) { setShowSignup(true); return }
    setLoading(true); setResult(null); setError(null)
    try {
      const isFree = canUseFreeMusic
      const cr = await fetch('/api/auth/use-credit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'music', durationSeconds: duration, isFreeMusciTrial: isFree }),
      })
      const cd = await cr.json()
      if (!cr.ok) throw new Error(cd.error)
      setSession(prev => ({
        ...prev,
        credits: cd.credits,
        musicFreeUsed: isFree ? true : prev.musicFreeUsed,
        founderMusicRemaining: cd.founderMusicRemaining ?? prev.founderMusicRemaining,
      }))
      const res = await fetch('/api/music', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, durationSeconds: duration }),
      })
      if (!res.ok) { const e = await res.json(); throw new Error(e.error) }
      const blob = await res.blob()
      setResult({ url: URL.createObjectURL(blob), filename: `swor_music_${Date.now()}.mp3` })
    } catch (e) { setError(e.message) }
    setLoading(false)
  }

  return (
    <>
      <Head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <title>Nepali AI Music Generator — Swor AI</title>
        <meta name="description" content="Generate original royalty-free Nepali music in seconds. Type a prompt and get a custom Nepali song." />
        <link href="https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800&family=Manrope:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </Head>

      <style>{`
        *{box-sizing:border-box;margin:0;padding:0}
        body{font-family:'Manrope',sans-serif;background:#FAFAFA;color:#1d1d1f;-webkit-font-smoothing:antialiased}
        textarea:focus{outline:none}
        .chip{padding:7px 14px;border-radius:20px;border:1.5px solid #A5D6A7;background:#fff;cursor:pointer;font-size:12px;font-weight:500;white-space:nowrap;transition:all .15s;font-family:inherit}
        .chip:hover{background:#E8F5E9;border-color:#2E7D32;color:#2E7D32}
        .dur-btn{padding:10px 16px;border-radius:10px;border:1.5px solid #e8e8ed;background:#fff;cursor:pointer;font-size:13px;font-weight:600;transition:all .15s;font-family:inherit;text-align:center}
        .dur-btn.active{background:#2E7D32;color:#fff;border-color:#2E7D32}
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
          <Link href="/tool" style={{fontSize:13,color:'#888',textDecoration:'none'}}>← All Tools</Link>
        </div>
        <div style={{display:'flex',alignItems:'center',gap:10}}>
          {session && <div style={{fontSize:13,fontWeight:600,background:'#E8F5E9',color:'#2E7D32',padding:'5px 12px',borderRadius:20}}>{credits} credits</div>}
          {!session && session !== null && <button onClick={() => setShowSignup(true)} style={{background:'#2E7D32',color:'#fff',border:'none',padding:'7px 16px',borderRadius:10,fontSize:13,fontWeight:700,cursor:'pointer'}}>Sign in</button>}
        </div>
      </nav>

      {/* PAGE TITLE */}
      <div style={{background:'#fff',borderBottom:'1px solid #e8e8ed',padding:'20px 24px'}}>
        <div style={{maxWidth:1100,margin:'0 auto',display:'flex',alignItems:'center',gap:12}}>
          <div style={{width:40,height:40,borderRadius:10,background:'#E8F5E9',display:'flex',alignItems:'center',justifyContent:'center',fontSize:20}}>🎵</div>
          <div>
            <h1 style={{fontFamily:'Sora,sans-serif',fontSize:20,fontWeight:800,color:'#1d1d1f',letterSpacing:'-0.4px'}}>Create Nepali Music</h1>
            <p style={{fontSize:13,color:'#888',marginTop:2}}>Type a prompt and generate original royalty-free Nepali music</p>
          </div>
        </div>
      </div>

      {/* MAIN */}
      <div style={{maxWidth:1100,margin:'0 auto',padding:isMobile?'20px 16px':'32px 24px',display:'grid',gridTemplateColumns:isMobile?'1fr':'1fr 320px',gap:20}}>

        {/* LEFT */}
        <div>
          {/* Not logged in */}
          {session === false && (
            <div style={{background:'#E8F5E9',border:'1.5px solid #A5D6A7',borderRadius:14,padding:'20px',marginBottom:16,textAlign:'center'}}>
              <div style={{fontSize:32,marginBottom:10}}>🎵</div>
              <div style={{fontSize:15,fontWeight:700,marginBottom:6}}>Sign up to create music</div>
              <p style={{fontSize:13,color:'#555',marginBottom:14,lineHeight:1.6}}>
                Registered users get <strong>1 free 15-second Nepali music generation</strong>
              </p>
              <button onClick={() => setShowSignup(true)}
                style={{background:'#2E7D32',color:'#fff',border:'none',padding:'12px 28px',borderRadius:10,fontSize:14,fontWeight:700,cursor:'pointer'}}>
                Sign up free →
              </button>
            </div>
          )}

          {/* Prompt input */}
          <div style={{background:'#fff',borderRadius:14,border:'1.5px solid #e8e8ed',overflow:'hidden',marginBottom:12}}>
            <textarea
              value={prompt}
              onChange={e => setPrompt(e.target.value)}
              placeholder="Describe your music... e.g. Upbeat Nepali folk song with madal drums and flute for a travel vlog"
              style={{width:'100%',minHeight:isMobile?140:180,padding:'16px',fontSize:14,lineHeight:1.7,border:'none',background:'transparent',color:'#1d1d1f',fontFamily:'Manrope,sans-serif',resize:'none'}}
            />
            <div style={{padding:'8px 16px',borderTop:'1px solid #f0f0f0',background:'#fafafa',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
              <span style={{fontSize:12,color:'#888'}}>Describe genre, mood, instruments</span>
              <span style={{fontSize:12,color:'#888'}}>{prompt.length} chars</span>
            </div>
          </div>

          {/* Quick prompt chips */}
          <div style={{marginBottom:16}}>
            <div style={{fontSize:11,fontWeight:700,color:'#888',letterSpacing:'0.08em',textTransform:'uppercase',marginBottom:8}}>Quick prompts</div>
            <div style={{display:'flex',gap:8,flexWrap:'wrap'}}>
              {PROMPT_CHIPS.map(p => (
                <button key={p} className="chip" onClick={() => setPrompt(p)}>{p}</button>
              ))}
            </div>
          </div>

          {/* Duration selector */}
          <div style={{marginBottom:16}}>
            <div style={{fontSize:11,fontWeight:700,color:'#888',letterSpacing:'0.08em',textTransform:'uppercase',marginBottom:8}}>Duration</div>
            <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:8}}>
              {DURATIONS.map(d => (
                <button key={d.seconds} className={`dur-btn${duration === d.seconds ? ' active' : ''}`}
                  onClick={() => setDuration(d.seconds)}>
                  <div>{d.label}</div>
                  <div style={{fontSize:10,opacity:.7,marginTop:2}}>
                    {d.seconds === 15 && session && !session.musicFreeUsed ? 'FREE' : `${d.credits} cr`}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Not enough credits warning */}
          {session && !canUseFreeMusic && !session?.founderMusicRemaining && (session?.credits || 0) < selectedDuration.credits && (
            <div style={{background:'#FFF8F0',border:'1px solid rgba(255,149,0,.3)',borderRadius:10,padding:'12px 14px',marginBottom:14,fontSize:13,color:'#B45309',fontWeight:500}}>
              Not enough credits for {selectedDuration.label} track ({selectedDuration.credits} needed).{' '}
              <Link href="/#pricing" style={{color:'#DC143C',fontWeight:700,textDecoration:'none'}}>Buy credits →</Link>
            </div>
          )}

          {/* Error */}
          {error && (
            <div style={{background:'#FFF0F0',border:'1px solid #FFB8B8',borderRadius:10,padding:'12px 16px',fontSize:13,color:'#CC3333',marginBottom:12}}>
              ❌ {error}
            </div>
          )}

          {/* Result */}
          {result && (
            <div className="fade-in" style={{background:'#E8F5E9',border:'1.5px solid #A5D6A7',borderRadius:14,padding:16,marginBottom:12}}>
              <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:10}}>
                <div>
                  <div style={{fontSize:13,fontWeight:700,color:'#2E7D32'}}>🎵 Music ready!</div>
                  <div style={{fontSize:11,color:'#888',marginTop:2}}>Royalty-free · Commercial use allowed</div>
                </div>
                <a href={result.url} download={result.filename}
                  style={{background:'#2E7D32',color:'#fff',padding:'7px 16px',borderRadius:8,fontSize:12,fontWeight:700,textDecoration:'none'}}>
                  ⬇ Download
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
              background:canGenerate?'#2E7D32':'#ccc',
              color:'#fff',fontSize:15,fontWeight:700,
              cursor:canGenerate?'pointer':'not-allowed',
              fontFamily:'Sora,sans-serif',
              boxShadow:canGenerate?'0 4px 20px rgba(46,125,50,.3)':'none'}}>
            {loading ? '🎵 Generating...' : '🎵 Create Music'}
          </button>

          {/* Free trial badge */}
          {session && !session.musicFreeUsed && (
            <div style={{background:'#E8F5E9',border:'1px solid #A5D6A7',borderRadius:10,padding:'10px 14px',fontSize:12,color:'#2E7D32',fontWeight:600,textAlign:'center'}}>
              🎁 1 free 15-second track available!
              <div style={{fontSize:11,color:'#555',fontWeight:400,marginTop:3}}>Select 15s duration to use it</div>
            </div>
          )}

          {/* Credits */}
          <div style={{background:'#fff',borderRadius:12,border:'1.5px solid #e8e8ed',padding:'14px 16px'}}>
            <div style={{fontSize:11,fontWeight:700,color:'#888',letterSpacing:'0.08em',textTransform:'uppercase',marginBottom:10}}>Balance</div>
            {session ? (
              <div>
                {session.isFounder && session.founderMusicRemaining > 0 ? (
                  <>
                    <div style={{fontSize:22,fontWeight:800,color:'#2E7D32',fontFamily:'Sora,sans-serif'}}>{session.founderMusicRemaining}/5</div>
                    <div style={{fontSize:12,color:'#888',marginTop:2}}>Founders bonus tracks this month</div>
                  </>
                ) : (
                  <>
                    <div style={{fontSize:22,fontWeight:800,color:'#2E7D32',fontFamily:'Sora,sans-serif'}}>{credits}</div>
                    <div style={{fontSize:12,color:'#888',marginTop:2}}>Swor Credits remaining</div>
                    <div style={{fontSize:12,color:'#888',marginTop:6}}>
                      This track: {selectedDuration.credits} credits
                    </div>
                  </>
                )}
                {credits < selectedDuration.credits && !session.isFounder && (
                  <Link href="/#pricing" style={{display:'block',marginTop:10,background:'#DC143C',color:'#fff',padding:'8px 12px',borderRadius:8,fontSize:12,fontWeight:700,textAlign:'center',textDecoration:'none'}}>
                    Buy more credits →
                  </Link>
                )}
              </div>
            ) : (
              <div style={{fontSize:13,color:'#888'}}>Sign in to see balance</div>
            )}
          </div>

          {/* Cost breakdown */}
          <div style={{background:'#fff',borderRadius:12,border:'1.5px solid #e8e8ed',padding:'14px 16px'}}>
            <div style={{fontSize:11,fontWeight:700,color:'#888',letterSpacing:'0.08em',textTransform:'uppercase',marginBottom:10}}>Credit Costs</div>
            {DURATIONS.map(d => (
              <div key={d.seconds} style={{display:'flex',justifyContent:'space-between',padding:'5px 0',borderBottom:'1px solid #f5f5f7',fontSize:13}}>
                <span style={{color:'#555'}}>{d.label} track</span>
                <span style={{fontWeight:700,color:duration===d.seconds?'#2E7D32':'#1d1d1f'}}>
                  {d.seconds === 15 && session && !session.musicFreeUsed ? '🎁 FREE' : `${d.credits} cr`}
                </span>
              </div>
            ))}
          </div>

          {/* Other tools */}
          <div style={{background:'#fff',borderRadius:12,border:'1.5px solid #e8e8ed',padding:'14px 16px'}}>
            <div style={{fontSize:11,fontWeight:700,color:'#888',letterSpacing:'0.08em',textTransform:'uppercase',marginBottom:10}}>Other Tools</div>
            <div style={{display:'flex',flexDirection:'column',gap:6}}>
              <Link href="/voiceover" style={{display:'flex',alignItems:'center',gap:8,padding:'8px 10px',borderRadius:8,background:'#E8F4FD',textDecoration:'none',fontSize:13,fontWeight:600,color:'#1976D2'}}>
                🎙️ Nepali Voiceover
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
              <div style={{fontSize:26,fontWeight:800,color:'#2E7D32',fontFamily:'Sora,sans-serif',marginBottom:4}}>SWOR AI</div>
              <div style={{fontSize:14,fontWeight:700,marginBottom:6}}>Sign up for free access</div>
              <p style={{fontSize:13,color:'#888',lineHeight:1.6}}>Get 1 free 15-second music generation on signup.</p>
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
                  style={{width:'100%',padding:'13px',borderRadius:10,border:'none',background:'#2E7D32',color:'#fff',fontSize:15,fontWeight:700,cursor:'pointer',opacity:signupStatus==='loading'?.7:1}}>
                  {signupStatus === 'loading' ? 'Sending...' : 'Send magic link →'}
                </button>
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
