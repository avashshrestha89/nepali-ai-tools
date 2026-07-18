import Head from 'next/head'
import Link from 'next/link'
import { useState, useEffect } from 'react'

export default function ForBusiness() {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  const problems = [
    { emoji: '😰', title: 'आफ्नो voice record गर्न डर लाग्छ?', desc: 'Mic fright, background noise, awkward recordings — content creators को सबैभन्दा ठूलो problem।' },
    { emoji: '💸', title: 'Voice artist hire गर्न महँगो छ', desc: 'एउटा 30-second voiceover को लागि NPR 1,000-3,500 तिर्नुपर्छ। Daily content को लागि यो sustainable छैन।' },
    { emoji: '⏰', title: 'Waiting time = lost time', desc: 'Freelancer खोज्नु, coordinate गर्नु, revisions को लागि कुर्नु — days waste हुन्छन्।' },
    { emoji: '🎵', title: 'Music only भएर पुग्दैन', desc: 'Background music मात्र भएको content ले audience सँग emotional connection बनाउन सक्दैन।' },
  ]

const benefits = [
    { stat: '8s', label: 'मा professional voiceover ready' },
    { stat: '20', label: 'premium Nepali AI voices' },
    { stat: '75%', label: 'कम cost — voice artist भन्दा' },
    { stat: '500+', label: 'characters per generation' },
  ]
  const useCases = [
    { emoji: '📱', who: 'TikTok & Reels Creators', use: 'आफ्नो face नदेखाई professional narration। Daily content को लागि perfect।' },
    { emoji: '🏢', who: 'Nepal Businesses & Brands', use: 'Product ads, promotional videos, social media content — studio-quality audio at fraction of cost।' },
    { emoji: '🎬', who: 'Digital Marketing Agencies', use: 'Client content को लागि instant voiceover। Freelancer coordinate गर्नु पर्दैन।' },
    { emoji: '🏥', who: 'NGOs & Healthcare', use: 'Awareness campaigns, health education videos — credible Nepali voice मा।' },
    { emoji: '🎓', who: 'Education & Coaching Centers', use: 'Online courses, tutorial videos, Lok Sewa prep content — professional audio मा।' },
    { emoji: '🏔️', who: 'Tourism & Travel', use: 'Destination videos, trekking promos — authentic Nepali narration सँग।' },
  ]

  const voices = [
    { name: 'Priyanka', desc: 'Romantic & Elegant', color: '#FF6B8A', use: 'Lifestyle, Fashion' },
    { name: 'Vanishree', desc: 'Professional News', color: '#0077CC', use: 'Corporate, News' },
    { name: 'Dhurundhar', desc: 'Deep & Commanding', color: '#1A3A5C', use: 'Documentary' },
    { name: 'Anika', desc: 'Sweet & Lively', color: '#7B2FBE', use: 'Reels, TikTok' },
    { name: 'Rudra', desc: 'Intense & Romantic', color: '#880E4F', use: 'Drama, Story' },
    { name: 'Arjun', desc: 'Energetic Reels', color: '#F57C00', use: 'Sports, Energy' },
  ]

  return (
    <>
      <Head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <title>Nepal Business को लागि AI Nepali Voiceover — Swor AI</title>
        <meta name="description" content="Voice narration vs music only — why Nepal businesses need professional Nepali voiceover for their content. Try Swor AI free." />
        <link rel="canonical" href="https://meroadai.com/for-business" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Sora:wght@700;800&family=Manrope:wght@400;500;600;700&family=Noto+Sans+Devanagari:wght@400;600&display=swap" rel="stylesheet" />
      </Head>

      <style>{`
        *{box-sizing:border-box;margin:0;padding:0}
        body{font-family:'Manrope',sans-serif;background:#fff;color:#1d1d1f;-webkit-font-smoothing:antialiased}
        a{text-decoration:none;color:inherit}
        @keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
        .fade-up{animation:fadeUp .5s ease forwards}
      `}</style>

      {/* NAV */}
      <nav style={{padding:'0 24px',height:60,display:'flex',alignItems:'center',justifyContent:'space-between',borderBottom:'1px solid #f0f0f0',background:'rgba(255,255,255,.97)',position:'sticky',top:0,zIndex:100,backdropFilter:'blur(10px)'}}>
        <Link href="/" style={{display:'flex',alignItems:'center',gap:8}}>
          <div style={{width:28,height:28,borderRadius:7,background:'linear-gradient(135deg,#DC143C,#FF6B8A)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:12,color:'#fff',fontWeight:800}}>M</div>
          <span style={{fontSize:15,fontWeight:700,fontFamily:'Sora,sans-serif',color:'#1d1d1f'}}>Swor AI</span>
        </Link>
        <div style={{display:'flex',gap:10,alignItems:'center'}}>
          <a href={`https://wa.me/19255379425?text=Hello! I want to learn more about Swor AI for my business.`} target="_blank" rel="noopener noreferrer">
            <button style={{background:'#25D366',color:'#fff',border:'none',padding:'8px 16px',borderRadius:10,fontSize:13,fontWeight:700,cursor:'pointer'}}>
              WhatsApp गर्नुस् →
            </button>
          </a>
          <Link href="/tool">
            <button style={{background:'#DC143C',color:'#fff',border:'none',padding:'8px 16px',borderRadius:10,fontSize:13,fontWeight:700,cursor:'pointer'}}>
              Free Try →
            </button>
          </Link>
        </div>
      </nav>

      {/* HERO */}
      <section style={{background:'linear-gradient(160deg,#fff 0%,#fff5f7 60%,#fff 100%)',padding:isMobile?'60px 20px 50px':'100px 24px 80px',textAlign:'center'}}>
        <div style={{maxWidth:800,margin:'0 auto'}}>
          <div style={{display:'inline-flex',alignItems:'center',gap:6,background:'rgba(220,20,60,.08)',border:'1px solid rgba(220,20,60,.15)',borderRadius:20,padding:'5px 16px',fontSize:12,fontWeight:700,color:'#DC143C',marginBottom:24,letterSpacing:'0.06em'}}>
            🇳🇵 NEPAL BUSINESSES को लागि
          </div>
          <h1 style={{fontFamily:'Sora,sans-serif',fontSize:isMobile?'28px':'clamp(32px,5vw,56px)',fontWeight:800,letterSpacing:'-1.5px',lineHeight:1.1,marginBottom:20,color:'#1d1d1f'}}>
            Music मात्र भएर{' '}
            <span style={{color:'#DC143C'}}>पुग्दैन।</span>
            <br />
            <span style={{fontFamily:'Noto Sans Devanagari,sans-serif'}}>आवाज</span>{' '}
            चाहिन्छ।
          </h1>
          <p style={{fontSize:isMobile?16:19,color:'#6e6e73',lineHeight:1.7,marginBottom:12,maxWidth:560,margin:'0 auto 12px'}}>
            Research भन्छ — voice narration भएको video ले{' '}
            <strong style={{color:'#1d1d1f'}}>3x बढी engagement</strong>{' '}
            पाउँछ music-only content भन्दा।
          </p>
          <p style={{fontSize:15,color:'#DC143C',fontWeight:600,marginBottom:36}}>
            Nepal को first AI Nepali voice generator — NPR 499 देखि सुरु
          </p>
          <div style={{display:'flex',gap:12,justifyContent:'center',flexWrap:'wrap'}}>
            <Link href="/tool">
              <button style={{background:'#DC143C',color:'#fff',border:'none',padding:'15px 36px',borderRadius:12,fontSize:16,fontWeight:700,cursor:'pointer',fontFamily:'Sora,sans-serif',boxShadow:'0 8px 32px rgba(220,20,60,.25)'}}>
                Free try गर्नुस् →
              </button>
            </Link>
            <a href={`https://wa.me/19255379425?text=Hello! I want to learn more about Swor AI for my business.`} target="_blank" rel="noopener noreferrer">
              <button style={{background:'#25D366',color:'#fff',border:'none',padding:'15px 36px',borderRadius:12,fontSize:16,fontWeight:700,cursor:'pointer',fontFamily:'Sora,sans-serif'}}>
                💬 WhatsApp गर्नुस्
              </button>
            </a>
          </div>
          <p style={{fontSize:13,color:'#999',marginTop:12}}>eSewa / Khalti / IME Pay / PayPal accepted · 20 natural Nepali voices</p>
        </div>
      </section>

      {/* VOICE VS MUSIC COMPARISON */}
      <section style={{padding:isMobile?'60px 20px':'80px 24px',background:'#f5f5f7'}}>
        <div style={{maxWidth:900,margin:'0 auto'}}>
          <h2 style={{fontFamily:'Sora,sans-serif',fontSize:isMobile?'22px':'clamp(22px,3.5vw,36px)',fontWeight:800,textAlign:'center',letterSpacing:'-0.8px',marginBottom:12}}>
            Music Only vs Voice Narration
          </h2>
          <p style={{textAlign:'center',color:'#6e6e73',fontSize:16,marginBottom:48,lineHeight:1.6}}>
            तपाईंको competitors के गर्दैछन् — र तपाईं के गर्नुपर्छ
          </p>
          <div style={{display:'grid',gridTemplateColumns:isMobile?'1fr':'1fr 1fr',gap:16}}>
            {/* Music Only */}
            <div style={{background:'#fff',borderRadius:20,padding:28,border:'2px solid #f0f0f0'}}>
              <div style={{fontSize:13,fontWeight:700,color:'#999',letterSpacing:'0.1em',marginBottom:16}}>🎵 MUSIC ONLY</div>
              {[
                'Audience ले text पढ्नुपर्छ — cognitive load बढ्छ',
                'Emotional connection कमजोर हुन्छ',
                'Watch time कम हुन्छ — algorithm ले penalize गर्छ',
                'Brand authority build हुँदैन',
                'Information density कम हुन्छ',
              ].map((item, i) => (
                <div key={i} style={{display:'flex',gap:10,alignItems:'flex-start',marginBottom:12}}>
                  <span style={{color:'#DC143C',fontWeight:700,fontSize:16,flexShrink:0}}>✗</span>
                  <span style={{fontSize:14,color:'#555',lineHeight:1.6}}>{item}</span>
                </div>
              ))}
            </div>
            {/* Voice Narration */}
            <div style={{background:'linear-gradient(135deg,#fff5f7,#fff)',borderRadius:20,padding:28,border:'2px solid rgba(220,20,60,.2)'}}>
              <div style={{fontSize:13,fontWeight:700,color:'#DC143C',letterSpacing:'0.1em',marginBottom:16}}>🎙️ VOICE NARRATION</div>
              {[
                'Audience सुन्दै अरु काम गर्न सक्छ',
                'Emotional connection 3x बढी हुन्छ',
                'Watch time बढ्छ — algorithm ले reward गर्छ',
                'Professional brand identity बन्छ',
                'Complex information सजिलै पुग्छ',
              ].map((item, i) => (
                <div key={i} style={{display:'flex',gap:10,alignItems:'flex-start',marginBottom:12}}>
                  <span style={{color:'#34C759',fontWeight:700,fontSize:16,flexShrink:0}}>✓</span>
                  <span style={{fontSize:14,color:'#1d1d1f',lineHeight:1.6,fontWeight:500}}>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* PROBLEMS */}
      <section style={{padding:isMobile?'60px 20px':'80px 24px',background:'#fff'}}>
        <div style={{maxWidth:900,margin:'0 auto'}}>
          <h2 style={{fontFamily:'Sora,sans-serif',fontSize:isMobile?'22px':'clamp(22px,3.5vw,36px)',fontWeight:800,textAlign:'center',letterSpacing:'-0.8px',marginBottom:12}}>
            हामी जान्दछौं — तपाईंको problem के हो
          </h2>
          <p style={{textAlign:'center',color:'#6e6e73',fontSize:16,marginBottom:48}}>
            Nepal मा content बनाउनेहरूले यही struggle गर्छन्
          </p>
          <div style={{display:'grid',gridTemplateColumns:isMobile?'1fr':'1fr 1fr',gap:16}}>
            {problems.map((p,i) => (
              <div key={i} style={{background:'#f5f5f7',borderRadius:16,padding:'24px 22px'}}>
                <div style={{fontSize:32,marginBottom:12}}>{p.emoji}</div>
                <div style={{fontFamily:'Sora,sans-serif',fontSize:15,fontWeight:700,marginBottom:8,color:'#1d1d1f'}}>{p.title}</div>
                <div style={{fontSize:13,color:'#6e6e73',lineHeight:1.65}}>{p.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SOLUTION */}
      <section style={{padding:isMobile?'60px 20px':'80px 24px',background:'linear-gradient(160deg,#1d1d1f 0%,#2d1020 100%)',textAlign:'center'}}>
        <div style={{maxWidth:700,margin:'0 auto'}}>
          <div style={{fontSize:13,fontWeight:700,color:'rgba(220,20,60,.8)',letterSpacing:'0.12em',marginBottom:16}}>THE SOLUTION</div>
          <h2 style={{fontFamily:'Sora,sans-serif',fontSize:isMobile?'26px':'clamp(26px,4vw,44px)',fontWeight:800,color:'#fff',letterSpacing:'-1px',marginBottom:20,lineHeight:1.15}}>
            Type गर्नुस्।<br />
            <span style={{color:'#DC143C'}}>8 seconds।</span><br />
            Professional voiceover ready।
          </h2>
          <p style={{fontSize:16,color:'rgba(255,255,255,.6)',lineHeight:1.7,marginBottom:48,maxWidth:500,margin:'0 auto 48px'}}>
            Nepal को first AI Nepali voice generator।
            Studio जानु पर्दैन। Freelancer खोज्नु पर्दैन।
            आफ्नो voice record गर्नु पर्दैन।
          </p>
          <div style={{display:'grid',gridTemplateColumns:isMobile?'1fr 1fr':'repeat(4,1fr)',gap:12,marginBottom:48}}>
            {benefits.map((b,i) => (
              <div key={i} style={{background:'rgba(255,255,255,.06)',borderRadius:14,padding:'20px 16px',border:'1px solid rgba(255,255,255,.08)'}}>
                <div style={{fontFamily:'Sora,sans-serif',fontSize:28,fontWeight:800,color:'#DC143C',marginBottom:4}}>{b.stat}</div>
                <div style={{fontSize:12,color:'rgba(255,255,255,.5)',lineHeight:1.5}}>{b.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* VOICES */}
      <section style={{padding:isMobile?'60px 20px':'80px 24px',background:'#fff'}}>
        <div style={{maxWidth:900,margin:'0 auto'}}>
          <h2 style={{fontFamily:'Sora,sans-serif',fontSize:isMobile?'22px':'clamp(22px,3.5vw,36px)',fontWeight:800,textAlign:'center',letterSpacing:'-0.8px',marginBottom:12}}>
            20 Premium Nepali Voices
          </h2>
          <p style={{textAlign:'center',color:'#6e6e73',fontSize:16,marginBottom:48}}>
            हरेक content type को लागि perfect voice
          </p>
          <div style={{display:'grid',gridTemplateColumns:isMobile?'1fr 1fr':'repeat(3,1fr)',gap:12,marginBottom:32}}>
            {voices.map((v,i) => (
              <div key={i} style={{background:'#f5f5f7',borderRadius:14,padding:'18px 16px',display:'flex',alignItems:'center',gap:12}}>
                <div style={{width:44,height:44,borderRadius:11,background:v.color,display:'flex',alignItems:'center',justifyContent:'center',fontSize:18,fontWeight:800,color:'#fff',flexShrink:0}}>
                  {v.name[0]}
                </div>
                <div>
                  <div style={{fontFamily:'Sora,sans-serif',fontSize:14,fontWeight:700,color:'#1d1d1f'}}>{v.name}</div>
                  <div style={{fontSize:11,color:'#888'}}>{v.desc}</div>
                  <div style={{fontSize:10,color:v.color,fontWeight:600,marginTop:2}}>{v.use}</div>
                </div>
              </div>
            ))}
          </div>
          <p style={{textAlign:'center',fontSize:13,color:'#888'}}>+ 14 more voices available on the platform</p>
        </div>
      </section>

      {/* USE CASES */}
      <section style={{padding:isMobile?'60px 20px':'80px 24px',background:'#f5f5f7'}}>
        <div style={{maxWidth:900,margin:'0 auto'}}>
          <h2 style={{fontFamily:'Sora,sans-serif',fontSize:isMobile?'22px':'clamp(22px,3.5vw,36px)',fontWeight:800,textAlign:'center',letterSpacing:'-0.8px',marginBottom:12}}>
            को को use गर्छन् Swor AI?
          </h2>
          <p style={{textAlign:'center',color:'#6e6e73',fontSize:16,marginBottom:48}}>
            Nepal का सबै sectors मा content creators र businesses
          </p>
          <div style={{display:'grid',gridTemplateColumns:isMobile?'1fr':'repeat(3,1fr)',gap:14}}>
            {useCases.map((u,i) => (
              <div key={i} style={{background:'#fff',borderRadius:16,padding:'22px 20px',border:'1.5px solid #e8e8ed'}}>
                <div style={{fontSize:28,marginBottom:10}}>{u.emoji}</div>
                <div style={{fontFamily:'Sora,sans-serif',fontSize:14,fontWeight:700,marginBottom:8,color:'#1d1d1f'}}>{u.who}</div>
                <div style={{fontSize:13,color:'#6e6e73',lineHeight:1.65}}>{u.use}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section style={{padding:isMobile?'60px 20px':'80px 24px',background:'#fff'}}>
        <div style={{maxWidth:700,margin:'0 auto',textAlign:'center'}}>
          <h2 style={{fontFamily:'Sora,sans-serif',fontSize:isMobile?'22px':'clamp(22px,3.5vw,36px)',fontWeight:800,letterSpacing:'-0.8px',marginBottom:12}}>
            Nepal को लागि — NPR मा
          </h2>
          <p style={{color:'#6e6e73',fontSize:16,marginBottom:48,lineHeight:1.6}}>
            eSewa, Khalti, IME Pay बाट pay गर्नुस्।
            No USD card needed।
          </p>
          <div style={{display:'grid',gridTemplateColumns:isMobile?'1fr':'1fr 1fr',gap:14,marginBottom:24}}>
            <div style={{background:'#f5f5f7',borderRadius:20,padding:28,textAlign:'left'}}>
              <div style={{fontSize:11,fontWeight:700,color:'#888',letterSpacing:'0.1em',marginBottom:12}}>STARTER</div>
              <div style={{fontFamily:'Sora,sans-serif',fontSize:32,fontWeight:800,color:'#1d1d1f',marginBottom:4}}>NPR 499</div>
              <div style={{fontSize:13,color:'#888',marginBottom:20}}>500 Swor Credits</div>
              {['20 voiceover generations','Subtitles always free','All 20 voices','MP3 download'].map((f,i) => (
                <div key={i} style={{display:'flex',gap:8,marginBottom:8,fontSize:13,color:'#555'}}>
                  <span style={{color:'#34C759',fontWeight:700}}>✓</span> {f}
                </div>
              ))}
            </div>
            <div style={{background:'linear-gradient(135deg,#DC143C,#c01030)',borderRadius:20,padding:28,textAlign:'left'}}>
              <div style={{fontSize:11,fontWeight:700,color:'rgba(255,255,255,.6)',letterSpacing:'0.1em',marginBottom:12}}>CREATOR — MOST POPULAR</div>
              <div style={{fontFamily:'Sora,sans-serif',fontSize:32,fontWeight:800,color:'#fff',marginBottom:4}}>NPR 999</div>
              <div style={{fontSize:13,color:'rgba(255,255,255,.6)',marginBottom:20}}>1,100 Swor Credits (+10% bonus)</div>
              {['44 voiceover generations','50 AI music tracks','All 20 voices','Priority support'].map((f,i) => (
                <div key={i} style={{display:'flex',gap:8,marginBottom:8,fontSize:13,color:'rgba(255,255,255,.85)'}}>
                  <span style={{color:'#fff',fontWeight:700}}>✓</span> {f}
                </div>
              ))}
            </div>
          </div>
          <div style={{fontSize:13,color:'#888'}}>
            Custom plan चाहिन्छ? &nbsp;
            <a href="https://wa.me/19255379425?text=I need a custom Swor AI plan for my business" target="_blank" rel="noopener noreferrer" style={{color:'#DC143C',fontWeight:700}}>
              WhatsApp गर्नुस् →
            </a>
          </div>
        </div>
      </section>

      {/* COST COMPARISON */}
      <section style={{padding:isMobile?'60px 20px':'80px 24px',background:'#f5f5f7'}}>
        <div style={{maxWidth:700,margin:'0 auto'}}>
          <h2 style={{fontFamily:'Sora,sans-serif',fontSize:isMobile?'22px':'clamp(22px,3.5vw,36px)',fontWeight:800,textAlign:'center',letterSpacing:'-0.8px',marginBottom:48}}>
            Cost comparison
          </h2>
          <div style={{display:'flex',flexDirection:'column',gap:12}}>
            {[
              {label:'Freelance voice artist (per script)',cost:'NPR 1,000-3,500',bad:true},
              {label:'Recording studio (per session)',cost:'NPR 5,000-15,000',bad:true},
              {label:'International AI tools (USD required)',cost:'$5-22/month + USD card',bad:true},
              {label:'Swor AI (20 voiceovers)',cost:'NPR 499 — eSewa/Khalti',bad:false},
            ].map((c,i) => (
              <div key={i} style={{background:c.bad?'#fff':'linear-gradient(135deg,#fff5f7,#fff)',borderRadius:12,padding:'16px 20px',display:'flex',justifyContent:'space-between',alignItems:'center',border:c.bad?'1px solid #f0f0f0':'2px solid rgba(220,20,60,.2)'}}>
                <span style={{fontSize:14,color:c.bad?'#888':'#1d1d1f',fontWeight:c.bad?400:600}}>{c.label}</span>
                <span style={{fontSize:14,fontWeight:700,color:c.bad?'#CC3333':'#DC143C',flexShrink:0,marginLeft:16}}>{c.cost}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section style={{padding:isMobile?'60px 20px':'100px 24px',background:'linear-gradient(160deg,#1d1d1f 0%,#2d1020 100%)',textAlign:'center'}}>
        <div style={{maxWidth:600,margin:'0 auto'}}>
         <h2 style={{fontFamily:'Sora,sans-serif',fontSize:isMobile?'26px':'clamp(26px,4vw,44px)',fontWeight:800,color:'#fff',letterSpacing:'-1px',marginBottom:16,lineHeight:1.2}}>
            आजै सुरु गर्नुस्।
            <br />
            <span style={{color:'#DC143C'}}>Nepal को #1 Nepali AI Voice।</span>
          </h2>
        <p style={{fontSize:16,color:'rgba(255,255,255,.5)',lineHeight:1.7,marginBottom:40,maxWidth:440,margin:'0 auto 40px'}}>
            Sign up with your email and get started today।
            eSewa / Khalti / IME Pay accepted।
          </p>
          <div style={{display:'flex',gap:12,justifyContent:'center',flexWrap:'wrap',marginBottom:20}}>
            <Link href="/tool">
              <button style={{background:'#DC143C',color:'#fff',border:'none',padding:'16px 36px',borderRadius:12,fontSize:16,fontWeight:700,cursor:'pointer',fontFamily:'Sora,sans-serif',boxShadow:'0 8px 32px rgba(220,20,60,.3)'}}>
                Free try गर्नुस् →
              </button>
            </Link>
            <a href="https://wa.me/19255379425?text=Hello! I want to learn more about Swor AI for my business." target="_blank" rel="noopener noreferrer">
              <button style={{background:'#25D366',color:'#fff',border:'none',padding:'16px 36px',borderRadius:12,fontSize:16,fontWeight:700,cursor:'pointer',fontFamily:'Sora,sans-serif'}}>
                💬 WhatsApp गर्नुस्
              </button>
            </a>
          </div>
          <div style={{fontSize:13,color:'rgba(255,255,255,.25)'}}>
            meroadai.com · Built in Kathmandu, Nepal 🇳🇵
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{padding:'24px',background:'#111',display:'flex',alignItems:'center',justifyContent:'space-between',flexWrap:'wrap',gap:12}}>
        <div style={{fontSize:12,color:'rgba(255,255,255,.2)'}}>© 2026 Swor AI · MeroAD.ai · Kathmandu, Nepal</div>
        <div style={{display:'flex',gap:16}}>
          <Link href="/" style={{fontSize:12,color:'rgba(255,255,255,.3)'}}>Home</Link>
          <Link href="/tool" style={{fontSize:12,color:'rgba(255,255,255,.3)'}}>Try Tool</Link>
          <Link href="/nepali-text-to-speech" style={{fontSize:12,color:'rgba(255,255,255,.3)'}}>Learn More</Link>
        </div>
      </footer>
    </>
  )
}
