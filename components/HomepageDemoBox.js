import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'

const DEMO_VOICES_HP = [
  { voice_id: '1zUSi8LeHs9M2mV8X6YS', name: 'Priyanka', desc: 'Romantic & Elegant', color: '#FF6B8A' },
  { voice_id: 'WdZjiN0nNcik2LBjOHiv', name: 'Bishnu', desc: 'Wise Documentary', color: '#4E342E' },
  { voice_id: 'TX3LPaxmHKxFdv7VOQHJ', name: 'Arjun', desc: 'Energetic Reels', color: '#F57C00' },
]

const HP_DEMO_CHAR_LIMIT = 200

export default function HomepageDemoBox({ isMobile }) {
  const [demoText, setDemoText] = useState('')
  const [demoVoice, setDemoVoice] = useState(DEMO_VOICES_HP[0])
  const [demoLoading, setDemoLoading] = useState(false)
  const [demoError, setDemoError] = useState(null)
  const [demoPlaying, setDemoPlaying] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [used, setUsed] = useState(false)
  const [showReward, setShowReward] = useState(false)
  const [timeLeft, setTimeLeft] = useState(900)
  const demoAudioRef = useRef(null)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setUsed(localStorage.getItem('swor_hp_demo_used') === 'true')
    }
  }, [])

  useEffect(() => {
    if (!showReward) return
    if (timeLeft <= 0) return
    const timer = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) { clearInterval(timer); return 0 }
        return t - 1
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [showReward, timeLeft])

  function formatTime(secs) {
    const m = Math.floor(secs / 60).toString().padStart(2, '0')
    const s = (secs % 60).toString().padStart(2, '0')
    return `${m}:${s}`
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!name || !phone || !email || !demoText.trim()) return
    setDemoLoading(true)
    setDemoError(null)
    try {
      const res = await fetch('/api/homepage-demo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, phone, email, text: demoText, voiceId: demoVoice.voice_id }),
      })
      if (!res.ok) { const e = await res.json(); throw new Error(e.error) }
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      if (demoAudioRef.current) demoAudioRef.current.pause()
      const audio = new Audio(url)
      demoAudioRef.current = audio
      setShowForm(false)
      setDemoPlaying(true)
      audio.play()

      const fallbackTimer = setTimeout(() => {
        setShowReward(true)
        setDemoPlaying(false)
        localStorage.setItem('swor_hp_demo_used', 'true')
        setUsed(true)
      }, 3000)

      audio.onended = () => {
        clearTimeout(fallbackTimer)
        setDemoPlaying(false)
        setShowReward(true)
        localStorage.setItem('swor_hp_demo_used', 'true')
        setUsed(true)
      }
    } catch (err) { setDemoError(err.message) }
    setDemoLoading(false)
  }

  if (used && !showReward) {
    return (
      <div style={{background:'#f5f5f7',borderRadius:16,padding:24,textAlign:'center',border:'1.5px solid #e8e8ed'}}>
        <div style={{fontSize:16,fontWeight:700,marginBottom:8}}>🎉 You&apos;ve already tried the free demo!</div>
        <p style={{fontSize:14,color:'#6e6e73',marginBottom:16}}>Ready for full access? Get unlimited Nepali voiceovers.</p>
        <Link href="/voiceover">
          <button style={{background:'#DC143C',color:'#fff',border:'none',padding:'12px 28px',borderRadius:10,fontSize:14,fontWeight:700,cursor:'pointer'}}>
            Get Full Access →
          </button>
        </Link>
      </div>
    )
  }

  return (
    <div style={{position:'relative'}}>
      <div style={{background:'#f5f5f7',borderRadius:16,padding:isMobile?20:28,border:'1.5px solid #e8e8ed'}}>

        {/* Choose a voice label */}
        <div style={{fontSize:11,fontWeight:700,color:'#888',letterSpacing:'0.08em',textTransform:'uppercase',marginBottom:10}}>
          Choose a voice
        </div>

        {/* Unlocked voices */}
        <div style={{display:'flex',gap:8,marginBottom:8,flexWrap:'wrap'}}>
          {DEMO_VOICES_HP.map(v => (
            <button key={v.voice_id} onClick={() => setDemoVoice(v)}
              style={{
                display:'flex',alignItems:'center',gap:6,
                padding:'7px 14px',borderRadius:10,border:'1.5px solid',
                borderColor: demoVoice.voice_id === v.voice_id ? v.color : '#e8e8ed',
                background: demoVoice.voice_id === v.voice_id ? `${v.color}15` : '#fff',
                cursor:'pointer',fontSize:12,fontWeight:600,
                color: demoVoice.voice_id === v.voice_id ? v.color : '#555',
              }}>
              <div style={{width:18,height:18,borderRadius:5,background:v.color,display:'flex',alignItems:'center',justifyContent:'center',fontSize:9,fontWeight:700,color:'#fff'}}>
                {v.name[0]}
              </div>
              {v.name}
            </button>
          ))}
        </div>

        {/* Locked voices */}
        <div style={{display:'flex',gap:8,marginBottom:16,flexWrap:'wrap'}}>
      {[
  {name:'Vanishree',desc:'Professional News Anchor',color:'#0077CC'},
  {name:'Sanjay',desc:'Mature Deep & Intriguing',color:'#263238'},
  {name:'Chameli',desc:'Gen Z & Modern Reels',color:'#E91E63'},
  {name:'Chandramukhi',desc:'Mysterious & Powerful',color:'#4A148C'},
  {name:'Sonia',desc:'Tranquil ASMR & Meditation',color:'#26A69A'},
].map(v => (
            <div key={v.name}
              style={{
                display:'flex',alignItems:'center',gap:8,
                padding:'7px 14px',borderRadius:10,
                border:`1.5px solid ${v.color}40`,
                background:`${v.color}08`,
                fontSize:12,fontWeight:600,
                color:v.color,
                opacity:0.6,
                cursor:'not-allowed',
              }}>
              <div style={{width:18,height:18,borderRadius:5,background:v.color,display:'flex',alignItems:'center',justifyContent:'center',fontSize:9,fontWeight:700,color:'#fff',flexShrink:0}}>
                {v.name[0]}
              </div>
              {v.name} — {v.desc}
              <span style={{fontSize:11,marginLeft:4}}>🔒</span>
            </div>
          ))}
          <a href="/voiceover"
            style={{
              display:'flex',alignItems:'center',gap:4,
              padding:'7px 14px',borderRadius:10,
              border:'1.5px dashed #DC143C',
              background:'rgba(220,20,60,.05)',
              fontSize:12,fontWeight:700,
              color:'#DC143C',
              cursor:'pointer',
              textDecoration:'none',
              whiteSpace:'nowrap',
            }}>
            +30 more voices →
          </a>
        </div>

        {/* Text input */}
        <div style={{background:'#fff',borderRadius:12,border:'1.5px solid #e8e8ed',overflow:'hidden',marginBottom:8}}>
          <textarea
            value={demoText}
            onChange={e => setDemoText(e.target.value.slice(0, HP_DEMO_CHAR_LIMIT))}
            placeholder="नमस्ते! यहाँ नेपाली टाइप गर्नुस्..."
            style={{
              width:'100%',height:90,padding:'12px 14px',
              fontSize:15,lineHeight:1.8,border:'none',
              background:'transparent',color:'#1d1d1f',
              fontFamily:'Noto Sans Devanagari, Manrope, sans-serif',
              resize:'none',outline:'none'
            }}
          />
          <div style={{padding:'6px 14px',borderTop:'1px solid #f0f0f0',background:'#fafafa',display:'flex',justifyContent:'space-between'}}>
            <span style={{fontSize:11,color:'#DC143C',fontWeight:600}}>⚠️ Devanagari only</span>
            <span style={{fontSize:11,fontWeight:600,color: demoText.length >= HP_DEMO_CHAR_LIMIT ? '#DC143C' : '#888'}}>
              {demoText.length}/{HP_DEMO_CHAR_LIMIT}
            </span>
          </div>
        </div>

        {/* Devanagari example */}
        <div style={{background:'#fff',border:'1px solid #e8e8ed',borderRadius:10,padding:'8px 12px',marginBottom:12,fontSize:12}}>
          <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:4}}>
            <span style={{color:'#34C759',fontWeight:700}}>✓</span>
            <span style={{fontFamily:'Noto Sans Devanagari,sans-serif',color:'#34C759',fontWeight:600}}>नमस्ते! आज म तपाईंलाई Swor AI बारे बताउँछु।</span>
          </div>
          <div style={{display:'flex',alignItems:'center',gap:8}}>
            <span style={{color:'#DC143C',fontWeight:700}}>✗</span>
            <span style={{color:'#DC143C',fontWeight:600}}>Namaste! Aaja ma tapailai Swor AI bare bataunchhu.</span>
          </div>
        </div>

        {/* Error */}
        {demoError && (
          <div style={{fontSize:12,color:'#CC3333',marginBottom:10}}>❌ {demoError}</div>
        )}

        {/* Generate button */}
        {!showForm && (
          <button
            onClick={() => { if (demoText.trim()) setShowForm(true) }}
            disabled={!demoText.trim()}
            style={{
              width:'100%',padding:'13px',borderRadius:12,border:'none',
              background: demoText.trim() ? '#DC143C' : '#ccc',
              color:'#fff',fontSize:15,fontWeight:700,
              cursor: demoText.trim() ? 'pointer' : 'not-allowed',
              fontFamily:'Sora,sans-serif',
              boxShadow: demoText.trim() ? '0 4px 20px rgba(220,20,60,.25)' : 'none',
            }}>
            {demoPlaying ? '🔊 Playing...' : '🎙️ Generate Free Sample →'}
          </button>
        )}

        {/* Form */}
        {showForm && (
          <form onSubmit={handleSubmit} style={{display:'flex',flexDirection:'column',gap:10}}>
            <div style={{fontSize:13,fontWeight:700,color:'#1d1d1f',marginBottom:4}}>
              Almost there! Enter your details to unlock your free sample:
            </div>
            <input
              type="text" placeholder="Your name" required value={name}
              onChange={e => setName(e.target.value)}
              style={{padding:'11px 14px',borderRadius:10,border:'1.5px solid #e8e8ed',fontSize:14,outline:'none',fontFamily:'inherit'}}
            />
            <input
              type="tel" placeholder="Phone number (e.g. 98XXXXXXXX)" required value={phone}
              onChange={e => setPhone(e.target.value)}
              style={{padding:'11px 14px',borderRadius:10,border:'1.5px solid #e8e8ed',fontSize:14,outline:'none',fontFamily:'inherit'}}
            />
            <input
              type="email" placeholder="Email address" required value={email}
              onChange={e => setEmail(e.target.value)}
              style={{padding:'11px 14px',borderRadius:10,border:'1.5px solid #e8e8ed',fontSize:14,outline:'none',fontFamily:'inherit'}}
            />
            <button type="submit" disabled={demoLoading}
              style={{
                padding:'13px',borderRadius:12,border:'none',
                background: demoLoading ? '#ccc' : '#DC143C',
                color:'#fff',fontSize:15,fontWeight:700,
                cursor: demoLoading ? 'not-allowed' : 'pointer',
                fontFamily:'Sora,sans-serif',
              }}>
              {demoLoading ? '⏳ Generating your sample...' : demoPlaying ? '🔊 Playing...' : '🎙️ Hear My Free Sample →'}
            </button>
            <button type="button" onClick={() => setShowForm(false)}
              style={{background:'transparent',border:'none',fontSize:12,color:'#888',cursor:'pointer'}}>
              ← Back
            </button>
          </form>
        )}
      </div>

      {/* REWARD POPUP */}
      {showReward && (
        <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,.75)',zIndex:9999,display:'flex',alignItems:'center',justifyContent:'center',padding:16,backdropFilter:'blur(6px)'}}>
          <div style={{background:'linear-gradient(135deg,#1d1d1f 0%,#2d1020 100%)',borderRadius:24,padding:isMobile?24:36,maxWidth:480,width:'100%',border:'1.5px solid rgba(220,20,60,.3)',boxShadow:'0 24px 60px rgba(0,0,0,.5)',position:'relative'}}>

            {/* Close button */}
            <button onClick={() => setShowReward(false)}
              style={{position:'absolute',top:16,right:16,background:'rgba(255,255,255,.1)',border:'none',color:'#fff',width:32,height:32,borderRadius:'50%',cursor:'pointer',fontSize:16,display:'flex',alignItems:'center',justifyContent:'center'}}>
              ✕
            </button>

            {/* Header */}
            <div style={{textAlign:'center',marginBottom:20}}>
              <div style={{fontSize:36,marginBottom:8}}>🎉</div>
              <div style={{fontFamily:'Sora,sans-serif',fontSize:20,fontWeight:800,color:'#fff',marginBottom:4}}>
                Voice Generated Successfully!
              </div>
              <div style={{fontFamily:'Noto Sans Devanagari,sans-serif',fontSize:14,color:'rgba(255,255,255,.6)'}}>
                आवाज सफलतापूर्वक तयार भयो!
              </div>
            </div>

            {/* Reward box */}
            <div style={{background:'rgba(220,20,60,.1)',border:'1.5px solid rgba(220,20,60,.3)',borderRadius:16,padding:20,marginBottom:20,textAlign:'center'}}>
              <div style={{fontSize:13,fontWeight:700,color:'rgba(255,255,255,.7)',marginBottom:8}}>
                🎁 You unlocked an Exclusive Early Creator Reward!
              </div>
              <div style={{fontFamily:'Noto Sans Devanagari,sans-serif',fontSize:12,color:'rgba(255,255,255,.5)',marginBottom:16}}>
                तपाईंले एउटा विशेष Early Creator Reward अनलक गर्नुभयो!
              </div>

              {/* Code */}
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
  🎁 Send this code on WhatsApp to unlock exclusive bonus credits on any pack:
</div>
<div style={{display:'flex',flexDirection:'column',gap:8,marginBottom:12}}>
  {[
    {name:'Starter Pack',npr:'499',normal:'3,500',bonus:'10,000'},
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
<div style={{fontFamily:'Noto Sans Devanagari,sans-serif',fontSize:12,color:'rgba(255,255,255,.5)'}}>
  यो कोड WhatsApp मा पठाउनुस् र जुनसुकै Pack मा extra bonus credits पाउनुस्!
</div>
            </div>

            {/* Timer */}
            <div style={{textAlign:'center',marginBottom:16}}>
              <div style={{fontSize:12,color:'rgba(255,255,255,.5)',marginBottom:4}}>
                ⏱️ Offer valid for / यो अफर मान्य छ:
              </div>
              <div style={{fontFamily:'Sora,sans-serif',fontSize:28,fontWeight:800,color:timeLeft < 60 ? '#DC143C' : '#FF9500'}}>
                {formatTime(timeLeft)}
              </div>
              <div style={{fontSize:11,color:'rgba(255,255,255,.4)'}}>
                {timeLeft < 60 ? '⚠️ Expiring soon!' : 'minutes remaining'}
              </div>
            </div>

            {/* CTA */}
            <a href="https://wa.me/19255379425?text=Namaste%20Avash!%20I%20just%20generated%20a%20demo%20on%20Swor%20AI%20and%20unlocked%20code%20SWOR-LAUNCH-10K.%20I%20want%20to%20claim%20my%20bonus%20credits!" target="_blank" rel="noreferrer" style={{display:'block',background:'#25D366',color:'#fff',padding:'14px',borderRadius:12,fontSize:15,fontWeight:700,textAlign:'center',textDecoration:'none',boxShadow:'0 4px 20px rgba(37,211,102,.3)',marginBottom:10}}>
              {'💬 Claim 10,000 Credits on WhatsApp Now'}
            </a>
            <div style={{textAlign:'center',fontSize:11,color:'rgba(255,255,255,.3)'}}>
              {'या / or '}
              <span style={{cursor:'pointer',textDecoration:'underline'}} onClick={() => { setShowReward(false); window.location.href='/voiceover' }}>
                {'Continue to full tool'}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
