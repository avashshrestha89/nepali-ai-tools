import Head from 'next/head'
import Link from 'next/link'
import { useState, useEffect } from 'react'

const FORMSPREE_ID = 'YOUR_FORM_ID'

// YouTube video IDs — replace with real IDs when ready
// Example: https://youtube.com/watch?v=XXXXXXXXXXX → ID is XXXXXXXXXXX
const VIDEOS = [
  { id: null, title: 'How to use Swor', label: 'Tutorial' },
  { id: null, title: 'What AI content looks like', label: 'Seema & Geeta' },
  { id: null, title: 'MeroAD.ai Introduction', label: 'About us' },
]

export default function Landing() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState('idle')
  const [scrolled, setScrolled] = useState(false)
  const [isNepali, setIsNepali] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Load Google Translate
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
      if (combo) {
        combo.value = 'ne'
        combo.dispatchEvent(new Event('change'))
        setIsNepali(true)
      }
    } else {
      document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
      document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${window.location.hostname}`
      window.location.reload()
    }
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!email.trim()) return
    setStatus('loading')
    try {
      const res = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ email }),
      })
      setStatus(res.ok ? 'success' : 'error')
    } catch { setStatus('error') }
  }

  return (
    <>
      <Head>
        <title>Swor — Nepali AI Subtitle & Voiceover Generator</title>
        <meta name="description" content="Stop spending hours on Nepali subtitles and voiceovers. Swor generates them in seconds. Nepal's first AI-powered Nepali language tool." />
        <meta name="keywords" content="Nepali subtitle generator, Nepali voiceover AI, AI Nepali voice generator, Nepali caption tool, Nepali content creator tool" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link href="https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800&family=Manrope:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </Head>

      <style>{`
        *{box-sizing:border-box;margin:0;padding:0}
        html{scroll-behavior:smooth}
        body{font-family:'Manrope',sans-serif;background:#fff;color:#1d1d1f;-webkit-font-smoothing:antialiased}
        a{text-decoration:none;color:inherit}

        /* Hide Google Translate toolbar */
        .goog-te-banner-frame{display:none!important}
        .skiptranslate{display:none!important}
        #gt_element{display:none}
        body{top:0!important}

        @keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
        .fu{animation:fadeUp .65s ease both}
        .fu1{animation-delay:.05s}
        .fu2{animation-delay:.15s}
        .fu3{animation-delay:.25s}
        .fu4{animation-delay:.38s}

        .btn-main{background:#DC143C;color:#fff;border:none;padding:15px 36px;border-radius:14px;font-size:16px;font-weight:700;font-family:'Sora',sans-serif;cursor:pointer;transition:transform .15s,box-shadow .15s;box-shadow:0 4px 20px rgba(220,20,60,.25)}
        .btn-main:hover{transform:translateY(-2px);box-shadow:0 8px 32px rgba(220,20,60,.35)}
        .btn-main:active{transform:translateY(0)}
        .btn-ghost{background:#f5f5f7;color:#1d1d1f;border:none;padding:15px 36px;border-radius:14px;font-size:16px;font-weight:600;font-family:'Sora',sans-serif;cursor:pointer;transition:background .15s}
        .btn-ghost:hover{background:#e8e8ed}
        .card-hover{transition:transform .25s,box-shadow .25s}
        .card-hover:hover{transform:translateY(-5px);box-shadow:0 20px 50px rgba(0,0,0,.1)}
        .lang-btn{background:transparent;border:1.5px solid #e0e0e0;border-radius:20px;padding:5px 14px;font-size:12px;font-weight:700;cursor:pointer;transition:all .15s;font-family:'Sora',sans-serif;color:#555}
        .lang-btn:hover{border-color:#DC143C;color:#DC143C}
        .lang-btn.active{background:#DC143C;border-color:#DC143C;color:#fff}
        .email-input{width:100%;padding:16px 20px;border:2px solid #e8e8ed;border-radius:14px;font-size:16px;font-family:'Manrope',sans-serif;color:#1d1d1f;outline:none;transition:border-color .2s}
        .email-input:focus{border-color:#DC143C}
        .video-placeholder{background:linear-gradient(145deg,#1d1d1f,#2d2d2f);border-radius:16px;overflow:hidden;aspect-ratio:16/9;display:flex;flex-direction:column;align-items:center;justify-content:center;position:relative;cursor:pointer}
      `}</style>

      {/* Hidden Google Translate element */}
      <div id="gt_element" />

      {/* ══════════════ NAV ══════════════ */}
      <nav style={{
        position:'fixed',top:0,left:0,right:0,zIndex:200,
        background: scrolled ? 'rgba(255,255,255,0.9)' : 'transparent',
        backdropFilter: scrolled ? 'blur(20px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(0,0,0,.06)' : 'none',
        transition:'all .3s',padding:'0 32px',height:62,
        display:'flex',alignItems:'center',justifyContent:'space-between',
      }}>
        <Link href="/" style={{display:'flex',alignItems:'center',gap:8}}>
          <div style={{width:30,height:30,borderRadius:8,background:'linear-gradient(135deg,#DC143C,#FF6B8A)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:13,color:'#fff',fontWeight:800}}>M</div>
          <span style={{fontSize:16,fontWeight:700,fontFamily:'Sora,sans-serif',letterSpacing:'-0.3px'}}>MeroAD.ai</span>
        </Link>

        <div style={{display:'flex',alignItems:'center',gap:12}}>
          <button
            onClick={toggleLanguage}
            className={`lang-btn ${isNepali ? 'active' : ''}`}
          >
            {isNepali ? 'English' : 'नेपाली'}
          </button>
          <Link href="/tool">
            <button className="btn-main" style={{padding:'9px 22px',fontSize:14}}>Try Tool →</button>
          </Link>
        </div>
      </nav>

      {/* ══════════════ SECTION 1 — HERO ══════════════ */}
      <section style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',padding:'120px 24px 80px',background:'#fff',textAlign:'center',position:'relative',overflow:'hidden'}}>
        <div style={{position:'absolute',top:'10%',left:'50%',transform:'translateX(-50%)',width:700,height:700,borderRadius:'50%',background:'radial-gradient(circle,rgba(220,20,60,.05) 0%,transparent 65%)',pointerEvents:'none'}} />

        <div style={{maxWidth:760,position:'relative',zIndex:1}}>
          <div className="fu" style={{display:'inline-flex',alignItems:'center',gap:6,background:'#FFF0F3',border:'1px solid rgba(220,20,60,.2)',borderRadius:24,padding:'6px 16px',fontSize:12,fontWeight:700,color:'#DC143C',marginBottom:32,letterSpacing:'0.04em'}}>
            🇳🇵 &nbsp;FREE BETA — 20 SPOTS ONLY
          </div>

          <h1 className="fu fu1" style={{fontFamily:'Sora,sans-serif',fontSize:'clamp(38px,5.5vw,70px)',fontWeight:800,lineHeight:1.06,letterSpacing:'-2px',marginBottom:24,color:'#1d1d1f'}}>
            Your Nepali videos<br />
            <span style={{position:'relative',display:'inline-block'}}>
              deserve better.
              <svg style={{position:'absolute',bottom:-6,left:0,width:'100%'}} height="8" viewBox="0 0 400 8" preserveAspectRatio="none">
                <path d="M0,6 Q100,0 200,6 Q300,12 400,6" stroke="#DC143C" strokeWidth="3" fill="none" strokeLinecap="round"/>
              </svg>
            </span>
          </h1>

          <p className="fu fu2" style={{fontSize:19,color:'#6e6e73',maxWidth:560,margin:'0 auto 16px',lineHeight:1.7,fontWeight:400}}>
            Right now, adding Nepali subtitles and voiceovers to your videos takes hours.
          </p>
          <p className="fu fu3" style={{fontSize:19,color:'#1d1d1f',maxWidth:500,margin:'0 auto 48px',lineHeight:1.7,fontWeight:600}}>
            Swor does it in seconds — so you can focus on what you do best: creating.
          </p>

          <div className="fu fu4" style={{display:'flex',gap:12,justifyContent:'center',flexWrap:'wrap'}}>
            <a href="#access"><button className="btn-main">Get free access</button></a>
            <Link href="/tool"><button className="btn-ghost">Try the tool first</button></Link>
          </div>
        </div>
      </section>

      {/* ══════════════ SECTION 2 — BEFORE / AFTER ══════════════ */}
      <section style={{padding:'100px 24px',background:'#f5f5f7'}}>
        <div style={{maxWidth:1000,margin:'0 auto'}}>
          <div style={{textAlign:'center',marginBottom:60}}>
            <h2 style={{fontFamily:'Sora,sans-serif',fontSize:'clamp(28px,3.5vw,46px)',fontWeight:800,letterSpacing:'-1px',marginBottom:14}}>Sound familiar?</h2>
            <p style={{fontSize:17,color:'#6e6e73',maxWidth:460,margin:'0 auto',lineHeight:1.65}}>Here's what making Nepali content looks like before and after Swor.</p>
          </div>

          <div style={{display:'grid',gridTemplateColumns:'1fr auto 1fr',gap:20,alignItems:'stretch'}}>
            {/* BEFORE */}
            <div style={{background:'#fff',borderRadius:20,padding:'36px 32px',border:'1.5px solid #e8e8ed'}}>
              <div style={{fontSize:13,fontWeight:700,color:'#999',letterSpacing:'0.1em',textTransform:'uppercase',marginBottom:24,display:'flex',alignItems:'center',gap:8}}>
                <span style={{width:8,height:8,borderRadius:'50%',background:'#e8e8ed',display:'inline-block'}} />
                Before Swor
              </div>
              {[
                ['😩','Hours typing subtitles manually — every single video'],
                ['💸','Hiring a studio or voice artist for Nepali narration'],
                ['😤','Inconsistent quality — never sounds professional'],
                ['📉','Losing Nepali-speaking viewers because of no captions'],
                ['🕐','Delaying your upload because editing takes too long'],
              ].map(([icon,text])=>(
                <div key={text} style={{display:'flex',gap:12,alignItems:'flex-start',marginBottom:18}}>
                  <span style={{fontSize:20,flexShrink:0,marginTop:2}}>{icon}</span>
                  <span style={{fontSize:14,color:'#6e6e73',lineHeight:1.6}}>{text}</span>
                </div>
              ))}
            </div>

            {/* DIVIDER */}
            <div style={{display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:8,padding:'0 8px'}}>
              <div style={{width:1,flex:1,background:'#e8e8ed'}} />
              <div style={{width:36,height:36,borderRadius:'50%',background:'#DC143C',display:'flex',alignItems:'center',justifyContent:'center',color:'#fff',fontSize:14,fontWeight:700,flexShrink:0}}>→</div>
              <div style={{width:1,flex:1,background:'#e8e8ed'}} />
            </div>

            {/* AFTER */}
            <div style={{background:'linear-gradient(145deg,#fff8f8,#fff)',borderRadius:20,padding:'36px 32px',border:'1.5px solid rgba(220,20,60,.15)'}}>
              <div style={{fontSize:13,fontWeight:700,color:'#DC143C',letterSpacing:'0.1em',textTransform:'uppercase',marginBottom:24,display:'flex',alignItems:'center',gap:8}}>
                <span style={{width:8,height:8,borderRadius:'50%',background:'#DC143C',display:'inline-block'}} />
                With Swor
              </div>
              {[
                ['⚡','Nepali subtitles generated in under 60 seconds'],
                ['🎙️','Natural AI Nepali voiceover — download in 10 seconds'],
                ['✨','Consistent professional quality — every time'],
                ['📈','Reach your full Nepali-speaking audience with captions'],
                ['🚀','Upload on time — editing no longer slows you down'],
              ].map(([icon,text])=>(
                <div key={text} style={{display:'flex',gap:12,alignItems:'flex-start',marginBottom:18}}>
                  <span style={{fontSize:20,flexShrink:0,marginTop:2}}>{icon}</span>
                  <span style={{fontSize:14,color:'#1d1d1f',lineHeight:1.6,fontWeight:500}}>{text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════ SECTION 3 — VIDEO SLOTS ══════════════ */}
      <section style={{padding:'100px 24px',background:'#fff'}}>
        <div style={{maxWidth:1100,margin:'0 auto'}}>
          <div style={{textAlign:'center',marginBottom:60}}>
            <h2 style={{fontFamily:'Sora,sans-serif',fontSize:'clamp(28px,3.5vw,46px)',fontWeight:800,letterSpacing:'-1px',marginBottom:14}}>See it in action</h2>
            <p style={{fontSize:17,color:'#6e6e73',maxWidth:440,margin:'0 auto',lineHeight:1.65}}>Watch how Nepali creators are using Swor to save hours every week.</p>
          </div>

          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(300px,1fr))',gap:20}}>
            {VIDEOS.map((v,i)=>(
              <div key={i} className="card-hover" style={{borderRadius:16,overflow:'hidden',border:'1.5px solid #e8e8ed'}}>
                <div className="video-placeholder">
                  {v.id ? (
                    <iframe
                      width="100%" height="100%"
                      src={`https://www.youtube.com/embed/${v.id}`}
                      title={v.title}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      style={{position:'absolute',inset:0,width:'100%',height:'100%'}}
                    />
                  ) : (
                    <>
                      <div style={{position:'absolute',inset:0,background:'linear-gradient(145deg,#1a1a2e,#0e0e16)'}} />
                      <div style={{position:'relative',zIndex:1,textAlign:'center',padding:24}}>
                        <div style={{width:56,height:56,borderRadius:'50%',background:'rgba(220,20,60,.2)',border:'2px solid rgba(220,20,60,.3)',display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 16px',fontSize:20}}>▶</div>
                        <div style={{fontSize:13,fontWeight:600,color:'rgba(255,255,255,.4)',letterSpacing:'0.06em',textTransform:'uppercase',marginBottom:6}}>Coming soon</div>
                        <div style={{fontSize:15,fontWeight:600,color:'rgba(255,255,255,.7)'}}>{v.title}</div>
                      </div>
                    </>
                  )}
                </div>
                <div style={{padding:'16px 20px',background:'#fff'}}>
                  <div style={{fontSize:11,fontWeight:700,color:'#DC143C',letterSpacing:'0.08em',textTransform:'uppercase',marginBottom:4}}>{v.label}</div>
                  <div style={{fontSize:14,fontWeight:600,color:'#1d1d1f'}}>{v.title}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════ SECTION 4 — SOCIAL PROOF ══════════════ */}
      <section style={{padding:'80px 24px',background:'#1d1d1f'}}>
        <div style={{maxWidth:900,margin:'0 auto',textAlign:'center'}}>
          <p style={{fontSize:14,color:'rgba(255,255,255,.4)',fontWeight:600,letterSpacing:'0.08em',textTransform:'uppercase',marginBottom:16}}>Built by the team behind</p>
          <h2 style={{fontFamily:'Sora,sans-serif',fontSize:'clamp(22px,3vw,36px)',fontWeight:700,color:'#fff',marginBottom:48,letterSpacing:'-0.5px'}}>@seemaandgeetatwins — Nepal's first AI virtual influencer</h2>

          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(180px,1fr))',gap:1,background:'rgba(255,255,255,.06)',borderRadius:16,overflow:'hidden',marginBottom:48}}>
            {[
              ['51M+','Total video views'],
              ['85K+','TikTok followers'],
              ['1.6M+','Total likes'],
              ['80K+','Video shares'],
            ].map(([n,l])=>(
              <div key={n} style={{padding:'28px 20px',textAlign:'center',background:'rgba(255,255,255,.02)'}}>
                <div style={{fontFamily:'Sora,sans-serif',fontSize:28,fontWeight:800,color:'#fff',marginBottom:6}}>{n}</div>
                <div style={{fontSize:12,color:'rgba(255,255,255,.4)',fontWeight:500}}>{l}</div>
              </div>
            ))}
          </div>

          <p style={{fontSize:16,color:'rgba(255,255,255,.5)',maxWidth:520,margin:'0 auto',lineHeight:1.75}}>
            We know what Nepali content creation takes. We built Swor because we needed it ourselves — and now we're making it available to every Nepali creator.
          </p>
        </div>
      </section>

      {/* ══════════════ SECTION 5 — ACCESS FORM ══════════════ */}
      <section id="access" style={{padding:'100px 24px',background:'#fff'}}>
        <div style={{maxWidth:520,margin:'0 auto',textAlign:'center'}}>
          <div style={{display:'inline-flex',alignItems:'center',gap:6,background:'#FFF0F3',border:'1px solid rgba(220,20,60,.2)',borderRadius:24,padding:'5px 14px',fontSize:12,fontWeight:700,color:'#DC143C',marginBottom:28,letterSpacing:'0.04em'}}>
            🔥 20 spots — apply now
          </div>
          <h2 style={{fontFamily:'Sora,sans-serif',fontSize:'clamp(28px,4vw,46px)',fontWeight:800,letterSpacing:'-1px',marginBottom:14}}>
            Get your free access.
          </h2>
          <p style={{fontSize:17,color:'#6e6e73',marginBottom:40,lineHeight:1.65}}>
            Enter your email. We'll review your request and send a private access link within 24 hours.
          </p>

          {status === 'success' ? (
            <div style={{background:'#F0FBF4',border:'1.5px solid rgba(52,199,89,.25)',borderRadius:20,padding:'48px 32px'}}>
              <div style={{fontSize:44,marginBottom:16}}>🙏</div>
              <div style={{fontFamily:'Sora,sans-serif',fontSize:20,fontWeight:700,marginBottom:8}}>You're on the list!</div>
              <div style={{fontSize:14,color:'#6e6e73',lineHeight:1.7}}>Check your email within 24 hours for your private access link. Thank you for your interest in Swor.</div>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div style={{display:'flex',gap:10,marginBottom:12,flexWrap:'wrap'}}>
                <input
                  type="email"
                  placeholder="your@email.com"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="email-input"
                  style={{flex:1,minWidth:220}}
                />
                <button type="submit" disabled={status==='loading'} className="btn-main" style={{padding:'16px 28px',whiteSpace:'nowrap'}}>
                  {status==='loading' ? 'Sending...' : 'Get free access →'}
                </button>
              </div>
              {status==='error' && <p style={{fontSize:13,color:'#DC143C'}}>Something went wrong. Email us at meroadaiofficial@gmail.com</p>}
              <p style={{fontSize:12,color:'#aaa',marginTop:12}}>No spam. No credit card. Cancel anytime.</p>
            </form>
          )}
        </div>
      </section>

      {/* ══════════════ FOOTER ══════════════ */}
      <footer style={{padding:'48px 24px 32px',background:'#1d1d1f'}}>
        <div style={{maxWidth:900,margin:'0 auto'}}>
          <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',flexWrap:'wrap',gap:24,marginBottom:32,paddingBottom:32,borderBottom:'1px solid rgba(255,255,255,.08)'}}>
            <div>
              <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:6}}>
                <div style={{width:28,height:28,borderRadius:7,background:'linear-gradient(135deg,#DC143C,#FF6B8A)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:12,color:'#fff',fontWeight:800}}>M</div>
                <span style={{fontFamily:'Sora,sans-serif',fontSize:15,fontWeight:700,color:'#fff'}}>MeroAD.ai</span>
              </div>
              <p style={{fontSize:12,color:'rgba(255,255,255,.35)',maxWidth:260,lineHeight:1.6}}>AI-powered advertisements and commercial content for Nepal brands.</p>
            </div>
            <div style={{display:'flex',gap:10,flexWrap:'wrap'}}>
              {[
                {l:'Instagram',h:'https://instagram.com/meroadai'},
                {l:'Facebook',h:'https://facebook.com/meroadai'},
                {l:'TikTok',h:'https://tiktok.com/@meroadai'},
                {l:'Contact',h:'mailto:meroadaiofficial@gmail.com'},
              ].map(s=>(
                <a key={s.l} href={s.h} target="_blank" rel="noreferrer"
                  style={{background:'rgba(255,255,255,.07)',border:'1px solid rgba(255,255,255,.1)',borderRadius:8,padding:'8px 16px',fontSize:12,fontWeight:600,color:'rgba(255,255,255,.6)',transition:'color .15s'}}
                  onMouseOver={e=>e.currentTarget.style.color='#fff'} onMouseOut={e=>e.currentTarget.style.color='rgba(255,255,255,.6)'}>
                  {s.l}
                </a>
              ))}
            </div>
          </div>
          <div style={{fontSize:11,color:'rgba(255,255,255,.2)',textAlign:'center'}}>
            © 2026 Swor by MeroAD.ai · Kathmandu, Nepal · meroadaiofficial@gmail.com
          </div>
        </div>
      </footer>
    </>
  )
}
