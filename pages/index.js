import Head from 'next/head'
import Link from 'next/link'
import { useState, useEffect } from 'react'

const FORMSPREE_ID = 'YOUR_FORM_ID'

export default function Landing() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', type: '', usecase: '', source: '' })
  const [status, setStatus] = useState('idle')
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  async function handleSubmit(e) {
    e.preventDefault()
    setStatus('loading')
    try {
      const res = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(form),
      })
      setStatus(res.ok ? 'success' : 'error')
    } catch { setStatus('error') }
  }

  return (
    <>
      <Head>
        <title>Swor — AI Nepali Subtitles & Voiceover by MeroAD.ai</title>
        <meta name="description" content="Generate accurate Nepali subtitles and natural AI voiceovers in seconds. Nepal's first AI-powered Nepali language content tool. Free beta — 20 spots only." />
        <meta name="keywords" content="Nepali subtitle generator, Nepali voiceover AI, Nepali AI tools, Nepal content creator tools, Nepali caption generator, AI Nepali voice" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link href="https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&family=Manrope:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </Head>

      <style>{`
        *{box-sizing:border-box;margin:0;padding:0}
        html{scroll-behavior:smooth}
        body{font-family:'Manrope',sans-serif;background:#fff;color:#1d1d1f;-webkit-font-smoothing:antialiased}
        a{text-decoration:none;color:inherit}
        ::selection{background:#DC143C22}

        @keyframes fadeUp{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)}}
        @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-12px)}}
        @keyframes shimmer{0%{background-position:200% center}100%{background-position:-200% center}}

        .fade-up{animation:fadeUp .7s ease both}
        .fade-up-1{animation-delay:.1s}
        .fade-up-2{animation-delay:.2s}
        .fade-up-3{animation-delay:.3s}
        .fade-up-4{animation-delay:.45s}

        .feature-card{transition:transform .3s ease,box-shadow .3s ease}
        .feature-card:hover{transform:translateY(-6px);box-shadow:0 24px 60px rgba(0,0,0,.12)}
        .cta-btn{transition:transform .15s ease,box-shadow .15s ease,background .15s ease}
        .cta-btn:hover{transform:translateY(-2px);box-shadow:0 8px 30px rgba(220,20,60,.35)}
        .cta-btn:active{transform:translateY(0)}
        .ghost-btn{transition:background .15s,color .15s}
        .ghost-btn:hover{background:#f5f5f7}
        .nav-link{position:relative;transition:color .15s}
        .nav-link::after{content:'';position:absolute;bottom:-2px;left:0;width:0;height:1.5px;background:#DC143C;transition:width .2s}
        .nav-link:hover::after{width:100%}
        .form-input:focus{border-color:#DC143C!important;box-shadow:0 0 0 3px rgba(220,20,60,.1)!important;outline:none}
        .step-card{transition:transform .25s,box-shadow .25s}
        .step-card:hover{transform:translateY(-4px);box-shadow:0 12px 40px rgba(0,0,0,.08)}
      `}</style>

      {/* ── NAV ── */}
      <nav style={{
        position:'fixed',top:0,left:0,right:0,zIndex:200,
        background: scrolled ? 'rgba(255,255,255,0.85)' : 'transparent',
        backdropFilter: scrolled ? 'blur(20px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(0,0,0,.06)' : 'none',
        transition:'all .3s ease',
        padding:'0 32px',height:60,
        display:'flex',alignItems:'center',justifyContent:'space-between',
      }}>
        <Link href="/" style={{display:'flex',alignItems:'center',gap:8,textDecoration:'none'}}>
          <div style={{width:30,height:30,borderRadius:8,background:'linear-gradient(135deg,#DC143C,#FF6B8A)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:13,color:'#fff',fontWeight:800}}>M</div>
          <span style={{fontSize:16,fontWeight:700,fontFamily:'Sora,sans-serif',letterSpacing:'-0.3px',color:'#1d1d1f'}}>MeroAD.ai</span>
        </Link>
        <div style={{display:'flex',alignItems:'center',gap:24}}>
          <a href="#features" className="nav-link" style={{fontSize:13,fontWeight:500,color:'#333'}}>Features</a>
          <a href="#how-it-works" className="nav-link" style={{fontSize:13,fontWeight:500,color:'#333'}}>How it works</a>
          <a href="#apply" className="nav-link" style={{fontSize:13,fontWeight:500,color:'#333'}}>Apply</a>
          <Link href="/tool" style={{fontSize:13,fontWeight:600,padding:'7px 18px',borderRadius:20,background:'#DC143C',color:'#fff',letterSpacing:'0.01em'}}>Try Tool →</Link>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section style={{minHeight:'100vh',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',padding:'120px 24px 80px',textAlign:'center',background:'#fff',position:'relative',overflow:'hidden'}}>
        {/* background blobs */}
        <div style={{position:'absolute',top:'-10%',right:'-5%',width:600,height:600,borderRadius:'50%',background:'radial-gradient(circle,rgba(220,20,60,.06) 0%,transparent 70%)',pointerEvents:'none'}} />
        <div style={{position:'absolute',bottom:'-10%',left:'-5%',width:500,height:500,borderRadius:'50%',background:'radial-gradient(circle,rgba(107,63,190,.05) 0%,transparent 70%)',pointerEvents:'none'}} />
        <div style={{position:'absolute',top:'40%',left:'10%',width:300,height:300,borderRadius:'50%',background:'radial-gradient(circle,rgba(26,158,106,.04) 0%,transparent 70%)',pointerEvents:'none'}} />

        <div className="fade-up" style={{display:'inline-flex',alignItems:'center',gap:8,background:'linear-gradient(90deg,#FFF0F3,#FFF5E6)',border:'1px solid rgba(220,20,60,.15)',borderRadius:24,padding:'6px 16px 6px 8px',fontSize:12,fontWeight:600,color:'#DC143C',marginBottom:28,letterSpacing:'0.02em'}}>
          <span style={{background:'#DC143C',color:'#fff',borderRadius:16,padding:'2px 8px',fontSize:10,fontWeight:700}}>NEW</span>
          Nepal's First AI Nepali Language Tool
        </div>

        <h1 className="fade-up fade-up-1" style={{fontFamily:'Sora,sans-serif',fontSize:'clamp(42px,6vw,76px)',fontWeight:800,lineHeight:1.04,letterSpacing:'-2px',marginBottom:24,maxWidth:820}}>
          Nepali Subtitles.<br />
          <span style={{background:'linear-gradient(135deg,#DC143C 0%,#FF6B8A 50%,#FF9966 100%)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',backgroundClip:'text',backgroundSize:'200%',animation:'shimmer 4s linear infinite'}}>AI Voiceover.</span><br />
          <span style={{color:'#1d1d1f'}}>In Seconds.</span>
        </h1>

        <p className="fade-up fade-up-2" style={{fontSize:19,color:'#6e6e73',maxWidth:580,margin:'0 auto 44px',lineHeight:1.65,fontWeight:400}}>
          The first AI that generates <strong style={{color:'#1d1d1f',fontWeight:700}}>natural Nepali voiceovers</strong> from text — accurately, in seconds.
          Plus automatic Nepali subtitle generation. Built exclusively for Nepali creators and brands.
        </p>

        <div className="fade-up fade-up-3" style={{display:'flex',gap:12,justifyContent:'center',flexWrap:'wrap',marginBottom:64}}>
          <a href="#apply" className="cta-btn" style={{background:'#DC143C',color:'#fff',padding:'14px 32px',borderRadius:14,fontSize:16,fontWeight:700,fontFamily:'Sora,sans-serif',display:'inline-flex',alignItems:'center',gap:8,boxShadow:'0 4px 20px rgba(220,20,60,.25)'}}>
            Apply for Free Beta
          </a>
          <Link href="/tool" className="ghost-btn" style={{background:'#f5f5f7',color:'#1d1d1f',padding:'14px 32px',borderRadius:14,fontSize:16,fontWeight:600,display:'inline-flex',alignItems:'center',gap:8}}>
            Try the Tool
          </Link>
        </div>

        <div className="fade-up fade-up-4" style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:1,background:'#e8e8ed',borderRadius:16,overflow:'hidden',maxWidth:600,width:'100%'}}>
          {[['51M+','Total views'],['85K+','Followers'],['🇳🇵 First','AI Nepali tool'],['20','Beta spots']].map(([n,l])=>(
            <div key={n} style={{background:'#f5f5f7',padding:'20px 16px',textAlign:'center'}}>
              <div style={{fontFamily:'Sora,sans-serif',fontSize:22,fontWeight:700,color:'#1d1d1f',lineHeight:1}}>{n}</div>
              <div style={{fontSize:11,color:'#6e6e73',marginTop:4,fontWeight:500}}>{l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section id="features" style={{padding:'100px 24px',background:'#f5f5f7'}}>
        <div style={{maxWidth:1100,margin:'0 auto'}}>
          <div style={{textAlign:'center',marginBottom:64}}>
            <div style={{fontSize:12,fontWeight:700,color:'#DC143C',letterSpacing:'0.12em',textTransform:'uppercase',marginBottom:12}}>Two powerful tools</div>
            <h2 style={{fontFamily:'Sora,sans-serif',fontSize:'clamp(32px,4vw,52px)',fontWeight:800,letterSpacing:'-1px',lineHeight:1.08}}>Everything you need for<br />Nepali content.</h2>
          </div>

          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(340px,1fr))',gap:20}}>
            {/* Subtitle card */}
            <div className="feature-card" style={{background:'linear-gradient(145deg,#FF3B5C 0%,#DC143C 100%)',borderRadius:24,padding:'44px 36px',color:'#fff',position:'relative',overflow:'hidden'}}>
              <div style={{position:'absolute',top:-30,right:-30,width:180,height:180,borderRadius:'50%',background:'rgba(255,255,255,.08)'}} />
              <div style={{position:'absolute',bottom:-20,right:20,width:100,height:100,borderRadius:'50%',background:'rgba(255,255,255,.05)'}} />
              <div style={{fontSize:44,marginBottom:20}}>🎬</div>
              <h3 style={{fontFamily:'Sora,sans-serif',fontSize:26,fontWeight:700,marginBottom:14,letterSpacing:'-0.5px'}}>Nepali Subtitle Generator</h3>
              <p style={{fontSize:15,opacity:.85,lineHeight:1.7,marginBottom:28}}>Upload your video or audio. Our AI transcribes and generates perfectly timed Nepali subtitles — ready to drop into CapCut, TikTok, or YouTube.</p>
              <div style={{display:'flex',flexDirection:'column',gap:10}}>
                {['✓ Devanagari & Romanized Nepali','✓ Timestamped .SRT file','✓ Works with MP4, MOV, MP3, WAV','✓ Unlimited during beta'].map(p=>(
                  <div key={p} style={{fontSize:13,fontWeight:500,opacity:.9}}>{p}</div>
                ))}
              </div>
            </div>

            {/* Voiceover card */}
            <div className="feature-card" style={{background:'linear-gradient(145deg,#5B2EB3 0%,#3B0D8F 100%)',borderRadius:24,padding:'44px 36px',color:'#fff',position:'relative',overflow:'hidden'}}>
              <div style={{position:'absolute',top:-30,right:-30,width:180,height:180,borderRadius:'50%',background:'rgba(255,255,255,.08)'}} />
              <div style={{position:'absolute',bottom:-20,right:20,width:100,height:100,borderRadius:'50%',background:'rgba(255,255,255,.05)'}} />
              <div style={{fontSize:44,marginBottom:20}}>🎙️</div>
              <h3 style={{fontFamily:'Sora,sans-serif',fontSize:26,fontWeight:700,marginBottom:14,letterSpacing:'-0.5px'}}>Nepali Voiceover Generator</h3>
              <p style={{fontSize:15,opacity:.85,lineHeight:1.7,marginBottom:28}}>Type your Nepali text and choose a voice. Get a natural, expressive Nepali AI voiceover downloaded as MP3 — ready for any video project.</p>
              <div style={{display:'flex',flexDirection:'column',gap:10}}>
                {['✓ 5 premium Nepali voices','✓ Natural, expressive speech','✓ MP3 download + preview','✓ Powered by ElevenLabs AI'].map(p=>(
                  <div key={p} style={{fontSize:13,fontWeight:500,opacity:.9}}>{p}</div>
                ))}
              </div>
              <div style={{marginTop:20,display:'inline-block',background:'rgba(255,255,255,.12)',border:'1px solid rgba(255,255,255,.2)',borderRadius:20,padding:'4px 12px',fontSize:11,fontWeight:600,opacity:.8}}>
                Beta users get 5,000 free characters
              </div>
            </div>

            {/* MeroAD.ai services card — full width */}
            <div className="feature-card" style={{background:'linear-gradient(135deg,#0E0E16 0%,#1A0A1A 100%)',borderRadius:24,padding:'44px 40px',color:'#fff',gridColumn:'1 / -1',display:'flex',alignItems:'center',justifyContent:'space-between',flexWrap:'wrap',gap:32,position:'relative',overflow:'hidden'}}>
              <div style={{position:'absolute',top:'-30%',right:'5%',width:320,height:320,borderRadius:'50%',background:'radial-gradient(circle,rgba(220,20,60,.12) 0%,transparent 70%)',pointerEvents:'none'}} />
              <div style={{position:'absolute',bottom:'-30%',right:'25%',width:200,height:200,borderRadius:'50%',background:'radial-gradient(circle,rgba(107,63,190,.1) 0%,transparent 70%)',pointerEvents:'none'}} />
              <div style={{maxWidth:500,position:'relative',zIndex:1}}>
                <div style={{display:'inline-flex',alignItems:'center',gap:6,background:'rgba(220,20,60,.15)',border:'1px solid rgba(220,20,60,.3)',borderRadius:20,padding:'4px 12px',fontSize:11,fontWeight:700,color:'#FF6B8A',marginBottom:18,letterSpacing:'0.06em'}}>
                  POWERED BY MEROAD.AI
                </div>
                <h3 style={{fontFamily:'Sora,sans-serif',fontSize:28,fontWeight:800,marginBottom:14,letterSpacing:'-0.5px',lineHeight:1.15}}>Need AI-powered ads &amp; commercials for your brand?</h3>
                <p style={{fontSize:15,opacity:.65,lineHeight:1.75,marginBottom:0}}>MeroAD.ai creates full-scale AI-produced advertisements, product videos, and commercial content for Nepal brands — from concept to final delivery.</p>
              </div>
              <div style={{display:'flex',flexDirection:'column',gap:10,position:'relative',zIndex:1}}>
                {[
                  {label:'Instagram',href:'https://instagram.com/meroadai',bg:'#E1306C'},
                  {label:'Facebook',href:'https://facebook.com/meroadai',bg:'#1877F2'},
                  {label:'TikTok',href:'https://tiktok.com/@meroadai',bg:'rgba(255,255,255,.15)'},
                  {label:'DM for inquiries',href:'mailto:meroadaiofficial@gmail.com',bg:'#DC143C'},
                ].map(s=>(
                  <a key={s.label} href={s.href} target="_blank" rel="noreferrer"
                    style={{background:s.bg,color:'#fff',borderRadius:10,padding:'10px 22px',fontSize:13,fontWeight:600,textDecoration:'none',textAlign:'center',border:'1px solid rgba(255,255,255,.1)',transition:'opacity .15s',minWidth:180}}
                    onMouseOver={e=>e.currentTarget.style.opacity='.8'} onMouseOut={e=>e.currentTarget.style.opacity='1'}>
                    {s.label}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="how-it-works" style={{padding:'100px 24px',background:'#fff'}}>
        <div style={{maxWidth:900,margin:'0 auto'}}>
          <div style={{textAlign:'center',marginBottom:64}}>
            <div style={{fontSize:12,fontWeight:700,color:'#DC143C',letterSpacing:'0.12em',textTransform:'uppercase',marginBottom:12}}>Simple process</div>
            <h2 style={{fontFamily:'Sora,sans-serif',fontSize:'clamp(32px,4vw,52px)',fontWeight:800,letterSpacing:'-1px'}}>How the beta works</h2>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(240px,1fr))',gap:20}}>
            {[
              {n:'01',icon:'📝',color:'#DC143C',bg:'#FFF0F3',title:'Apply below',desc:'Fill the short form. Tell us who you are and how you plan to use Swor. Takes 60 seconds.'},
              {n:'02',icon:'✅',color:'#007AFF',bg:'#F0F7FF',title:'Get approved',desc:'We review every application and notify approved users within 24 hours via a private email link.'},
              {n:'03',icon:'🚀',color:'#34C759',bg:'#F0FBF4',title:'Use it free',desc:'Full access to both tools — subtitle generator and voiceover — free for the entire beta period.'},
            ].map(s=>(
              <div key={s.n} className="step-card" style={{background:s.bg,borderRadius:20,padding:'36px 28px'}}>
                <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:20}}>
                  <div style={{fontSize:32}}>{s.icon}</div>
                  <div style={{fontFamily:'Sora,sans-serif',fontSize:13,fontWeight:700,color:s.color,opacity:.5}}>{s.n}</div>
                </div>
                <div style={{fontFamily:'Sora,sans-serif',fontSize:20,fontWeight:700,color:'#1d1d1f',marginBottom:10,letterSpacing:'-0.3px'}}>{s.title}</div>
                <div style={{fontSize:14,color:'#6e6e73',lineHeight:1.7}}>{s.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── APPLY FORM ── */}
      <section id="apply" style={{padding:'100px 24px',background:'#1d1d1f',position:'relative',overflow:'hidden'}}>
        <div style={{position:'absolute',top:'-20%',right:'-5%',width:500,height:500,borderRadius:'50%',background:'radial-gradient(circle,rgba(220,20,60,.12) 0%,transparent 70%)',pointerEvents:'none'}} />
        <div style={{position:'absolute',bottom:'-20%',left:'-5%',width:400,height:400,borderRadius:'50%',background:'radial-gradient(circle,rgba(107,63,190,.1) 0%,transparent 70%)',pointerEvents:'none'}} />
        <div style={{maxWidth:580,margin:'0 auto',position:'relative',zIndex:1}}>
          <div style={{textAlign:'center',marginBottom:44}}>
            <div style={{display:'inline-flex',alignItems:'center',gap:6,background:'rgba(220,20,60,.15)',border:'1px solid rgba(220,20,60,.3)',borderRadius:24,padding:'5px 14px',fontSize:12,fontWeight:700,color:'#FF6B8A',marginBottom:20,letterSpacing:'0.04em'}}>
              🔥 Only 20 beta spots — apply now
            </div>
            <h2 style={{fontFamily:'Sora,sans-serif',fontSize:'clamp(28px,4vw,44px)',fontWeight:800,color:'#fff',letterSpacing:'-1px',marginBottom:12}}>Apply for free beta access</h2>
            <p style={{fontSize:15,color:'rgba(255,255,255,.5)',lineHeight:1.7}}>Approved users get a private access link within 24 hours.</p>
          </div>

          {status==='success' ? (
            <div style={{background:'rgba(52,199,89,.08)',border:'1.5px solid rgba(52,199,89,.25)',borderRadius:20,padding:'48px 32px',textAlign:'center'}}>
              <div style={{fontSize:48,marginBottom:16}}>🙏</div>
              <div style={{fontFamily:'Sora,sans-serif',fontSize:22,fontWeight:700,color:'#fff',marginBottom:10}}>Application received!</div>
              <div style={{fontSize:14,color:'rgba(255,255,255,.5)',lineHeight:1.7}}>We'll send our decision to your email within 24 hours. Thank you for your interest in Swor.</div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{background:'rgba(255,255,255,.04)',border:'1px solid rgba(255,255,255,.08)',borderRadius:20,padding:'36px 32px',display:'flex',flexDirection:'column',gap:18}}>
              {[
                {id:'name',label:'Full Name *',ph:'Your full name',type:'text',req:true},
                {id:'email',label:'Email Address *',ph:'your@email.com',type:'email',req:true},
                {id:'phone',label:'WhatsApp Number',ph:'+977 98XXXXXXXX',type:'tel',req:false},
              ].map(f=>(
                <div key={f.id}>
                  <label style={{fontSize:11,fontWeight:700,color:'rgba(255,255,255,.4)',letterSpacing:'0.08em',textTransform:'uppercase',display:'block',marginBottom:7}}>{f.label}</label>
                  <input
                    type={f.type} placeholder={f.ph} required={f.req}
                    value={form[f.id]} onChange={e=>setForm({...form,[f.id]:e.target.value})}
                    className="form-input"
                    style={{width:'100%',padding:'12px 16px',borderRadius:10,border:'1.5px solid rgba(255,255,255,.1)',background:'rgba(255,255,255,.07)',color:'#fff',fontSize:14,transition:'border-color .2s,box-shadow .2s'}}
                  />
                </div>
              ))}

              {[
                {id:'type',label:'I am a *',opts:[['','Select one'],['creator','Content Creator (TikTok / YouTube / Instagram)'],['business','Business or Brand'],['marketer','Social Media Manager or Marketer'],['ngo','NGO or Organization'],['individual','Individual / Personal use']]},
                {id:'usecase',label:'I will mainly use Swor for *',opts:[['','Select one'],['subtitles','Nepali subtitles for my videos'],['voiceover','Nepali voiceover for content'],['both','Both subtitles and voiceover']]},
                {id:'source',label:'How did you hear about Swor?',opts:[['','Select one'],['tiktok','TikTok'],['instagram','Instagram'],['linkedin','LinkedIn'],['friend','Friend or Word of mouth'],['google','Google Search'],['other','Other']]},
              ].map(f=>(
                <div key={f.id}>
                  <label style={{fontSize:11,fontWeight:700,color:'rgba(255,255,255,.4)',letterSpacing:'0.08em',textTransform:'uppercase',display:'block',marginBottom:7}}>{f.label}</label>
                  <select
                    required={f.label.includes('*')} value={form[f.id]}
                    onChange={e=>setForm({...form,[f.id]:e.target.value})}
                    className="form-input"
                    style={{width:'100%',padding:'12px 16px',borderRadius:10,border:'1.5px solid rgba(255,255,255,.1)',background:'#2d2d2f',color:form[f.id]?'#fff':'rgba(255,255,255,.4)',fontSize:14}}
                  >
                    {f.opts.map(([v,l])=><option key={v} value={v}>{l}</option>)}
                  </select>
                </div>
              ))}

              <button type="submit" disabled={status==='loading'} className="cta-btn"
                style={{background:status==='loading'?'#555':'#DC143C',color:'#fff',border:'none',padding:'15px',borderRadius:12,fontSize:16,fontWeight:700,fontFamily:'Sora,sans-serif',cursor:status==='loading'?'not-allowed':'pointer',marginTop:4,boxShadow:'0 4px 20px rgba(220,20,60,.3)'}}>
                {status==='loading'?'Submitting...':'Submit Application →'}
              </button>

              {status==='error'&&<div style={{fontSize:13,color:'#FF6B8A',textAlign:'center'}}>Something went wrong. Email us at meroadaiofficial@gmail.com</div>}
              <p style={{fontSize:11,color:'rgba(255,255,255,.25)',textAlign:'center',lineHeight:1.6}}>We respect your privacy. No spam — ever.</p>
            </form>
          )}
        </div>
      </section>

      {/* ── PAYMENT METHODS ── */}
      <section style={{padding:'60px 24px',background:'#f5f5f7'}}>
        <div style={{maxWidth:800,margin:'0 auto',textAlign:'center'}}>
          <div style={{fontSize:12,fontWeight:700,color:'#6e6e73',letterSpacing:'0.1em',textTransform:'uppercase',marginBottom:24}}>Accepted payment methods (post-beta)</div>
          <div style={{display:'flex',gap:10,justifyContent:'center',flexWrap:'wrap'}}>
            {[{n:'eSewa',c:'#60B843'},{n:'Khalti',c:'#5C2D91'},{n:'IME Pay',c:'#E8392A'},{n:'Bank Transfer',c:'#1d1d1f'},{n:'PayPal',c:'#003087'}].map(p=>(
              <span key={p.n} style={{background:'#fff',border:`1.5px solid ${p.c}22`,borderRadius:10,padding:'10px 20px',fontSize:13,fontWeight:700,color:p.c,boxShadow:'0 2px 8px rgba(0,0,0,.06)'}}>{p.n}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ── MEROAD.AI ── */}
      <section style={{padding:'80px 24px',background:'#fff',borderTop:'1px solid #e8e8ed'}}>
        <div style={{maxWidth:700,margin:'0 auto',textAlign:'center'}}>
          <div style={{display:'inline-flex',alignItems:'center',gap:8,marginBottom:20}}>
            <div style={{width:32,height:32,borderRadius:8,background:'linear-gradient(135deg,#DC143C,#FF6B8A)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:14,color:'#fff',fontWeight:800}}>M</div>
            <span style={{fontFamily:'Sora,sans-serif',fontSize:20,fontWeight:700,letterSpacing:'-0.3px'}}>MeroAD.ai</span>
          </div>
          <h3 style={{fontFamily:'Sora,sans-serif',fontSize:26,fontWeight:700,marginBottom:12,letterSpacing:'-0.5px'}}>Need a full AI content campaign?</h3>
          <p style={{fontSize:15,color:'#6e6e73',lineHeight:1.75,maxWidth:480,margin:'0 auto 32px'}}>
            We create AI-powered advertisements and commercial content for Nepal brands. From concept to final video — fully AI-produced.
          </p>
          <div style={{display:'flex',gap:10,justifyContent:'center',flexWrap:'wrap'}}>
            {[
              {label:'Instagram',href:'https://instagram.com/meroadai',bg:'#E1306C'},
              {label:'Facebook',href:'https://facebook.com/meroadai',bg:'#1877F2'},
              {label:'TikTok',href:'https://tiktok.com/@meroadai',bg:'#010101'},
              {label:'DM for inquiries',href:'mailto:meroadaiofficial@gmail.com',bg:'#DC143C'},
            ].map(s=>(
              <a key={s.label} href={s.href} target="_blank" rel="noreferrer"
                style={{background:s.bg,color:'#fff',borderRadius:10,padding:'10px 20px',fontSize:13,fontWeight:600,transition:'opacity .15s'}}
                onMouseOver={e=>e.currentTarget.style.opacity='.85'} onMouseOut={e=>e.currentTarget.style.opacity='1'}>
                {s.label}
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{padding:'28px 24px',background:'#1d1d1f',textAlign:'center'}}>
        <div style={{fontSize:12,color:'rgba(255,255,255,.3)',lineHeight:1.8}}>
          © 2026 <span style={{color:'rgba(255,255,255,.5)',fontWeight:600}}>Swor</span> by MeroAD.ai · Kathmandu, Nepal
          <span style={{margin:'0 12px',opacity:.3}}>·</span>
          <a href="mailto:meroadaiofficial@gmail.com" style={{color:'rgba(255,255,255,.4)'}}>meroadaiofficial@gmail.com</a>
        </div>
      </footer>
    </>
  )
}
