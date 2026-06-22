import Head from 'next/head'
import Link from 'next/link'
import { useState, useEffect, useRef } from 'react'

const FORMSPREE_ID = 'xaqkjezd'

const FEATURED_VOICES = [
  { voice_id: '1zUSi8LeHs9M2mV8X6YS', name: 'Priyanka', label: 'Romantic', photo: '/priyanka.jpg' },
  { voice_id: 'LK1Sn9bmEczSFI65RF0v', name: 'Sunita', label: 'Nepali Aunty', photo: '/sunita.jpg' },
  { voice_id: 'FszY75334ExxVmg7yl0U', name: 'Dhurundhar', label: 'Narration', photo: '/dhurundhar.jpg' },
  { voice_id: 'ecp3DWciuUyW7BYM7II1', name: 'Anika', label: 'Social Media', photo: '/anika.jpg' },
  { voice_id: 'rHhok70RpCi5GgianXRA', name: 'Rudra', label: 'Romantic Male', photo: '/rudra.jpg' },
  { voice_id: '2W8HrWcBFzCEf5cQQdIL', name: 'Karan', label: 'Documentary', photo: '/karan.jpg' },
]

const ALL_VOICES = [
  { voice_id: '1zUSi8LeHs9M2mV8X6YS', name: 'Priyanka', desc: 'Romantic & Elegant', color: '#FF6B8A', initial: 'P', gender: 'female' },
  { voice_id: 'LK1Sn9bmEczSFI65RF0v', name: 'Sunita', desc: 'Soft Spoken Aunty', color: '#E91E8C', initial: 'S', gender: 'female' },
  { voice_id: 'duDBJHU6G1oq7ZdK4Kxf', name: 'Anjali', desc: 'Motivational & Uplifting', color: '#FF8C42', initial: 'A', gender: 'female' },
  { voice_id: 'TmPeb2hSxdVrThJLywkg', name: 'Vanishree', desc: 'Professional & News', color: '#0077CC', initial: 'V', gender: 'female' },
  { voice_id: 'ecp3DWciuUyW7BYM7II1', name: 'Anika', desc: 'Sweet & Lively Reels', color: '#7B2FBE', initial: 'A', gender: 'female' },
  { voice_id: 'f0JpDwzbGK384Dd1WH2s', name: 'Mina', desc: 'Friendly & Polished', color: '#00897B', initial: 'M', gender: 'female' },
  { voice_id: 'Pc57DSBXmCXyEAmow7lW', name: 'Shraddha', desc: 'Credible & Trustworthy', color: '#5C6BC0', initial: 'S', gender: 'female' },
  { voice_id: '6qL48o1LBmtR94hIYAQh', name: 'Monika', desc: 'Suspense & Drama', color: '#1C1C2E', initial: 'M', gender: 'female' },
  { voice_id: 'FszY75334ExxVmg7yl0U', name: 'Dhurundhar', desc: 'Deep & Commanding', color: '#1A3A5C', initial: 'D', gender: 'male' },
  { voice_id: 'WdZjiN0nNcik2LBjOHiv', name: 'Bishnu', desc: 'Wise Documentary', color: '#4E342E', initial: 'B', gender: 'male' },
  { voice_id: 'CwhRBWXzGAHq8TQ4Fs17', name: 'Rohan', desc: 'Casual & Laid-Back', color: '#546E7A', initial: 'R', gender: 'male' },
  { voice_id: 'TX3LPaxmHKxFdv7VOQHJ', name: 'Arjun', desc: 'Energetic Reels', color: '#F57C00', initial: 'A', gender: 'male' },
  { voice_id: 'g1FVKFidZjHPxXdfA89c', name: 'Vikram', desc: 'Confident & Warm', color: '#2E7D32', initial: 'V', gender: 'male' },
  { voice_id: '2W8HrWcBFzCEf5cQQdIL', name: 'Karan', desc: 'Dark Documentary', color: '#212121', initial: 'K', gender: 'male' },
{ voice_id: 'rHhok70RpCi5GgianXRA', name: 'Rudra', desc: 'Intense & Romantic', color: '#880E4F', initial: 'R', gender: 'male' },
{ voice_id: '34lPwSZ54D8fWbX1aHzk', name: 'Suraj', desc: 'Upbeat TV & Radio Announcer', color: '#FFA000', initial: 'S', gender: 'male' },
{ voice_id: 'gU0LNdkMOQCOrPrwtbee', name: 'Saurav', desc: 'Sports Commentator', color: '#B71C1C', initial: 'S', gender: 'male' },
{ voice_id: 'BtWabtumIemAotTjP5sk', name: 'Prakash', desc: 'Clear & Professional', color: '#37474F', initial: 'P', gender: 'male' },
{ voice_id: 'e6h2ged6ThVk1jTnIwnC', name: 'Ridhi', desc: 'Elegant Ad Narration', color: '#00ACC1', initial: 'R', gender: 'female' },
{ voice_id: 'm3yAHyFEFKtbCIM5n7GF', name: 'Asha', desc: 'Conversational & Bright', color: '#D81B60', initial: 'A', gender: 'female' },
]

export default function Landing() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState('idle')
  const [scrolled, setScrolled] = useState(false)
  const [isNepali, setIsNepali] = useState(false)
  const [filter, setFilter] = useState('all')
  const [playingId, setPlayingId] = useState(null)
  const audioRef = useRef(null)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  useEffect(() => {
    window.googleTranslateElementInit = function () {
      new window.google.translate.TranslateElement(
        { pageLanguage: 'en', includedLanguages: 'ne', autoDisplay: false },
        'gt_element'
      )
    }
    const s = document.createElement('script')
    s.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit'
    s.async = true
    document.body.appendChild(s)
  }, [])

  function toggleLanguage() {
    if (!isNepali) {
      const combo = document.querySelector('.goog-te-combo')
      if (combo) { combo.value = 'ne'; combo.dispatchEvent(new Event('change')); setIsNepali(true) }
    } else {
      document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
      document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${window.location.hostname}`
      window.location.reload()
    }
  }

  function playPreview(voiceId) {
    if (playingId === voiceId) {
      audioRef.current?.pause()
      audioRef.current = null
      setPlayingId(null)
      return
    }
    audioRef.current?.pause()
    const audio = new Audio(`/previews/${voiceId}.mp3`)
    audioRef.current = audio
    audio.play()
    setPlayingId(voiceId)
    audio.onended = () => setPlayingId(null)
    audio.onerror = () => setPlayingId(null)
  }

  const filteredVoices = ALL_VOICES.filter(v => filter === 'all' || v.gender === filter)

  async function handleSubmit(e) {
    e.preventDefault()
    setStatus('loading')
    try {
      const formData = new FormData(e.target)
      const data = Object.fromEntries(formData.entries())
      data.email = email
      const res = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(data),
      })
      setStatus(res.ok ? 'success' : 'error')
    } catch { setStatus('error') }
  }

  return (
    <>
      <Head>
    <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <title>Swor AI — नेपाली AI Voice & Subtitle Generator</title>
        <meta name="description" content="Nepal's most realistic AI Nepali voice generator and subtitle tool. Generate natural Nepali voiceovers and subtitles in seconds." />
        <meta name="keywords" content="Nepali AI voice generator, नेपाली voiceover, Nepali subtitle generator, AI Nepali text to speech, Swor AI" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link href="https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800&family=Manrope:wght@400;500;600;700&family=Righteous&display=swap" rel="stylesheet" />
      </Head>

      <style>{`
        *{box-sizing:border-box;margin:0;padding:0}
        html{scroll-behavior:smooth}
        body{font-family:'Manrope',sans-serif;background:#fff;color:#1d1d1f;-webkit-font-smoothing:antialiased}
        a{text-decoration:none;color:inherit}
        .goog-te-banner-frame,.skiptranslate{display:none!important}
        #gt_element{display:none}
        body{top:0!important}

        @keyframes fadeUp{from{opacity:0;transform:translateY(22px)}to{opacity:1;transform:translateY(0)}}
        @keyframes pulse{0%,100%{transform:scale(1)}50%{transform:scale(1.1)}}
        @keyframes shimmer{0%{background-position:200% center}100%{background-position:-200% center}}
        @keyframes glow{0%,100%{text-shadow:0 0 20px rgba(220,20,60,.3)}50%{text-shadow:0 0 40px rgba(220,20,60,.6),0 0 80px rgba(255,106,138,.2)}}

        .fu{animation:fadeUp .65s ease both}
        .fu1{animation-delay:.08s}.fu2{animation-delay:.18s}.fu3{animation-delay:.28s}.fu4{animation-delay:.4s}

        .swor-brand{
          font-family:'Righteous',sans-serif;
          font-size:clamp(52px,8vw,110px);
          font-weight:400;
          background:linear-gradient(135deg,#DC143C 0%,#FF3366 25%,#FF6B8A 50%,#FF9500 75%,#FFB347 100%);
          background-size:200% auto;
          -webkit-background-clip:text;
          -webkit-text-fill-color:transparent;
          background-clip:text;
          animation:shimmer 4s linear infinite,glow 3s ease-in-out infinite;
          letter-spacing:4px;
          line-height:1;
          text-align:center;
        }

        .btn-primary{background:#DC143C;color:#fff;border:none;padding:14px 30px;border-radius:12px;font-size:15px;font-weight:700;font-family:'Sora',sans-serif;cursor:pointer;transition:all .15s;box-shadow:0 4px 18px rgba(220,20,60,.25)}
        .btn-primary:hover{transform:translateY(-2px);box-shadow:0 8px 28px rgba(220,20,60,.35)}
        .btn-secondary{background:#f5f5f7;color:#1d1d1f;border:none;padding:14px 30px;border-radius:12px;font-size:15px;font-weight:600;font-family:'Sora',sans-serif;cursor:pointer;transition:background .15s}
        .btn-secondary:hover{background:#e8e8ed}

        .voice-card{background:#fff;border:1.5px solid #f0f0f0;border-radius:14px;padding:14px 16px;display:flex;align-items:center;gap:12px;cursor:pointer;transition:all .2s}
        .voice-card:hover{border-color:rgba(220,20,60,.2);box-shadow:0 4px 20px rgba(0,0,0,.07);transform:translateY(-2px)}

        .hero-voice-card{border-radius:16px;padding:12px 14px;display:flex;align-items:center;gap:12px;background:rgba(255,255,255,0.95);backdrop-filter:blur(12px);border:1px solid rgba(255,255,255,0.9);box-shadow:0 4px 24px rgba(0,0,0,.1);cursor:pointer;transition:all .2s}
        .hero-voice-card:hover{transform:translateY(-4px);box-shadow:0 12px 36px rgba(0,0,0,.14)}

        .play-btn{width:34px;height:34px;border-radius:50%;display:flex;align-items:center;justify-content:center;border:none;cursor:pointer;flex-shrink:0;transition:all .15s;font-size:12px;margin-left:auto}
        .filter-btn{padding:8px 20px;border-radius:24px;border:1.5px solid #e8e8ed;background:#fff;font-size:13px;font-weight:600;cursor:pointer;transition:all .15s;font-family:'Sora',sans-serif;color:#555}
        .filter-btn.on{background:#1d1d1f;color:#fff;border-color:#1d1d1f}
        .lang-btn{background:transparent;border:1.5px solid rgba(255,255,255,.3);border-radius:20px;padding:5px 14px;font-size:12px;font-weight:700;cursor:pointer;transition:all .15s;font-family:'Sora',sans-serif;color:rgba(255,255,255,.8)}
        .lang-btn:hover,.lang-btn.on{background:#DC143C;border-color:#DC143C;color:#fff}
        .lang-btn-scroll{border-color:#e0e0e0;color:#555}
        .lang-btn-scroll:hover,.lang-btn-scroll.on{background:#DC143C;border-color:#DC143C;color:#fff}
        .email-input{width:100%;padding:15px 20px;border:2px solid #e8e8ed;border-radius:12px;font-size:16px;font-family:'Manrope',sans-serif;outline:none;transition:border-color .2s;background:rgba(255,255,255,.06);color:#fff;border-color:rgba(255,255,255,.15)}
        .email-input:focus{border-color:#DC143C}
        .email-input::placeholder{color:rgba(255,255,255,.35)}
        .feature-card{background:#f8f8f8;border-radius:20px;padding:32px 28px;transition:all .25s}
        .feature-card:hover{transform:translateY(-4px);box-shadow:0 16px 48px rgba(0,0,0,.08)}
      `}</style>

      <div id="gt_element" />

      {/* ══ NAV ══ */}
      <nav style={{
        position:'fixed',top:0,left:0,right:0,zIndex:200,
        background:scrolled?'rgba(255,255,255,.95)':'transparent',
        backdropFilter:scrolled?'blur(20px)':'none',
        borderBottom:scrolled?'1px solid rgba(0,0,0,.06)':'none',
        transition:'all .3s',padding:'0 32px',height:62,
        display:'flex',alignItems:'center',justifyContent:'space-between'
      }}>
        <Link href="/" style={{display:'flex',alignItems:'center',gap:8}}>
          <div style={{width:30,height:30,borderRadius:8,background:'linear-gradient(135deg,#DC143C,#FF6B8A)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:13,color:'#fff',fontWeight:800}}>M</div>
          <span style={{fontSize:15,fontWeight:700,fontFamily:'Sora,sans-serif',letterSpacing:'-0.3px',color:scrolled?'#1d1d1f':'#1d1d1f'}}>MeroAD.ai</span>
        </Link>
        <div style={{display:'flex',alignItems:'center',gap:10}}>
          <button onClick={toggleLanguage} className={`lang-btn${scrolled?' lang-btn-scroll':''}${isNepali?' on':''}`}>
            {isNepali?'English':'नेपाली'}
          </button>
          <Link href="/for-business"><button style={{background:'#7B2FBE',color:'#fff',border:'none',padding:'9px 20px',borderRadius:10,fontSize:13,fontWeight:700,cursor:'pointer',marginRight:4}}>For Business</button></Link>
<Link href="/tool"><button className="btn-primary" style={{padding:'9px 20px',fontSize:13}}>Try Tool →</button></Link>
        </div>
      </nav>

      {/* ══ HERO ══ */}
      <section style={{minHeight:'100vh',display:'flex',flexDirection:'column',alignItems:'center',padding:isMobile?'80px 16px 40px':'90px 48px 60px',background:'linear-gradient(160deg,#fff 0%,#fff5f7 40%,#fff8f0 70%,#fff 100%)',position:'relative',overflow:'hidden'}}>
        <div style={{position:'absolute',top:'5%',left:'50%',transform:'translateX(-50%)',width:800,height:800,borderRadius:'50%',background:'radial-gradient(circle,rgba(220,20,60,.04) 0%,transparent 65%)',pointerEvents:'none'}} />
        <div style={{position:'absolute',top:'20%',right:'5%',width:300,height:300,borderRadius:'50%',background:'radial-gradient(circle,rgba(255,149,0,.05) 0%,transparent 70%)',pointerEvents:'none'}} />

        {/* SWOR AI Brand Name */}
        <div className="fu" style={{marginBottom:8,position:'relative',zIndex:1}}>
          <div className="swor-brand">SWOR AI</div>
          <div style={{textAlign:'center',fontSize:11,fontWeight:600,color:'rgba(220,20,60,.5)',letterSpacing:'0.15em',textTransform:'uppercase',marginTop:4}}>
            A Product of MeroAD.ai
          </div>
        </div>

        {/* Two column layout */}
        <div style={{display:'grid',gridTemplateColumns:isMobile?'1fr':'1fr 1fr',gap:isMobile?24:48,alignItems:'center',width:'100%',maxWidth:1100,position:'relative',zIndex:1,marginTop:32}}>

          {/* LEFT */}
          <div>
            <div className="fu fu1" style={{fontSize:12,fontWeight:700,color:'#888',letterSpacing:'0.04em',marginBottom:18,lineHeight:1.6}}>
             Nepal's #1 Nepali Text to Speech &{' '}
              <span style={{color:'#DC143C',fontFamily:'Noto Sans Devanagari, sans-serif'}}>नेपाली</span>{' '}
              AI Voiceover Generator
            </div>
            <h1 className="fu fu2" style={{fontFamily:'Sora,sans-serif',fontSize:isMobile?'20px':'clamp(28px,3.8vw,50px)',fontWeight:800,lineHeight:1.15,letterSpacing:'-1.2px',marginBottom:20,color:'#1d1d1f'}}>
              Hyper realistic Nepali AI<br />
              voice generator that{' '}
              <span style={{color:'#DC143C',fontStyle:'italic'}}>captivates</span><br />
              your audience
            </h1>
            <p className="fu fu3" style={{fontSize:16,color:'#6e6e73',lineHeight:1.75,marginBottom:32,maxWidth:440}}>
              Right now, adding{' '}
              <strong style={{color:'#1d1d1f',fontFamily:'Noto Sans Devanagari, sans-serif'}}>नेपाली</strong>{' '}
              subtitles and voiceovers to your videos takes hours.
              Swor AI does it in seconds.
            </p>
            {/* Music announcement */}
          <div style={{display:'flex',alignItems:'center',gap:12,background:'linear-gradient(135deg,#5B2D9E,#7B3FBE)',border:'1px solid rgba(107,63,190,.4)',borderRadius:14,padding:'14px 20px',marginBottom:20,flexWrap:'wrap',boxShadow:'0 4px 20px rgba(107,63,190,.25)'}}>
              <span style={{fontSize:22,flexShrink:0}}>🎵</span>
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontSize:isMobile?13:15,fontWeight:800,color:'#fff',letterSpacing:'-0.3px'}}>Now also: Generate original Nepali music</div>
                <div style={{fontSize:isMobile?12:14,color:'rgba(255,255,255,.8)',marginTop:3,fontWeight:500}}>Type a prompt. Get a royalty-free Nepali song in seconds.</div>
              </div>
              <Link href="/tool"><button style={{background:'#fff',color:'#6B3FBE',border:'none',padding:'8px 16px',borderRadius:8,fontSize:13,fontWeight:800,cursor:'pointer',flexShrink:0,whiteSpace:'nowrap'}}>Try Free Music →</button></Link>
            </div>
            <div className="fu fu4" style={{display:'flex',gap:12,flexWrap:'wrap',marginBottom:20}}>
              <a href="#access"><button className="btn-primary">Get free access</button></a>
              <Link href="/tool"><button className="btn-secondary">Try the tool first</button></Link>
            </div>
            <div style={{fontSize:13,color:'#DC143C',fontWeight:600}}>🔥 Only 20 beta spots — 7 already filled</div>
          </div>

          {/* RIGHT — Badge + Voice Cards */}
          <div>
            <div style={{textAlign:'center',marginBottom:14}}>
              <div style={{display:'inline-flex',alignItems:'center',gap:8,background:'rgba(220,20,60,.08)',border:'1px solid rgba(220,20,60,.2)',borderRadius:20,padding:'6px 16px',fontSize:12,fontWeight:700,color:'#DC143C',letterSpacing:'0.06em',textTransform:'uppercase'}}>
                ▶ &nbsp;Test Demo Below — Click Any Voice
              </div>
            </div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:isMobile?6:10,width:'100%'}}>
            {FEATURED_VOICES.map((v,i)=>(
              <div
                key={v.voice_id}
                className="hero-voice-card"
                onClick={()=>playPreview(v.voice_id)}
                style={{animation:`fadeUp .6s ease ${i*0.08}s both`,padding:isMobile?'10px 8px':'16px 18px'}}
              >
                <div style={{width:isMobile?44:64,height:isMobile?44:64,borderRadius:14,overflow:'hidden',flexShrink:0,border:'2px solid rgba(220,20,60,.1)'}}>
                  <img
                    src={v.photo}
                    alt={v.name}
                    style={{width:'100%',height:'100%',objectFit:'cover'}}
                    onError={e=>{e.target.style.display='none';e.target.parentNode.style.background='linear-gradient(135deg,#DC143C,#FF6B8A)';e.target.parentNode.innerHTML=`<span style="color:#fff;font-weight:700;font-size:16px;display:flex;align-items:center;justify-content:center;width:100%;height:100%">${v.name[0]}</span>`}}
                  />
                </div>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{fontSize:13,fontWeight:700,color:'#1d1d1f',lineHeight:1.2,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{v.name}</div>
                  <div style={{fontSize:11,color:'#999',marginTop:1}}>{v.label}</div>
                </div>
                <button
                  className="play-btn"
                  style={{
                    background:playingId===v.voice_id?'#DC143C':'#f5f5f7',
                    color:playingId===v.voice_id?'#fff':'#555',
                    animation:playingId===v.voice_id?'pulse 1s infinite':''
                  }}
                >
                  {playingId===v.voice_id?'■':'▶'}
                </button>
              </div>
            ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══ MIDDLE STRIP ══ */}
      <section style={{background:'#1d1d1f',padding:isMobile?'20px 16px':'28px 48px',textAlign:'center'}}>
        <div style={{fontFamily:'Sora,sans-serif',fontSize:'clamp(16px,2vw,24px)',fontWeight:700,color:'#fff',letterSpacing:'-0.3px',marginBottom:8}}>
          Start saving <span style={{color:'#FF6B8A'}}>90%</span> of your time and budget today!
        </div>
        <div style={{fontSize:13,color:'rgba(255,255,255,.65)',fontWeight:500,letterSpacing:'0.02em'}}>
          <span style={{color:'#FF9500',fontWeight:700}}>Swor AI</span>
          {' '}—{' '}
          <span style={{color:'rgba(255,255,255,.8)'}}>A Product of MeroAD.ai</span>
        </div>
      </section>

      {/* ══ VOICE LIBRARY ══ */}
      <section style={{padding:isMobile?'60px 16px':'100px 48px',background:'#fff'}}>
        <div style={{maxWidth:1100,margin:'0 auto'}}>
          <div style={{textAlign:'center',marginBottom:48}}>
            <h2 style={{fontFamily:'Sora,sans-serif',fontSize:'clamp(26px,3.5vw,44px)',fontWeight:800,letterSpacing:'-1px',marginBottom:14}}>
              The most natural{' '}
              <span style={{color:'#DC143C',fontFamily:'Noto Sans Devanagari, sans-serif'}}>नेपाली</span>{' '}
              voices
            </h2>
            <p style={{fontSize:16,color:'#6e6e73',marginBottom:32,lineHeight:1.65}}>
              Choose the perfect voice — click <strong style={{color:'#1d1d1f'}}>▶</strong> to preview any voice instantly
            </p>
            <div style={{display:'flex',gap:8,justifyContent:'center'}}>
              {[['all','All'],['female','Female'],['male','Male']].map(([f,l])=>(
                <button key={f} className={`filter-btn${filter===f?' on':''}`} onClick={()=>setFilter(f)}>{l}</button>
              ))}
            </div>
          </div>

          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))',gap:12}}>
            {filteredVoices.map(v=>(
              <div key={v.voice_id} className="voice-card" onClick={()=>playPreview(v.voice_id)}>
                <div style={{width:46,height:46,borderRadius:12,background:`linear-gradient(135deg,${v.color},${v.color}88)`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:17,fontWeight:700,color:'#fff',flexShrink:0}}>
                  {v.initial}
                </div>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{fontSize:14,fontWeight:700,color:'#1d1d1f'}}>{v.name}</div>
                  <div style={{fontSize:12,color:'#999',marginTop:2}}>{v.desc}</div>
                  <div style={{fontSize:10,fontWeight:700,color:v.gender==='female'?'#E91E8C':'#1565C0',marginTop:4,textTransform:'uppercase',letterSpacing:'0.06em'}}>{v.gender}</div>
                </div>
                <button
                  className="play-btn"
                  style={{background:playingId===v.voice_id?v.color:'#f5f5f7',color:playingId===v.voice_id?'#fff':'#555',animation:playingId===v.voice_id?'pulse 1s infinite':''}}
                >
                  {playingId===v.voice_id?'■':'▶'}
                </button>
              </div>
            ))}
          </div>

          <div style={{textAlign:'center',marginTop:40}}>
            <Link href="/tool">
              <button className="btn-primary" style={{fontSize:15,padding:'14px 32px'}}>
                Generate your Nepali voiceover now →
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* ══ SWOR IS ULTIMATE ══ */}
      <section style={{padding:'100px 48px',background:'#f5f5f7'}}>
        <div style={{maxWidth:1100,margin:'0 auto'}}>
          <div style={{textAlign:'center',marginBottom:60}}>
            <h2 style={{fontFamily:'Sora,sans-serif',fontSize:'clamp(26px,3.5vw,44px)',fontWeight:800,letterSpacing:'-1px',marginBottom:14}}>
              Swor is the <span style={{color:'#DC143C',fontStyle:'italic'}}>ultimate</span> Nepali AI content tool
            </h2>
            <p style={{fontSize:16,color:'#6e6e73',maxWidth:500,margin:'0 auto',lineHeight:1.65}}>
              Everything you need to create professional Nepali content — without the expensive equipment or studio time.
            </p>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(300px,1fr))',gap:20,alignItems:'start'}}>

            <div className="feature-card">
              <div style={{width:52,height:52,borderRadius:14,background:'linear-gradient(135deg,#FF8C42,#FFB347)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:22,marginBottom:20}}>⏱</div>
              <div style={{background:'#fff',borderRadius:12,padding:16,marginBottom:20,border:'1px solid #e8e8ed'}}>
                <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:10}}>
                  <div style={{width:8,height:8,borderRadius:'50%',background:'#34C759'}} />
                  <div style={{fontSize:11,color:'#999'}}>Generating Nepali voiceover...</div>
                </div>
                <div style={{height:6,background:'linear-gradient(90deg,#DC143C,#FF6B8A)',borderRadius:3,width:'75%',marginBottom:8}} />
                <div style={{display:'flex',justifyContent:'space-between',fontSize:11,color:'#999'}}>
                  <span>0:00</span><span style={{color:'#34C759',fontWeight:700}}>✓ Ready in 8s</span>
                </div>
              </div>
              <h3 style={{fontFamily:'Sora,sans-serif',fontSize:20,fontWeight:700,marginBottom:10}}>Save 90% of your time</h3>
              <p style={{fontSize:14,color:'#6e6e73',lineHeight:1.7}}>What used to take hours now takes seconds. Upload, generate, download. Done.</p>
            </div>

            <div className="feature-card">
              <div style={{width:52,height:52,borderRadius:14,background:'linear-gradient(135deg,#DC143C,#FF6B8A)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:22,marginBottom:20}}>🎙️</div>
              <div style={{background:'#fff',borderRadius:12,padding:16,marginBottom:20,border:'1px solid #e8e8ed'}}>
                <div style={{fontSize:12,color:'#1d1d1f',fontWeight:600,marginBottom:10}}>Priyanka — Romantic</div>
                <div style={{display:'flex',gap:3,alignItems:'flex-end',height:28,marginBottom:8}}>
                  {[14,22,18,28,20,24,16,30,22,18,26,20,14,24,18].map((h,i)=>(
                    <div key={i} style={{flex:1,height:h,borderRadius:2,background:i%2===0?'#DC143C':'#FF6B8A',opacity:.7}} />
                  ))}
                </div>
                <div style={{fontSize:11,color:'#999'}}>नमस्ते! म तपाईँको आवाज हुँ...</div>
              </div>
              <h3 style={{fontFamily:'Sora,sans-serif',fontSize:20,fontWeight:700,marginBottom:10}}>20 natural Nepali voices</h3>
              <p style={{fontSize:14,color:'#6e6e73',lineHeight:1.7}}>From romantic to documentary — choose the voice that fits your content perfectly.</p>
            </div>

            <div className="feature-card">
              <div style={{width:52,height:52,borderRadius:14,background:'linear-gradient(135deg,#007AFF,#00C7FF)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:22,marginBottom:20}}>📝</div>
              <div style={{background:'#1d1d1f',borderRadius:12,padding:12,marginBottom:20}}>
                <div style={{background:'#000',borderRadius:8,aspectRatio:'16/9',display:'flex',alignItems:'flex-end',padding:'8px',position:'relative',overflow:'hidden'}}>
                  <div style={{position:'absolute',inset:0,background:'linear-gradient(135deg,#1a1a2e,#16213e)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:20}}>🏔️</div>
                  <div style={{position:'relative',zIndex:1,width:'100%',textAlign:'center',padding:'4px 8px',background:'rgba(0,0,0,.65)',borderRadius:4}}>
                    <div style={{fontSize:10,color:'#fff',fontWeight:600}}>नमस्ते, यो हाम्रो नयाँ भिडियो हो</div>
                  </div>
                </div>
              </div>
              <h3 style={{fontFamily:'Sora,sans-serif',fontSize:20,fontWeight:700,marginBottom:10}}>Accurate Nepali subtitles</h3>
              <p style={{fontSize:14,color:'#6e6e73',lineHeight:1.7}}>Auto-generated captions synced to your video. Devanagari or Romanized — ready for CapCut.</p>
            </div>

          </div>
        </div>
      </section>

      {/* ══ MEROAD AI SECTION ══ */}
      {/* PASTE THIS DIRECTLY ABOVE THE SEEMA & GEETA SECTION */}
      <section style={{padding:isMobile?'60px 16px':'100px 48px',background:'#0E0E16',position:'relative',overflow:'hidden'}}>
        <div style={{position:'absolute',top:'10%',left:'50%',transform:'translateX(-50%)',width:800,height:800,borderRadius:'50%',background:'radial-gradient(circle,rgba(220,20,60,.06) 0%,transparent 65%)',pointerEvents:'none'}} />

        <div style={{maxWidth:1100,margin:'0 auto',position:'relative',zIndex:1}}>

          {/* ── TEXT BLOCK ── */}
          <div style={{textAlign:'center',marginBottom:64}}>
            <div style={{display:'inline-flex',alignItems:'center',gap:8,background:'rgba(220,20,60,.12)',border:'1px solid rgba(220,20,60,.25)',borderRadius:24,padding:'6px 16px',fontSize:12,fontWeight:700,color:'#FF6B8A',letterSpacing:'0.08em',marginBottom:20}}>
              ✦ MEROAD.AI — Nepal's First AI-Powered Advertisement Agency
            </div>

            <h2 style={{fontFamily:'Sora,sans-serif',fontSize:'clamp(28px,4vw,52px)',fontWeight:800,color:'#fff',letterSpacing:'-1.5px',lineHeight:1.05,marginBottom:20}}>
              Premium commercial visuals.<br />
              <span style={{color:'#DC143C'}}>75% less cost.</span>
            </h2>

            <p style={{fontSize:17,color:'rgba(255,255,255,.55)',lineHeight:1.8,maxWidth:640,margin:'0 auto 32px'}}>
              You need breathtaking, ultra-realistic images and videos to make your brand stand out.
              But hiring models, booking photographers, and managing locations drains your budget.
              Skip the traditional <em style={{color:'rgba(255,255,255,.7)'}}>jhanjhat</em> — get the exact same cinematic commercial content
              using advanced AI, and cut production costs by up to 75%.
            </p>

            {/* Benefits */}
            <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))',gap:12,maxWidth:720,margin:'0 auto 36px',textAlign:'left'}}>
              {[
                {icon:'✓',text:'Ultra-Realistic AI images & cinematic video'},
                {icon:'✓',text:'75% cheaper — zero model, crew, or location fees'},
                {icon:'✓',text:'Commercial ready — built to sell your product instantly'},
                {icon:'✓',text:'Unlimited revisions until you love it'},
                {icon:'✓',text:'Delivered in 24-48 hours — not weeks'},
                {icon:'✓',text:'Works for any industry — food, fashion, real estate, NGOs'},
              ].map(b=>(
                <div key={b.text} style={{display:'flex',alignItems:'flex-start',gap:10,background:'rgba(255,255,255,.04)',borderRadius:10,padding:'12px 14px',border:'1px solid rgba(255,255,255,.06)'}}>
                  <span style={{color:'#34C759',fontWeight:700,fontSize:14,flexShrink:0,marginTop:1}}>{b.icon}</span>
                  <span style={{fontSize:13,color:'rgba(255,255,255,.65)',lineHeight:1.5}}>{b.text}</span>
                </div>
              ))}
            </div>

            {/* Social proof */}
            <div style={{fontSize:13,color:'rgba(255,255,255,.35)',marginBottom:28,fontStyle:'italic'}}>
              Trusted by top corporate brands in Nepal and internationally.
            </div>

            {/* Offer */}
            <div style={{display:'inline-flex',alignItems:'center',gap:8,background:'rgba(255,149,0,.1)',border:'1px solid rgba(255,149,0,.25)',borderRadius:12,padding:'10px 20px',fontSize:13,color:'#FFB347',fontWeight:600,marginBottom:32}}>
              🎁 First 20-second AI demo video — free for businesses.{' '}
              <span style={{color:'rgba(255,255,255,.3)',fontWeight:400,fontSize:11}}>*Terms apply</span>
            </div>

            {/* CTA */}
            <div>
              <a href="#pricing"
                target="_blank" rel="noreferrer"
                style={{display:'inline-block',background:'linear-gradient(135deg,#DC143C,#FF3366)',color:'#fff',padding:'16px 36px',borderRadius:14,fontSize:15,fontWeight:700,textDecoration:'none',boxShadow:'0 8px 32px rgba(220,20,60,.3)',fontFamily:'Sora,sans-serif',letterSpacing:'-0.2px'}}>
                Cut Your Production Costs Today →
              </a>
            </div>
          </div>

          {/* ── 2×2 VIDEO GRID ── */}
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16}}>
            {[
              {id:'7586270616106388791',url:'https://www.tiktok.com/@meroad.ai/video/7586270616106388791',label:'AI Product Ad'},
              {id:'7571005612088102158',url:'https://www.tiktok.com/@meroad.ai/video/7571005612088102158',label:'AI Brand Video'},
              {id:'7526381188886334734',url:'https://www.tiktok.com/@meroad.ai/video/7526381188886334734',label:'AI Commercial'},
              {id:'7517909753054432525',url:'https://www.tiktok.com/@meroad.ai/video/7517909753054432525',label:'AI Visual Campaign'},
            ].map(v=>(
              <a key={v.id} href={v.url} target="_blank" rel="noreferrer"
                style={{display:'block',textDecoration:'none',position:'relative',borderRadius:16,overflow:'hidden',background:'#1a1a2e',border:'1px solid rgba(255,255,255,.08)',transition:'transform .2s',aspectRatio:'9/16'}}
                onMouseEnter={e=>e.currentTarget.style.transform='translateY(-4px)'}
                onMouseLeave={e=>e.currentTarget.style.transform='translateY(0)'}
              >
                {/* TikTok embed iframe */}
                <iframe
                  src={`https://www.tiktok.com/embed/v2/${v.id}`}
                  style={{width:'100%',height:'100%',border:'none',position:'absolute',inset:0}}
                  allowFullScreen
                  allow="encrypted-media"
                  loading="lazy"
                />
                {/* Overlay label */}
                <div style={{position:'absolute',bottom:0,left:0,right:0,background:'linear-gradient(transparent,rgba(0,0,0,.7)',padding:'20px 14px 14px',pointerEvents:'none'}}>
                  <div style={{display:'flex',alignItems:'center',gap:6}}>
                    <div style={{width:20,height:20,borderRadius:'50%',background:'linear-gradient(135deg,#DC143C,#FF6B8A)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:9,color:'#fff',fontWeight:800,flexShrink:0}}>M</div>
                    <span style={{fontSize:11,color:'rgba(255,255,255,.8)',fontWeight:600}}>@meroad.ai</span>
                  </div>
                </div>
              </a>
            ))}
          </div>

          {/* View all on TikTok */}
          <div style={{textAlign:'center',marginTop:28}}>
            <a href="https://www.tiktok.com/@meroad.ai" target="_blank" rel="noreferrer"
              style={{display:'inline-flex',alignItems:'center',gap:8,background:'rgba(255,255,255,.06)',border:'1px solid rgba(255,255,255,.1)',borderRadius:24,padding:'10px 22px',fontSize:13,fontWeight:600,color:'rgba(255,255,255,.6)',textDecoration:'none'}}>
              View all videos on TikTok →
            </a>
          </div>

        </div>
      </section>


      {/* ══ SEEMA & GEETA PROOF ══ */}
      <section style={{padding:'100px 48px',background:'#fff'}}>
        <div style={{maxWidth:1100,margin:'0 auto',display:'grid',gridTemplateColumns:isMobile?'1fr':'1fr 1fr',gap:isMobile?32:64,alignItems:'center'}}>
          <div>
            <div style={{fontSize:12,fontWeight:700,color:'#DC143C',letterSpacing:'0.1em',textTransform:'uppercase',marginBottom:16}}>Built by creators, for creators</div>
            <h2 style={{fontFamily:'Sora,sans-serif',fontSize:'clamp(24px,3vw,40px)',fontWeight:800,letterSpacing:'-0.8px',marginBottom:20,lineHeight:1.15}}>
              Built by the team behind<br />
              <span style={{color:'#DC143C'}}>@seemaandgeetatwins</span> —<br />
              Nepal's first virtual influencer
            </h2>
            <p style={{fontSize:15,color:'#6e6e73',lineHeight:1.75,marginBottom:40,maxWidth:440}}>
              We didn't build Swor for someone else's problem. We built it because we needed it ourselves, and now we're sharing it with every Nepali creator.
            </p>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12,marginBottom:36}}>
              {[['54M+','Video views'],['91K+','Followers'],['1.6M+','Total likes'],['80K+','Shares']].map(([n,l])=>(
                <div key={n} style={{background:'#f5f5f7',borderRadius:14,padding:'18px 16px'}}>
                  <div style={{fontFamily:'Sora,sans-serif',fontSize:26,fontWeight:800,color:'#1d1d1f',marginBottom:4}}>{n}</div>
                  <div style={{fontSize:12,color:'#999',fontWeight:500}}>{l}</div>
                </div>
              ))}
            </div>
            <a href="#access"><button className="btn-primary">Get free beta access →</button></a>
          </div>
          <div style={{position:'relative'}}>
            <div style={{borderRadius:24,overflow:'hidden',boxShadow:'0 24px 60px rgba(0,0,0,.12)',aspectRatio:'9/16',maxWidth:360,margin:'0 auto'}}>
              <iframe src="https://www.tiktok.com/embed/v2/7625496104615890206" style={{width:'100%',height:'100%',border:'none'}} allowFullScreen allow="encrypted-media" loading="lazy" />
            </div>
            <div style={{marginTop:12,background:'#f5f5f7',borderRadius:12,padding:'12px 16px',display:'flex',alignItems:'center',gap:10}}>
              <div style={{width:9,height:9,borderRadius:'50%',background:'#34C759',flexShrink:0}} />
              <div>
                <div style={{fontSize:13,fontWeight:700,color:'#1d1d1f'}}>@seemaandgeetatwins</div>
                <div style={{fontSize:11,color:'#999'}}>Nepal's first virtual influencer · 54M+ views</div>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* ══ PRICING SECTION ══ */}
      <section id="pricing" style={{padding:isMobile?'60px 16px':'100px 48px',background:'#f5f5f7'}}>
        <div style={{maxWidth:1100,margin:'0 auto'}}>
          <div style={{textAlign:'center',marginBottom:60}}>
            <div style={{fontSize:12,fontWeight:700,color:'#DC143C',letterSpacing:'0.12em',textTransform:'uppercase',marginBottom:12}}>Simple pricing</div>
            <h2 style={{fontFamily:'Sora,sans-serif',fontSize:'clamp(28px,3.5vw,46px)',fontWeight:800,letterSpacing:'-1px',marginBottom:14}}>
              Choose your credit pack
            </h2>
            <p style={{fontSize:16,color:'#6e6e73',maxWidth:520,margin:'0 auto 16px',lineHeight:1.65}}>
              One universal currency for everything — voiceovers, subtitles, and music.
              Credits never expire. Use them however you want.
            </p>
            <div style={{display:'inline-flex',gap:16,background:'#fff',borderRadius:12,padding:'12px 20px',border:'1px solid #e8e8ed',fontSize:13,color:'#555',flexWrap:'wrap',justifyContent:'center'}}>
              <span>🎙️ <strong style={{color:'#1d1d1f'}}>25 credits</strong> = 1 voiceover</span>
              <span style={{color:'#e8e8ed'}}>|</span>
              <span>🎵 <strong style={{color:'#1d1d1f'}}>100 credits</strong> = 30s music</span>
              <span style={{color:'#e8e8ed'}}>|</span>
              <span>🎬 <strong style={{color:'#34C759'}}>Subtitles FREE</strong> always</span>
            </div>
          </div>

          {/* Founders Deal */}
          <div style={{background:'linear-gradient(135deg,#7A5C08 0%,#C9940A 40%,#92700A 100%)',borderRadius:20,padding:'36px 40px',marginBottom:20,position:'relative',overflow:'hidden',border:'1px solid rgba(255,215,0,.4)',boxShadow:'0 8px 40px rgba(201,148,10,.25)'}}>
            <div style={{position:'absolute',top:'-30%',right:'5%',width:400,height:400,borderRadius:'50%',background:'radial-gradient(circle,rgba(220,20,60,.1) 0%,transparent 70%)',pointerEvents:'none'}} />
            <div style={{display:'flex',alignItems:isMobile?'flex-start':'center',flexDirection:isMobile?'column':'row',justifyContent:'space-between',flexWrap:'wrap',gap:24,position:'relative',zIndex:1}}>
              <div>
                <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:12,flexWrap:'wrap'}}>
                  <div style={{background:'#DC143C',color:'#fff',fontSize:11,fontWeight:700,padding:'4px 12px',borderRadius:20,letterSpacing:'0.06em'}}>⚡ FOUNDERS' DEAL</div>
                  <div style={{background:'rgba(255,255,255,.1)',color:'rgba(0,0,0,.5)',fontSize:11,fontWeight:600,padding:'4px 12px',borderRadius:20}}>Limited to first 15 buyers</div>
                </div>
                <div style={{fontFamily:'Sora,sans-serif',fontSize:'clamp(22px,3vw,34px)',fontWeight:800,color:'#fff',letterSpacing:'-0.5px',marginBottom:6}}>
                  Founders' Lifetime Pack
                </div>
             <div style={{fontSize:14,fontWeight:700,color:'rgba(255,255,255,.9)',lineHeight:1.6,maxWidth:480,marginBottom:0}}>
                  Create fearlessly for a full year. 12,500 voiceovers + 50 soundtracks. No subscriptions. No limits.
                </div>
              </div>
         <div style={{textAlign:'center',flexShrink:0,minWidth:240}}>
                <div style={{display:'flex',flexDirection:'column',gap:8,marginBottom:20,textAlign:'left'}}>
                  {['12,500 Swor Credits (Lifetime Pool)','50 Total AI Music Tracks (Lifetime Balance)','Unlimited subtitles forever','Credits never expire','Founders status — forever'].map(f=>(
                    <div key={f} style={{display:'flex',alignItems:'center',gap:8,fontSize:13,fontWeight:700,color:'#fff'}}>
                      <span style={{color:'#34C759',fontWeight:800,fontSize:15}}>✓</span> {f}
                    </div>
                  ))}
                </div>
                <div style={{fontSize:14,fontWeight:700,color:'rgba(0,0,0,.4)',marginBottom:4,textDecoration:'line-through'}}>NPR 5,000</div>
                <div style={{fontFamily:'Sora,sans-serif',fontSize:44,fontWeight:800,color:'#fff',lineHeight:1}}>NPR 2,500</div>
                <div style={{fontSize:15,fontWeight:700,color:'rgba(0,0,0,.55)',marginBottom:20}}>$19.99 USD</div>
                <div style={{display:'flex',flexDirection:'column',gap:8}}>
                  <a href={`https://wa.me/19255379425?text=Hi! I want to buy the Swor AI Founders Lifetime Pack (NPR 2,500 / $19.99 USD). Nepal: eSewa/Khalti. International: PayPal @sworai, Venmo @TwentyfourAS, Zelle AVASHSHRESTHAUSA@GMAIL.COM. Please confirm.`} target="_blank" rel="noreferrer"
                    style={{background:'#25D366',color:'#fff',padding:'12px 24px',borderRadius:10,fontSize:14,fontWeight:700,textDecoration:'none',textAlign:'center'}}>
                    💬 Buy via WhatsApp (NPR)
                  </a>
                  <a href="https://paypal.me/sworai" target="_blank" rel="noreferrer"
                    style={{background:'#003087',color:'#fff',padding:'12px 24px',borderRadius:10,fontSize:14,fontWeight:700,textDecoration:'none',textAlign:'center'}}>
                    💳 Buy via PayPal ($19.99)
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Credit Packs Grid */}
          <div style={{display:'grid',gridTemplateColumns:isMobile?'1fr':'repeat(auto-fit,minmax(280px,1fr))',gap:16,marginBottom:20}}>
            {[
              {key:'starter',name:'Starter Pack',credits:500,bonus:'',npr:499,usd:4.99,popular:false,voice:20,music:5,
               hook:'Your next 2 weeks of video content, sorted. Launch your new channel idea this weekend.'},
              {key:'creator',name:'Creator Value Pack',credits:1100,bonus:'+10% bonus',npr:999,usd:12.99,popular:true,voice:44,music:11,
               hook:'Go daily for a full month. Build your audience with consistent uploads without touching a microphone.'},
            ].map(p=>(
              <div key={p.key} style={{background:'#fff',borderRadius:20,padding:'28px 24px',border:p.popular?'2px solid #DC143C':'1.5px solid #e8e8ed',position:'relative',boxShadow:p.popular?'0 8px 32px rgba(220,20,60,.1)':'none'}}>
                {p.popular&&<div style={{position:'absolute',top:-14,left:'50%',transform:'translateX(-50%)',background:'#DC143C',color:'#fff',fontSize:11,fontWeight:700,padding:'5px 16px',borderRadius:20,whiteSpace:'nowrap',letterSpacing:'0.06em'}}>★ MOST POPULAR</div>}
                <div style={{fontSize:13,fontWeight:700,color:p.popular?'#DC143C':'#6e6e73',marginBottom:8}}>{p.name}</div>
                <div style={{display:'flex',alignItems:'baseline',gap:8,marginBottom:4}}>
                  <div style={{fontFamily:'Sora,sans-serif',fontSize:36,fontWeight:800,color:'#1d1d1f',lineHeight:1}}>NPR {p.npr.toLocaleString()}</div>
                </div>
                <div style={{fontSize:13,color:'#999',marginBottom:4}}>${p.usd} USD</div>
                <div style={{display:'inline-flex',alignItems:'center',gap:6,background:'rgba(52,199,89,.1)',borderRadius:8,padding:'4px 10px',fontSize:12,fontWeight:700,color:'#1A9E6A',marginBottom:20}}>
                  <span>{p.credits.toLocaleString()} Swor Credits</span>
                  {p.bonus&&<span style={{color:'#34C759'}}>{p.bonus}</span>}
                </div>
                <div style={{display:'flex',flexDirection:'column',gap:8,marginBottom:20}}>
                  {[
                    `🎙️ ${p.voice} voiceover generations`,
                    `🎵 ${p.music} music tracks (30s each)`,
                    '🎬 Unlimited subtitle generation',
                    '✓ Credits never expire',
                    '✓ Mix voiceover + music freely',
                  ].map(f=>(
                    <div key={f} style={{fontSize:13,color:'#555'}}>{f}</div>
                  ))}
                </div>
                <div style={{fontSize:13,fontWeight:600,color:'#DC143C',marginBottom:16,background:'rgba(220,20,60,.06)',padding:'8px 12px',borderRadius:8}}>
                  {p.hook}
                </div>
                <div style={{display:'flex',flexDirection:'column',gap:8}}>
                  <a href={`https://wa.me/19255379425?text=Hi! I want to buy the Swor AI ${p.name} (NPR ${p.npr} / $${p.usd} USD). Nepal: eSewa/Khalti. International: PayPal @sworai, Venmo @TwentyfourAS, Zelle AVASHSHRESTHAUSA@GMAIL.COM. Please confirm.`}
                    target="_blank" rel="noreferrer"
                    style={{background:p.popular?'#DC143C':'#1d1d1f',color:'#fff',padding:'11px',borderRadius:10,fontSize:14,fontWeight:600,textDecoration:'none',textAlign:'center',boxShadow:p.popular?'0 4px 16px rgba(220,20,60,.25)':'none'}}>
                    💬 Buy via WhatsApp
                  </a>
                  <a href="https://paypal.me/sworai" target="_blank" rel="noreferrer"
                    style={{background:'#f5f5f7',color:'#1d1d1f',padding:'11px',borderRadius:10,fontSize:14,fontWeight:600,textDecoration:'none',textAlign:'center',border:'1px solid #e8e8ed'}}>
                    💳 PayPal (${p.usd})
                  </a>
                </div>
              </div>
            ))}
          </div>

          {/* Custom Plan */}
          <div style={{background:'linear-gradient(135deg,#1d1d1f 0%,#2d1a2d 100%)',borderRadius:20,padding:'36px 40px',marginBottom:20,border:'1px solid rgba(107,63,190,.3)',position:'relative',overflow:'hidden'}}>
            <div style={{position:'absolute',top:'-30%',left:'5%',width:300,height:300,borderRadius:'50%',background:'radial-gradient(circle,rgba(107,63,190,.1) 0%,transparent 70%)',pointerEvents:'none'}} />
            <div style={{display:'flex',alignItems:'flex-start',justifyContent:'space-between',flexWrap:'wrap',gap:32,position:'relative',zIndex:1}}>
              <div style={{flex:1,minWidth:280}}>
                <div style={{display:'inline-flex',alignItems:'center',gap:8,marginBottom:16}}>
                  <div style={{background:'rgba(107,63,190,.3)',color:'#C084FC',fontSize:11,fontWeight:700,padding:'4px 12px',borderRadius:20,letterSpacing:'0.06em'}}>✦ CUSTOM PLAN</div>
                  <div style={{background:'rgba(255,255,255,.08)',color:'rgba(255,255,255,.5)',fontSize:11,fontWeight:600,padding:'4px 12px',borderRadius:20}}>For agencies & brands</div>
                </div>
                <div style={{fontFamily:'Sora,sans-serif',fontSize:'clamp(20px,2.5vw,30px)',fontWeight:800,color:'#fff',letterSpacing:'-0.3px',marginBottom:8}}>Need more than our standard plans?</div>
                <div style={{fontSize:14,color:'rgba(255,255,255,.5)',lineHeight:1.7,marginBottom:24,maxWidth:420}}>
                  Built for high-volume creators, agencies, and Nepal brands who need a tailored solution.
                </div>
                <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
                  {[
                    {icon:'🎙️',title:'Custom Brand Voice Cloning',desc:"Clone your brand ambassador's voice instantly"},
                    {icon:'⚡',title:'High-Volume Bulk Access',desc:'Generate unlimited content without limits'},
                    {icon:'🚀',title:'Priority Rendering',desc:'Skip the queue for instant generations'},
                    {icon:'👥',title:'Team Access Workspace',desc:'Single credit pool for your entire agency'},
                    {icon:'🧾',title:'Local Invoicing & PAN Billing',desc:'Tax-compliant corporate billing in NPR'},
                    {icon:'💬',title:'Dedicated WhatsApp Support',desc:'VIP troubleshooting via direct chat'},
                  ].map(f=>(
                    <div key={f.title} style={{display:'flex',gap:10,alignItems:'flex-start'}}>
                      <span style={{fontSize:18,flexShrink:0,marginTop:2}}>{f.icon}</span>
                      <div>
                        <div style={{fontSize:13,fontWeight:700,color:'#fff',marginBottom:2}}>{f.title}</div>
                        <div style={{fontSize:11,color:'rgba(255,255,255,.4)',lineHeight:1.5}}>{f.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div style={{display:'flex',flexDirection:'column',gap:10,flexShrink:0,minWidth:200}}>
                <div style={{fontFamily:'Sora,sans-serif',fontSize:28,fontWeight:800,color:'#fff',textAlign:'center',marginBottom:4}}>Let's talk</div>
                <div style={{fontSize:12,color:'rgba(255,255,255,.4)',textAlign:'center',marginBottom:8}}>Custom pricing for your needs</div>
                <a href="https://wa.me/19255379425?text=Hi! I'm interested in a Custom Plan for Swor AI. Can we discuss pricing?" target="_blank" rel="noreferrer"
                  style={{background:'#25D366',color:'#fff',padding:'12px 24px',borderRadius:10,fontSize:14,fontWeight:700,textDecoration:'none',textAlign:'center'}}>
                  💬 WhatsApp Us
                </a>
                <a href="mailto:meroadaiofficial@gmail.com?subject=Custom Plan Inquiry — Swor AI" target="_blank" rel="noreferrer"
                  style={{background:'rgba(255,255,255,.08)',color:'rgba(255,255,255,.8)',border:'1px solid rgba(255,255,255,.15)',padding:'12px 24px',borderRadius:10,fontSize:14,fontWeight:600,textDecoration:'none',textAlign:'center'}}>
                  ✉️ Email Us
                </a>
              </div>
            </div>
          </div>

          {/* Payment Instructions */}
          <div style={{background:'#FFFBF0',borderRadius:16,padding:'28px',border:'2px solid rgba(201,148,10,.25)',textAlign:'center'}}>
            <div style={{fontSize:16,fontWeight:700,color:'#1d1d1f',marginBottom:10}}>How payment works</div>
            <div style={{fontSize:14,color:'#555',lineHeight:1.9,maxWidth:560,margin:'0 auto 16px'}}>
              Click "Buy via WhatsApp" → send your eSewa, Khalti, or IME Pay transfer screenshot →
              credits activated within <strong style={{color:'#1d1d1f'}}>10 minutes</strong>.
              International users pay via PayPal (<a href="https://paypal.me/sworai" style={{color:'#DC143C'}}>@sworai</a>), Venmo (@TwentyfourAS), or Zelle (AVASHSHRESTHAUSA@GMAIL.COM).
            </div>
            <div style={{background:'rgba(255,149,0,.1)',border:'1px solid rgba(255,149,0,.3)',borderRadius:10,padding:'10px 16px',display:'inline-flex',alignItems:'center',gap:8,fontSize:13,color:'#B45309',fontWeight:600,marginBottom:16}}>
              ⏰ Credits activated daily at <strong>8AM and 6PM Nepal time</strong>. WhatsApp for urgent activation.
            </div>
            <div style={{display:'flex',gap:10,justifyContent:'center',flexWrap:'wrap'}}>
              {[{n:'eSewa',c:'#60B843'},{n:'Khalti',c:'#7B3FC4'},{n:'IME Pay',c:'#E8392A'},{n:'Bank Transfer',c:'#1d1d1f'},{n:'PayPal',c:'#003087'},{n:'Venmo',c:'#008CFF'},{n:'Zelle',c:'#6D1ED4'}].map(p=>(
                <span key={p.n} style={{background:'rgba(255,255,255,.8)',border:`1.5px solid ${p.c}`,borderRadius:8,padding:'7px 14px',fontSize:12,fontWeight:700,color:p.c}}>{p.n}</span>
              ))}
            </div>
          </div>
        </div>
      </section>


      {/* ══ APPLICATION FORM ══ */}
      <section id="access" style={{padding:isMobile?'60px 16px':'100px 48px',background:'linear-gradient(160deg,#1d1d1f 0%,#2d1020 100%)',position:'relative',overflow:'hidden'}}>
        <div style={{position:'absolute',top:'-20%',right:'-5%',width:500,height:500,borderRadius:'50%',background:'radial-gradient(circle,rgba(220,20,60,.1) 0%,transparent 70%)',pointerEvents:'none'}} />
        <div style={{maxWidth:600,margin:'0 auto',position:'relative',zIndex:1}}>
          <div style={{textAlign:'center',marginBottom:40}}>
            <div style={{display:'inline-flex',alignItems:'center',gap:6,background:'rgba(220,20,60,.15)',border:'1px solid rgba(220,20,60,.3)',borderRadius:24,padding:'5px 14px',fontSize:12,fontWeight:700,color:'#FF6B8A',marginBottom:24}}>
              🔥 20 beta spots — apply now
            </div>
            <h2 style={{fontFamily:'Sora,sans-serif',fontSize:'clamp(26px,4vw,42px)',fontWeight:800,color:'#fff',letterSpacing:'-1px',marginBottom:14}}>
              Apply for free beta access.
            </h2>
            <p style={{fontSize:15,color:'rgba(255,255,255,.5)',lineHeight:1.7}}>
              Tell us a little about yourself — we review every application personally.
            </p>
          </div>

          {status==='success' ? (
            <div style={{background:'rgba(52,199,89,.08)',border:'1.5px solid rgba(52,199,89,.25)',borderRadius:20,padding:'48px 32px',textAlign:'center'}}>
              <div style={{fontSize:44,marginBottom:16}}>🙏</div>
              <div style={{fontFamily:'Sora,sans-serif',fontSize:22,fontWeight:700,color:'#fff',marginBottom:10}}>Application received!</div>
              <div style={{fontSize:14,color:'rgba(255,255,255,.5)',lineHeight:1.7}}>We review every application personally. Expect a reply within 24 hours.</div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{display:'flex',flexDirection:'column',gap:14}}>

              {/* Row 1: Name + Email */}
              <div style={{display:'grid',gridTemplateColumns:isMobile?'1fr':'1fr 1fr',gap:12}}>
                <div>
                  <label style={{fontSize:11,fontWeight:700,color:'rgba(255,255,255,.4)',letterSpacing:'0.08em',textTransform:'uppercase',display:'block',marginBottom:6}}>Full Name *</label>
                  <input
                    type="text"
                    name="name"
                    placeholder="Sita Sharma"
                    required
                    style={{width:'100%',padding:'13px 16px',borderRadius:10,border:'1.5px solid rgba(255,255,255,.1)',background:'rgba(255,255,255,.06)',color:'#fff',fontSize:14,outline:'none',fontFamily:'inherit'}}
                  />
                </div>
                <div>
                  <label style={{fontSize:11,fontWeight:700,color:'rgba(255,255,255,.4)',letterSpacing:'0.08em',textTransform:'uppercase',display:'block',marginBottom:6}}>Email *</label>
                  <input
                    type="email"
                    name="email"
                    placeholder="you@example.com"
                    required
                    value={email}
                    onChange={e=>setEmail(e.target.value)}
                    style={{width:'100%',padding:'13px 16px',borderRadius:10,border:'1.5px solid rgba(255,255,255,.1)',background:'rgba(255,255,255,.06)',color:'#fff',fontSize:14,outline:'none',fontFamily:'inherit'}}
                  />
                </div>
              </div>

{/* Row 1.5: Phone */}
              <div>
                <label style={{fontSize:11,fontWeight:700,color:'rgba(255,255,255,.4)',letterSpacing:'0.08em',textTransform:'uppercase',display:'block',marginBottom:6}}>Phone / WhatsApp *</label>
                <input
                  type="tel"
                  name="phone"
                  placeholder="+977 98XXXXXXXX"
                  required
                  style={{width:'100%',padding:'13px 16px',borderRadius:10,border:'1.5px solid rgba(255,255,255,.1)',background:'rgba(255,255,255,.06)',color:'#fff',fontSize:14,outline:'none',fontFamily:'inherit'}}
                />
              </div>

              {/* Row 2: Channel/Company */}
              <div>
                <label style={{fontSize:11,fontWeight:700,color:'rgba(255,255,255,.4)',letterSpacing:'0.08em',textTransform:'uppercase',display:'block',marginBottom:6}}>TikTok / YouTube / Company Name</label>
                <input
                  type="text"
                  name="channel_or_company"
                  placeholder="@yourchannel or Company Pvt Ltd"
                  style={{width:'100%',padding:'13px 16px',borderRadius:10,border:'1.5px solid rgba(255,255,255,.1)',background:'rgba(255,255,255,.06)',color:'#fff',fontSize:14,outline:'none',fontFamily:'inherit'}}
                />
              </div>

              {/* Row 3: Content Type */}
              <div>
                <label style={{fontSize:11,fontWeight:700,color:'rgba(255,255,255,.4)',letterSpacing:'0.08em',textTransform:'uppercase',display:'block',marginBottom:8}}>What do you create? *</label>
                <select
                  name="content_type"
                  required
                  style={{width:'100%',padding:'13px 16px',borderRadius:10,border:'1.5px solid rgba(255,255,255,.1)',background:'#2a1a2a',color:'#fff',fontSize:14,outline:'none',fontFamily:'inherit',cursor:'pointer'}}
                >
                  <option value="">Select your content type...</option>
                  <option value="tiktok_reels">TikTok / Instagram Reels creator</option>
                  <option value="youtube">YouTube creator</option>
                  <option value="business_ads">Business owner (product/service ads)</option>
                  <option value="agency">Agency / Production house</option>
                  <option value="ngo_org">NGO / Organization</option>
                  <option value="music">Music / Podcast creator</option>
                  <option value="other">Other</option>
                </select>
              </div>

              {/* Row 4: How did you hear */}
              <div>
                <label style={{fontSize:11,fontWeight:700,color:'rgba(255,255,255,.4)',letterSpacing:'0.08em',textTransform:'uppercase',display:'block',marginBottom:8}}>How did you hear about Swor AI?</label>
                <select
                  name="source"
                  style={{width:'100%',padding:'13px 16px',borderRadius:10,border:'1.5px solid rgba(255,255,255,.1)',background:'#2a1a2a',color:'#fff',fontSize:14,outline:'none',fontFamily:'inherit',cursor:'pointer'}}
                >
                  <option value="">Select...</option>
                  <option value="tiktok">TikTok (@seemaandgeetatwins)</option>
                  <option value="instagram">Instagram</option>
                  <option value="linkedin">LinkedIn</option>
                  <option value="facebook">Facebook</option>
                  <option value="friend">Friend / Word of mouth</option>
                  <option value="google">Google Search</option>
                  <option value="other">Other</option>
                </select>
              </div>

              {/* Row 5: Why do you want access */}
              <div>
                <label style={{fontSize:11,fontWeight:700,color:'rgba(255,255,255,.4)',letterSpacing:'0.08em',textTransform:'uppercase',display:'block',marginBottom:6}}>Why do you want beta access? *</label>
                <textarea
                  name="reason"
                  required
                  placeholder="Tell us what you plan to create with Swor AI (2-3 sentences)..."
                  style={{width:'100%',minHeight:90,padding:'13px 16px',borderRadius:10,border:'1.5px solid rgba(255,255,255,.1)',background:'rgba(255,255,255,.06)',color:'#fff',fontSize:14,outline:'none',fontFamily:'inherit',resize:'vertical',lineHeight:1.6}}
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={status==='loading'}
                className="btn-primary"
                style={{width:'100%',padding:'15px',fontSize:16,opacity:status==='loading'?.7:1,marginTop:4}}
              >
                {status==='loading'?'Submitting...':'Apply for free beta access →'}
              </button>

              {status==='error'&&(
                <p style={{fontSize:13,color:'#FF6B8A',textAlign:'center'}}>
                  Something went wrong. Email us at meroadaiofficial@gmail.com
                </p>
              )}

              <p style={{fontSize:12,color:'rgba(255,255,255,.2)',textAlign:'center',marginTop:4}}>
                No spam. No credit card. We review every application personally.
              </p>
            </form>
          )}
        </div>
      </section>

      {/* ══ FOOTER ══ */}
      <footer style={{padding:'40px 48px',background:'#111',display:'flex',alignItems:'center',justifyContent:'space-between',flexWrap:'wrap',gap:20}}>
        <div>
          <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:5}}>
            <div style={{width:26,height:26,borderRadius:7,background:'linear-gradient(135deg,#DC143C,#FF6B8A)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:11,color:'#fff',fontWeight:800}}>M</div>
            <span style={{fontFamily:'Sora,sans-serif',fontSize:14,fontWeight:700,color:'#fff'}}>MeroAD.ai</span>
          </div>
          <div style={{fontSize:11,color:'rgba(255,255,255,.25)'}}>© 2026 Swor AI · Kathmandu, Nepal</div>
        </div>
        <div style={{display:'flex',gap:8,flexWrap:'wrap'}}>
          {[{l:'Instagram',h:'https://instagram.com/meroadai'},{l:'Facebook',h:'https://facebook.com/meroadai'},{l:'TikTok',h:'https://tiktok.com/@meroadai'},{l:'Contact',h:'mailto:meroadaiofficial@gmail.com'}].map(s=>(
            <a key={s.l} href={s.h} target="_blank" rel="noreferrer" style={{background:'rgba(255,255,255,.06)',border:'1px solid rgba(255,255,255,.08)',borderRadius:8,padding:'7px 14px',fontSize:12,fontWeight:600,color:'rgba(255,255,255,.5)'}}>
              {s.l}
            </a>
          ))}
        </div>
      </footer>
    </>
  )
}
